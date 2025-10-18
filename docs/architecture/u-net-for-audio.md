---
sidebar_position: 5
title: U-Net for Audio
---

# U-Net for Audio

The U-Net architecture — originally designed for biomedical image segmentation — has become the standard denoiser backbone in diffusion-based audio and music generation systems. Its skip connections and multi-scale processing make it well-suited for the iterative denoising process.

## Architecture Overview

The U-Net is an encoder-decoder with skip connections at each resolution:

```
Input (noisy latent)
    │
    ▼
┌──────────┐
│ DownBlock │──────────────────────────────┐ skip
└────┬─────┘                               │
     ▼                                     │
┌──────────┐                               │
│ DownBlock │────────────────────┐ skip     │
└────┬─────┘                    │          │
     ▼                          │          │
┌──────────┐                    │          │
│ DownBlock │──────┐ skip       │          │
└────┬─────┘      │            │          │
     ▼             │            │          │
┌──────────┐      │            │          │
│ Mid Block │      │            │          │
└────┬─────┘      │            │          │
     ▼             │            │          │
┌──────────┐      │            │          │
│  UpBlock  │◀────┘            │          │
└────┬─────┘                   │          │
     ▼                          │          │
┌──────────┐                   │          │
│  UpBlock  │◀─────────────────┘          │
└────┬─────┘                              │
     ▼                                     │
┌──────────┐                              │
│  UpBlock  │◀────────────────────────────┘
└────┬─────┘
     ▼
Output (predicted noise ε or clean signal)
```

## 1D vs. 2D U-Net for Audio

### 2D U-Net (Spectrogram Domain)

Treats the spectrogram as an image:
- Input: $(B, C, F, T)$ — batch, channels, frequency, time
- Uses 2D convolutions
- Natural for spectrogram diffusion

### 1D U-Net (Latent / Waveform Domain)

Operates on temporal sequences:
- Input: $(B, C, T)$ — batch, channels, time
- Uses 1D convolutions
- Used in latent diffusion (Stable Audio) and waveform diffusion

Most modern music generation systems use **1D U-Net on latent representations**.

## Building Blocks

### Residual Block

The basic unit at each resolution:

$$
h = x + \text{Conv}(\text{SiLU}(\text{GroupNorm}(\text{Conv}(\text{SiLU}(\text{GroupNorm}(x))))))
$$

With timestep conditioning:

$$
h = x + \text{Conv}(\text{SiLU}(\text{GroupNorm}(\text{Conv}(\text{SiLU}(\text{GroupNorm}(x) + \text{MLP}(t_{\text{emb}}))))))
$$

### Timestep Embedding

The diffusion timestep $t$ is encoded as a continuous embedding:

$$
t_{\text{emb}} = \text{MLP}(\text{sinusoidal}(t))
$$

Sinusoidal encoding (same as transformer positional encoding):

$$
\gamma_i(t) = \begin{cases} \sin(t / 10000^{2i/d}) & \text{even } i \\ \cos(t / 10000^{2i/d}) & \text{odd } i \end{cases}
$$

This embedding is added to or modulates intermediate features, telling the network what noise level to expect.

### Downsampling

Reduce temporal resolution:

$$
\text{Down}(x) = \text{Conv1d}(x, \text{stride}=2) \quad \text{or} \quad \text{AvgPool1d}(x, 2)
$$

Each downsampling step doubles the channel dimension to maintain information capacity.

### Upsampling

Increase temporal resolution:

$$
\text{Up}(x) = \text{Conv1d}(\text{Interpolate}(x, \text{scale}=2))
$$

or transposed convolution:

$$
\text{Up}(x) = \text{ConvTranspose1d}(x, \text{stride}=2)
$$

### Skip Connections

The defining feature of U-Net. Features from the encoder are concatenated with decoder features at matching resolutions:

$$
h_{\text{up}} = \text{UpBlock}([\text{skip}, h_{\text{prev}}])
$$

Skip connections preserve high-resolution details that would otherwise be lost through the bottleneck. In audio, this means preserving transient detail, fine harmonic structure, and precise timing.

## Attention Layers in U-Net

Modern audio U-Nets include attention layers at certain resolutions:

### Self-Attention

Applied at lower resolutions (where sequence length is manageable):

$$
\text{SelfAttn}(x) = \text{Attention}(xW^Q, xW^K, xW^V)
$$

Captures long-range dependencies that convolutions miss — important for musical structure and repetition.

### Cross-Attention (Conditioning)

Injects text or other conditioning signals:

$$
\text{CrossAttn}(x, c) = \text{Attention}(xW^Q, cW^K, cW^V)
$$

where $c$ is the conditioning signal (text embeddings from T5, CLAP, etc.).

This is how the U-Net learns to follow text prompts during denoising.

### Attention Resolution

Attention is computationally expensive, so it is typically applied only at the lower resolution levels (after downsampling):

| Resolution | Sequence Length (30s audio) | Attention |
|---|---|---|
| Full | ~1500 | ✗ (too expensive) |
| /2 | ~750 | Sometimes |
| /4 | ~375 | ✓ |
| /8 | ~187 | ✓ |
| Bottleneck | ~94 | ✓ |

## Conditioning Mechanisms

### Adaptive Group Normalization (AdaGN)

Modulate normalization parameters based on timestep and class:

$$
\text{AdaGN}(h, y) = y_s \cdot \text{GroupNorm}(h) + y_b
$$

where $y_s$ and $y_b$ are predicted from the timestep/class embedding.

### FiLM (Feature-wise Linear Modulation)

$$
\text{FiLM}(h, c) = \gamma(c) \odot h + \beta(c)
$$

where $\gamma$ and $\beta$ are learned functions of the conditioning signal.

### Concatenative Conditioning

Concatenate conditioning features with input:

$$
h_{\text{input}} = [x; c_{\text{proj}}]
$$

Simple but effective for spatial or temporal conditioning.

## U-Net Configurations for Music

### Typical Architecture Parameters

| Parameter | Small | Medium | Large |
|---|---|---|---|
| Base channels | 128 | 256 | 384 |
| Channel multipliers | [1,2,4,8] | [1,2,3,5] | [1,2,4,4,8] |
| Res blocks per level | 2 | 2 | 3 |
| Attention resolutions | [/4, /8] | [/4, /8] | [/2, /4, /8] |
| Attention heads | 4 | 8 | 16 |
| Parameters | ~50M | ~400M | ~900M |

### Training Considerations

- **GroupNorm** is standard (BatchNorm causes issues with small batches and diffusion timesteps)
- **SiLU (Swish)** activation: $\text{SiLU}(x) = x \cdot \sigma(x)$
- **Gradient checkpointing** saves memory at the cost of speed
- **Flash Attention** in attention layers for efficiency

## DiT: Diffusion Transformer (Alternative to U-Net)

Recent work replaces the U-Net with a pure transformer:

$$
h_{l+1} = h_l + \text{Attn}(\text{AdaLN}(h_l, c)) + \text{FFN}(\text{AdaLN}(h_l', c))
$$

DiT uses **Adaptive Layer Normalization (AdaLN)** instead of cross-attention for conditioning.

### U-Net vs. DiT for Audio

| Aspect | U-Net | DiT |
|---|---|---|
| Inductive bias | Multi-scale (built-in) | Minimal (learned) |
| Long-range modeling | Attention + skip | Full attention |
| Scaling | Moderate | Scales well with compute |
| Training efficiency | Good | Higher data requirements |
| Current status | Dominant | Emerging |

Most production music generation systems still use U-Net, but DiT is gaining traction for its simplicity and scaling properties.
