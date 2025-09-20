---
sidebar_position: 1
title: Digital Audio Basics
---

# Digital Audio Basics

Before diving into neural audio generation, you need a solid understanding of how sound is captured, stored, and reconstructed in digital form. Every AI music system operates on digital audio representations, and design choices at this level propagate through the entire pipeline.

## Sound as a Physical Phenomenon

Sound is a longitudinal pressure wave travelling through a medium (usually air). A microphone converts these pressure variations into a continuous electrical signal — an analog waveform.

Key physical properties:

| Property | Unit | Musical Meaning |
|---|---|---|
| Frequency | Hz | Pitch |
| Amplitude | Pa / dBSPL | Loudness |
| Spectrum | — | Timbre / tone color |
| Phase | radians | Spatial perception |

## Sampling: Continuous to Discrete

Analog-to-digital conversion (ADC) captures the continuous waveform at regular intervals. Each captured value is a **sample**.

$$
x[n] = x_a(nT_s), \quad n = 0, 1, 2, \dots
$$

where $T_s = 1/f_s$ is the sampling period and $f_s$ is the **sample rate** (samples per second).

### Common Sample Rates

| Sample Rate | Use Case |
|---|---|
| 16 kHz | Speech models, telephony |
| 22.05 kHz | Lightweight music ML |
| 44.1 kHz | CD audio, consumer music |
| 48 kHz | Video/broadcast standard |
| 96 kHz | High-resolution audio production |

### The Nyquist–Shannon Sampling Theorem

A bandlimited signal with maximum frequency $f_{\max}$ can be perfectly reconstructed if:

$$
f_s > 2 f_{\max}
$$

The frequency $f_s/2$ is called the **Nyquist frequency**. If the signal contains energy above the Nyquist frequency, **aliasing** occurs — high frequencies fold back as phantom low-frequency content.

Anti-aliasing filters remove content above $f_s/2$ before sampling. In AI audio pipelines, resampling operations must apply anti-alias filtering to avoid artifacts.

## Quantization: Continuous Amplitude to Discrete Values

Each sample is stored as an integer with a fixed number of bits — the **bit depth**.

$$
\text{Dynamic range (dB)} \approx 6.02 \times B + 1.76
$$

where $B$ is the number of bits.

| Bit Depth | Dynamic Range | Typical Use |
|---|---|---|
| 8-bit | ~49 dB | Legacy, low-quality |
| 16-bit | ~96 dB | CD audio |
| 24-bit | ~144 dB | Professional recording |
| 32-bit float | ~1528 dB | Internal processing, ML pipelines |

### Quantization Error

The difference between the true analog value and the quantized value is **quantization noise**. For uniform quantization with step size $\Delta$:

$$
\sigma_q^2 = \frac{\Delta^2}{12}
$$

Higher bit depth means smaller $\Delta$ and lower noise floor.

## Pulse Code Modulation (PCM)

The standard uncompressed digital audio format. Each sample is stored as a fixed-point or floating-point number in sequence.

A stereo 44.1 kHz, 16-bit PCM stream requires:

$$
44{,}100 \times 2 \times 16 = 1{,}411{,}200 \;\text{bits/s} \approx 1.41 \;\text{Mbps}
$$

This is the raw data rate for CD-quality audio.

## Channels and Interleaving

- **Mono**: single channel
- **Stereo**: left + right channels
- **Multichannel**: surround (5.1, 7.1, Atmos object-based)

In interleaved PCM, samples alternate: $L_0, R_0, L_1, R_1, \dots$

Most AI music systems generate mono or stereo output. Some research systems are exploring multichannel/spatial generation.

## Digital Audio in ML Pipelines

Neural audio models consume digital audio in several forms:

1. **Raw waveform** — direct sample-level input (e.g., WaveNet, SampleRNN)
2. **Spectrogram** — time-frequency representation via STFT (see [FFT page](../mathematics/fft.md))
3. **Mel spectrogram** — perceptually weighted spectrogram (see [Mel Spectrograms](../mathematics/mel-spectrograms.md))
4. **Neural codec tokens** — compressed discrete codes (see [Neural Audio Codecs](../concepts/neural-audio-codecs.md))

The choice of representation affects model size, training speed, generation quality, and computational cost.

## Normalization Conventions

Before feeding audio to models, common preprocessing steps include:

- **Peak normalization**: scale so $\max|x[n]| = 1.0$
- **Loudness normalization**: adjust to target LUFS (EBU R 128)
- **DC offset removal**: subtract the mean to center the waveform at zero
- **Resampling**: convert to the model's expected sample rate

Consistent normalization prevents training instabilities and ensures reproducible inference.
