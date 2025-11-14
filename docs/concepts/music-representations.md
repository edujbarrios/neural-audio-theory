---
sidebar_position: 5
title: Music Representations
---

# Music Representations

The choice of how to represent music — as waveforms, spectrograms, symbolic tokens, or learned codes — is one of the most impactful engineering decisions in any AI music system. Each representation trades off between fidelity, compactness, interpretability, and compatibility with different model architectures.

## Taxonomy of Representations

```
                    Music Representations
                    ┌────────┴────────┐
               Continuous          Discrete
               ┌────┴────┐       ┌────┴────┐
          Waveform  Spectrogram  MIDI/Symbolic  Codec Tokens
```

## Waveform (Time Domain)

The most raw representation: a sequence of amplitude samples over time.

$$
x = [x_0, x_1, \dots, x_{T-1}], \quad x_n \in [-1, 1]
$$

### Properties

| Property | Value |
|---|---|
| Dimensionality | Very high (44,100 samples/sec for CD) |
| Information | Complete — no information loss |
| Interpretability | Low (hard to read musical content from samples) |
| Model compatibility | WaveNet, SampleRNN, WaveGlow |

### Advantages

- Lossless representation
- No preprocessing artifacts
- Captures all acoustic detail

### Disadvantages

- Extremely high dimensionality
- Long-range dependencies are hard to model
- No explicit frequency structure

## Spectrogram (Time-Frequency Domain)

The Short-Time Fourier Transform (STFT) converts waveform to a 2D time-frequency representation:

$$
S(m, k) = \left|\sum_{n=0}^{N-1} x[n + mH] \, w[n] \, e^{-j2\pi kn/N}\right|^2
$$

### Key Parameters

| Parameter | Symbol | Typical Values |
|---|---|---|
| FFT size | $N$ | 1024, 2048, 4096 |
| Hop size | $H$ | 256, 512, 1024 |
| Window | $w[n]$ | Hann, Hamming |

### Trade-offs

$$
\Delta t \cdot \Delta f \geq \frac{1}{4\pi}
$$

The **uncertainty principle**: better time resolution means worse frequency resolution, and vice versa.

- Larger $N$ → better frequency resolution, worse time resolution
- Smaller $H$ → more time frames, more compute

## Mel Spectrogram

A perceptually weighted spectrogram using the mel scale (see [Mel Spectrograms](../mathematics/mel-spectrograms.md)):

$$
M(m, b) = \sum_{k} W_{\text{mel}}(b, k) \cdot S(m, k)
$$

| Property | Value |
|---|---|
| Dimensionality | Moderate (80–128 mel bands × time frames) |
| Perceptual alignment | Good — matches human frequency perception |
| Model compatibility | Tacotron, Diffusion, many classifiers |
| Invertibility | Approximate (requires vocoder for waveform) |

The mel spectrogram is the most common intermediate representation in audio ML.

## Constant-Q Transform (CQT)

Provides logarithmically spaced frequency bins — one bin per musical semitone:

$$
X_{\text{CQ}}(k) = \frac{1}{N_k}\sum_{n=0}^{N_k - 1} x[n] \, w_k[n] \, e^{-j2\pi Q n / N_k}
$$

where the window length $N_k$ varies per frequency bin to maintain constant $Q = f_k / \Delta f_k$.

| Property | Value |
|---|---|
| Frequency spacing | Logarithmic (semitone-aligned) |
| Best for | Pitch tracking, chord recognition, music transcription |
| Drawback | Non-uniform time resolution across frequencies |

## Chromagram

A 12-dimensional representation that folds all octaves into a single pitch class distribution:

$$
C(m, p) = \sum_{k \in \text{bin}(p)} S(m, k), \quad p \in \{C, C\#, D, \dots, B\}
$$

| Property | Value |
|---|---|
| Dimensionality | 12 (one per pitch class) |
| Best for | Harmony analysis, chord detection, melody conditioning |
| Limitation | Loses octave information |

Used in MusicGen-Melody for melody-conditioned generation.

## MIDI and Symbolic Representations

MIDI encodes music as discrete events:

```
Note On:  (pitch=60, velocity=80, time=0.0)
Note Off: (pitch=60, velocity=0,  time=0.5)
```

### Properties

| Property | Value |
|---|---|
| Dimensionality | Very low (events, not samples) |
| Information | Pitch, timing, velocity — no timbre or production |
| Interpretability | High — directly human-readable |
| Model compatibility | Music Transformer, MuseNet, Coconet |

### Encoding Schemes for ML

- **MIDI-like tokens**: Note, Time, Velocity as separate token types
- **REMI**: Relative Event-based MIDI representation with bar/position tokens
- **Compound tokens**: Bundle note attributes into single tokens
- **Piano roll**: 2D binary matrix (pitch × time) — image-like

### Limitations

- No timbre, production quality, or audio texture information
- Cannot represent vocals, effects, or mixing
- Requires MIDI data (not always available from audio)

## Neural Codec Tokens

Discrete codes from trained neural audio codecs (see [Neural Audio Codecs](./neural-audio-codecs.md)):

$$
\mathbf{c}_t = (c_t^1, c_t^2, \dots, c_t^Q), \quad c_t^q \in \{1, \dots, K\}
$$

| Property | Value |
|---|---|
| Dimensionality | Compact (50–75 tokens/sec × Q codebooks) |
| Information | Complete audio reconstruction |
| Interpretability | Low (learned codes, not human-readable) |
| Model compatibility | MusicGen, AudioLM, SoundStorm |

### Advantages

- Discrete → compatible with language model techniques
- Compact → efficient for long audio
- Hierarchical → coarse-to-fine generation strategies

### Disadvantages

- Quantization introduces some quality loss
- Codebook structure is opaque
- Requires pre-trained codec

## Latent Representations (Continuous)

Continuous learned representations from autoencoders or VAEs:

$$
\mathbf{z} = E_\phi(x) \in \mathbb{R}^{C \times T'}
$$

| Property | Value |
|---|---|
| Dimensionality | Compact (channel × compressed time) |
| Information | High — encoder trained to preserve quality |
| Model compatibility | Latent diffusion (Stable Audio), VAE-based systems |

Used when continuous diffusion is preferred over discrete autoregressive generation.

## Representation Comparison

| Representation | Dim | Info Loss | Gen Method | Models |
|---|---|---|---|---|
| Waveform | Very high | None | AR / Flow | WaveNet, SampleRNN |
| Spectrogram | High | Phase | Diffusion | DiffWave, SpecDiff |
| Mel spectrogram | Moderate | Phase + freq | Diffusion + Vocoder | Tacotron + HiFi-GAN |
| CQT | Moderate | Phase | Classification | Pitch/chord models |
| MIDI | Very low | Timbre, production | AR Transformer | MuseNet, Music Transformer |
| Codec tokens | Low | Slight quality | AR Transformer | MusicGen, AudioLM |
| Latent | Low | Learned | Diffusion | Stable Audio |

## Choosing a Representation

The right representation depends on your task:

| Goal | Best Representation |
|---|---|
| Highest fidelity | Waveform |
| Text-to-music generation | Codec tokens or Latent |
| Music transcription | CQT or Mel spectrogram |
| Chord/harmony analysis | Chromagram |
| Compositional control | MIDI / symbolic |
| Source separation | Spectrogram (complex) |
| Real-time generation | Codec tokens (compact) |
