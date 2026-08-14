---
sidebar_position: 1
title: APIs Overview
---

# AI Music Generation APIs

This section covers supported APIs and durable integration patterns for programmatic music generation. Provider contracts change quickly: verify endpoints, fields, model identifiers, limits, pricing, and terms in current first-party documentation before deployment.

:::info Freshness rule

Provider pages explain integration boundaries and link to the live contract. They do not treat undocumented browser endpoints or copied wrappers as supported APIs. See [Reliability and Sourcing](../engineering/reliability-and-sourcing.md) for the evidence standard.

:::

## What's Covered

| Guide | Description |
|-------|-------------|
| [Suno API](./suno-api) | Authentication, endpoints, generation parameters, and best practices for the Suno AI API |
| [Treblo API](./treblo-api) | Official Treblo REST API for asynchronous generation, extension, streaming, and lyrics alignment |

## Common Concepts

### Asynchronous Generation

Long-running music generation commonly uses asynchronous jobs. A provider may support polling, webhooks, streaming, synchronous previews, or a combination; follow its documented contract.

```
POST /generate   →  202 Accepted  { job_id }
GET  /status/:id →  200 { status: "processing" | "complete" | "failed" }
```

### Rate Limits

Hosted services commonly enforce request, concurrency, duration, or account quotas. Design your integration to:
- Respect `Retry-After` headers
- Implement exponential back-off
- Cache completed assets by `job_id` to avoid re-generation

### Audio Formats

APIs typically return one of:
- **MP3** — universal, streaming-friendly
- **WAV** — lossless, preferred for further processing
- **M4A / AAC** — common on mobile-first services

See [Audio Formats & Codecs](../audio-fundamentals/audio-formats-and-codecs) for a deeper dive.
