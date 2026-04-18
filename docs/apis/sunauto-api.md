---
sidebar_position: 3
title: Sunauto API
---

# Sunauto API

**Sunauto** is an open-source automation framework built on top of the Suno platform. It adds higher-level abstractions for bulk generation, album workflows, prompt templating, and webhook-based delivery that the raw Suno API does not expose.

> Sunauto is a community project and is **not** officially affiliated with Suno AI. Always review the [Suno Terms of Service](https://suno.com/terms) before deploying automated workflows at scale.

## Installation

```bash
# Node.js
npm install sunauto

# Python
pip install sunauto
```

## Authentication

Sunauto reuses your Suno API key and optionally a Sunauto Cloud token for managed infrastructure:

```env
SUNO_API_KEY=sk-...
SUNAUTO_TOKEN=sat-...    # optional — required only for Sunauto Cloud runners
```

Pass credentials in code:

```python
from sunauto import Sunauto

client = Sunauto(
    suno_api_key="sk-...",
    sunauto_token="sat-..."   # omit for self-hosted
)
```

---

## Core Concepts

### Jobs vs. Campaigns

| Concept | Description |
|---------|-------------|
| **Job** | A single generation request (maps 1-to-1 to a Suno clip pair) |
| **Campaign** | A group of Jobs with shared settings, retry logic, and output handling |
| **Template** | A reusable prompt recipe with variable slots |

### Prompt Templating

Sunauto uses a Mustache-style syntax for reusable prompts:

```
{{mood}} {{genre}} track at {{bpm}} BPM featuring {{instrument}}
```

Render a template with a context object:

```python
from sunauto.templates import PromptTemplate

tmpl = PromptTemplate("{{mood}} {{genre}} track at {{bpm}} BPM featuring {{instrument}}")

rendered = tmpl.render({
    "mood": "melancholic",
    "genre": "post-rock",
    "bpm": "120",
    "instrument": "reverb-heavy guitar"
})
# → "melancholic post-rock track at 120 BPM featuring reverb-heavy guitar"
```

---

## Endpoints (Sunauto Cloud)

### Submit a Job

```http
POST https://api.sunauto.dev/v1/jobs
Authorization: Bearer <SUNAUTO_TOKEN>
Content-Type: application/json
```

```json
{
  "prompt": "Ambient drone music with Tibetan bowl samples",
  "tags": "ambient, meditative, drone",
  "make_instrumental": true,
  "webhook_url": "https://yourdomain.com/webhooks/sunauto",
  "metadata": { "project": "meditation-app", "user_id": "u_9900" }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Generation prompt |
| `tags` | string | No | Style tags |
| `make_instrumental` | boolean | No | Suppress vocals |
| `webhook_url` | string | No | Receive results via webhook instead of polling |
| `metadata` | object | No | Arbitrary key/value pairs passed back in webhook payloads |

**Response (202 Accepted):**

```json
{
  "job_id": "sau_01HXYZ...",
  "status": "queued",
  "estimated_seconds": 25
}
```

---

### Poll Job Status

```http
GET https://api.sunauto.dev/v1/jobs/{job_id}
```

```json
{
  "job_id": "sau_01HXYZ...",
  "status": "complete",
  "clips": [
    {
      "id": "suno_abc123",
      "audio_url": "https://cdn.suno.ai/...",
      "duration_seconds": 92,
      "waveform_url": "https://cdn.sunauto.dev/waveforms/..."
    }
  ],
  "metadata": { "project": "meditation-app", "user_id": "u_9900" }
}
```

Sunauto enriches the base Suno response with `duration_seconds` and an optional `waveform_url`.

---

### Bulk Campaign

Generate many tracks in a single request with per-item prompt overrides:

```http
POST https://api.sunauto.dev/v1/campaigns
```

```json
{
  "template": "{{mood}} {{genre}} track for a {{scene}} scene",
  "items": [
    { "mood": "tense",   "genre": "cinematic", "scene": "car chase" },
    { "mood": "serene",  "genre": "folk",       "scene": "sunrise hike" },
    { "mood": "playful", "genre": "jazz",       "scene": "comedy sketch" }
  ],
  "make_instrumental": true,
  "webhook_url": "https://yourdomain.com/webhooks/sunauto/campaign"
}
```

**Response:**

```json
{
  "campaign_id": "camp_01HXYZ...",
  "total_jobs": 3,
  "estimated_total_seconds": 75
}
```

Poll the campaign:

```http
GET https://api.sunauto.dev/v1/campaigns/{campaign_id}
```

---

### Webhook Payload

When `webhook_url` is set, Sunauto sends a `POST` with the following JSON when each job completes:

```json
{
  "event": "job.complete",
  "job_id": "sau_01HXYZ...",
  "clips": [{ "id": "...", "audio_url": "...", "duration_seconds": 88 }],
  "metadata": { "project": "meditation-app", "user_id": "u_9900" }
}
```

**Verify webhook authenticity** by checking the `X-Sunauto-Signature` header:

```python
import hmac, hashlib

def verify_sunauto_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
```

---

## Python SDK — End-to-End Example

```python
import os
from sunauto import Sunauto
from sunauto.templates import PromptTemplate

client = Sunauto(suno_api_key=os.environ["SUNO_API_KEY"])

tmpl = PromptTemplate("{{mood}} {{genre}} instrumental at {{bpm}} BPM")

prompts = [
    tmpl.render({"mood": "dark",    "genre": "ambient", "bpm": "60"}),
    tmpl.render({"mood": "upbeat",  "genre": "pop",     "bpm": "128"}),
    tmpl.render({"mood": "soulful", "genre": "R&B",     "bpm": "90"}),
]

campaign = client.campaigns.create(
    prompts=prompts,
    make_instrumental=True,
)

print(f"Campaign {campaign.id} launched — {len(prompts)} jobs queued")

# Block until all complete (self-hosted polling)
results = campaign.wait()

for job in results:
    for clip in job.clips:
        print(clip.audio_url)
```

---

## JavaScript / TypeScript SDK

```ts
import { Sunauto } from 'sunauto';

const client = new Sunauto({ sunoApiKey: process.env.SUNO_API_KEY });

const job = await client.jobs.create({
  prompt: 'Cinematic trailer music with rising tension and orchestral swells',
  tags: 'cinematic, orchestral, trailer',
  makeInstrumental: true,
});

const result = await job.wait(); // polls internally
console.log(result.clips.map(c => c.audioUrl));
```

---

## Sunauto vs. Raw Suno API

| Feature | Raw Suno API | Sunauto |
|---------|-------------|---------|
| Single generation | ✅ | ✅ |
| Bulk / campaign | ❌ | ✅ |
| Prompt templates | ❌ | ✅ |
| Webhooks | ❌ | ✅ |
| Waveform thumbnails | ❌ | ✅ |
| Retry logic | Manual | Built-in |
| Self-hosted runner | N/A | ✅ |
| Official support | ✅ | Community |

---

## Self-Hosting the Runner

Run the Sunauto worker locally instead of routing through Sunauto Cloud:

```bash
docker run -e SUNO_API_KEY=sk-... \
           -p 8080:8080 \
           ghcr.io/sunauto/runner:latest
```

Then point your SDK at `http://localhost:8080`:

```python
client = Sunauto(suno_api_key="sk-...", base_url="http://localhost:8080")
```

---

## Rate Limits

Sunauto inherits Suno's underlying credit limits. The Sunauto Cloud layer adds:

| Tier | Concurrent jobs | Campaigns / hour |
|------|----------------|-----------------|
| Free | 2 | 3 |
| Starter | 10 | 20 |
| Pro | 50 | Unlimited |

---

## Error Reference

| Code | Meaning |
|------|---------|
| `sau_invalid_key` | Sunauto token invalid or expired |
| `sau_quota_exceeded` | Campaign size exceeds plan limit |
| `sau_suno_error` | Upstream Suno API error — check `upstream_detail` field |
| `sau_timeout` | Job did not complete within 120 s (retried automatically) |

---

## Related Resources

- [Suno API](./suno-api) — underlying generation API
- [Suno Prompting Guide](../suno-prompting-guide) — prompt strategies
- [Production Workflow](../producer-handbook/production-workflow) — integrating AI audio into a DAW pipeline
- [API Patterns](../tools/api-reference-patterns) — general async API design patterns
