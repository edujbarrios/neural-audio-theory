---
sidebar_position: 2
title: Multi-Model Pipelines
---

# Multi-Model Pipelines

A multi-model pipeline sends audio (or metadata) through a sequence of AI models, each transforming the signal in a way the previous model could not. The output of one step becomes the input of the next.

## Core Pipeline Topology

```
[Text Prompt]
      │
      ▼
┌─────────────┐    full song    ┌──────────────────┐
│  Suno / v3  │ ─────────────▶ │  Stem Separator  │  (Demucs / Spleeter)
└─────────────┘                └──────────────────┘
                                        │
                      ┌────────────────┬┴────────────────┐
                      ▼                ▼                  ▼
                  [Vocals]       [Drums]            [Instrumental]
                      │                                   │
                      ▼                                   ▼
              ┌───────────────┐                ┌──────────────────┐
              │  Voice Clone  │                │  MusicGen Remix  │
              │  (RVC / so-vits)│               │  (melody cond.)  │
              └───────────────┘                └──────────────────┘
                      │                                   │
                      └──────────────┬────────────────────┘
                                     ▼
                            ┌─────────────────┐
                            │  DAW / FFmpeg   │  (mix & master)
                            │  Final Mixdown  │
                            └─────────────────┘
```

---

## Pipeline 1: Generate → Extend → Master

**Goal:** Produce a full-length track (3–5 min) from a single prompt.

**Models used:** Sonauto v3 (generation) → Sonauto `/v2/extend` (extension) → FFmpeg (normalization)

```python
import os, time, requests

BASE = "https://api.sonauto.ai/v1"
H = {"Authorization": f"Bearer {os.environ['SONAUTO_API_KEY']}", "Content-Type": "application/json"}

def poll(task_id: str) -> dict:
    while True:
        status = requests.get(f"{BASE}/generations/status/{task_id}", headers=H).text.strip('"')
        if status == "SUCCESS":
            return requests.get(f"{BASE}/generations/{task_id}", headers=H).json()
        if status == "FAILURE":
            raise RuntimeError(f"Task {task_id} failed")
        time.sleep(5)

# Step 1 — Generate seed track with v3
seed = requests.post(f"{BASE}/generations/v3", headers=H, json={
    "prompt": "cinematic lo-fi hip-hop with melancholic piano",
    "tags": ["lo-fi", "cinematic", "piano"],
    "instrumental": True
}).json()
seed_result = poll(seed["task_id"])
seed_url = seed_result["song_paths"][0]
print(f"Seed: {seed_url}")

# Step 2 — Extend right by 85 s (max per call)
ext1 = requests.post(f"{BASE}/generations/v2/extend", headers=H, json={
    "audio_url": seed_url,
    "side": "right",
    "extend_duration": 85.0,
    "tags": ["lo-fi", "cinematic", "piano"],
    "prompt": "Continue the mood, add subtle string swells"
}).json()
ext1_result = poll(ext1["task_id"])
extended_url = ext1_result["song_paths"][0]
print(f"Extended: {extended_url}")

# Step 3 — Normalize with FFmpeg
import subprocess
subprocess.run([
    "ffmpeg", "-i", extended_url,
    "-af", "loudnorm=I=-14:LRA=7:TP=-1",
    "-c:a", "mp3", "-b:a", "320k",
    "final_track.mp3"
], check=True)
print("Done → final_track.mp3")
```

---

## Pipeline 2: Suno → Stems → MusicGen Remix

**Goal:** Take an AI-generated song, isolate its melody line, and feed it to MusicGen for a style transfer.

**Models used:** Suno (full song) → Demucs (stem separation) → MusicGen (melody-conditioned generation)

```python
import torchaudio
from audiocraft.models import MusicGen
import subprocess, os

SUNO_AUDIO = "suno_output.mp3"   # download from Suno manually or via API

# Step 1 — Separate stems with Demucs
subprocess.run(["python", "-m", "demucs", "--two-stems=vocals", SUNO_AUDIO], check=True)
# Outputs: separated/htdemucs/suno_output/{vocals,no_vocals}.wav

melody_path = f"separated/htdemucs/suno_output/no_vocals.wav"

# Step 2 — Load melody waveform
melody_wav, sr = torchaudio.load(melody_path)
melody_wav = melody_wav.unsqueeze(0)   # [1, C, T]

# Step 3 — Condition MusicGen on the melody
model = MusicGen.get_pretrained("melody")
model.set_generation_params(duration=30)

output = model.generate_with_chroma(
    descriptions=["synthwave remix, pulsing bass, neon aesthetic"],
    melody_wavs=melody_wav,
    melody_sample_rate=sr
)

torchaudio.save("remixed.wav", output[0].cpu(), sample_rate=32000)
print("Remix saved → remixed.wav")
```

