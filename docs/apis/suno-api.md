---
sidebar_position: 2
title: Suno API
---

# Suno API

Suno now provides an official developer platform at [platform.suno.com](https://platform.suno.com/). Its public landing page describes a REST API for generating songs, covers, and mashups. Account-specific documentation and credentials require signing in with the Google account linked to a Suno account.

:::warning Verify the live contract

Do not build against reverse-engineered `studio-api.suno.ai` routes, copied browser cookies, or unofficial wrappers that present private web endpoints as a supported API. Those interfaces can change without notice and may conflict with Suno's terms. This guide intentionally does not reproduce endpoint names, request fields, model identifiers, quotas, or prices that cannot be verified in the signed-in official documentation.

:::

## Integration workflow

1. Sign in to the [official Suno Platform](https://platform.suno.com/).
2. Create credentials through its account interface.
3. Read the current API reference shown for your account and plan.
4. Pin any documented API or model version supported by the service.
5. Keep the credential in a server-side secret store, never browser or mobile application code.
6. Validate generation, polling or callbacks, asset retention, cancellation, and billing in a non-production account.

## Contract checklist

Before implementing a client, record the official definitions for:

| Area | Questions to answer from the live documentation |
| --- | --- |
| authentication | Header format, key scopes, rotation, and revocation |
| creation | Endpoint, required fields, content limits, and idempotency behavior |
| jobs | Status values, terminal states, retry guidance, and cancellation |
| assets | Output formats, signed-URL lifetime, retention, and download authorization |
| versioning | API version, model identifier, deprecation policy, and reproducibility limits |
| quotas | Request rate, concurrent jobs, audio duration, credits, and billing behavior |
| rights and safety | Commercial-use terms, prohibited content, moderation, and data handling |

Treat all of these as versioned provider behavior. Marketing product names do not establish an API model identifier, and a seed does not guarantee identical output after a provider-side model update.

## Minimal client shape

Keep provider-specific paths and fields in configuration derived from the official reference:

```python
import os
import time
import requests

BASE_URL = os.environ["SUNO_API_BASE_URL"]
API_KEY = os.environ["SUNO_API_KEY"]
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

def request(method: str, path: str, **kwargs):
    response = requests.request(
        method,
        f"{BASE_URL.rstrip('/')}/{path.lstrip('/')}",
        headers=HEADERS,
        timeout=(5, 60),
        **kwargs,
    )
    response.raise_for_status()
    return response
```

Add an idempotency key if the official contract supports one. Retry only documented transient failures, use jitter, honor `Retry-After`, and do not retry an uncertain creation request unless duplicate creation is prevented.

## Provenance record

Store enough information to audit a generated asset without storing secrets:

```json
{
  "provider": "suno",
  "api_version": "value-from-response-or-contract",
  "model_version": "value-from-response-if-provided",
  "request_id": "provider-request-id",
  "job_id": "provider-job-id",
  "created_at": "ISO-8601 timestamp",
  "prompt_sha256": "digest-of-canonical-request",
  "output_sha256": "digest-of-downloaded-audio",
  "terms_reviewed_at": "YYYY-MM-DD"
}
```

Keep the canonical request in access-controlled storage when needed for reproducibility or rights review. Preserve the downloaded audio rather than relying on a hosted URL remaining permanent.

## Related resources

- [Suno Platform](https://platform.suno.com/) — official API entry point
- [API Patterns](../tools/api-reference-patterns.md) — asynchronous jobs, webhooks, idempotency, and backpressure
- [Responsible Use](../ethics-legal/responsible-use.md) — release and rights checks
