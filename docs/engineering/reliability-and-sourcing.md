---
title: Reliability and Sourcing
---

# Reliability and Sourcing

Neural Audio Theory separates durable concepts from changing product behavior and unresolved research claims. This page explains how to interpret statements in the guide and how contributors should support them.

## Evidence hierarchy

Prefer evidence in this order:

1. specifications, standards, laws, and first-party product documentation;
2. peer-reviewed papers or original technical reports;
3. official source code, model cards, datasets, and release notes;
4. reproducible measurements with disclosed settings and artifacts;
5. clearly labeled secondary analysis;
6. anecdotal observations, used only to motivate a test.

A citation establishes only what its source demonstrates. A model paper does not automatically describe a hosted product with the same brand, and a benchmark score does not transfer to another dataset or preprocessing pipeline.

## Claim labels

Use explicit language for claims about systems that are not fully public:

| Label | Required support |
| --- | --- |
| **Documented** | A current first-party source or primary publication states it |
| **Observed** | A dated, reproducible test demonstrates it |
| **Inferred** | Evidence supports a hypothesis but does not confirm the mechanism |
| **Unknown** | Public evidence is insufficient |

Do not use “likely,” “appears to,” or output artifacts as a substitute for this distinction. Inference can guide experiments but should not be presented as architecture fact.

## Time-sensitive claims

Treat these as volatile:

- API endpoints, request fields, authentication, quotas, prices, and model names;
- hosted product features, duration limits, formats, and plan rights;
- software versions and hardware performance;
- laws, court decisions, regulatory guidance, and provider terms;
- public availability and licenses of datasets or model weights.

Time-sensitive statements should link a first-party source and state when they were checked when the date materially affects interpretation. Avoid duplicating a provider's complete reference; explain the integration pattern and send readers to the live contract.

## Quantitative claims

Every performance number needs enough context to reproduce or reject it:

- dataset and split;
- sample count and independent evaluation unit;
- sample rate, channels, duration, and preprocessing;
- model checkpoint, precision, sampler, and candidate budget;
- metric implementation and embedding checkpoint;
- hardware, runtime, batch size, warm-up, and timing boundary;
- uncertainty or repeated-run variation.

Numbers without matched conditions should not be combined into a leaderboard.

## Corrections policy

When correcting a page:

1. preserve useful context while removing unsupported certainty;
2. replace secondary summaries with primary sources when practical;
3. explain operating conditions and limitations next to the claim;
4. update related pages, navigation, and examples that repeat the claim;
5. run `npm run check` before opening the pull request;
6. describe the evidence and reader impact in the pull request.

Report suspected errors through [GitHub Issues](https://github.com/edujbarrios/neural-audio-theory/issues). Include the page, exact claim, proposed correction, and strongest available source. Never include credentials, private audio, or personal information.

## Scope boundaries

This project is educational. Technical explanations are not legal advice, licensing clearance, safety certification, or a guarantee that a provider will preserve behavior. For consequential releases or deployments, verify the primary material and obtain qualified review appropriate to the jurisdiction and risk.

Continue with [Benchmark Design](../training/benchmark-design.md) for experimental comparisons and [Evaluation Metrics](../training/evaluation-metrics.md) for measurement design.
