---
sidebar_position: 1
title: APIs Overview
---

# AI Music Generation APIs

This section covers the public and unofficial APIs available for programmatic access to AI music generation platforms. Whether you're building a creative tool, automating a production pipeline, or experimenting with generative audio, understanding these APIs is essential.

## What's Covered

| Guide | Description |
|-------|-------------|
| [Suno API](./suno-api) | Authentication, endpoints, generation parameters, and best practices for the Suno AI API |
| [Sonauto API](./sunauto-api) | Official Sonauto REST API — generate, extend, and inpaint songs with v2/v3 models, real-time streaming, and lyrics alignment |

## Common Concepts

### Asynchronous Generation

All AI music generation APIs operate **asynchronously**. You submit a job and poll for results — generation typically takes 10–60 seconds depending on track length and server load.

```
POST /generate   →  202 Accepted  { job_id }
GET  /status/:id →  200 { status: "processing" | "complete" | "failed" }
```

### Rate Limits

Most services enforce per-minute and per-day quotas. Design your integration to:
- Respect `Retry-After` headers
- Implement exponential back-off
- Cache completed assets by `job_id` to avoid re-generation

### Audio Formats

APIs typically return one of:
- **MP3** — universal, streaming-friendly
- **WAV** — lossless, preferred for further processing
- **M4A / AAC** — common on mobile-first services

See [Audio Formats & Codecs](../audio-fundamentals/audio-formats-and-codecs) for a deeper dive.
