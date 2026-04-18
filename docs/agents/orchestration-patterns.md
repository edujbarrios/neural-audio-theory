---
sidebar_position: 3
title: Orchestration Patterns
---

# Orchestration Patterns

These are the reusable architectural blueprints for AI music agents. Mix and match them to fit your workflow's requirements.

---

## Pattern 1: Selector Agent

The agent reads the task description and **routes it to the single best model** rather than running everything.

```
[Task Description]
        │
        ▼
  ┌───────────┐
  │  Selector │  ← LLM or rule-based classifier
  └───────────┘
    /    |    \
   ▼     ▼     ▼
[Suno] [Sonauto] [MusicGen]
```

**When to use:** You have a heterogeneous queue of tasks (some need vocals, some melody-only, some need extensions) and want to automatically dispatch each to the right service.

```python
def select_model(task: dict) -> str:
    """Simple rule-based selector."""
    if task.get("has_lyrics") and task.get("needs_full_song"):
        return "suno"
    if task.get("extend_existing"):
        return "sonauto_extend"
    if task.get("melody_conditioning"):
        return "musicgen"
    if task.get("high_fidelity") and not task.get("vocals"):
        return "stable_audio"
    return "sonauto_v3"   # sensible default

task = {"has_lyrics": True, "needs_full_song": True}
model = select_model(task)
print(f"Routing to: {model}")   # → "suno"
```

For smarter routing, replace rule-based logic with an LLM call:

```python
import openai, json

def llm_select_model(task_description: str) -> str:
    resp = openai.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "system",
            "content": (
                "You are a music AI router. Given a task description, "
                "return a JSON object with key 'model' set to one of: "
                "'suno', 'sonauto_v3', 'sonauto_extend', 'musicgen', 'stable_audio'."
            )
        }, {
            "role": "user",
            "content": task_description
        }],
        response_format={"type": "json_object"}
    )
    return json.loads(resp.choices[0].message.content)["model"]
```

---

## Pattern 2: Sequential Pipeline

Each model's output feeds directly into the next. This is the simplest pattern and the backbone of most production workflows.

```
[Prompt] → [Model A] → [Model B] → [Model C] → [Output]
```

Key rules:
- **Fail fast:** if any step returns an error, abort and surface it immediately.
- **Pass CDN URLs directly** between Sonauto calls — never re-upload decoded audio unnecessarily (avoids re-encoding quality loss).
- **Log every intermediate file** so you can replay from any step.

```python
class Pipeline:
    def __init__(self):
        self.steps = []
        self.artifacts = {}        # step_name → artifact value

    def add_step(self, name: str, fn):
        self.steps.append((name, fn))
        return self

    def run(self, initial_input):
        current = initial_input
        for name, fn in self.steps:
            print(f"[{name}] starting...")
            current = fn(current)
            self.artifacts[name] = current
            print(f"[{name}] done → {str(current)[:80]}")
        return current
```

---

## Pattern 3: Fan-out / Fan-in (Parallel Variations)

Send the same prompt to multiple models (or the same model multiple times) in parallel, then **merge or select** the best result.

```
              ┌───────────────────────────────────┐
              │           Fan-out                 │
              │  [Suno v3]  [Sonauto v3]  [MusicGen]│
              └─────────────┬─────────────────────┘
                            │
                            ▼
                      ┌──────────┐
                      │ Fan-in   │  select / blend
                      │ Critic   │
                      └──────────┘
                            │
                            ▼
                       [Best Output]
```

The fan-in step can be:
- **Human review** — present URLs, let the user pick
- **Automated scoring** — CLAP embeddings, LUFS, spectral quality heuristics
- **LLM critic** — describe each result and ask an LLM to rank by brief + task fit

```python
import asyncio, aiohttp, os

async def fan_out_models(prompt: str, tags: list[str]) -> dict[str, str]:
    """Run Sonauto v3 and a second Sonauto v3 request in parallel (budget comparison)."""
    BASE = "https://api.sonauto.ai/v1"
    KEY = os.environ["SONAUTO_API_KEY"]

    async with aiohttp.ClientSession() as session:
        # Launch both simultaneously
        payloads = [
            {"prompt": prompt, "tags": tags, "instrumental": True},
            {"prompt": prompt, "tags": tags + ["acoustic"], "instrumental": True},
        ]
        tasks = []
        for p in payloads:
            async with session.post(f"{BASE}/generations/v3",
                                    json=p,
                                    headers={"Authorization": f"Bearer {KEY}"}) as r:
                tasks.append((await r.json())["task_id"])

        # Poll both
        results = {}
        pending = set(tasks)
        while pending:
            for tid in list(pending):
                async with session.get(f"{BASE}/generations/status/{tid}",
                                       headers={"Authorization": f"Bearer {KEY}"}) as r:
                    status = (await r.text()).strip('"')
                if status == "SUCCESS":
                    async with session.get(f"{BASE}/generations/{tid}",
                                           headers={"Authorization": f"Bearer {KEY}"}) as r:
                        results[tid] = (await r.json())["song_paths"][0]
                    pending.remove(tid)
                elif status == "FAILURE":
                    pending.remove(tid)
            if pending:
                await asyncio.sleep(5)

    return results
```

