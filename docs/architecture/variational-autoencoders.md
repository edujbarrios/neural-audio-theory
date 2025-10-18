---
sidebar_position: 3
title: VAEs for Audio
---

# Variational Autoencoders for Audio

Variational Autoencoders (VAEs) are generative models that learn a compressed, continuous latent space from which new audio can be sampled. They are foundational in music AI — serving as the compression backbone in latent diffusion systems and as standalone generative models.

## Architecture

```
Input Audio x ──▶ Encoder q_φ(z|x) ──▶ z (latent) ──▶ Decoder p_θ(x|z) ──▶ Reconstructed x̂
                     │                      ▲
                     │    Reparameterization │
                     │    z = μ + σ⊙ε       │
                     └──────────────────────┘
```

### Encoder

Maps input audio to the parameters of a latent distribution:

$$
q_\phi(\mathbf{z}|x) = \mathcal{N}(\mathbf{z}; \boldsymbol{\mu}_\phi(x), \text{diag}(\boldsymbol{\sigma}_\phi^2(x)))
$$

For audio, the encoder is typically:
- **1D Convolutional**: for waveform input (neural codec style)
- **2D Convolutional**: for spectrogram input
- **Transformer-based**: for token sequences

### Reparameterization Trick

To backpropagate through sampling:

$$
\mathbf{z} = \boldsymbol{\mu} + \boldsymbol{\sigma} \odot \boldsymbol{\epsilon}, \quad \boldsymbol{\epsilon} \sim \mathcal{N}(0, \mathbf{I})
$$

This converts a stochastic sampling step into a deterministic function of learnable parameters plus independent noise.

### Decoder

Reconstructs audio from the latent vector:

$$
\hat{x} = D_\psi(\mathbf{z})
$$

Mirror architecture of the encoder with upsampling operations.

## Training Objective

The VAE is trained by maximizing the Evidence Lower Bound (ELBO):

$$
\mathcal{L}_{\text{ELBO}} = \underbrace{\mathbb{E}_{q_\phi(\mathbf{z}|x)}[\log p_\theta(x|\mathbf{z})]}_{\text{Reconstruction}} - \underbrace{D_{\text{KL}}(q_\phi(\mathbf{z}|x) \| p(\mathbf{z}))}_{\text{Regularization}}
$$

### Reconstruction Term

Measures how well the decoder reproduces the input. For audio:

$$
\log p_\theta(x|\mathbf{z}) \propto -\|x - \hat{x}\|_2^2 \quad \text{(Gaussian likelihood)}
$$

In practice, multi-scale spectral losses work better than raw waveform MSE:

$$
\mathcal{L}_{\text{recon}} = \sum_{m=1}^{M} \left(\mathcal{L}_{\text{sc}}^{(m)} + \mathcal{L}_{\text{mag}}^{(m)}\right) + \lambda \|x - \hat{x}\|_1
$$

### KL Divergence Term

Regularizes the latent space to be close to a standard Gaussian:

$$
D_{\text{KL}}(q_\phi(\mathbf{z}|x) \| \mathcal{N}(0, \mathbf{I})) = \frac{1}{2}\sum_{i=1}^{d}\left(\sigma_i^2 + \mu_i^2 - 1 - \log \sigma_i^2\right)
$$

This term:
- Prevents the encoder from using arbitrarily different regions for different inputs
- Creates a smooth, interpolable latent space
- Enables sampling by drawing $\mathbf{z} \sim \mathcal{N}(0, \mathbf{I})$

## The KL–Reconstruction Trade-off

### KL Collapse

If KL weight is too high, the model ignores the latent variable:

$$
q_\phi(\mathbf{z}|x) \approx p(\mathbf{z}) = \mathcal{N}(0, \mathbf{I}) \quad \text{(posterior collapses to prior)}
$$

Result: decoder generates from unconditional prior, latent codes carry no information.

### KL Annealing

Gradually increase KL weight during training:

$$
\mathcal{L} = \mathcal{L}_{\text{recon}} - \beta(t) \cdot D_{\text{KL}}
$$

