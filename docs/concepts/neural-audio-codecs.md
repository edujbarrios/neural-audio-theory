---
sidebar_position: 3
title: Neural Audio Codecs
---

# Neural Audio Codecs

Neural audio codecs replace hand-crafted compression algorithms with learned encoder-decoder networks. They achieve remarkable compression ratios while maintaining perceptual quality, and their discrete token representations have become the foundation for language model-based music generation.

## Why Neural Codecs Matter for Music AI

Traditional codecs (MP3, AAC, Opus) were designed for efficient storage and transmission. Neural codecs serve a dual purpose:

1. **Compression**: reduce audio to a compact representation
2. **Tokenization**: produce discrete tokens that language models can generate

This dual role makes neural codecs the bridge between continuous audio and discrete sequence modeling.

## Architecture Pattern

All major neural codecs follow the same high-level architecture:

```
Waveform ──▶ Encoder ──▶ Quantizer (RVQ) ──▶ Decoder ──▶ Waveform
               │              │                  ▲
               │         Codebook indices         │
               │      (discrete tokens)           │
               └──────────────────────────────────┘
```

### Encoder

A stack of 1D convolutional layers with downsampling:

$$
\mathbf{z} = E_\phi(x) \in \mathbb{R}^{D \times T'}
$$

where $T' = T / \prod_i s_i$ is the compressed temporal resolution and $s_i$ are stride factors.

Typical architecture: Conv1d blocks with residual connections, using strides of [2, 4, 5, 8] for progressive downsampling.

### Residual Vector Quantization (RVQ)

The continuous latent $\mathbf{z}$ is discretized using cascaded codebooks:

**Step 1**: Quantize with first codebook:
$$
\hat{\mathbf{z}}^{(1)} = \text{VQ}_1(\mathbf{z}), \quad r^{(1)} = \mathbf{z} - \hat{\mathbf{z}}^{(1)}
$$

**Step $q$**: Quantize the residual:
$$
\hat{\mathbf{z}}^{(q)} = \text{VQ}_q(r^{(q-1)}), \quad r^{(q)} = r^{(q-1)} - \hat{\mathbf{z}}^{(q)}
$$

**Final reconstruction**:
$$
\hat{\mathbf{z}} = \sum_{q=1}^{Q} \hat{\mathbf{z}}^{(q)}
$$

Each additional codebook refines the approximation. Early codebooks capture coarse structure (pitch, rhythm); later codebooks capture fine detail (noise, timbre nuance).

### Decoder

A mirror of the encoder with transposed convolutions for upsampling:

$$
\hat{x} = D_\psi(\hat{\mathbf{z}})
$$

## Training Objectives

Neural codecs are trained with a combination of losses:

### Reconstruction Loss

$$
\mathcal{L}_{\text{recon}} = \sum_{m=1}^{M}\left(\mathcal{L}_{\text{STFT}}^{(m)} + \lambda \|x - \hat{x}\|_1\right)
$$

Multi-resolution STFT loss captures both time and frequency accuracy.

### Adversarial Loss

A multi-scale discriminator ensures perceptual quality:

$$
\mathcal{L}_{\text{adv}} = \mathbb{E}\left[\sum_{k}(1 - D_k(\hat{x}))^2\right]
$$

Feature matching loss:

$$
\mathcal{L}_{\text{feat}} = \sum_{k}\sum_{l}\frac{1}{N_{k,l}}\|\phi_{k,l}(x) - \phi_{k,l}(\hat{x})\|_1
$$

### Codebook Loss

$$
\mathcal{L}_{\text{VQ}} = \|\text{sg}[\mathbf{z}] - \mathbf{e}\|_2^2 + \beta \|\mathbf{z} - \text{sg}[\mathbf{e}]\|_2^2
$$

Or, with exponential moving average (EMA) codebook updates, only the commitment term is needed.

## Major Neural Codecs

### EnCodec (Meta, 2022)

- 24 kHz mono/stereo, 1.5–24 kbps
- 32 codebooks available, selectable at inference
- Balancer mechanism for multi-loss training stability
- Used in MusicGen, AudioGen

**Token rate**: at 24 kHz with 75 Hz frame rate and 4 codebooks = 300 tokens/sec

### SoundStream (Google, 2021)

- Pioneer of the RVQ neural codec architecture
- 24 kHz mono, 3–18 kbps
- Used in AudioLM, MusicLM
- Quantizer dropout for bitrate-scalable compression

### Descript Audio Codec (DAC, 2023)

- Improved discriminator design (multi-scale + multi-period STFT)
- Better music quality at low bitrates
- Open-source implementation
- 44.1 kHz support

### Mimi (Kyutai, 2024)

- Used in the Moshi conversational model
- Adds a **semantic codebook** trained with a distillation loss:

$$
\mathcal{L}_{\text{distill}} = \|f_{\text{semantic}}(x) - g(\hat{\mathbf{z}}^{(1)})\|_2^2
$$

This explicitly separates semantic and acoustic information across codebook levels.

## Bitrate and Quality

| Codec | Bitrate | Quality (ViSQOL) | Music Suitability |
|---|---|---|---|
| EnCodec | 1.5 kbps | ~2.5 | Speech only |
| EnCodec | 6 kbps | ~3.5 | Acceptable music |
| EnCodec | 24 kbps | ~4.2 | Good music |
| DAC | 8 kbps | ~3.8 | Good music |
| Opus | 64 kbps | ~4.3 | Very good music |
| Opus | 128 kbps | ~4.6 | Near-transparent |

Neural codecs at 6–24 kbps achieve quality competitive with Opus at 64+ kbps — a 3–10× efficiency advantage.

## Codebook Properties for Music Generation

### Hierarchical Information Structure

| RVQ Level | Information Captured | Analogy |
|---|---|---|
| 1 (coarsest) | Pitch, rhythm, energy | Skeleton |
| 2–3 | Harmony, spectral envelope | Flesh |
| 4–8 | Timbre detail, transients | Skin texture |
| 8+ | Noise, micro-detail | Fine hair |

This hierarchy is crucial for generation: models can predict coarse tokens first and refine with additional codebooks, enabling multi-resolution generation strategies.

### Codebook Utilization

A common problem in VQ training is **codebook collapse** — many codes go unused. Solutions:

- **EMA updates** with usage tracking and reinitialization
- **Codebook reset**: replace dead codes with encoder outputs
- **Entropy regularization**: encourage uniform codebook usage

$$
\mathcal{L}_{\text{entropy}} = -\sum_{k=1}^{K} p_k \log p_k
$$

where $p_k$ is the usage probability of code $k$.

## Neural Codecs as Foundation for Music AI

The emergence of neural audio codecs has fundamentally reshaped music AI architecture:

1. **Before codecs**: models operated on spectrograms or raw waveforms (expensive)
2. **After codecs**: models operate on discrete tokens (efficient, compatible with LLM techniques)

This shift enabled the transfer of powerful language modeling techniques (transformers, autoregressive sampling, instruction tuning) directly to music generation.
