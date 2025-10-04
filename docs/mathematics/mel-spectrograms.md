---
sidebar_position: 3
title: Mel Spectrograms
---

# Mel Spectrograms

The mel spectrogram is the most common audio representation in modern music ML. It combines spectral analysis with perceptual frequency weighting, producing a compact 2D feature that models can process efficiently.

## From Linear Spectrogram to Mel

### Step 1: STFT

Compute the Short-Time Fourier Transform (see [FFT page](./fft.md)):

$$
X(m, k) = \sum_{n=0}^{N-1} x[n + mH] \, w[n] \, e^{-j2\pi kn/N}
$$

This produces a complex-valued time-frequency representation with $K = N/2 + 1$ frequency bins.

### Step 2: Power Spectrum

Take the squared magnitude:

$$
S(m, k) = |X(m, k)|^2
$$

### Step 3: Mel Filter Bank

Apply a bank of $B$ triangular filters spaced according to the mel scale:

$$
M(m, b) = \sum_{k=0}^{K-1} W(b, k) \cdot S(m, k)
$$

where $W(b, k)$ is the weight of filter $b$ at frequency bin $k$.

### Step 4: Log Compression

Apply logarithmic compression to match human loudness perception:

$$
M_{\log}(m, b) = \log(M(m, b) + \epsilon)
$$

The small constant $\epsilon$ (typically $10^{-6}$ or $10^{-10}$) prevents $\log(0)$.

## The Mel Scale

The mel scale maps frequency to perceived pitch:

$$
m(f) = 2595 \log_{10}\left(1 + \frac{f}{700}\right)
$$

Inverse:

$$
f(m) = 700\left(10^{m/2595} - 1\right)
$$

### Mel Filter Bank Design

Triangular filters are placed at equally spaced points on the mel scale:

1. Choose the number of filters $B$ (typically 80 or 128 for music)
2. Define frequency range $[f_{\min}, f_{\max}]$ (e.g., [0 Hz, 8000 Hz] or [20 Hz, 16000 Hz])
3. Convert limits to mel: $m_{\min} = m(f_{\min})$, $m_{\max} = m(f_{\max})$
4. Space $B+2$ points equally in mel domain
5. Convert back to Hz for filter center frequencies
6. Build overlapping triangular filters

Each filter $b$ has center frequency $f_c^{(b)}$ and spans from $f_c^{(b-1)}$ to $f_c^{(b+1)}$:

$$
W(b, k) = \begin{cases}
\frac{f(k) - f_c^{(b-1)}}{f_c^{(b)} - f_c^{(b-1)}} & f_c^{(b-1)} \leq f(k) < f_c^{(b)} \\
\frac{f_c^{(b+1)} - f(k)}{f_c^{(b+1)} - f_c^{(b)}} & f_c^{(b)} \leq f(k) \leq f_c^{(b+1)} \\
0 & \text{otherwise}
\end{cases}
$$

Filters are narrow at low frequencies (fine pitch resolution) and wide at high frequencies (coarse, matching human perception).

## Typical Parameters for Music ML

| Parameter | Typical Value | Notes |
|---|---|---|
| Sample rate | 22050 or 44100 Hz | Higher = more bandwidth |
| FFT size ($N$) | 1024 or 2048 | Frequency resolution |
| Hop size ($H$) | 256 or 512 | Time resolution |
| Mel bands ($B$) | 80 or 128 | Feature dimensionality |
| $f_{\min}$ | 0 or 20 Hz | Low frequency cutoff |
| $f_{\max}$ | $f_s/2$ or 8000 Hz | High frequency cutoff |
| Log type | Natural log or $\log_{10}$ | Scale convention |
| Power | 1 (magnitude) or 2 (power) | Energy vs. amplitude |

### Parameter Trade-offs

- **More mel bands** → finer frequency detail, larger model input
- **Larger FFT** → better frequency resolution, coarser time resolution
- **Smaller hop** → finer time resolution, more frames, slower processing
- **Higher $f_{\max}$** → captures high harmonics and brightness cues

## Mel Spectrograms vs. Other Representations

| Representation | Frequency Spacing | Phase Info | Dimensionality | Invertible |
|---|---|---|---|---|
| Complex STFT | Linear | Yes | High | Yes (perfect) |
| Magnitude spectrogram | Linear | No | High | Approximate |
| Mel spectrogram | Perceptual | No | Moderate | Approximate |
| CQT | Logarithmic | Optional | Moderate | Approximate |
| MFCC | Perceptual + DCT | No | Low | No |

## Inversion: Mel Spectrogram to Audio

Since the mel spectrogram discards phase and compresses frequency, inversion requires estimation.

### Griffin-Lim Algorithm

Iterative phase reconstruction:

1. Start with random phase
2. Apply mel filter bank inverse (approximate)
3. Iterate: iSTFT → enforce magnitude → STFT → enforce consistency

$$
\hat{X}^{(i+1)}(m,k) = |X_{\text{target}}(m,k)| \cdot e^{j \angle \hat{X}^{(i)}(m,k)}
$$

Griffin-Lim is fast but produces metallic, artifact-prone audio.

### Neural Vocoders (Preferred)

Modern systems use trained neural networks for high-quality inversion:

| Vocoder | Architecture | Quality | Speed |
|---|---|---|---|
| WaveNet | Autoregressive | Excellent | Very slow |
| WaveGlow | Flow-based | Very good | Fast |
| HiFi-GAN | GAN-based | Excellent | Very fast |
| BigVGAN | GAN-based | State-of-the-art | Fast |
| Vocos | ISTFT-based | Very good | Very fast |

HiFi-GAN and BigVGAN are the most common choices in production systems.

## Mel Spectrograms in Diffusion Models

Mel spectrograms serve as both training targets and intermediate representations in diffusion-based music generation:

$$
\mathbf{z}_t = \sqrt{\bar{\alpha}_t} M_{\log} + \sqrt{1-\bar{\alpha}_t} \boldsymbol{\epsilon}
$$

The model learns to denoise mel spectrograms, then a vocoder converts the clean mel spectrogram to waveform.

## Dynamic Range Compression Variants

Beyond simple log compression, other approaches exist:

### Power-Law Compression

$$
M_{\text{power}}(m, b) = M(m, b)^{\gamma}, \quad \gamma \in (0, 1)
$$

### PCEN (Per-Channel Energy Normalization)

$$
\text{PCEN}(m, b) = \left(\frac{M(m, b)}{(\epsilon + \bar{M}(m, b))^\alpha + \delta}\right)^r - \delta^r
$$

PCEN provides automatic gain control and is robust to varying recording conditions. Useful for training on diverse, inconsistently-normalized data.

## Implementation Notes

Most frameworks provide mel spectrogram computation:

- **torchaudio**: `torchaudio.transforms.MelSpectrogram`
- **librosa**: `librosa.feature.melspectrogram`
- **tensorflow**: `tf.signal.linear_to_mel_weight_matrix` + STFT

Ensure consistent parameter choices between training and inference — mismatched mel parameters will produce garbage outputs.
