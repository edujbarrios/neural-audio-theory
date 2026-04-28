---
sidebar_position: 1
title: MusicLM (Google)
---

# MusicLM

MusicLM is Google's hierarchical text-to-music generation model, introduced in January 2023. It generates high-fidelity music from text descriptions by combining three pre-trained models in a cascading architecture.

## Architecture Overview

MusicLM uses a three-stage pipeline:

```
Text Prompt
    │
    ▼
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  MuLan    │────▶│ Semantic     │────▶│ Acoustic    │──▶ Waveform
│  (text    │     │ Modeling     │     │ Modeling    │
│  encoder) │     │ Stage        │     │ Stage       │
└──────────┘     └──────────────┘     └─────────────┘
```

### Stage 1: Conditioning via MuLan

**MuLan** (Music Language) is a contrastive text-audio model (similar to CLIP for images). It maps text and audio to a shared embedding space:

$$
\mathcal{L}_{\text{MuLan}} = -\log \frac{\exp(\text{sim}(\mathbf{e}_t, \mathbf{e}_a) / \tau)}{\sum_k \exp(\text{sim}(\mathbf{e}_t, \mathbf{e}_{a,k}) / \tau)}
$$

MuLan embeddings serve as the conditioning signal for generation.

### Stage 2: Semantic Token Generation

A transformer generates **w2v-BERT semantic tokens** conditioned on MuLan embeddings:

$$
p(\mathbf{s}_{1:T} | \mathbf{c}_{\text{MuLan}}) = \prod_{t=1}^{T} p_\theta(\mathbf{s}_t | \mathbf{s}_{<t}, \mathbf{c}_{\text{MuLan}})
$$

Semantic tokens capture high-level musical content (melody, harmony, structure) without fine acoustic detail.

### Stage 3: Acoustic Token Generation

A second transformer generates fine-grained **SoundStream acoustic tokens** conditioned on both MuLan embeddings and the semantic tokens:

$$
p(\mathbf{a}_{1:T} | \mathbf{s}_{1:T}, \mathbf{c}_{\text{MuLan}}) = \prod_{t=1}^{T} p_\theta(\mathbf{a}_t | \mathbf{a}_{<t}, \mathbf{s}_{1:T}, \mathbf{c}_{\text{MuLan}})
$$

Acoustic tokens are then decoded to waveform by the SoundStream decoder.

## Key Components

### SoundStream

A neural audio codec that compresses audio into discrete tokens using Residual Vector Quantization (RVQ). The hierarchical token structure naturally separates semantic and acoustic information:

- **Coarse tokens** (first few codebook levels): semantic content
- **Fine tokens** (later codebook levels): acoustic detail

### w2v-BERT

MusicLM also uses a self-supervised audio model (w2v-BERT) to extract intermediate semantic representations that bridge the gap between text conditioning and audio tokens.

## Training Data

MusicLM was trained on a large internal dataset of 280,000 hours of music. The MuLan component was trained on 50 million audio-text pairs.

## Capabilities

- Generates 24 kHz audio at variable lengths
- Supports text prompts describing genre, instruments, mood, tempo
- Can condition on melody (melody-conditioned generation via melody tokens)
- Generates coherent music with reasonable structure

## MusicCaps Benchmark

Google released **MusicCaps** alongside MusicLM — a dataset of 5,521 music clips with human-written captions for evaluation. It has become a standard benchmark.

## Limitations

- Not open-source (as of last update)
- Can reproduce characteristics of training data (memorization concerns)
- Structure coherence degrades for long generations (>30s)
- Limited control over fine-grained arrangement

## Engineering Significance

MusicLM demonstrated that the cascaded semantic → acoustic generation approach works well for music, and that contrastive text-audio alignment (MuLan) is an effective conditioning mechanism. This hierarchical tokenization pattern influenced many subsequent systems.
