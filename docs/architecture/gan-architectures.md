---
sidebar_position: 4
title: GAN Architectures
---

# GAN Architectures for Audio

Generative Adversarial Networks (GANs) are primarily used in audio AI as **vocoders** — converting mel spectrograms or latent representations to high-fidelity waveforms. They are the final stage in many music generation pipelines.

## GAN Fundamentals

A GAN consists of two networks trained adversarially:

- **Generator** $G$: creates fake audio from input features
- **Discriminator** $D$: distinguishes real audio from generated audio

### Minimax Objective

$$
\min_G \max_D \; \mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]
$$

In audio vocoders, $z$ is typically a mel spectrogram or latent code rather than random noise.

### Least-Squares GAN (LSGAN)

Most audio GANs use least-squares loss for stability:

$$
\mathcal{L}_D = \mathbb{E}[(D(x) - 1)^2] + \mathbb{E}[D(G(s))^2]
$$

$$
\mathcal{L}_G = \mathbb{E}[(D(G(s)) - 1)^2]
$$

where $s$ is the conditioning input (mel spectrogram).

## HiFi-GAN

HiFi-GAN (2020) is the most widely used neural vocoder. It achieves both high quality and fast inference.

### Generator Architecture

The generator uses **transposed convolutions** for upsampling, with **Multi-Receptive Field Fusion (MRF)** blocks:

```
Mel Spectrogram
    │
    ▼
ConvTranspose1d (upsample by 8)
    │ ──▶ MRF Block (kernels: 3, 7, 11)
    ▼
ConvTranspose1d (upsample by 8)
    │ ──▶ MRF Block
    ▼
ConvTranspose1d (upsample by 2)
    │ ──▶ MRF Block
    ▼
ConvTranspose1d (upsample by 2)
    │ ──▶ MRF Block
    ▼
Conv1d ──▶ tanh ──▶ Waveform
```

**MRF blocks** apply parallel residual blocks with different kernel sizes, then sum outputs. This captures patterns at multiple temporal scales simultaneously.

The total upsampling factor matches the hop size used in mel spectrogram extraction (e.g., $8 \times 8 \times 2 \times 2 = 256$).

### Multi-Period Discriminator (MPD)

Reshapes 1D audio into 2D patterns at different periods:

$$
x_p[t, c] = x[t \cdot p + c], \quad c = 0, \dots, p-1
$$

Each sub-discriminator uses 2D convolutions on a different period $p \in \{2, 3, 5, 7, 11\}$.

This captures periodic patterns at different scales — essential for perceiving pitch and harmonic structure.

### Multi-Scale Discriminator (MSD)

Operates on audio at different resolutions:
- Original resolution
- 2× downsampled
- 4× downsampled

Each sub-discriminator uses 1D grouped convolutions with increasing dilation.

### Training Losses

$$
\mathcal{L}_G = \mathcal{L}_{\text{adv}}(G) + \lambda_{\text{feat}} \mathcal{L}_{\text{feat}}(G) + \lambda_{\text{mel}} \mathcal{L}_{\text{mel}}(G)
$$

**Feature matching loss**:

$$
\mathcal{L}_{\text{feat}} = \sum_{k}\sum_{l} \frac{1}{N_{k,l}}\|D_k^{(l)}(x) - D_k^{(l)}(G(s))\|_1
$$

**Mel spectrogram loss**:

$$
\mathcal{L}_{\text{mel}} = \|M(x) - M(G(s))\|_1
$$

Typical weights: $\lambda_{\text{feat}} = 2$, $\lambda_{\text{mel}} = 45$.

## BigVGAN

BigVGAN (2023) scales up HiFi-GAN with several improvements:

### Key Changes

1. **Anti-aliased activation**: Applies low-pass filtering after nonlinearities to reduce aliasing artifacts

$$
\text{AMP}(x) = \text{LPF}(\text{snake}(x))
$$

2. **Snake activation**: Periodic activation function that captures harmonic structure:

$$
\text{snake}(x) = x + \frac{1}{\alpha}\sin^2(\alpha x)
$$

3. **Larger model**: More channels and layers
4. **Multi-resolution STFT discriminator**: Additional discriminator using complex STFT

### Performance

BigVGAN achieves state-of-the-art vocoder quality, especially for:
- Out-of-distribution inputs
- High-frequency content
- Unseen speakers and instruments

## MelGAN

MelGAN (2019) was one of the first GAN-based vocoders:

- No feature matching loss — pure adversarial training
- Window-based discriminator
- Faster than WaveNet but lower quality than HiFi-GAN
- Historically important but largely superseded

## Multi-Band MelGAN

Splits generation into frequency sub-bands:

$$
x = \sum_{b=1}^{B} \text{upsample}(G_b(s))
$$

Each sub-generator handles a different frequency range. The synthesis filter bank combines outputs. Faster inference due to reduced temporal resolution per band.

## UnivNet

Combines the best ideas from HiFi-GAN and MelGAN:

- **Location-Variable Convolutions (LVC)**: spatially adaptive kernels
- **Multi-Resolution Spectrogram Discriminator**: operates on multiple STFT resolutions
- Competitive quality with fast inference

## Vocos

A recent alternative that generates STFT magnitudes and phases directly:

$$
(|\hat{X}|, \angle\hat{X}) = G(s)
$$

$$
\hat{x} = \text{iSTFT}(|\hat{X}| \cdot e^{j\angle\hat{X}})
$$

Advantages:
- Very fast (no temporal upsampling convolutions)
- Directly produces complex spectrogram
- Good quality at extremely low computational cost

## Audio GAN Training Tips

### Discriminator Balance

The discriminator should not overpower the generator:

| Symptom | Cause | Fix |
|---|---|---|
| Mode collapse | D too strong | Reduce D learning rate |
| Noisy output | D too weak | Increase D capacity |
| Training oscillation | Imbalanced | Use gradient penalty, spectral normalization |

### Gradient Penalty

Regularize discriminator gradients:

$$
\mathcal{L}_{\text{GP}} = \lambda \mathbb{E}\left[(\|\nabla_{\hat{x}} D(\hat{x})\|_2 - 1)^2\right]
$$

### Spectral Normalization

Normalize weight matrices by their spectral norm:

$$
W_{\text{SN}} = \frac{W}{\sigma(W)}
$$

where $\sigma(W)$ is the largest singular value. Stabilizes discriminator training.

## GAN Vocoders in Music AI Pipelines

```
Text ──▶ [Text Encoder] ──▶ [Diffusion/AR Model] ──▶ Mel Spectrogram ──▶ [GAN Vocoder] ──▶ Waveform
```

The GAN vocoder is often the **last mile** of the generation pipeline. Its quality directly impacts perceived output quality, making vocoder selection a critical engineering decision.

| Vocoder | Quality | Speed (RTF) | Best For |
|---|---|---|---|
| HiFi-GAN V1 | Very good | ~80× RT | General purpose |
| BigVGAN | Excellent | ~40× RT | Highest quality |
| Vocos | Good | ~200× RT | Low latency |
| Multi-Band MelGAN | Good | ~150× RT | Mobile/edge |

RTF = Real-Time Factor (how many times faster than real-time).
