---
sidebar_position: 4
title: Building a Music Agent
---

# Building a Music Agent

This guide walks through designing, implementing, and deploying a complete AI music agent from scratch. The agent takes a high-level creative brief, orchestrates multiple AI music models, and delivers a production-ready audio file.

## What We're Building

A **Brief-to-Track agent** that:
1. Accepts a natural-language creative brief
2. Uses an LLM to derive tags, lyrics scaffold, and model routing decisions
3. Generates a seed track with Sonauto v3
4. Extends it to full length
5. Optionally stem-separates and applies MusicGen melody remix
6. Returns a normalized MP3

```
Creative Brief (text)
        │
        ▼
┌──────────────────────┐
│   Planning Agent     │  (LLM — interpret brief, choose models)
└──────────────────────┘
        │ plan JSON
        ▼
┌──────────────────────┐
│   Execution Engine   │  (sequential + async steps)
│  ┌────────────────┐  │
│  │  Sonauto v3    │  │  generate seed
│  │  Sonauto ext.  │  │  extend to full length
│  │  Demucs        │  │  (optional) stem split
│  │  MusicGen      │  │  (optional) melody regen
│  │  FFmpeg        │  │  mix & normalize
│  └────────────────┘  │
└──────────────────────┘
        │
        ▼
  Final MP3 output
```

---

## Step 1: Project Structure

```
music_agent/
├── agent.py           ← top-level orchestrator
├── planner.py         ← LLM planning step
├── models/
│   ├── sonauto.py     ← Sonauto API wrapper
│   ├── musicgen.py    ← MusicGen wrapper
│   └── stems.py       ← Demucs wrapper
├── audio/
│   └── normalize.py   ← FFmpeg normalization
├── .env               ← SONAUTO_API_KEY, OPENAI_API_KEY
└── requirements.txt
```

`requirements.txt`:

```
requests
aiohttp
openai
audiocraft
demucs
torchaudio
ffmpeg-python
python-dotenv
```

---

## Step 2: The Planner

The planner calls an LLM to convert a free-text brief into a structured execution plan.

```python
# planner.py
import os, json
import openai

SYSTEM_PROMPT = """
You are a music production assistant. Given a creative brief, return a JSON plan with:
- "tags": array of 3-6 musical style tags (strings)
- "prompt": refined prompt for the generation API (string)
- "instrumental": boolean — true if no vocals needed
- "use_musicgen_remix": boolean — true if a style-transfer remix is desired
- "target_duration_seconds": integer target length (60-300)
- "mood": one-word mood descriptor

Return ONLY valid JSON. No markdown fences.
"""

def plan(brief: str) -> dict:
    client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    resp = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": brief}
        ],
        response_format={"type": "json_object"}
    )
    return json.loads(resp.choices[0].message.content)
```

---

## Step 3: Sonauto Wrapper

```python
# models/sonauto.py
import os, time, requests

BASE = "https://api.sonauto.ai/v1"

def _headers():
    return {
        "Authorization": f"Bearer {os.environ['SONAUTO_API_KEY']}",
        "Content-Type": "application/json"
    }

def _poll(task_id: str) -> str:
    """Block until task completes. Returns first song_path URL."""
    while True:
        status = requests.get(
            f"{BASE}/generations/status/{task_id}", headers=_headers()
        ).text.strip('"')
        if status == "SUCCESS":
            data = requests.get(f"{BASE}/generations/{task_id}", headers=_headers()).json()
            return data["song_paths"][0]
        if status == "FAILURE":
            raise RuntimeError(f"Sonauto task {task_id} failed")
        time.sleep(6)

def generate_v3(prompt: str, tags: list[str], instrumental: bool = False) -> str:
    """Generate a v3 track. Returns CDN URL."""
    r = requests.post(f"{BASE}/generations/v3", headers=_headers(), json={
        "prompt": prompt, "tags": tags, "instrumental": instrumental
    })
    r.raise_for_status()
    return _poll(r.json()["task_id"])

def extend(audio_url: str, prompt: str, tags: list[str], duration: float = 85.0) -> str:
    """Extend an existing track by up to 85 s. Returns CDN URL of extended track."""
    r = requests.post(f"{BASE}/generations/v2/extend", headers=_headers(), json={
        "audio_url": audio_url,
        "prompt": prompt,
        "tags": tags,
        "side": "right",
        "extend_duration": min(duration, 85.0)
    })
    r.raise_for_status()
    return _poll(r.json()["task_id"])
```

---

## Step 4: MusicGen Wrapper (Optional Remix)

```python
# models/musicgen.py
import torchaudio
from audiocraft.models import MusicGen

def melody_remix(melody_path: str, description: str, duration: int = 30) -> str:
    """Condition MusicGen on a melody file and return path to remixed WAV."""
    model = MusicGen.get_pretrained("melody")
    model.set_generation_params(duration=duration)

    wav, sr = torchaudio.load(melody_path)
    wav = wav.unsqueeze(0)

    output = model.generate_with_chroma(
        descriptions=[description],
        melody_wavs=wav,
        melody_sample_rate=sr
    )

    out_path = melody_path.replace(".wav", "_remix.wav")
    torchaudio.save(out_path, output[0].cpu(), sample_rate=32000)
    return out_path
```

