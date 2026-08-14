---
title: Benchmark Design
---

# Designing Music-Generation Benchmarks

A benchmark is an experimental contract, not a playlist of impressive prompts. It should make system boundaries, selection budgets, failure cases, and uncertainty visible enough that another team could reproduce the comparison.

## Start with a decision

Write the decision the benchmark will support: choosing a model for an interactive instrument, measuring a new conditioning method, or validating a release. The decision determines the evaluation unit and minimum practical effect. A benchmark that mixes research ablations, product latency, and listener preference without priorities usually answers none of them well.

## Build a prompt matrix

Stratify prompts across capabilities rather than sampling only genres:

| Axis | Example strata |
| --- | --- |
| duration | local texture, phrase, section, full-form excerpt |
| control | free text, tempo/key, chords, melody, reference audio |
| arrangement | solo, sparse ensemble, dense mix, stem request |
| acoustics | dry, reverberant, stereo placement, dynamic range |
| composition | repetition, transition, development, long-range return |
| language | literal attributes, negation, compositional descriptions |

Freeze prompts before listening to outputs. Keep a hidden challenge set for regression testing so prompt wording is not tuned to the benchmark.

## Define the generation policy

Record the complete policy for each system:

```yaml
model: checkpoint-or-service-version
duration_seconds: 30
candidates_per_prompt: 1
selection: none
seed_policy: paired-where-supported
sampler: named-sampler
guidance: declared-value
post_processing: loudness-normalization-for-listening-only
timeout_seconds: declared-value
retries: 0
```

Unsupported controls, timeouts, safety refusals, and malformed outputs are results. Do not silently regenerate them. If human selection or reranking is part of the intended product workflow, declare its cost and apply an equivalent budget to baselines.

## Prevent contamination

Deduplicate reference material by recording and composition, not filename. Use audio fingerprints and embedding-neighbor review to supplement metadata. For continuation or reconstruction tasks, split before slicing clips. When training data are unknown, label contamination risk as unknown rather than claiming a clean test set.

## Listening-test design

Choose the task that matches the decision:

- paired preference for a direct system comparison;
- MUSHRA-like multi-stimulus testing for intermediate-quality degradations;
- absolute category ratings for independently meaningful attributes;
- expert annotation for narrow defects such as timing, clipping, or harmony.

Randomize order, blind system identity, include attention or repeat trials, and avoid asking too many questions per excerpt. Capture listening device and environment when they affect interpretation. Pilot the interface and anchors before collecting the full study.

## Analysis plan

Use prompt or source item as the resampling unit when several listeners rate the same audio. Report paired effect sizes and uncertainty. For binary preference, show ties and abstentions rather than forcing a choice. For ordinal ratings, medians or ordinal models may be more appropriate than treating labels as interval data.

Slice results by predeclared prompt strata and failure status. Treat exploratory slices as hypotheses for the next benchmark, not confirmed discoveries.

## Release checklist

- benchmark version and license are recorded;
- prompts, source IDs, and exclusions are published where rights permit;
- system versions and generation policies are frozen;
- raw audio is retained before normalization;
- metric implementations and checkpoints are pinned;
- listener instructions, interface, anchors, and demographics are documented;
- statistical analysis and confidence intervals use the correct independent unit;
- environmental cost, latency, and peak memory use named hardware and batch size;
- known contamination, moderation, and API-version limitations are explicit.

Continue with [Evaluation Metrics](./evaluation-metrics.md) to select measurements for each benchmark dimension.
