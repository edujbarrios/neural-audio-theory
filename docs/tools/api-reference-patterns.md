---
sidebar_position: 3
title: API Patterns
---

# API Patterns for AI Audio Generation

This page describes the common API design patterns used by AI music generation services. Understanding these patterns helps you integrate AI music tools into production workflows, build automated pipelines, and develop custom applications.

## Common API Architecture

Most AI music APIs follow this pattern:

```
Client ──▶ POST /generate (prompt + params) ──▶ Server
                                                    │
                                               Queue job
                                                    │
Client ◀── 202 Accepted (job_id) ◀────────────────┘
    │
    ▼
Client ──▶ GET /status/{job_id} ──▶ Server
Client ◀── 200 {status: "processing"} ◀── Server
    │
    ... (poll)
    │
Client ──▶ GET /status/{job_id} ──▶ Server
Client ◀── 200 {status: "complete", url: "..."} ◀── Server
    │
    ▼
Client ──▶ GET /download/{audio_id} ──▶ Audio file
```

Generation is asynchronous because it takes seconds to minutes.

## Request Patterns

### Text-to-Music Request

```json
{
  "prompt": "Melodic techno, 126 BPM, analog bass, airy pads, female vocal textures",
  "duration": 30,
  "sample_rate": 44100,
  "num_variations": 4,
  "guidance_scale": 3.0,
  "seed": 42
}
```

### Key Parameters

| Parameter | Type | Description |
|---|---|---|
| `prompt` | string | Text description of desired audio |
| `duration` | float | Target duration in seconds |
| `sample_rate` | int | Output sample rate (Hz) |
| `num_variations` | int | Number of outputs to generate |
| `guidance_scale` | float | Classifier-free guidance strength |
| `seed` | int | Random seed for reproducibility |
| `temperature` | float | Sampling temperature (diversity vs. quality) |
| `top_k` | int | Top-k sampling parameter |
| `top_p` | float | Nucleus sampling threshold |

### Continuation / Extension Request

```json
{
  "prompt": "Continue with a high-energy drop section",
  "input_audio": "base64_encoded_audio_or_url",
  "continuation_start": 25.0,
  "duration": 30
}
```

### Melody-Conditioned Request

```json
{
  "prompt": "Orchestral arrangement, strings and brass",
  "melody_audio": "base64_encoded_melody",
  "melody_strength": 0.8,
  "duration": 30
}
```

## Response Patterns

### Generation Response

```json
{
  "job_id": "gen_abc123",
  "status": "processing",
  "estimated_time": 15,
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Completion Response

```json
{
  "job_id": "gen_abc123",
  "status": "complete",
  "results": [
    {
      "id": "audio_001",
      "url": "https://api.example.com/audio/audio_001.wav",
      "duration": 30.0,
      "sample_rate": 44100,
      "format": "wav",
      "seed": 42
    },
    {
      "id": "audio_002",
      "url": "https://api.example.com/audio/audio_002.wav",
      "duration": 30.0,
      "sample_rate": 44100,
      "format": "wav",
      "seed": 43
    }
  ],
  "metadata": {
    "model": "musicgen-large",
    "inference_time": 12.3,
    "prompt": "Melodic techno, 126 BPM..."
  }
}
```

## Inference Server Patterns

### Local Model Serving

For self-hosted models, common frameworks:

| Framework | Best For | Protocol |
|---|---|---|
| **FastAPI** | Quick prototypes | REST |
| **Triton** | Production GPU serving | gRPC / REST |
| **TorchServe** | PyTorch models | REST / gRPC |
| **BentoML** | Packaging + serving | REST |
| **vLLM** | Autoregressive models | REST |

### Batching

Audio generation can benefit from dynamic batching:

$$
\text{Throughput} = \frac{B \times L}{\max(T_1, T_2, \dots, T_B) + T_{\text{overhead}}}
$$

where $B$ is batch size and $T_i$ is processing time for request $i$.

Batching same-length requests is most efficient since padding short requests wastes compute.

### Streaming

For real-time applications, stream audio as it's generated:

```
Client ──▶ WebSocket /stream
Server ──▶ [chunk_1] [chunk_2] [chunk_3] ...
```

Autoregressive models naturally support streaming (tokens generated sequentially). Diffusion models require full denoising before output, making streaming harder.

## Rate Limiting and Quotas

### Common Patterns

| Limit Type | Typical Values |
|---|---|
| Requests per minute | 10–60 |
| Concurrent generations | 1–5 |
| Max duration per request | 30–300 seconds |
| Monthly generation minutes | 100–10,000 |
| Max audio file size (input) | 10–50 MB |

### Handling Rate Limits

```
1. Check response headers for rate limit info
2. Implement exponential backoff on 429 responses
3. Queue requests client-side
4. Cache results to avoid re-generation
```

## Authentication Patterns

| Method | Use Case |
|---|---|
| API Key (header) | Simple server-to-server |
| OAuth 2.0 | User-facing applications |
| JWT tokens | Stateless authentication |

## Webhook Patterns

For long-running generations, webhooks avoid polling:

```json
{
  "prompt": "Epic orchestral music...",
  "webhook_url": "https://your-server.com/callback",
  "webhook_events": ["complete", "failed"]
}
```

Server POSTs to your webhook when generation completes:

```json
{
  "event": "complete",
  "job_id": "gen_abc123",
  "results": [...]
}
```

## Error Handling

### Common Error Responses

| Status | Meaning | Action |
|---|---|---|
| 400 | Bad request (invalid prompt/params) | Fix request |
| 401 | Unauthorized | Check API key |
| 402 | Quota exceeded | Upgrade plan or wait |
| 429 | Rate limited | Back off and retry |
| 500 | Server error | Retry with backoff |
| 503 | Service unavailable | Retry later |

### Safety Rejections

```json
{
  "error": "content_policy_violation",
  "message": "The prompt was rejected by the content safety filter",
  "code": 400
}
```

## Building a Generation Pipeline

### Batch Generation Workflow

```
1. Load prompt list
2. For each prompt:
   a. Submit generation request
   b. Store job_id
3. Poll all jobs for completion
4. Download completed audio
5. Run quality checks (CLAP score, loudness)
6. Organize by quality score
7. Select best outputs
```

### Prompt Iteration Pipeline

```
1. Define base prompt template
2. Generate parameter variations:
   - BPM: [120, 124, 128]
   - Style: ["dark", "bright", "warm"]
   - Structure: ["intro-drop", "verse-chorus"]
3. Submit all combinations
4. Evaluate results
5. Narrow down to best parameter region
6. Refine with smaller variations
```

## Caching Strategies

### Prompt-Based Caching

Cache results by prompt hash:

$$
\text{cache\_key} = \text{hash}(\text{prompt} + \text{params} + \text{seed})
$$

Exact seed match → exact same output (for deterministic models).

### Embedding-Based Caching

For similar (not identical) prompts:

$$
\text{similarity} = \text{cos\_sim}(\text{embed}(p_1), \text{embed}(p_2))
$$

If similarity > threshold, return cached result. Useful for deduplication.

## Best Practices

1. **Always specify seeds** for reproducibility
2. **Generate multiple variations** per prompt (N=4 is a good default)
3. **Store prompts with outputs** for traceability
4. **Implement retry logic** with exponential backoff
5. **Validate outputs** before using them (check duration, sample rate, silence)
6. **Monitor costs** — generation API credits add up quickly
7. **Use webhooks** instead of polling for production systems
8. **Cache aggressively** to avoid redundant generations
