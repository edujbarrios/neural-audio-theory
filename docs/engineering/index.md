---
title: Engineering Docs
slug: /engineering
---

# Engineering Docs

Study how neural audio systems represent sound, learn conditional relationships, generate audio, and are evaluated in production and research settings.

## Follow the path

Work through the material in three layers. The sequence moves from signal foundations to model design and then to production systems.

### 1. Represent audio

1. **[Digital Audio Basics](../audio-fundamentals/digital-audio-basics.md)** — establish the signal-level vocabulary used throughout the documentation.
2. **[Music Representations](../concepts/music-representations.md)** — compare waveforms, spectrograms, symbolic formats, embeddings, and codec tokens.
3. **[Signal Processing Basics](../mathematics/signal-processing-basics.md)** — connect time-domain signals to frequency-domain analysis.

### 2. Model and train

4. **[Transformers for Audio](../architecture/transformers-for-audio.md)** and **[Diffusion Models](../architecture/diffusion-models.md)** — examine core generation architectures.
5. **[Dataset Curation](../training/dataset-curation.md)** — understand the data, rights, and labeling decisions that shape a model.
6. **[Evaluation Metrics](../training/evaluation-metrics.md)** — combine computational measurements with structured listening tests.

### 3. Build a system

Apply the foundations through **[APIs and Integration](../apis/index.md)**, **[AI Music Agents](../agents/index.md)**, and **[Advanced Topics](../advanced/controllable-generation.md)**. Use **[Reliability and Sourcing](./reliability-and-sourcing.md)** when documenting claims and system behavior.

## Choose by engineering task

| I need to… | Start here |
| --- | --- |
| Design an audio representation | [Audio Embeddings](../concepts/audio-embeddings.md) and [Neural Audio Codecs](../concepts/neural-audio-codecs.md) |
| Select a model architecture | [Architecture](../architecture/transformers-for-audio.md) |
| Prepare or augment training data | [Training](../training/dataset-curation.md) |
| Integrate a hosted model | [APIs](../apis/index.md) |
| Build a multi-model system | [AI Music Agents](../agents/index.md) |
| Fine-tune or control a model | [Advanced Topics](../advanced/fine-tuning-and-adaptation.md) |
| Check terminology | [Glossary](../glossary.md) |

These pages assume comfort with software concepts and introduce mathematics where it clarifies system behavior. Readers primarily interested in making music can use the **[User Guides](../user-guides/index.md)**.
