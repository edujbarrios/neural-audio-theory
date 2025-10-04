---
sidebar_position: 1
title: FFT (Fast Fourier Transform)
---

# Fast Fourier Transform (FFT)

The FFT is a core algorithm in music ML pipelines because it converts waveform samples into frequency-domain structure efficiently.

## Discrete Fourier Transform

For sequence $x[n]$ of length $N$:

$$
X[k]=\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N},\quad k=0,\dots,N-1
$$

Inverse transform:

$$
x[n]=\frac{1}{N}\sum_{k=0}^{N-1}X[k]e^{j2\pi kn/N}
$$

FFT algorithms compute the same result in $O(N\log N)$ instead of $O(N^2)$.

## STFT for Non-Stationary Music

Music changes over time, so systems use the short-time Fourier transform:

$$
\text{STFT}\{x[n]\}(m,k)=\sum_{n=0}^{N-1}x[n+mH]w[n]e^{-j2\pi kn/N}
$$

where $H$ is hop size and $w[n]$ is a window (for example Hann).

## Spectral Features Used by Models

Power spectrogram:

$$
S(m,k)=|\text{STFT}\{x[n]\}(m,k)|^2
$$

Log-magnitude representation:

$$
S_{\log}(m,k)=10\log_{10}(S(m,k)+\epsilon)
$$

These features are widely used for:

- spectrogram diffusion training
- embedding encoders
- pitch and onset conditioning signals
- quality metrics based on spectral distance
