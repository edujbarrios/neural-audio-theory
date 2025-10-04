---
sidebar_position: 5
title: Signal Processing Basics
---

# Signal Processing Basics

Signal processing provides the mathematical tools that underpin every audio ML pipeline. This page covers the foundational concepts that connect raw audio to the representations that models consume.

## Signals and Systems

A **signal** is a function that conveys information. Audio signals are typically real-valued functions of time:

$$
x: \mathbb{R} \to \mathbb{R} \quad \text{(continuous)} \qquad x: \mathbb{Z} \to \mathbb{R} \quad \text{(discrete)}
$$

A **system** transforms an input signal to an output signal:

$$
y[n] = \mathcal{H}\{x[n]\}
$$

### Linear Time-Invariant (LTI) Systems

An LTI system satisfies:
- **Linearity**: $\mathcal{H}\{ax_1 + bx_2\} = a\mathcal{H}\{x_1\} + b\mathcal{H}\{x_2\}$
- **Time-invariance**: if $\mathcal{H}\{x[n]\} = y[n]$, then $\mathcal{H}\{x[n-k]\} = y[n-k]$

LTI systems are completely characterized by their **impulse response** $h[n]$.

## Convolution

The output of an LTI system is the convolution of input and impulse response:

$$
y[n] = (x * h)[n] = \sum_{k=-\infty}^{\infty} x[k] \, h[n-k]
$$

### Convolution Theorem

Convolution in time domain equals multiplication in frequency domain:

$$
\mathcal{F}\{x * h\} = X(f) \cdot H(f)
$$

This is why filtering is efficient via FFT:
1. FFT both signals
2. Multiply spectra
3. Inverse FFT

Complexity: $O(N \log N)$ instead of $O(N^2)$ for direct convolution.

### Convolution in Neural Networks

1D convolutions in audio CNNs operate similarly:

$$
y[n] = \sum_{k=0}^{K-1} w[k] \, x[n \cdot s - k] + b
$$

where $w$ is the learned kernel, $K$ is kernel size, $s$ is stride. This is the building block of encoder-decoder architectures in neural codecs and vocoders.

## Filtering

### Low-Pass Filter

Passes frequencies below cutoff $f_c$, attenuates above:

$$
H(f) = \begin{cases} 1 & |f| \leq f_c \\ 0 & |f| > f_c \end{cases} \quad \text{(ideal)}
$$

Practical filters have a transition band and ripple. Used for anti-aliasing before downsampling.

### High-Pass Filter

Passes frequencies above cutoff:

$$
H_{\text{HP}}(f) = 1 - H_{\text{LP}}(f)
$$

Used for DC removal and removing low-frequency rumble.

### Band-Pass Filter

Passes frequencies in a range $[f_1, f_2]$:

$$
H_{\text{BP}}(f) = \begin{cases} 1 & f_1 \leq |f| \leq f_2 \\ 0 & \text{otherwise} \end{cases}
$$

Used in multi-band processing and critical band analysis.

### Common Filter Designs

| Design | Characteristics | Use Case |
|---|---|---|
| Butterworth | Maximally flat passband | General purpose |
| Chebyshev I | Steeper rolloff, passband ripple | Sharp cutoff needed |
| Chebyshev II | Steeper rolloff, stopband ripple | Less common |
| Elliptic | Steepest rolloff, both ripples | Minimum order |
| FIR (windowed) | Linear phase, no feedback | Phase-sensitive applications |

## The Sampling Theorem

A bandlimited signal with maximum frequency $f_{\max}$ can be perfectly reconstructed from samples taken at rate $f_s > 2f_{\max}$:

$$
x(t) = \sum_{n=-\infty}^{\infty} x[n] \, \text{sinc}\left(\frac{t - nT_s}{T_s}\right)
$$

where $\text{sinc}(x) = \sin(\pi x)/(\pi x)$.

### Aliasing

If $f_s < 2f_{\max}$, high frequencies fold back into lower frequencies:

$$
f_{\text{alias}} = |f - k \cdot f_s| \quad \text{for some integer } k
$$

