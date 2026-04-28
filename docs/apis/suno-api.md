---
sidebar_position: 2
title: Suno API
---

# Suno API

[Suno](https://suno.com) is one of the most capable text-to-music AI platforms available as of 2026. Its API allows developers to generate full songs — including vocals, instrumentation, and production — from a natural-language prompt.

## Authentication

Suno uses **Bearer token** authentication. Generate your API key in the Suno dashboard under **Settings → API Keys**.

```http
Authorization: Bearer <YOUR_SUNO_API_KEY>
Content-Type: application/json
```

> **Security note:** Never embed API keys directly in client-side code. Store them in environment variables or a secrets manager and proxy requests through your backend.

## Base URL

```
https://studio-api.suno.ai/api/
```

---

## Endpoints

### Generate a Track

```http
POST /generate/v2/
```

**Request body:**

```json
{
  "prompt": "An upbeat lo-fi hip-hop track with jazzy piano chords and soft rain",
  "tags": "lo-fi, hip-hop, jazz, chill",
  "title": "Rainy Afternoon",
  "make_instrumental": false,
  "mv": "chirp-v3-5"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Natural-language description of the desired music |
| `tags` | string | No | Genre / style / mood tags, comma-separated |
| `title` | string | No | Display name for the generated clip |
| `make_instrumental` | boolean | No | `true` to suppress vocal generation |
| `mv` | string | No | Model version. Use `chirp-v3-5` (default) or `chirp-v4` |

**Response (202 Accepted):**

```json
{
  "clips": [
    { "id": "abc123", "status": "submitted" },
    { "id": "def456", "status": "submitted" }
  ],
  "metadata": { "prompt": "...", "tags": "..." }
}
```

Suno always returns **two clip variants** per request for creative diversity.

---

### Poll Generation Status

```http
GET /feed/?ids=abc123,def456
```

**Response (in-progress):**

```json
[
  { "id": "abc123", "status": "streaming", "audio_url": null },
  { "id": "def456", "status": "complete",  "audio_url": "https://cdn.suno.ai/abc..." }
]
```

**Status values:**

| Status | Meaning |
|--------|---------|
| `submitted` | Job queued |
| `queued` | Waiting for GPU |
| `streaming` | Audio being generated |
| `complete` | Ready to download |
| `error` | Generation failed |

---

### Extend a Track

```http
POST /generate/v2/
```

Pass `continue_clip_id` to extend an existing clip:

```json
{
  "continue_clip_id": "abc123",
  "continue_at": 30,
  "prompt": "Bridge section with strings and a key change to E major"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `continue_clip_id` | string | ID of the clip to extend |
| `continue_at` | number | Timestamp (seconds) where the extension begins |

---

### Upload Custom Lyrics

```http
POST /generate/v2/
```

Set `prompt` to the full lyrics with section markers:

```json
{
  "prompt": "[Verse 1]\nWalking through the midnight rain\n[Chorus]\nEverything fades away",
  "tags": "indie pop, melancholic",
  "make_instrumental": false
}
```

Use `[Verse]`, `[Chorus]`, `[Bridge]`, `[Outro]` markers to guide song structure. See the [Prompt Engineering Guide](../suno-prompting-guide) for full syntax.

---

## Python SDK Example

```python
import os, time, requests

BASE = "https://studio-api.suno.ai/api"
HEADERS = {"Authorization": f"Bearer {os.environ['SUNO_API_KEY']}",
           "Content-Type": "application/json"}

def generate(prompt: str, tags: str = "", instrumental: bool = False):
    resp = requests.post(f"{BASE}/generate/v2/", json={
        "prompt": prompt, "tags": tags, "make_instrumental": instrumental
    }, headers=HEADERS)
    resp.raise_for_status()
    clips = resp.json()["clips"]

    # Poll until complete
    ids = ",".join(c["id"] for c in clips)
    while True:
        feed = requests.get(f"{BASE}/feed/?ids={ids}", headers=HEADERS).json()
        if all(c["status"] == "complete" for c in feed):
            return [c["audio_url"] for c in feed]
        if any(c["status"] == "error" for c in feed):
            raise RuntimeError("Generation failed")
        time.sleep(5)

urls = generate("Epic orchestral battle music with choir", tags="orchestral, epic")
print(urls)
```

---

## Rate Limits & Credits

| Plan | Generations / day | Credits / generation |
|------|-------------------|--------------------|
| Free | 5 | 10 |
| Pro | 500 | 10 |
| Premier | Unlimited | — |

- Each `POST /generate/v2/` consumes **10 credits** and returns 2 clips.
- Polls (`GET /feed/`) are **free** and do not count against limits.
- Use `GET /billing/info/` to check remaining credits programmatically.

---

## Error Handling

```json
{ "detail": "Insufficient credits", "status_code": 402 }
```

| HTTP Status | Meaning |
|-------------|---------|
| 400 | Invalid request body |
| 401 | Missing or invalid API key |
| 402 | Insufficient credits |
| 429 | Rate limit exceeded — respect `Retry-After` |
| 5xx | Server error — retry with back-off |

---

## Best Practices

- **Deduplicate:** Cache `audio_url` by `clip_id`; the URL is stable once complete.
- **Parallel polls:** If you have many pending jobs, batch IDs in a single `GET /feed/` call (comma-separated, up to 20).
- **Retry 5xx:** Use exponential back-off starting at 2 s, capping at 30 s.
- **Content policy:** Suno's API enforces the same content guidelines as the UI. Prompts that violate terms return a `400` with a policy message.

---

## Related Resources

- [Prompt Engineering Guide](../suno-prompting-guide) — craft better prompts
- [API Patterns](../tools/api-reference-patterns) — general async API design
- [Udio & Suno Deep Dive](../model-zoo/udio-and-suno) — model internals
