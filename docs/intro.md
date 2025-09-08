---
sidebar_position: 1
title: Introduction
---

# Neural Audio Theory

**By Eduardo J. Barrios**

Neural Audio Theory is an open educational reference focused on how AI music systems are engineered, trained, and evaluated.

## What You Will Learn

This handbook covers the full landscape of AI music — from foundational audio theory to production workflows to cutting-edge research:

### Foundations
- **[Audio Fundamentals](./audio-fundamentals/digital-audio-basics.md)** — digital audio, psychoacoustics, music theory, and codecs
- **[Concepts](./concepts/audio-embeddings.md)** — embeddings, latent spaces, neural codecs, text-audio alignment, and music representations

### Engineering
- **[Mathematics](./mathematics/fft.md)** — FFT, mel spectrograms, attention math, loss functions, and signal processing
- **[Architecture](./architecture/transformers-for-audio.md)** — transformers, diffusion models, VAEs, GANs, and U-Nets for audio
- **[Training](./training/dataset-curation.md)** — dataset curation, augmentation, training strategies, and evaluation metrics

### Systems
- **[Model Zoo](./model-zoo/musiclm.md)** — MusicLM, MusicGen, Stable Audio, Jukebox, Suno, and Udio
- **[Advanced Topics](./advanced/multimodal-generation.md)** — multimodal generation, real-time inference, fine-tuning, and controllable generation

### Practice
- **[Producer Handbook](./producer-handbook/production-workflow.md)** — workflows, troubleshooting, genre prompting, mixing, stem separation, and vocal synthesis
- **[Prompt Engineering Guide](./suno-prompting-guide.md)** — conditioning embeddings and prompt structure
- **[Tools & Ecosystem](./tools/daw-integration.md)** — DAW integration, open-source tools, and API patterns

### Reference
- **[Ethics & Legal](./ethics-legal/copyright-and-training-data.md)** — copyright, training data rights, and responsible use
- **[Glossary](./glossary.md)** — comprehensive A–Z reference of AI music terminology

## Core Engineering View

Most AI music systems follow a practical pipeline:

1. **Data preparation**: normalize, segment, and annotate large music/audio corpora
2. **Representation**: transform audio into spectrograms, codec tokens, or latents
3. **Modeling**: train sequence or diffusion networks with conditional inputs
4. **Inference control**: steer generation with prompts, structure tags, and guidance scales
5. **Post-processing**: mixing, mastering, and quality assurance
6. **Evaluation**: combine objective metrics and human listening tests

## If You Just Want to Make AI Music

If your main goal is creating songs quickly, start with the beginner page:

- **[For Dummies: Practical AI Music Background](./for-dummies.md)**

It translates the same engineering foundations into plain language while staying technically accurate, so you can move from "just prompting" to more consistent, controllable outputs.

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

Use the sidebar to explore all sections for a full engineering-level understanding.
