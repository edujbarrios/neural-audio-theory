---
sidebar_position: 5
title: Agent Evaluation and Observability
---

# Agent Evaluation and Observability

An AI music agent is harder to evaluate than a single model because the final track is the result of many decisions: planning, model routing, generation, extension, stem processing, mixing, and delivery. Good evaluation separates those layers so you can tell whether a failed result came from the prompt plan, the chosen model, an API failure, or the audio itself.

This page describes a practical evaluation stack for production music agents.

## What to Measure

Track three classes of quality:

| Layer | Question | Example signals |
|---|---|---|
| Plan quality | Did the agent understand the brief? | Parsed tags, target duration, vocal/instrumental flag, structure plan |
| Execution quality | Did the workflow run reliably? | Task status, retries, latency, cost, failed steps |
| Audio quality | Did the final result satisfy the request? | Duration, loudness, clipping, CLAP score, human rating |

Do not collapse these into one score too early. A track can sound good while the plan was wrong, or the plan can be correct while a downstream generation failed.

## Run Log Schema

Every agent run should produce a structured log that can be replayed later. Store prompts, model choices, task IDs, artifact URLs, and scores, but never store secrets.

```json
{
  "run_id": "run_2026_04_18_001",
  "brief": "90 second cinematic synth cue, no vocals, tense intro, heroic ending",
  "plan": {
    "tags": ["cinematic", "synth", "heroic"],
    "instrumental": true,
    "target_duration_seconds": 90,
    "route": ["treblo_v3", "ffmpeg_normalize"]
  },
  "steps": [
    {
      "name": "treblo_v3",
      "status": "success",
      "task_id": "task_abc123",
      "latency_seconds": 74.2,
      "artifact": "https://cdn.example/audio.ogg"
    },
    {
      "name": "ffmpeg_normalize",
      "status": "success",
      "latency_seconds": 3.9,
      "artifact": "outputs/run_2026_04_18_001.mp3"
    }
  ],
  "scores": {
    "duration_seconds": 91.4,
    "integrated_lufs": -14.1,
    "true_peak_db": -1.0,
    "clap_alignment": 0.31,
    "human_rating": null
  }
}
```

This schema is intentionally simple. You can store it as JSONL during prototyping, then move it into Postgres, BigQuery, or an experiment tracker later.

## Automatic Checks

Use deterministic checks first. They catch cheap failures before you spend human review time.

| Check | Pass condition | Why it matters |
|---|---|---|
| Duration | Within target tolerance | Detects truncation and failed extension |
| Loudness | Around delivery target, often -14 LUFS for streaming previews | Avoids inconsistent playback level |
| True peak | Below delivery ceiling, often -1 dBTP | Avoids clipping after encoding |
| Silence ratio | Low percentage of near-silent frames | Detects failed renders and dead intros |
| File integrity | Decode succeeds end to end | Catches corrupt downloads |
| Route compliance | Actual route matches allowed route | Detects planner drift |

Example FFmpeg probes:

```bash
ffprobe -v error -show_entries format=duration -of json output.mp3
ffmpeg -i output.mp3 -af loudnorm=I=-14:LRA=7:TP=-1:print_format=json -f null -
```

## Alignment Scoring

For text-to-music agents, alignment is separate from fidelity. A clean track can still ignore the brief.

A practical alignment stack:

1. Compute a text-audio embedding score with CLAP or a similar model.
2. Run lightweight classifiers for explicit attributes such as vocal presence, tempo range, or genre.
3. Compare the detected attributes with the plan.
4. Send borderline cases to human review.

Use alignment scores as ranking signals, not absolute truth. They are most useful when comparing several variations generated from the same brief.

## Human Review Rubric

Human review should be short, consistent, and tied to the agent objective. A five-question rubric is often enough:

| Dimension | Prompt |
|---|---|
| Brief match | Does the result satisfy the original request? |
| Musical coherence | Does it feel like a coherent cue or song? |
| Audio fidelity | Are there distracting artifacts, clipping, or noise? |
| Structure | Does the arrangement develop naturally over time? |
| Usability | Would you keep, edit, or reject this output? |

For client-facing workflows, store the review decision as one of:

- `accept`
- `accept_with_edits`
- `regenerate`
- `manual_intervention`

This makes the data useful for future routing and prompt-policy improvements.

## Failure Taxonomy

Label failures in a way that points to the component that should change.

| Failure | Likely owner | Example fix |
|---|---|---|
| Wrong genre or mood | Planner | Tighten prompt extraction and routing rules |
| Vocals when instrumental was requested | Planner or model route | Add vocal-presence classifier gate |
| Too short | Execution engine | Add extension step or duration retry |
| Harsh clipping | Audio post-process | Adjust limiter or loudness target |
| Repeated sections | Generation model | Use alternate seed or inpaint weak region |
| API timeout | Infrastructure | Retry with backoff and preserve task ID |

Clear labels prevent vague "bad output" reports from piling up without action.

## Regression Sets

Keep a small set of briefs that represent the workflows your agent must handle. Run them after every meaningful planner, router, or prompt-template change.

```json
[
  {
    "id": "instrumental_30s_loop",
    "brief": "30 second seamless ambient loop, no vocals, warm pads",
    "must": ["instrumental", "duration_25_35s", "loopable"]
  },
  {
    "id": "vocal_pop_demo",
    "brief": "two minute upbeat pop demo with female vocals and a big chorus",
    "must": ["vocals", "pop", "chorus", "duration_90_150s"]
  },
  {
    "id": "cinematic_trailer_cue",
    "brief": "90 second cinematic trailer cue, tense intro, heroic ending",
    "must": ["instrumental", "cinematic", "dynamic_build"]
  }
]
```

The goal is not to freeze creativity. The goal is to detect when a routing or prompt change breaks core behavior.

## Production Dashboard

A useful dashboard for a music agent should show:

- Success rate by route
- Median and p95 latency by step
- Cost per accepted output
- Retry rate by provider
- Accept/regenerate/manual-intervention ratio
- Top failure labels
- Best and worst recent examples with playable artifacts

The best debugging view is usually a timeline of one run: brief, plan, step logs, artifacts, automatic checks, human review, and final output.

## Related

- [Orchestration Patterns](./orchestration-patterns)
- [Building a Music Agent](./building-a-music-agent)
- [Evaluation Metrics](../training/evaluation-metrics)
- [Production Workflow](../producer-handbook/production-workflow)
