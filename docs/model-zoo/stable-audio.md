---
sidebar_position: 3
title: Stable Audio (Stability AI)
---

# Stable Audio

Stable Audio is Stability AI's text-to-music system, notable for being one of the first to apply **latent diffusion** — the same paradigm behind Stable Diffusion for images — to long-form music generation.

## Architecture

Stable Audio uses a latent diffusion model (LDM) instead of autoregressive token prediction:

```
Text Prompt ──▶ CLAP/T5 Encoder ──▶ Conditioning
                                        │
                                        ▼
Noise ──▶ ┌─────────────────────┐       │
          │   U-Net Denoiser    │◀──────┘
          │   (latent space)    │
          └─────────┬───────────┘
                    │
                    ▼
          ┌─────────────────────┐
          │   VAE Decoder       │──▶ Waveform
          └─────────────────────┘
```

### Variational Autoencoder (VAE)

A convolutional VAE compresses audio to a lower-dimensional latent representation:

- **Encoder**: waveform $x \rightarrow$ latent $\mathbf{z}_0 \in \mathbb{R}^{C \times T'}$
- **Decoder**: latent $\mathbf{z}_0 \rightarrow$ waveform $\hat{x}$

The VAE is trained with reconstruction + adversarial losses to preserve audio quality at high compression ratios.

### Diffusion in Latent Space

Instead of diffusing raw audio or spectrograms, diffusion operates on the compressed latent:

$$
\mathbf{z}_t = \sqrt{\bar{\alpha}_t}\mathbf{z}_0 + \sqrt{1-\bar{\alpha}_t}\boldsymbol{\epsilon}
$$

$$
\mathcal{L} = \mathbb{E}_{t, \mathbf{z}_0, \boldsymbol{\epsilon}} \left[\|\boldsymbol{\epsilon} - \boldsymbol{\epsilon}_\theta(\mathbf{z}_t, t, \mathbf{c})\|^2\right]
$$

This dramatically reduces compute and memory compared to waveform-level diffusion.

### U-Net Denoiser

The denoiser is a 1D U-Net adapted for audio latents:

- Skip connections at multiple scales
- Cross-attention layers for text conditioning
- Timestep embedding via sinusoidal + MLP
- Operates on the temporal dimension of the latent

### Conditioning

Stable Audio uses multiple conditioning signals:

1. **Text**: CLAP and/or T5 embeddings via cross-attention
2. **Duration**: explicit duration conditioning allows specifying output length
3. **Start time**: allows generating from a specific position in a theoretical full track

Duration conditioning is a distinctive feature:

$$
\mathbf{c}_{\text{dur}} = \text{MLP}(\text{sinusoidal\_embed}(d))
$$

where $d$ is the target duration in seconds.

## Stable Audio 2.0

The second version introduced significant improvements:

- **Longer generation**: up to 3 minutes (vs. 90 seconds in v1)
- **Stereo output**: native stereo generation
- **Audio-to-audio**: conditioning on input audio for style transfer and variation
- **Higher sample rate**: 44.1 kHz output
- **Improved structure**: better song-level coherence via longer context training

### Timing Conditioning

Stable Audio 2.0 uses a timing-aware architecture that encodes:

$$
\mathbf{c}_{\text{timing}} = [\text{embed}(t_{\text{start}}); \text{embed}(t_{\text{total}})]
$$

This allows the model to understand where it is in the overall track, improving structural coherence.

## Training Data

Stable Audio models are trained on licensed music from AudioSparx and other licensed catalogs. Stability AI emphasized using only licensed training data.

## Comparison with Autoregressive Approaches

| Aspect | Stable Audio (Diffusion) | MusicGen (Autoregressive) |
|---|---|---|
| Generation paradigm | Iterative denoising | Token-by-token |
| Duration flexibility | Native duration control | Fixed by sequence length |
| Inference speed | Faster for long audio | Slower for long sequences |
| Edit/inpainting | Naturally supported | Requires masking tricks |
| Quality character | Smooth, diffusion aesthetic | Sharp, token-level detail |

## Inference

During inference, the reverse diffusion process generates clean latents from noise:

$$
\mathbf{z}_{t-1} = \frac{1}{\sqrt{\alpha_t}}\left(\mathbf{z}_t - \frac{1-\alpha_t}{\sqrt{1-\bar{\alpha}_t}}\boldsymbol{\epsilon}_\theta(\mathbf{z}_t, t, \mathbf{c})\right) + \sigma_t \mathbf{n}
$$

Classifier-free guidance scales the conditioning effect:

$$
\hat{\boldsymbol{\epsilon}} = (1+w)\boldsymbol{\epsilon}_\theta(\mathbf{z}_t, t, \mathbf{c}) - w \cdot \boldsymbol{\epsilon}_\theta(\mathbf{z}_t, t, \varnothing)
$$

## Open Source

Stable Audio Open was released as an open-weight model, enabling:
- Community fine-tuning
- Research experimentation
- Custom deployment

## Engineering Significance

Stable Audio proved that latent diffusion is viable for long-form music generation, bringing the efficiency and flexibility of the Stable Diffusion paradigm to the audio domain. Duration conditioning and timing-aware architectures were particularly influential innovations.
