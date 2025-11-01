---
sidebar_position: 2
title: MusicGen (Meta)
---

# MusicGen

MusicGen is Meta's open-source text-to-music model, released in June 2023. It introduced a simple yet effective single-stage transformer architecture that generates music from text prompts or melody conditioning.

## Architecture

Unlike MusicLM's cascaded approach, MusicGen uses a **single autoregressive transformer** that models multiple codebook streams simultaneously.

```
Text Prompt ──▶ T5 Encoder ──▶ Conditioning
                                    │
                                    ▼
              ┌──────────────────────────┐
              │   Autoregressive         │
              │   Transformer            │──▶ EnCodec Tokens ──▶ Waveform
              │   (multi-stream)         │
              └──────────────────────────┘
```

### EnCodec Tokenization

Audio is compressed into discrete tokens using Meta's **EnCodec** codec with RVQ. At 32 kHz, this produces 4 codebook streams at 50 tokens per second.

Each timestep has $Q = 4$ parallel codebook tokens:

$$
\mathbf{c}_t = (c_t^1, c_t^2, c_t^3, c_t^4)
$$

### Codebook Interleaving Patterns

The key innovation in MusicGen is how it handles multi-codebook generation. Three patterns were explored:

**1. Flat Pattern (Baseline)**

Flatten all codebooks into a single sequence — simple but 4× slower:

$$
c_1^1, c_1^2, c_1^3, c_1^4, c_2^1, c_2^2, c_2^3, c_2^4, \dots
$$

**2. Parallel Pattern**

Generate all codebooks simultaneously with a delay offset:

$$
p(c_t^q | c_{<t}^{1:Q}, \mathbf{c}_{\text{text}})
$$

Codebook $q$ is delayed by $q-1$ steps, allowing the model to condition on coarser codebooks when generating finer ones.

**3. Delay Pattern (Best)**

A compromise: each codebook is shifted by one step, creating a staircase pattern. This allows single-pass generation while still modeling inter-codebook dependencies.

The delay pattern achieves the best quality/speed trade-off and is the default.

### Text Conditioning

Text is encoded using a frozen **T5 encoder**. Cross-attention layers inject text embeddings into the transformer:

$$
\text{CrossAttn}(Q_{\text{audio}}, K_{\text{text}}, V_{\text{text}})
$$

Classifier-free guidance is used during inference:

$$
\hat{\mathbf{l}} = (1 + w) \cdot \mathbf{l}_{\text{cond}} - w \cdot \mathbf{l}_{\text{uncond}}
$$

## Model Variants

| Variant | Parameters | Quality | Speed |
|---|---|---|---|
| MusicGen-Small | 300M | Good | Fast |
| MusicGen-Medium | 1.5B | Better | Moderate |
| MusicGen-Large | 3.3B | Best | Slower |
| MusicGen-Melody | 1.5B | + melody cond. | Moderate |

## Melody Conditioning

MusicGen-Melody accepts a reference audio melody in addition to (or instead of) text. The melody is encoded using a **chromagram** representation:

$$
\mathbf{m}_t = \text{Chroma}(x_{\text{ref}}, t) \in \mathbb{R}^{12}
$$

The 12-dimensional chroma vector captures pitch class distribution, allowing the model to follow a melody while generating new instrumentation and arrangement.

## Training Details

- **Data**: 20,000 hours of licensed music (Shutterstock, Pond5) + 10,000 hours of internal data
- **Sample rate**: 32 kHz mono
- **Segment length**: 30 seconds during training
- **Optimizer**: AdamW, $\beta_1 = 0.9$, $\beta_2 = 0.95$
- **Learning rate**: warmup + cosine decay

## Evaluation

MusicGen outperformed MusicLM on FAD and human preference scores at the time of release:

| Metric | MusicGen-Large | MusicLM |
|---|---|---|
| FAD (VGGish) | 3.80 | 4.00 |
| KL Divergence | 1.22 | 1.29 |
| Human Overall Quality | Preferred | Baseline |

## Open Source

MusicGen is fully open-source:
- Model weights available on Hugging Face
- Training code in Meta's **audiocraft** repository
- Inference supports CPU, GPU, and Apple Silicon

This openness made MusicGen the de facto baseline for text-to-music research.

## Engineering Significance

MusicGen demonstrated that:
1. A single transformer can handle multi-codebook generation efficiently
2. Clever interleaving patterns eliminate the need for cascaded architectures
3. Pre-trained text encoders (T5) transfer effectively to music conditioning
4. Open-weight music models can achieve competitive quality
