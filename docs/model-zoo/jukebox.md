---
sidebar_position: 4
title: Jukebox (OpenAI)
---

# Jukebox

Jukebox is OpenAI's raw-audio music generation model, released in April 2020. It was one of the earliest systems to generate music with vocals directly in the waveform domain, making it a landmark in AI music history even though it has since been surpassed in quality and efficiency.

## Architecture

Jukebox uses a **hierarchical VQ-VAE** (Vector Quantized Variational Autoencoder) with autoregressive priors at each level.

```
Raw Audio (44.1 kHz)
    │
    ▼
┌──────────────────┐
│  VQ-VAE Encoder  │
│  (3 levels)      │
└──────────────────┘
    │
    ▼
Level 2 (top): 344 tokens/s   ──▶ Sparse Transformer ──▶ top codes
Level 1 (mid): 86 tokens/s    ──▶ Upsampler ──▶ mid codes
Level 0 (bottom): 21 tokens/s ──▶ Upsampler ──▶ bottom codes
    │
    ▼
┌──────────────────┐
│  VQ-VAE Decoder  │──▶ Raw Waveform
└──────────────────┘
```

### Hierarchical VQ-VAE

The VQ-VAE compresses raw audio at three temporal resolutions:

| Level | Compression | Tokens/sec | Captures |
|---|---|---|---|
| Top (2) | 128× | ~344 | High-level structure, melody |
| Middle (1) | 32× | ~1,378 | Harmony, rhythm detail |
| Bottom (0) | 8× | ~5,513 | Timbre, vocal nuance |

Vector quantization discretizes continuous latents:

$$
\mathbf{z}_q = \arg\min_{\mathbf{e}_k \in \mathcal{C}} \|\mathbf{z} - \mathbf{e}_k\|_2
$$

The codebook $\mathcal{C}$ is learned during training with a commitment loss:

$$
\mathcal{L}_{\text{VQ}} = \|\text{sg}[\mathbf{z}] - \mathbf{e}\|_2^2 + \beta \|\mathbf{z} - \text{sg}[\mathbf{e}]\|_2^2
$$

where $\text{sg}[\cdot]$ is the stop-gradient operator.

### Autoregressive Priors

Each VQ level has its own prior model — a **sparse transformer** that generates codes autoregressively:

$$
p(\mathbf{z}_{1:T}^{(\ell)} | \mathbf{z}^{(\ell+1)}, \mathbf{c}) = \prod_{t=1}^{T} p_\theta(\mathbf{z}_t^{(\ell)} | \mathbf{z}_{<t}^{(\ell)}, \mathbf{z}^{(\ell+1)}, \mathbf{c})
$$

The top-level prior generates the most compressed codes. Each subsequent level upsamples, conditioned on the level above.

### Sparse Transformers

Due to the extreme sequence lengths (millions of samples at 44.1 kHz), Jukebox uses sparse attention patterns:

- **Strided attention**: attend to every $k$-th position
- **Fixed attention**: attend to a fixed local window
- **Combination**: alternate between strided and fixed patterns

This reduces attention complexity from $O(T^2)$ to approximately $O(T \sqrt{T})$.

## Conditioning

Jukebox accepts three types of conditioning:

1. **Artist**: one-hot artist ID
2. **Genre**: one-hot genre label
3. **Lyrics**: character-level text aligned to audio timing

Lyrics conditioning allows generating singing voices that roughly follow the input text, though intelligibility is limited.

## Training

- **Dataset**: 1.2 million songs (artist, genre, lyrics metadata)
- **Parameters**: ~5 billion (across all components)
- **Training compute**: enormous — multiple weeks on large GPU clusters
- **Sample rate**: 44.1 kHz (raw waveform, no mel spectrogram intermediate)

## Generation Characteristics

### Strengths

- Generates audio with vocals, instruments, and production simultaneously
- Captures long-range musical structure (tens of seconds of coherent music)
- Style transfer: condition on one artist/genre to generate in that style
- Operates at CD-quality sample rate

### Limitations

- **Extremely slow generation**: minutes to hours per second of audio
- **Lossy reconstruction**: VQ-VAE introduces quality loss
- **Not real-time**: impractical for interactive use
- **Vocal clarity**: lyrics are often mumbled or approximate
- **No text-to-music**: conditioned on metadata, not natural language descriptions

## Generation Time

Jukebox is notoriously slow. Generating one minute of audio at the top level takes approximately 12 hours on a V100 GPU. The full three-level sampling process is even longer.

$$
T_{\text{generate}} \propto L_{\text{sequence}} \times D_{\text{model}}^2 \times N_{\text{layers}}
$$

This computational cost limited practical adoption and motivated the development of more efficient architectures.

## Legacy and Impact

Despite its limitations, Jukebox was influential:

1. **Proved raw-audio generation is possible** at scale
2. **Demonstrated VQ-VAE hierarchies** for audio (later adopted by EnCodec, SoundStream)
3. **Showed transformers can model music** coherently over long contexts
4. **Motivated efficiency research** that led to codec-based and latent diffusion approaches

Jukebox's key insight — that hierarchical discrete representations enable tractable modeling of high-dimensional audio — remains foundational in every modern music generation system.
