---
sidebar_position: 1
title: Introduction
---

# Neural Audio Theory

**By Eduardo J. Barrios**

Neural Audio Theory is an open educational reference for both people making music with AI and people engineering the systems behind it.

The project covers common ideas across neural audio without assuming that every commercial or research system uses the same architecture. Where implementation details are unpublished, product-specific, or inferred from observed behavior, the documentation aims to say so explicitly.

## Choose your learning path

### [Create music with AI: User Guides](./user-guides/index.md)

Choose this path if your goal is to make, troubleshoot, finish, or release AI-assisted music. It uses plain language and assumes no machine-learning background.

**Start here:** [AI Music in Plain Language](./for-dummies.md) → [Prompt Engineering](./suno-prompting-guide.md) → [Production Workflow](./producer-handbook/production-workflow.md)

### [Build and study neural audio systems: Engineering Docs](./engineering/index.md)

Choose this path if your goal is to understand, build, train, integrate, or evaluate neural audio systems. It assumes comfort with software concepts and introduces the required mathematics along the way.

**Start here:** [Digital Audio Basics](./audio-fundamentals/digital-audio-basics.md) → [Music Representations](./concepts/music-representations.md) → [Signal Processing Basics](./mathematics/signal-processing-basics.md)

Technical claims follow the guide's [Reliability and Sourcing](./engineering/reliability-and-sourcing.md) standard, which distinguishes documented facts, observations, inference, and unknowns.

Both paths describe the same field from different levels of abstraction. You can switch between them whenever a practical question needs a technical explanation—or an engineering concept needs a musical example.

## What You Will Learn

This handbook covers a broad set of practical and engineering topics in AI music and neural audio, from digital-signal foundations and representations to production workflows, model design, evaluation, and responsible use.

### Foundations
- **[Audio Fundamentals](./audio-fundamentals/digital-audio-basics.md)** — digital audio, psychoacoustics, music theory, and codecs
- **[Concepts](./concepts/audio-embeddings.md)** — embeddings, latent spaces, neural codecs, text-audio alignment, and music representations

### Engineering
- **[Mathematics](./mathematics/fft.md)** — FFT, mel spectrograms, attention math, loss functions, and signal processing
- **[Architecture](./architecture/transformers-for-audio.md)** — transformers, diffusion models, VAEs, GANs, and U-Nets for audio
- **[Training](./training/dataset-curation.md)** — dataset curation, augmentation, training strategies, and evaluation metrics

### Systems
- **[Model Zoo](./model-zoo/musiclm.md)** — selected research and commercial systems, with published details separated from observation or inference
- **[Advanced Topics](./advanced/multimodal-generation.md)** — multimodal generation, real-time inference, fine-tuning, and controllable generation

### Practice
- **[Producer Handbook](./producer-handbook/production-workflow.md)** — workflows, troubleshooting, genre prompting, mixing, stem separation, and vocal synthesis
- **[Prompt Engineering Guide](./suno-prompting-guide.md)** — practical prompt structure and model-specific control patterns where documented or observed
- **[Tools & Ecosystem](./tools/daw-integration.md)** — DAW integration, open-source tools, and API patterns

### Reference
- **[Ethics & Legal](./ethics-legal/copyright-and-training-data.md)** — copyright, training data rights, and responsible use
- **[Glossary](./glossary.md)** — comprehensive A–Z reference of AI music terminology

## A Useful Engineering View

There is no single pipeline shared by all AI music systems. A useful way to reason about many systems is to separate the stages involved in **building a model**, **running inference**, and **finishing audio after generation**.

### Training-time stages

1. **Data preparation**: collect, filter, normalize, segment, and—where needed—annotate audio or music data.
2. **Representation**: choose how the system encodes its inputs and targets, such as waveforms, time-frequency features, symbolic events, neural codec tokens, embeddings, or continuous latents.
3. **Modeling and optimization**: train one or more networks using objectives appropriate to the architecture and representation.
4. **Evaluation**: measure technical behavior and use human listening where objective metrics cannot capture musical quality or preference.

### Inference-time stages

1. **Conditioning**: encode whatever controls the system supports, which may include text, metadata, structural information, melody, reference audio, or other modalities.
2. **Generation or prediction**: produce audio, tokens, latents, symbolic events, or intermediate representations according to the model design.
3. **Decoding or reconstruction**: when the model operates in a compressed or latent representation, convert that representation back to an audible waveform.
4. **Evaluation and selection**: compare outputs using listening, diagnostics, or task-specific measurements.

### Production stages outside the model

Editing, stem processing, mixing, mastering, metadata preparation, and release quality control are often part of the **creative workflow**, not intrinsic stages of the generative model itself. Some products may automate portions of these steps, but they should not be assumed to exist inside every model architecture.

This separation is intentionally conceptual. Individual systems may combine stages, omit them, use multiple models, or keep implementation details private.

## If You Just Want to Make AI Music

If your main goal is creating songs quickly, start with the beginner page:

- **[For Dummies: AI Music in Plain Language](./for-dummies.md)**

It translates the same engineering foundations into plain language while staying technically cautious, so you can connect practical controls to plausible system behavior without assuming access to unpublished internals.

Then dive into the **Producer Handbook** for practical workflows, genre-specific prompting tips, and mixing techniques for AI-generated audio.

## Example Mathematical Building Blocks

Continuous Fourier transform for a signal $x(t)$:

$$
X(f) = \int_{-\infty}^{\infty} x(t) \, e^{-j2\pi ft} \, dt
$$

Cosine similarity for embedding vectors $\mathbf{a}$ and $\mathbf{b}$:

$$
\text{sim}(\mathbf{a}, \mathbf{b}) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\| \, \|\mathbf{b}\|}
$$

Use the sidebar to explore all sections, and use the reliability standard when a page discusses a fast-changing product, unpublished architecture, or system-specific behavior.
