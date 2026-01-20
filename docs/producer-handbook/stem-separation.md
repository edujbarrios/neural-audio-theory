---
sidebar_position: 5
title: Stem Separation
---

# AI Stem Separation

Stem separation (source separation) uses AI models to decompose a mixed audio signal into individual components — vocals, drums, bass, and other instruments. This is one of the most practically useful AI audio technologies for music producers.

## What Is Stem Separation?

Given a mixed audio signal $x[n]$, the goal is to recover the source signals:

$$
x[n] = s_{\text{vocals}}[n] + s_{\text{drums}}[n] + s_{\text{bass}}[n] + s_{\text{other}}[n]
$$

This is an **underdetermined problem** — there are infinitely many valid decompositions. AI models learn statistical priors over what each source "should" sound like.

## How AI Separation Works

### Spectrogram Masking

The dominant approach estimates a **mask** for each source in the time-frequency domain:

$$
\hat{S}_k(t, f) = M_k(t, f) \cdot X(t, f)
$$

where $M_k$ is the estimated mask for source $k$ and $X$ is the mixture spectrogram.

The masks should sum to 1 at each time-frequency bin (or approximately so):

$$
\sum_{k} M_k(t, f) \approx 1
$$

### Mask Types

| Mask Type | Range | Properties |
|---|---|---|
| Binary mask | {0, 1} | Hard assignment, artifacts |
| Ratio mask | [0, 1] | Soft, smoother transitions |
| Complex mask | $\mathbb{C}$ | Handles phase, best quality |

### Waveform-Domain Approaches

Some models operate directly on waveform:

$$
\hat{s}_k[n] = f_\theta^{(k)}(x[n])
$$

This avoids phase estimation issues but requires the model to learn both magnitude and phase separation.

## Key Models

### Demucs (Meta)

**Hybrid Transformer Demucs (HTDemucs)** is the current state-of-the-art open-source separator:

- **Architecture**: Hybrid of waveform U-Net + spectrogram U-Net with transformer layers
- **Sources**: vocals, drums, bass, other (4-stem)
- **Quality**: Excellent, especially for vocals
- **Open source**: Available in Meta's demucs repository

The hybrid approach processes both waveform and spectrogram in parallel, combining their outputs:

$$
\hat{s}_k = \alpha \cdot \text{WaveformDecoder}_k + (1-\alpha) \cdot \text{SpectrogramDecoder}_k
$$

### Open-Unmix

- Bidirectional LSTM on spectrogram
- Open source, well-documented
- Good baseline, outperformed by Demucs

### Band-Split RNN (BSRNN)

- Splits spectrogram into frequency bands
- Applies band-specific RNNs
- Won the 2023 Music Demixing Challenge
- Excellent performance, especially for vocals

### Music Source Separation Transformer (MSSM)

- Pure transformer operating on spectrogram patches
- Attention across both time and frequency
- Competitive with Demucs

## Quality Metrics

### Signal-to-Distortion Ratio (SDR)

The standard metric for source separation:

$$
\text{SDR} = 10 \log_{10} \frac{\|s_{\text{target}}\|^2}{\|s_{\text{target}} - \hat{s}\|^2}
$$

Higher SDR = better separation. Measured in dB.

### Scale-Invariant SDR (SI-SDR)

Removes amplitude scaling as a factor:

$$
s_{\text{proj}} = \frac{\langle\hat{s}, s\rangle}{\|s\|^2} s
$$

$$
\text{SI-SDR} = 10 \log_{10} \frac{\|s_{\text{proj}}\|^2}{\|\hat{s} - s_{\text{proj}}\|^2}
$$

### Typical Performance (SDR in dB)

| Source | Demucs v4 | BSRNN | Baseline |
|---|---|---|---|
| Vocals | ~8.5 dB | ~9.0 dB | ~5.5 dB |
| Drums | ~8.0 dB | ~7.5 dB | ~5.0 dB |
| Bass | ~7.0 dB | ~7.0 dB | ~4.5 dB |
| Other | ~5.5 dB | ~5.5 dB | ~3.0 dB |

"Other" (containing everything else) is hardest because it's the most diverse category.

## Practical Applications for Producers

### 1. Remixing AI Outputs

Separate your AI-generated track into stems, then:
- Replace weak drums with better samples
- Rebalance the mix (louder vocals, quieter bass, etc.)
- Apply different effects to each stem
- Remove unwanted elements

### 2. Creating Mashups

Combine elements from different AI generations:
- Vocals from generation A
- Drums from generation B
- Bass and harmony from generation C

### 3. Fixing Mix Problems

- Extract and fix problematic elements
- Apply targeted EQ or compression per stem
- Remove artifacts from specific stems

### 4. Sampling and Sound Design

- Extract interesting sounds from AI generations
- Build sample libraries from separated elements
- Use isolated elements as layers in traditional productions

### 5. A Cappella and Instrumental Creation

- Extract vocals for a cappella versions
- Create instrumental versions by removing vocals
- Isolate specific instruments for analysis or reuse

## Workflow: AI Generation + Stem Separation

```
Step 1: Generate with AI music platform
    │
    ▼
Step 2: Select best generation
    │
    ▼
Step 3: Separate into stems (Demucs)
    │
    ├──▶ Vocals
    ├──▶ Drums
    ├──▶ Bass
    └──▶ Other (synths, guitars, etc.)
    │
    ▼
Step 4: Process stems individually
    │
    ├──▶ EQ, compression per stem
    ├──▶ Replace weak elements
    └──▶ Add your own layers
    │
    ▼
Step 5: Remix and master
```

## Limitations and Artifacts

### Bleeding

Imperfect separation leaves traces of other sources in each stem:
- Vocal bleed in drum stem
- Drum transients in vocal stem

Mitigation: use higher-quality models, accept some bleed, or manually edit.

### Phase Artifacts

Separation can introduce phase distortion:
- Hollow or phasey sound when recombining stems
- Worse in spectrogram-domain methods than waveform methods

### Quality Degradation

Each separated stem is lower quality than the original mix:
- Some information is inevitably lost
- Artifacts increase with lower SDR
- "Other" category typically has most artifacts

### Processing Tips

- **Don't over-process** separated stems — artifacts become more audible
- **Use gentle EQ** to reduce bleed rather than aggressive gating
- **Layer with fresh sounds** to mask separation artifacts
- **Check mono compatibility** — separation can create stereo issues
