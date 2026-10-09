---
title: Sound Engineering
slug: /audio-engineering
---

# Sound Engineering: Mix, Master and Deliver

**For mix engineers, mastering engineers and technically minded producers.** This path is about the *audio signal and the final deliverable*, not about training a generative model.

You do not need machine-learning expertise. You do need critical listening, a DAW, a reference track, appropriate meters and an agreed delivery brief.

## Start with your job

| If you are responsible for… | Read first | Leave with… |
| --- | --- | --- |
| Translating a creative brief into a track | [Producer path](../user-guides/index.md) | Arrangement, approved take and creative notes |
| Repairing and balancing AI-assisted audio | [Mix preparation and diagnostics](./mix-session-and-diagnostics.md) | Session template, problem log and repeatable A/B test |
| Final loudness and Spotify-ready exports | [Mastering for streaming](./mastering-for-streaming.md) | Measured stereo master and format checks |
| Rights, credits and source traceability | [Provenance and release](./provenance-and-release.md) | Rights and provenance checklist |
| Understanding codecs, spectra or generation models | [AI/DSP engineering path](../engineering/index.md) | Signal and model architecture reference |

## The sound engineer's workflow

1. **Define the delivery.** Ask for release destination, approved mix, stems, native sample rate, revision and references.
2. **Inspect before processing.** Listen once uninterrupted. Log timecodes for clipping, masking, phantom-center instability, separated-stem artifacts and truncated tails.
3. **Correct the source.** Prefer an edit, arrangement change, replacement recording or revised generation when processing would make the problem worse.
4. **Mix with repeatable comparisons.** Level-match bypass tests, automate the arrangement, check the stereo-to-mono fold-down and avoid a universal preset.
5. **Master to the musical brief and delivery specification.** Measure the rendered file; do not infer its true peak or loudness from the live DAW meters.
6. **Verify and archive.** Export at native resolution when accepted, audition encoded previews, check metadata and preserve source/provenance records.

## A reference chain—not a fixed preset

```text
Approved source or aligned stems
        ↓
Technical edit and gain staging
        ↓
Corrective EQ / source repair (if needed)
        ↓
Dynamics and spatial balance (if needed)
        ↓
Automation and level-matched comparison
        ↓
Mix export + measured pre-master
        ↓
Mastering, true-peak check and listening QC
        ↓
Lossless delivery + version/provenance records
```

**Do not treat AI-generated audio as inherently defective.** Diagnose the audible problem first. Editing, stem separation, equalization, multiband processing and limiting can all be useful; unnecessary processing can also damage a good result.

### Handoffs between roles

- The **producer** approves the musical direction, arrangement, vocal intent and reference aesthetic.
- The **sound engineer** owns technical integrity, balance, measurable delivery constraints and reproducible QC.
- The **AI/DSP engineer** studies or builds representations, models, evaluation systems and tooling.

Those responsibilities often overlap in small teams; the documentation separates *decisions* so readers can find the right depth.

Continue with [mix diagnostics](./mix-session-and-diagnostics.md), [streaming mastering](./mastering-for-streaming.md) or return to [the producer guide](../user-guides/index.md).