---

## Step 5: Normalization

```python
# audio/normalize.py
import subprocess, os

def normalize_to_mp3(input_url_or_path: str, output_path: str, lufs: float = -14.0) -> str:
    """Download (if URL) and normalize to -14 LUFS, export MP3 320k."""
    subprocess.run([
        "ffmpeg", "-y",
        "-i", input_url_or_path,
        "-af", f"loudnorm=I={lufs}:LRA=7:TP=-1",
        "-c:a", "mp3", "-b:a", "320k",
        output_path
    ], check=True)
    return output_path
```

---

## Step 6: The Agent Orchestrator

```python
# agent.py
import os
from dotenv import load_dotenv
load_dotenv()

from planner import plan
from models.sonauto import generate_v3, extend
from models.musicgen import melody_remix
from audio.normalize import normalize_to_mp3

def run_agent(brief: str, output_path: str = "output.mp3") -> str:
    print("=== Planning ===")
    p = plan(brief)
    print(f"Plan: {p}")

    print("\n=== Generating seed track ===")
    seed_url = generate_v3(
        prompt=p["prompt"],
        tags=p["tags"],
        instrumental=p["instrumental"]
    )
    print(f"Seed: {seed_url}")

    # Extend to target duration if needed (Sonauto v3 ~2-4 min, extend if more needed)
    current_url = seed_url
    target = p.get("target_duration_seconds", 120)
    if target > 150:
        print("\n=== Extending track ===")
        current_url = extend(
            audio_url=current_url,
            prompt=f"Continue: {p['prompt']}",
            tags=p["tags"],
            duration=min(target - 95, 85.0)
        )
        print(f"Extended: {current_url}")

    # Optional MusicGen remix
    if p.get("use_musicgen_remix"):
        print("\n=== MusicGen melody remix ===")
        import subprocess
        # Download the Sonauto track locally for Demucs
        local = "temp_seed.ogg"
        subprocess.run(["curl", "-s", "-o", local, current_url], check=True)
        subprocess.run(["python", "-m", "demucs", "--two-stems=vocals", local], check=True)
        melody_path = f"separated/htdemucs/temp_seed/no_vocals.wav"
        remixed_path = melody_remix(melody_path, p["prompt"])
        current_url = remixed_path   # now a local path
        print(f"Remixed: {remixed_path}")

    print("\n=== Normalizing ===")
    final = normalize_to_mp3(current_url, output_path)
    print(f"\n✓ Done → {final}")
    return final


if __name__ == "__main__":
    import sys
    brief = " ".join(sys.argv[1:]) or "Uplifting corporate background music, no vocals, 3 minutes"
    run_agent(brief)
```

**Usage:**

```bash
python agent.py "Melancholic indie pop song about late-night drives, 2 minutes, with vocals"
# → output.mp3
```

---

## Deployment Options

### Local / Script

Run `agent.py` directly. Good for personal projects, batch processing.

### REST Microservice (FastAPI)

```python
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import uuid, os

app = FastAPI()
jobs: dict = {}

class BriefRequest(BaseModel):
    brief: str

@app.post("/generate")
async def generate(req: BriefRequest, bg: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "queued"}
    bg.add_task(run_job, job_id, req.brief)
    return {"job_id": job_id}

@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    return jobs.get(job_id, {"error": "not found"})

def run_job(job_id: str, brief: str):
    from agent import run_agent
    jobs[job_id] = {"status": "running"}
    try:
        path = run_agent(brief, output_path=f"outputs/{job_id}.mp3")
        jobs[job_id] = {"status": "complete", "path": path}
    except Exception as e:
        jobs[job_id] = {"status": "failed", "error": str(e)}
```

### Queue-based (Celery + Redis)

For production throughput:

```python
from celery import Celery
app = Celery("music_agent", broker="redis://localhost:6379/0")

@app.task
def generate_task(brief: str, job_id: str):
    from agent import run_agent
    return run_agent(brief, output_path=f"outputs/{job_id}.mp3")
```

---

## Security Considerations

- **Never expose API keys** in logs, responses, or client-facing code.
- **Validate and sanitize** the `brief` input before passing to the LLM (prompt injection risk).
- **Rate-limit** your `/generate` endpoint to prevent runaway credit consumption.
- **Cap `target_duration_seconds`** to a sane maximum (e.g. 300 s) to prevent runaway extend loops.

---

## Related

- [Multi-Model Pipelines](./multi-model-pipelines)
- [Orchestration Patterns](./orchestration-patterns)
- [Sonauto API](../apis/sunauto-api)
- [Suno API](../apis/suno-api)
- [Real-Time Inference](../advanced/real-time-inference)