where $\beta(t)$ increases from 0 to 1 over training. This lets the model first learn good reconstructions, then regularize the latent space.

### β-VAE

Use a fixed $\beta \neq 1$ to control the trade-off:

$$
\mathcal{L}_{\beta\text{-VAE}} = \mathcal{L}_{\text{recon}} - \beta \cdot D_{\text{KL}}
$$

- $\beta > 1$: more disentangled latent space, potentially worse reconstruction
- $\beta < 1$: better reconstruction, less regular latent space

## VQ-VAE: Vector Quantized VAE

Replace the continuous Gaussian bottleneck with discrete codes:

$$
\mathbf{z}_q = \text{VQ}(\mathbf{z}_e) = \arg\min_{\mathbf{e}_k \in \mathcal{C}} \|\mathbf{z}_e - \mathbf{e}_k\|
$$

### Advantages for Audio

- Discrete tokens are compatible with autoregressive transformers
- No KL collapse — codebook utilization replaces KL regularization
- Hierarchical VQ-VAE enables multi-resolution generation (Jukebox)

### VQ-VAE Training Loss

$$
\mathcal{L}_{\text{VQ-VAE}} = \|x - \hat{x}\|^2 + \|\text{sg}[\mathbf{z}_e] - \mathbf{e}\|^2 + \beta\|\mathbf{z}_e - \text{sg}[\mathbf{e}]\|^2
$$

Straight-through estimator: gradients pass through the quantization step to the encoder.

## Audio-Specific VAE Variants

### Convolutional VAE for Spectrograms

- Encoder: 2D Conv → BatchNorm → ReLU → downsample
- Latent: flattened feature map → μ, σ
- Decoder: upsample → 2D TransposeConv → output spectrogram

### WaveVAE

- Encoder: 1D dilated convolutions (WaveNet-style)
- Decoder: autoregressive waveform generation conditioned on z
- Very high quality but extremely slow

### VAE + GAN (VAE-GAN)

Combine VAE reconstruction with adversarial training:

$$
\mathcal{L} = \mathcal{L}_{\text{recon}} + \lambda_{\text{KL}} D_{\text{KL}} + \lambda_{\text{adv}} \mathcal{L}_{\text{adv}} + \lambda_{\text{feat}} \mathcal{L}_{\text{feat}}
$$

This produces sharper outputs than pure VAE while maintaining a structured latent space. Used in modern neural codecs (EnCodec, DAC) though they use VQ instead of Gaussian latents.

## VAEs as Compression in Latent Diffusion

In latent diffusion models (Stable Audio), the VAE serves as a compression stage:

1. **Training phase 1**: Train VAE to compress audio ↔ latent with high fidelity
2. **Training phase 2**: Train diffusion model in the VAE's latent space
3. **Inference**: Denoise in latent space → decode with VAE decoder

The VAE provides:
- 8–64× temporal compression
- Smooth, continuous latent space suitable for diffusion
- High-quality reconstruction at decoding time

## Latent Space Properties

### Interpolation

Linear interpolation between two latent codes:

$$
\mathbf{z}_t = (1-t)\mathbf{z}_A + t\mathbf{z}_B, \quad t \in [0, 1]
$$

In a well-trained audio VAE, this produces a smooth morph between two sounds.

### Arithmetic

Latent space may support semantic operations:

$$
\mathbf{z}_{\text{jazz piano}} \approx \mathbf{z}_{\text{piano}} + (\mathbf{z}_{\text{jazz guitar}} - \mathbf{z}_{\text{guitar}})
$$

This works to varying degrees depending on the disentanglement of the latent space.

### Sampling

Generate new audio by sampling from the prior:

$$
\mathbf{z} \sim \mathcal{N}(0, \mathbf{I}), \quad \hat{x} = D_\psi(\mathbf{z})
$$

Pure VAE samples tend to be blurry/smooth — this is why diffusion or autoregressive models are typically used for the generation step, with the VAE handling compression only.
