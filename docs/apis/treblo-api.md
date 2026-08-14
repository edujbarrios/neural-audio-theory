---
sidebar_position: 3
title: Treblo API
---

# Treblo API

[Treblo](https://treblo.com/developers) provides a documented REST API for music generation. Older links and examples may use the former Sonauto name and `sonauto.ai` domains; the current official documentation redirects to Treblo and specifies `https://api.treblo.com/v1` as the API base.

Because hosted contracts evolve, use this page as an integration map and confirm fields against the [live Treblo API documentation](https://treblo.com/developers/docs) before deployment.

## Authentication and base URL

```http
Authorization: Bearer your_api_key_here
Content-Type: application/json
```

```text
https://api.treblo.com/v1
```

Keep the key on a server. Do not expose it in a web page, mobile bundle, notebook output, repository, or generated log.

## Generate with v3

The current documentation recommends v3 for new integrations and a prompt-only request as the starting point:

```python
import os
import requests

base = "https://api.treblo.com/v1"
headers = {
    "Authorization": f"Bearer {os.environ['TREBLO_API_KEY']}",
    "Content-Type": "application/json",
}

response = requests.post(
    f"{base}/generations/v3",
    headers=headers,
    json={"prompt": "A restrained chamber piece for strings and prepared piano"},
    timeout=(5, 60),
)
response.raise_for_status()
task_id = response.json()["task_id"]
```

Optional v3 controls documented by Treblo include explicit tags, lyrics, instrumental mode, negative tags, a length range, streaming, lyric alignment, output format, and a webhook URL. Defaults and valid ranges can change; omit controls you do not need.

## Poll and retrieve

Generation is asynchronous. Poll the status resource until a terminal state, then retrieve the generation resource:

```python
import time

while True:
    status_response = requests.get(
        f"{base}/generations/status/{task_id}",
        headers=headers,
        timeout=(5, 30),
    )
    status_response.raise_for_status()
    status = status_response.json()
    if isinstance(status, dict):
        status = status["status"]
    if status == "SUCCESS":
        break
    if status == "FAILURE":
        raise RuntimeError(f"Generation {task_id} failed")
    time.sleep(5)

result_response = requests.get(
    f"{base}/generations/{task_id}",
    headers=headers,
    timeout=(5, 30),
)
result_response.raise_for_status()
result = result_response.json()
```

Use bounded polling with cancellation and jitter in production. The official documentation says generated-song URLs are not permanent and may be deleted after 168 hours, so download required assets promptly and verify their hashes.

## Extend and stream

The current v3 extension route is `POST /generations/v3/extend`. It accepts a public audio URL or base64 audio and exposes context and crop controls. Prefer an original Treblo CDN asset when available because the service may reuse its latent representation rather than re-encode downloaded audio.

For a v3 request created with streaming enabled, connect to:

```text
https://api-stream.treblo.com/stream/{task_id}
```

Wait for `GENERATING_STREAMING_READY`. The generation stream is temporary; retrieve the final asset from the generation resource after completion.

## Version boundaries

The live documentation marks v2 as deprecated. V2-only controls include seed, BPM, balance strength, multiple-song generation, and v2 inpainting. Do not send them to v3. In particular:

- v3 and v2 have different control surfaces;
- v3 always returns one song according to the current contract;
- exact credit costs and plans belong in the pricing page, not hard-coded client logic;
- a deprecated route should have an explicit migration and removal plan.

## Operational safeguards

- Pin the API base and intended generation version in configuration.
- Preserve task IDs, canonical request hashes, response model versions, and output hashes.
- Treat webhook delivery as signed, at-least-once, and potentially unordered if Treblo documents signature support for your account.
- Do not log bearer tokens, lyrics, source-audio URLs, or base64 payloads.
- Validate duration, container, codec, channels, sample rate, clipping, and silence after download.
- Re-check the live contract before changing strength controls or relying on preview behavior.

## Official resources

- [Treblo developer overview](https://treblo.com/developers)
- [Treblo API documentation](https://treblo.com/developers/docs)
- [API Patterns](../tools/api-reference-patterns.md)
