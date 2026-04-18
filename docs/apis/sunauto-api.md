---
sidebar_position: 3
title: Sonauto API
---

# Sonauto API

[Sonauto](https://sonauto.ai) is an AI music generation platform with its own API for generating, extending, and inpainting songs programmatically. It is a standalone service — not a wrapper around Suno.

- **Base URL:** `https://api.sonauto.ai/v1`
- **Docs:** [sonauto.ai/developers/docs](https://sonauto.ai/developers/docs)
- **Pricing:** [sonauto.ai/developers/pricing](https://sonauto.ai/developers/pricing)

> Songs are stored on Sonauto's CDN for **168 hours (1 week)** after generation. Download anything you want to keep before the URLs expire.

---

## Authentication

All endpoints require a Bearer token in the `Authorization` header. Generate your key at [sonauto.ai/developers/account](https://sonauto.ai/login?redirectUrl=%2Fdevelopers%2Faccount).

```http
Authorization: Bearer your_api_key_here
Content-Type: application/json
```

> **Security:** Never expose your API key in client-side code. Proxy requests through a backend and store the key in an environment variable.

---

## Generation Endpoints

### Core Parameters

At least one of `tags`, `lyrics`, or `prompt` is required for every generation request.

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | string | Natural-language description. Used to generate `tags`/`lyrics` if those are omitted. |
| `tags` | array[string] | Musical style tags (see [Tag Explorer](https://sonauto.ai/tag-explorer)). |
| `lyrics` | string | Full lyrics for the song. |
| `instrumental` | boolean | `true` to suppress vocals. Do not pass `lyrics` when set. |
| `prompt_strength` | float | Higher = stricter prompt adherence; lower = more natural sound. |
| `webhook_url` | string | URL to receive real-time status `POST` updates. |
| `output_format` | string | `ogg` (default), `mp3`, `flac`, `wav`, `m4a` |
| `output_bit_rate` | integer | For `mp3`/`m4a` only. Supported: `128`, `192`, `256`, `320` kbps. |
| `align_lyrics` | boolean | Run word-level lyrics-to-audio alignment after generation. |

> Providing only `lyrics` or `tags` without `prompt` is not supported — pass `prompt: ""` to leave style entirely to the AI.

---

### POST `/generations/v3`

Generates a variable-length song (typically 2–4 minutes) using the v3 model with improved audio quality. v3 supports real-time streaming.

**v3 does not support:** `seed`, `balance_strength`, `bpm`, or `num_songs` (always generates 1 song).

#### Request Body

```json
{
  "tags": ["lo-fi", "ambient", "2020s"],
  "prompt": "a chill lofi beat for studying",
  "instrumental": true,
  "prompt_strength": 2.0,
  "output_format": "mp3",
  "enable_streaming": false,
  "stream_format": "ogg",
  "align_lyrics": false,
  "webhook_url": "https://yourdomain.com/webhook"
}
```

| Field | Default | Notes |
|-------|---------|-------|
| `prompt_strength` | `2.0` | |
| `output_format` | `"ogg"` | |
| `enable_streaming` | `false` | Must be `true` to use the streaming endpoint later |
| `stream_format` | `"ogg"` | `"ogg"` or `"mp3"` |

#### Response

```json
{ "task_id": "abc123-def456-ghi789" }
```

#### Python Example

```python
import requests, os

headers = {
    "Authorization": f"Bearer {os.environ['SONAUTO_API_KEY']}",
    "Content-Type": "application/json"
}
payload = {
    "tags": ["rock", "energetic"],
    "prompt": "An upbeat rock song with heavy guitar riffs"
}
resp = requests.post("https://api.sonauto.ai/v1/generations/v3", json=payload, headers=headers)
task_id = resp.json()["task_id"]
```

---

### POST `/generations/v2`

Generates a fixed-length song (~1 min 35 sec). Supports `seed`, `balance_strength`, `bpm`, and `num_songs`.

#### Request Body

```json
{
  "tags": ["jazz", "mellow"],
  "lyrics": "[Verse 1]\nWalking through the midnight rain",
  "prompt": "A soulful jazz ballad",
  "instrumental": false,
  "prompt_strength": 1.5,
  "balance_strength": 0.7,
  "bpm": "auto",
  "seed": 42,
  "num_songs": 1,
  "output_format": "ogg",
  "align_lyrics": false,
  "webhook_url": "https://yourdomain.com/webhook"
}
```

| v2-specific field | Default | Description |
|-------------------|---------|-------------|
| `balance_strength` | `0.7` | Higher = more natural vocals; lower = sharper instrumentals |
| `bpm` | `null` | Integer, `"auto"`, or `null` to skip BPM conditioning |
| `seed` | — | Fixed seed for reproducible output |
| `num_songs` | `1` | `1` or `2`. Generating 2 songs costs **150 credits** instead of 100 |

---

### POST `/generations/v2/extend`

Extends an existing song at the start or end.

```json
{
  "audio_url": "https://cdn.sonauto.ai/generations2/audio_<id>_0.ogg",
  "tags": ["rock", "energetic"],
  "prompt": "Write another verse for my song",
  "side": "right",
  "extend_duration": 45.0,
  "crop_duration": 0
}
```

| Field | Description |
|-------|-------------|
| `audio_url` | Publicly accessible URL of the source audio. Use the original CDN URL to avoid re-encoding quality loss. |
| `audio_base64` | Alternative to `audio_url` — base64-encoded audio bytes (max 40 MB). |
| `side` | `"right"` (extend end) or `"left"` (extend start) |
| `extend_duration` | Seconds of new audio to generate (0 – 85.0) |
| `crop_duration` | Seconds to crop from the end (or start) of the original before extending |

---

### POST `/generations/v2/inpaint`

Replaces a section of an existing song with newly generated content.

```json
{
  "audio_url": "https://cdn.sonauto.ai/generations2/audio_<id>_0.ogg",
  "tags": ["rock", "energetic"],
  "lyrics": "New lyrics for the replaced section",
  "sections": [[0.0, 30.0]],
  "selection_crop": false
}
```

| Field | Description |
|-------|-------------|
| `sections` | Array of `[start, end]` timestamp pairs (seconds). Currently only 1 section supported. |
| `selection_crop` | When `true`, crops output to only the inpainted section |

---

## Data Fetching Endpoints

### GET `/generations/{task_id}`

Retrieve the completed generation and all its parameters.

```python
import requests, os

resp = requests.get(
    f"https://api.sonauto.ai/v1/generations/{task_id}",
    headers={"Authorization": f"Bearer {os.environ['SONAUTO_API_KEY']}"}
)
data = resp.json()
print(data["song_paths"])   # list of CDN URLs
```

**Response:**

```json
{
  "id": "string (UUID)",
  "created_at": "ISO 8601 timestamp",
  "status": "SUCCESS",
  "alignment_status": "null | SUCCESS | FAILURE",
  "model_version": "v2.2 | v3-preview",
  "song_paths": ["https://cdn.sonauto.ai/..."],
  "error_message": null,
  "lyrics": "string",
  "prompt": "string | null",
  "prompt_strength": 2.0,
  "tags": ["string"],
  "v2_params": {
    "balance_strength": 0.7,
    "seed": 42,
    "bpm": "auto | integer | null"
  }
}
```

---

### GET `/generations/status/{task_id}`

Poll the status of a pending generation. Returns a plain string by default.

```bash
curl https://api.sonauto.ai/v1/generations/status/abc123 \
  -H "Authorization: Bearer your_api_key_here"
# → "GENERATING"
```

Pass `?include_alignment=true` for combined status:

```json
{ "status": "SUCCESS", "alignment_status": "ALIGNING" }
```

**Status progression:**

| # | Status | Notes |
|---|--------|-------|
| 1 | `RECEIVED` | Request parsed |
| 2–6 | `TRANSCRIBE_*` | Inpaint / extend only |
| 7 | `PROMPT` | Generating tags / lyrics from prompt |
| 8 | `TASK_SENT` | Dispatched to GPU cluster |
| 9 | `GENERATE_TASK_STARTED` | GPU worker assigned |
| 10 | `LOADING_SOURCE` | Inpaint / extend only |
| 11 | `BEGINNING_GENERATION` | |
| 12 | `GENERATING` | Main generation in progress |
| 13 | `GENERATING_STREAMING_READY` | v3 only — streaming endpoint is live |
| 14 | `DECOMPRESSING` | |
| 15 | `SAVING` | Uploading to CDN |
| 16 | `SUCCESS` | `song_paths` are ready |
| 17 | `FAILURE` | No credits deducted |

---

### GET `/credits/balance`

```python
resp = requests.get("https://api.sonauto.ai/v1/credits/balance", headers=headers)
print(resp.json())
# { "num_credits": 900, "num_credits_payg": 200 }
```

| Field | Description |
|-------|-------------|
| `num_credits` | Subscription credits remaining |
| `num_credits_payg` | Pay-as-you-go credits remaining |

**Credit costs:** 100 credits per generation (1 song); 150 credits for `num_songs=2`.

---

## Streaming (v3 only)

v3 songs can be streamed in real time while generating. You must set `enable_streaming: true` in the generation request.

### GET `https://api-stream.sonauto.ai/stream/{task_id}`

- Connect after the status reaches `GENERATING_STREAMING_READY`.
- Returns all previously generated audio immediately, then streams new chunks.
- Stream expires a few seconds after `SUCCESS` — use `song_paths` for permanent access.

```html
<!-- Use directly in an HTML audio element -->
<audio controls autoplay>
  <source src="https://api-stream.sonauto.ai/stream/your_task_id" type="audio/ogg" />
</audio>
```

**Response content types:**
- `audio/ogg; codecs="opus"` (default)
- `audio/mpeg` (if `stream_format: "mp3"` was set)

---

## Lyrics Alignment

Set `align_lyrics: true` to get word-level timing data syncing lyrics to the generated audio. Runs as a post-processing step after `SUCCESS`.

- Only works for non-instrumental songs with lyrics.
- v2: requires `num_songs=1`.
- Monitor via `GET /generations/status/{task_id}?include_alignment=true`.

**Alignment status values:** `REQUESTED` → `TASK_SENT` → `ALIGNING` → `SUCCESS` / `FAILURE`

> Alignment failure deducts credits if the main generation succeeded.

---

## End-to-End Python Example

```python
import os, time, requests

BASE = "https://api.sonauto.ai/v1"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SONAUTO_API_KEY']}",
    "Content-Type": "application/json"
}

# 1. Start generation
resp = requests.post(f"{BASE}/generations/v3", json={
    "prompt": "a chill lofi beat for studying",
    "tags": ["lo-fi", "ambient"],
    "instrumental": True
}, headers=HEADERS)
task_id = resp.json()["task_id"]
print(f"Task: {task_id}")

# 2. Poll until complete
while True:
    status = requests.get(f"{BASE}/generations/status/{task_id}", headers=HEADERS).text.strip('"')
    print(f"  Status: {status}")
    if status == "SUCCESS":
        break
    if status == "FAILURE":
        raise RuntimeError("Generation failed")
    time.sleep(5)

# 3. Retrieve audio URL
data = requests.get(f"{BASE}/generations/{task_id}", headers=HEADERS).json()
print(data["song_paths"][0])
```

---

## Related Resources

- [Sonauto Developers](https://sonauto.ai/developers/docs) — official docs
- [Tag Explorer](https://sonauto.ai/tag-explorer) — browse supported style tags
- [Suno API](./suno-api) — Suno's separate generation API
- [API Patterns](../tools/api-reference-patterns) — general async API design
- [Production Workflow](../producer-handbook/production-workflow) — integrating AI audio into a DAW pipeline
