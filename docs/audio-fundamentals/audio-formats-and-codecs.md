---
sidebar_position: 4
title: Audio Formats & Codecs
---

# Audio Formats and Codecs

Audio format choices affect data size, quality, and compatibility with ML pipelines. This page covers traditional codecs, modern perceptual codecs, and the neural codecs that are transforming audio ML.

## Uncompressed Formats

### WAV (RIFF/WAVE)

- PCM audio in a simple container
- No quality loss
- Large files (~10 MB per minute for CD quality)
- Standard input for most audio ML pipelines

### AIFF

- Apple's equivalent of WAV
- Same PCM data, different container
- Less common in ML contexts

### Raw PCM

- No header, just sample data
- Requires external metadata (sample rate, bit depth, channels)
- Sometimes used for direct model input

## Lossless Compression

### FLAC (Free Lossless Audio Codec)

- Bit-perfect reconstruction
- ~50–70% compression ratio
- Open source, widely supported
- Good archival format for training data

### ALAC (Apple Lossless)

- Apple's lossless codec
- Similar ratios to FLAC
- Less common in ML workflows

Lossless compression uses **entropy coding** (similar to ZIP) and **linear prediction** to exploit redundancy:

$$
\hat{x}[n] = \sum_{k=1}^{p} a_k \, x[n-k]
$$

The residual $e[n] = x[n] - \hat{x}[n]$ is then entropy-coded. Smaller residuals → better compression.

## Lossy Perceptual Codecs

### MP3 (MPEG-1 Audio Layer III)

- Removes perceptually irrelevant components using psychoacoustic models
- Typical bitrates: 128–320 kbps
- Introduces audible artifacts below ~192 kbps
- **Not recommended** as training data for high-fidelity models

### AAC (Advanced Audio Coding)

- Better quality than MP3 at same bitrate
- Default codec for Apple and YouTube
- Spectral band replication (SBR) extends bandwidth at low bitrates

### Opus

- State-of-the-art traditional codec
- Excellent at 64–128 kbps
- Seamlessly switches between speech (SILK) and music (CELT) modes
- Used in WebRTC, Discord, many streaming platforms

### Vorbis (OGG)

- Open-source alternative to MP3/AAC
- Good quality at moderate bitrates
- Less common today but still used in games

### Perceptual Coding Principles

All lossy codecs follow a similar pipeline:

1. **Time-frequency analysis** (MDCT or similar)
2. **Psychoacoustic model** estimates masking thresholds
3. **Quantization** removes sub-threshold components
4. **Entropy coding** compresses the quantized data

The noise-to-mask ratio (NMR) measures how well quantization noise stays below masking thresholds:

$$
\text{NMR}(b) = \frac{N(b)}{T(b)}
$$

where $N(b)$ is quantization noise power in band $b$ and $T(b)$ is the masking threshold.

## Neural Audio Codecs

Neural codecs represent a paradigm shift: instead of hand-designed psychoacoustic models, they use learned encoder-decoder networks with vector quantization.

### EnCodec (Meta)

- Convolutional encoder → Residual Vector Quantization (RVQ) → Convolutional decoder
- Operates at 1.5–24 kbps
- Quality comparable to Opus at much lower bitrates
- Codec tokens are used directly as inputs to language models (e.g., MusicGen)

### SoundStream (Google)

- Similar architecture to EnCodec
- Encoder-decoder with RVQ bottleneck
- Used in AudioLM, MusicLM pipelines

### Descript Audio Codec (DAC)

- Improved training with multi-scale STFT discriminator
- Better handling of music at low bitrates
- Open-source implementation available

### Residual Vector Quantization (RVQ)

The key innovation in neural codecs. Instead of a single codebook, RVQ uses $Q$ sequential codebooks:

$$
\hat{\mathbf{z}} = \sum_{q=1}^{Q} \mathbf{e}_{q}(k_q)
$$

where $k_q = \arg\min_k \| \mathbf{r}_{q-1} - \mathbf{e}_q(k) \|$ and the residual updates as:

$$
\mathbf{r}_q = \mathbf{r}_{q-1} - \mathbf{e}_q(k_q)
$$

Each codebook refines the approximation, with early codebooks capturing coarse structure (pitch, rhythm) and later codebooks adding fine detail (timbre nuance, noise).

## Format Recommendations for AI Audio

| Stage | Recommended Format | Reason |
|---|---|---|
| Training data storage | FLAC or WAV | No quality loss |
| Model input | WAV or raw PCM | Direct sample access |
| Token-based models | Neural codec tokens | Discrete, compact, semantic |
| Output / distribution | WAV (full quality) or FLAC | Preserve generation quality |
| Web demos | Opus or AAC | Small files, good quality |

## Bitrate vs. Quality Trade-offs

| Codec Type | Bitrate | Approximate Quality |
|---|---|---|
| PCM (CD) | 1,411 kbps | Reference |
| FLAC | ~700 kbps | Lossless |
| Opus | 128 kbps | Transparent for most listeners |
| MP3 | 320 kbps | Near-transparent |
| EnCodec | 6 kbps | Good for music |
| EnCodec | 1.5 kbps | Acceptable for speech |

Neural codecs achieving good quality at 6 kbps represent a ~200× compression over CD-quality PCM, enabling efficient tokenization for language model-based music generation.