Aliasing creates phantom tones and is irreversible. Anti-aliasing filters must be applied **before** downsampling.

## Resampling

Converting between sample rates is a common operation in audio ML pipelines.

### Upsampling by Factor $L$

1. Insert $L-1$ zeros between each sample
2. Apply low-pass filter at $f_s/(2L)$

### Downsampling by Factor $M$

1. Apply anti-aliasing low-pass filter at $f_s/(2M)$
2. Keep every $M$-th sample

### Arbitrary Rate Conversion

Combine upsampling by $L$ and downsampling by $M$:

$$
f_{s,\text{new}} = f_s \cdot \frac{L}{M}
$$

Polyphase filter implementations are efficient for large rate changes.

## Windowing

Multiplying a signal by a window function selects a segment and controls spectral leakage:

$$
x_w[n] = x[n] \cdot w[n]
$$

### Common Windows

| Window | Sidelobe Level | Main Lobe Width | Use |
|---|---|---|---|
| Rectangular | -13 dB | Narrowest | Analysis (no windowing) |
| Hann | -31 dB | Moderate | General STFT |
| Hamming | -43 dB | Moderate | Speech processing |
| Blackman | -58 dB | Wide | High dynamic range |
| Kaiser | Adjustable | Adjustable | Flexible |

**Hann window** is the default choice for most audio ML STFT computations.

### Overlap-Add (OLA)

For perfect reconstruction in STFT processing:

$$
\sum_{m} w[n - mH]^2 = \text{constant}
$$

The Hann window satisfies this constraint with 50% overlap ($H = N/2$).

## Z-Transform and Transfer Functions

The Z-transform converts discrete sequences to polynomial functions:

$$
X(z) = \sum_{n=-\infty}^{\infty} x[n] z^{-n}
$$

A digital filter's transfer function:

$$
H(z) = \frac{B(z)}{A(z)} = \frac{\sum_{k=0}^{M} b_k z^{-k}}{\sum_{k=0}^{N} a_k z^{-k}}
$$

- **FIR filters**: $A(z) = 1$ (no feedback, always stable)
- **IIR filters**: non-trivial $A(z)$ (feedback, may be unstable)

## Correlation and Autocorrelation

Cross-correlation measures similarity between two signals as a function of lag:

$$
R_{xy}[\tau] = \sum_{n} x[n] \, y[n + \tau]
$$

Autocorrelation ($y = x$) reveals periodicity:

$$
R_{xx}[\tau] = \sum_{n} x[n] \, x[n + \tau]
$$

Autocorrelation peaks indicate:
- **Pitch period** (strongest peak location)
- **Rhythmic period** (for onset/energy envelopes)
- **Repetitive structure** (useful for music structure analysis)

## Decibels

The decibel scale is ubiquitous in audio:

**Power ratio:**
$$
L_{\text{dB}} = 10 \log_{10} \frac{P}{P_{\text{ref}}}
$$

**Amplitude ratio:**
$$
L_{\text{dB}} = 20 \log_{10} \frac{A}{A_{\text{ref}}}
$$

Common reference levels:
- **dBFS** (Full Scale): $A_{\text{ref}} = 1.0$ in digital audio
- **dBSPL**: $P_{\text{ref}} = 20 \mu\text{Pa}$ (threshold of hearing)
- **LUFS**: integrated loudness (EBU R 128 standard)

## Signal Processing in ML Pipelines

| Stage | Signal Processing Operation |
|---|---|
| Input normalization | Gain adjustment, DC removal |
| Resampling | Sample rate conversion |
| Feature extraction | STFT, mel filterbank, log compression |
| Augmentation | Filtering, noise addition, time-stretching |
| Output | Vocoder (mel → waveform), loudness normalization |
| Evaluation | Spectral distance, SNR, correlation metrics |

Understanding these fundamentals helps debug audio ML pipelines — many "model" problems are actually signal processing problems (wrong sample rate, missing anti-aliasing, incorrect windowing, etc.).