---

## Pipeline 3: Inpaint Loop (Selective Section Replacement)

**Goal:** Iteratively improve a weak section of a generated song.

**Models used:** Sonauto v2 (generation + inpaint) → human review loop

```python
import os, time, requests, json

BASE = "https://api.sonauto.ai/v1"
H = {"Authorization": f"Bearer {os.environ['SONAUTO_API_KEY']}", "Content-Type": "application/json"}

def poll(task_id):
    while True:
        s = requests.get(f"{BASE}/generations/status/{task_id}", headers=H).text.strip('"')
        if s == "SUCCESS":
            return requests.get(f"{BASE}/generations/{task_id}", headers=H).json()["song_paths"][0]
        if s == "FAILURE":
            raise RuntimeError("Failed")
        time.sleep(5)

# Initial generation
initial = poll(requests.post(f"{BASE}/generations/v2", headers=H, json={
    "tags": ["rock", "anthemic"],
    "lyrics": "[Verse]\nI walk alone at midnight\n[Chorus]\nRise above the noise"
}).json()["task_id"])

current_url = initial
print(f"Initial: {current_url}")

# Inpaint the chorus section (30s–60s) with improved lyrics
improved = poll(requests.post(f"{BASE}/generations/v2/inpaint", headers=H, json={
    "audio_url": current_url,
    "tags": ["rock", "anthemic"],
    "lyrics": "Soar beyond the fire, never surrender",
    "sections": [[30.0, 60.0]]
}).json()["task_id"])

print(f"Inpainted: {improved}")
```

---

## Pipeline 4: Fan-out Variation + Best-of Selection

**Goal:** Generate N variations in parallel, evaluate them, and return the best one.

```python
import os, asyncio, aiohttp

BASE = "https://api.sonauto.ai/v1"
KEY = os.environ["SONAUTO_API_KEY"]

async def generate_one(session, prompt, tags):
    async with session.post(f"{BASE}/generations/v3",
                            json={"prompt": prompt, "tags": tags, "instrumental": True},
                            headers={"Authorization": f"Bearer {KEY}"}) as r:
        return (await r.json())["task_id"]

async def poll_one(session, task_id):
    while True:
        async with session.get(f"{BASE}/generations/status/{task_id}",
                               headers={"Authorization": f"Bearer {KEY}"}) as r:
            status = (await r.text()).strip('"')
        if status == "SUCCESS":
            async with session.get(f"{BASE}/generations/{task_id}",
                                   headers={"Authorization": f"Bearer {KEY}"}) as r:
                return (await r.json())["song_paths"][0]
        if status == "FAILURE":
            return None
        await asyncio.sleep(5)

async def fan_out(prompt, tags, n=3):
    async with aiohttp.ClientSession() as session:
        task_ids = await asyncio.gather(*[generate_one(session, prompt, tags) for _ in range(n)])
        urls = await asyncio.gather(*[poll_one(session, tid) for tid in task_ids])
    return [u for u in urls if u]

# Run 3 variations, pick manually or score with a classifier
variations = asyncio.run(fan_out(
    "uplifting electronic track for a product launch",
    ["electronic", "uplifting", "2020s"]
))
for i, url in enumerate(variations):
    print(f"Variation {i+1}: {url}")
```

---

## Choosing a Pipeline

| Scenario | Recommended Pipeline |
|----------|---------------------|
| Need a full 3+ min track | Generate → Extend |
| Want style transfer on existing audio | Stems → MusicGen melody cond. |
| One weak section in an otherwise good take | Inpaint loop |
| Exploring creative directions | Fan-out + best-of |
| Client needs vocal + custom instrumental | Suno vocals → Demucs → MusicGen instrumental |

---

## Related

- [Orchestration Patterns](./orchestration-patterns)
- [Building a Music Agent](./building-a-music-agent)
- [Sonauto API](../apis/sunauto-api)
- [MusicGen](../model-zoo/musicgen)
- [Stem Separation](../producer-handbook/stem-separation)
