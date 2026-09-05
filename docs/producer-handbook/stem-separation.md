---
sidebar_position: 5
title: Stem Separation
---

# AI Stem Separation

Stem separation (source separation) uses learned models to decompose a mixed audio signal into individual components such as vocals, drums, bass, and other instruments. It is widely used for remixing, restoration, analysis, and production workflows.

## What Is Stem Separation?

Given a mixed audio signal $x[n]$, a common four-stem formulation is:

$$
x[n] = s_{\text{vocals}}[n] + s_{\text{drums}}[n] + s_{\text{bass}}[n] + s_{\text{other}}[n]
$$

Recovering the component sources from only the mixture is underdetermined: many decompositions can explain the same observed waveform. Learned separators use training data and model structure to estimate plausible sources.

## How AI Separation Works

### Spectrogram Masking

Many separators estimate a mask for each source in the time-frequency domain:

$$
\hat{S}_k(t, f) = M_k(t, f) \cdot X(t, f)
$$

where $M_k$ is the estimated mask for source $k$ and $X$ is the mixture spectrogram. Some masking formulations constrain or normalize masks across sources, but masks do not universally have to sum to one.

### Mask Types

| Mask Type | Typical representation | Properties |
|---|---|---|
| Binary mask | {0, 1} | Hard time-frequency assignment |
| Ratio mask | Often [0, 1] | Soft source weighting |
| Complex mask | $\mathbb{C}$ | Can represent magnitude and phase-related corrections |

### Waveform-Domain Approaches

Some models operate directly on waveform:

$$
\hat{s}_k[n] = f_\theta^{(k)}(x[n])
$$

Waveform-domain models avoid an explicit spectrogram inversion step. Hybrid systems can combine waveform and spectrogram representations rather than treating the two approaches as mutually exclusive.

## Key Models

### Demucs and Hybrid Transformer Demucs

Meta's Demucs v4 release introduced **Hybrid Transformer Demucs (HTDemucs)**, a hybrid spectrogram/waveform separator. The published implementation describes U-Net-style encoders and decoders with a cross-domain Transformer at the innermost layers.

- **Sources**: the standard released model separates vocals, drums, bass, and other
- **Published MUSDB-HQ result**: 9.00 dB overall SDR for the base Hybrid Transformer model and 9.20 dB with sparse attention plus per-source fine-tuning in the authors' evaluation
- **Open source**: released under MIT in the Demucs repository
- **Maintenance note**: the original `facebookresearch/demucs` repository is archived and points users to a community-maintained fork for important fixes

Those published numbers describe a specific benchmark and training setup; they should not be read as a permanent ranking against later systems or different datasets.

### Open-Unmix

Open-Unmix is a well-established open-source baseline based on bidirectional LSTMs over spectrogram features. It remains useful for reproducible comparisons and for understanding a conventional mask-based separation pipeline.

### Band-Split RNN (BSRNN)

BSRNN splits spectrogram features into frequency bands and processes them with recurrent networks. It is an influential architecture and was included as a baseline in the 2023 Sound Demixing Challenge.

The challenge results do **not** support the claim that BSRNN itself won the 2023 music-demixing track. In the published Standard leaderboard, SAMI-ByteDance ranked first with 9.97 dB global SDR, while the listed BSRNN baseline scored 6.14 dB. The Bleeding leaderboard had a separate winner and evaluation condition.

## Quality Metrics

### Signal-to-Distortion Ratio (SDR)

A commonly reported source-separation metric is signal-to-distortion ratio. One simplified form is:

$$
\text{SDR} = 10 \log_{10} \frac{\|s_{\text{target}}\|^2}{\|s_{\text{target}} - \hat{s}\|^2}
$$

Higher values indicate lower error under that definition. Published source-separation work may use different SDR implementations or aggregation rules, so compare numbers only when the evaluation protocol is matched.

### Scale-Invariant SDR (SI-SDR)

SI-SDR removes a global scaling degree of freedom before measuring reconstruction error:

$$
s_{\text{proj}} = \frac{\langle\hat{s}, s\rangle}{\|s\|^2} s
$$

$$
\text{SI-SDR} = 10 \log_{10} \frac{\|s_{\text{proj}}\|^2}{\|\hat{s} - s_{\text{proj}}\|^2}
$$

Do not mix SI-SDR and SDR values in a single ranking without explicitly accounting for the metric difference.

## Practical Applications for Producers

### 1. Remixing AI Outputs

Separate an AI-generated track into stems, then:
- Replace weak drums with better samples
- Rebalance the mix
- Apply different effects to each stem
- Remove or attenuate unwanted elements

### 2. Creating Mashups

Combine elements from different generations when you have the rights to reuse them:
- Vocals from generation A
- Drums from generation B
- Bass and harmony from generation C

### 3. Fixing Mix Problems

- Extract and repair problematic elements
- Apply targeted EQ or compression per stem
- Reduce artifacts in individual sources

### 4. Sampling and Sound Design

- Extract useful material from authorized source audio
- Build sample libraries from separated elements where licensing permits
- Use isolated elements as layers in traditional productions

### 5. A Cappella and Instrumental Creation

- Extract vocals for a cappella versions
- Create instrumental versions by attenuating vocals
- Isolate instruments for analysis or editing

## Workflow: AI Generation + Stem Separation

```
Step 1: Generate with AI music platform
    │
    ▼
Step 2: Select best generation
    │
    ▼
Step 3: Separate into stems
    │
    ├──▶ Vocals
    ├──▶ Drums
    ├──▶ Bass
    └──▶ Other
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

Imperfect separation can leave traces of other sources in a stem, for example vocal residue in accompaniment or drum transients in a vocal stem.

Mitigation depends on the material: compare models, audition artifacts in context, and use manual editing or restoration tools when needed.

### Phase and Reconstruction Artifacts

Spectrogram-based and hybrid systems can produce reconstruction artifacts, especially around transients and overlapping harmonic content. The severity depends on the model, representation, and mixture; it is not safe to assume that one broad model family always produces more phase distortion than another.

### Quality Degradation

Separated stems are estimates rather than access to the original multitrack session. They can contain interference, missing content, transient smearing, or tonal coloration even when the recombined result sounds convincing.

### Processing Tips

- **Avoid unnecessary heavy processing** when it makes separation artifacts more audible
- **Use targeted EQ or automation** to reduce bleed when appropriate
- **Layer with clean source material** when replacement is preferable to restoration
- **Check mono and stereo compatibility** after separation and remixing

## Sources checked

Checked September 2026 against primary or challenge sources:

- [Demucs repository and published model notes](https://github.com/facebookresearch/demucs)
- Rouard, Massa & Défossez, *Hybrid Transformers for Music Source Separation* (ICASSP 2023), as cited by the Demucs project
- Fabbro et al., *The Sound Demixing Challenge 2023 — Music Demixing Track*, including the published Standard and Bleeding leaderboards
- [AIcrowd Sound Demixing Challenge 2023 leaderboards](https://www.aicrowd.com/challenges/sound-demixing-challenge-2023)
