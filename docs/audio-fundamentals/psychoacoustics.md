---
sidebar_position: 2
title: Psychoacoustics
---

# Psychoacoustics

Psychoacoustics studies how humans perceive sound. Understanding these principles is essential for AI music engineering because perceptual relevance — not raw signal accuracy — determines whether generated audio sounds good.

## Frequency Perception and the Mel Scale

Human frequency perception is approximately logarithmic: the perceptual distance between 100 Hz and 200 Hz feels similar to the distance between 1000 Hz and 2000 Hz.

The mel scale formalizes this:

$$
m = 2595 \log_{10}\left(1 + \frac{f}{700}\right)
$$

This mapping is fundamental to mel spectrograms, mel-frequency cepstral coefficients (MFCCs), and the filter bank design used in virtually every audio ML system.

## Loudness Perception

Perceived loudness does not scale linearly with amplitude. The relationship follows approximately:

$$
L \propto p^{0.3}
$$

where $p$ is sound pressure. A 10 dB increase is perceived as roughly "twice as loud."

### Equal-Loudness Contours (Fletcher–Munson Curves)

Human sensitivity varies with frequency. We are most sensitive around 2–5 kHz (where speech consonants live) and much less sensitive at very low and very high frequencies.

| Frequency Range | Sensitivity | Musical Relevance |
|---|---|---|
| 20–80 Hz | Low | Sub-bass, felt more than heard |
| 80–300 Hz | Moderate | Bass instruments, warmth |
| 300–2000 Hz | High | Vocals, melodic instruments |
| 2–5 kHz | Highest | Presence, articulation, clarity |
| 5–10 kHz | Moderate | Brilliance, air |
| 10–20 kHz | Declining | Sparkle, high harmonics |

AI models that optimize purely on waveform MSE may allocate equal importance to all frequencies. Perceptually weighted loss functions improve subjective quality by emphasizing bands where human hearing is most sensitive.

## Auditory Masking

Masking occurs when one sound makes another sound inaudible or less perceptible.

### Simultaneous (Frequency) Masking

A loud tone at frequency $f_m$ raises the hearing threshold for nearby frequencies. The masking effect is asymmetric — it extends further toward higher frequencies.

This property is exploited by:
- **Lossy audio codecs** (MP3, AAC, Opus) to discard inaudible components
- **Perceptual loss functions** that weight errors by masking thresholds
- **Audio quality metrics** that model masked distortion

### Temporal Masking

A loud sound masks quieter sounds that occur shortly before (**pre-masking**, ~5 ms) or after (**post-masking**, ~50–200 ms) it.

Temporal masking affects how listeners perceive transient accuracy in generated audio. Small timing errors in attacks may be inaudible if a louder event occurs nearby.

## Critical Bands and the Bark Scale

The cochlea analyzes sound in overlapping frequency bands called **critical bands**. There are approximately 24 critical bands spanning the audible range.

The Bark scale maps frequency to critical band rate:

$$
z = 13 \arctan(0.00076 f) + 3.5 \arctan\left(\frac{f}{7500}\right)^2
$$

Two tones within the same critical band interact (masking, roughness, beating). Tones in different critical bands are perceived more independently.

## Pitch Perception

Pitch is a perceptual attribute related primarily to fundamental frequency ($f_0$), but also influenced by harmonics and spectral envelope.

### Harmonic Series

Musical sounds typically consist of a fundamental plus overtones:

$$
f_n = n \cdot f_0, \quad n = 1, 2, 3, \dots
$$

The distribution and relative strength of harmonics determines **timbre** — why a piano and a guitar playing the same note sound different.

### Missing Fundamental

Humans can perceive pitch even when the fundamental frequency is absent, inferring it from the spacing of upper harmonics. AI systems that use only spectral magnitude may struggle with this phenomenon.

## Spatial Hearing

Humans localize sound using:

- **Interaural Time Difference (ITD)**: arrival time difference between ears (effective below ~1500 Hz)
- **Interaural Level Difference (ILD)**: amplitude difference (effective above ~1500 Hz)
- **Head-Related Transfer Function (HRTF)**: spectral coloring from head/ear geometry

Stereo and spatial audio generation in AI systems can benefit from modeling these cues for more natural-sounding output.

## Implications for AI Audio Engineering

| Perceptual Principle | Engineering Application |
|---|---|
| Mel/Bark scale | Use perceptually spaced frequency representations |
| Masking | Weight loss functions by audibility |
| Loudness curves | Apply A-weighting or LUFS normalization |
| Critical bands | Design filter banks aligned to auditory resolution |
| Timbre via harmonics | Train on representations that capture harmonic structure |
| Spatial cues | Generate coherent stereo/binaural output |

Models trained with perceptual awareness — through mel representations, multi-scale discriminators, or perceptual loss functions — consistently outperform those trained on raw waveform objectives alone.