---

## Pattern 4: Critic Loop (Iterative Refinement)

The agent generates, evaluates, and regenerates until a quality threshold is met or a maximum number of attempts is reached.

```
[Prompt]
    │
    ▼
[Generate] ──▶ [Critic / Evaluator]
    ▲                    │
    │         pass?      │  fail?
    │          No ───────┘
    │
    └── refine prompt & retry
```

The critic can be rule-based (e.g. "duration must be > 60 s, LUFS > -18") or LLM-based.

```python
import requests, os, time

def generate(prompt: str, tags: list) -> str:
    H = {"Authorization": f"Bearer {os.environ['SONAUTO_API_KEY']}"}
    r = requests.post("https://api.sonauto.ai/v1/generations/v3",
                      json={"prompt": prompt, "tags": tags, "instrumental": True},
                      headers={**H, "Content-Type": "application/json"})
    task_id = r.json()["task_id"]
    while True:
        s = requests.get(f"https://api.sonauto.ai/v1/generations/status/{task_id}", headers=H).text.strip('"')
        if s == "SUCCESS":
            return requests.get(f"https://api.sonauto.ai/v1/generations/{task_id}", headers=H).json()["song_paths"][0]
        if s == "FAILURE":
            return None
        time.sleep(5)

def critic(audio_url: str, requirements: dict) -> tuple[bool, str]:
    """
    Placeholder critic. In production: download audio, run CLAP/LUFS/classifier.
    Returns (passed, feedback).
    """
    # Stub: always pass on first attempt for demo
    return True, "Meets requirements"

def critic_loop(prompt: str, tags: list, requirements: dict, max_attempts: int = 3) -> str | None:
    for attempt in range(1, max_attempts + 1):
        print(f"Attempt {attempt}/{max_attempts}: generating...")
        url = generate(prompt, tags)
        if not url:
            print("  Generation failed, retrying...")
            continue
        passed, feedback = critic(url, requirements)
        if passed:
            print(f"  Critic passed: {feedback}")
            return url
        print(f"  Critic failed: {feedback} — refining prompt")
        prompt = f"{prompt}. {feedback}"   # append critic feedback to prompt
    return None

result = critic_loop(
    prompt="uplifting corporate background music",
    tags=["corporate", "uplifting", "2020s"],
    requirements={"min_duration_s": 60, "min_lufs": -18}
)
print(result)
```

---

## Pattern 5: Hybrid Human-in-the-Loop

Fully automated pipelines are powerful, but sometimes you want a human decision at a key branching point — especially for client work or mastering.

```
[Auto-generate N variations]
            │
            ▼
  [Present to human via UI]
            │
     human picks 1
            │
            ▼
  [Auto-extend + master]
            │
            ▼
       [Delivery]
```

**Implementation tips:**
- Use a webhook to notify your app when generation finishes, rather than polling in a long-running process.
- Store `task_id` and `song_paths` in a database against a job record.
- Serve a simple review UI (even a static HTML page with `<audio>` elements) that lets the client pick a variation.
- Once selection is made, trigger the next automated stage.

---

## Pattern Comparison

| Pattern | Latency | Cost | Human involvement | Best for |
|---------|---------|------|-------------------|----------|
| Selector | Low | Low | None | High-throughput mixed queues |
| Sequential | Medium | Low | None | Single-track production |
| Fan-out / fan-in | High | High | Optional | Creative exploration |
| Critic loop | High | Medium | None | Quality-gated automation |
| Human-in-the-loop | Variable | Medium | Yes | Client delivery, mastering |

---

## Related

- [Multi-Model Pipelines](./multi-model-pipelines)
- [Building a Music Agent](./building-a-music-agent)
- [Sonauto API](../apis/sunauto-api)
- [Controllable Generation](../advanced/controllable-generation)
