---
sidebar_position: 2
title: Data Augmentation
---

# Data Augmentation for Audio

Data augmentation artificially expands training data by applying transformations that preserve musical identity while introducing variation. It improves model robustness, reduces overfitting, and helps with data-scarce genres.

## Why Augment Audio?

1. **Regularization**: prevents memorization of specific recordings
2. **Invariance learning**: teaches the model which variations are irrelevant
3. **Data efficiency**: extracts more learning signal from limited data
4. **Domain gap reduction**: bridges differences between training and inference conditions

## Time-Domain Augmentations

### Gain / Volume Perturbation

Scale amplitude by a random factor:

$$
x'[n] = g \cdot x[n], \quad g \sim \mathcal{U}(g_{\min}, g_{\max})
$$

Typical range: $g \in [0.5, 1.5]$ or equivalently $\pm 6$ dB.

### Additive Noise

Mix background noise at a random SNR:

$$
x'[n] = x[n] + \alpha \cdot n_{\text{noise}}[n]
$$

where $\alpha$ controls the SNR. Common noise sources: Gaussian noise, environmental recordings, room tone.

### Time Shifting

Circular or zero-padded shift:

$$
x'[n] = x[n - \Delta n], \quad \Delta n \sim \mathcal{U}(-\Delta_{\max}, \Delta_{\max})
$$

Useful for making models robust to alignment variations.

### Polarity Inversion

$$
x'[n] = -x[n]
$$

Perceptually identical to the original. Free augmentation that tests model symmetry.

## Pitch and Time Augmentations

### Pitch Shifting

Shift pitch without changing duration using phase vocoder or resampling + time-stretching:

$$
f'_0 = f_0 \cdot 2^{s/12}
$$

where $s$ is the shift in semitones. Typical range: $s \in [-2, 2]$.

**Caution**: large pitch shifts introduce artifacts (formant distortion, chipmunk effect). Keep shifts small for music.

### Time Stretching

Change duration without changing pitch:

$$
x'(t) = x(t / r)
$$

where $r$ is the stretch ratio. Equivalent to tempo change. Typical range: $r \in [0.9, 1.1]$.

Phase vocoder, WSOLA, and élastique are common algorithms. Neural time-stretching is emerging as an alternative.

### Speed Perturbation

Change both pitch and tempo simultaneously (simple resampling):

$$
x'[n] = x[\lfloor n \cdot r \rfloor]
$$

Commonly used in speech ASR; less common for music where pitch matters.

## Frequency-Domain Augmentations

### SpecAugment

Originally designed for speech recognition, adapted for music:

1. **Frequency masking**: zero out $f$ consecutive mel bands
2. **Time masking**: zero out $t$ consecutive time frames

$$
S'(m, k) = \begin{cases} 0 & \text{if } k \in [k_0, k_0+f) \text{ or } m \in [m_0, m_0+t) \\ S(m, k) & \text{otherwise} \end{cases}
$$

Forces the model to reconstruct missing information, improving robustness.

### Equalization (EQ) Perturbation

Apply random parametric EQ curves to simulate different recording/mixing conditions:

$$
X'(f) = X(f) \cdot H_{\text{eq}}(f)
$$

where $H_{\text{eq}}(f)$ is a random filter with smooth frequency response. Simulates different microphones, rooms, and mix engineers.

### Codec Augmentation

Re-encode through a lossy codec (MP3 at varying bitrates, Opus) to simulate real-world quality degradation.

## Mixing-Based Augmentations

### Audio Mixup

Blend two training examples:

$$
x'[n] = \lambda \cdot x_1[n] + (1 - \lambda) \cdot x_2[n]
$$

$$
y' = \lambda \cdot y_1 + (1 - \lambda) \cdot y_2
$$

where $\lambda \sim \text{Beta}(\alpha, \alpha)$ and $y$ are soft labels. Effective for classification tasks; less common for generative models.

### CutMix (Temporal)

Replace a time segment from one example with a segment from another:

$$
x'[n] = \begin{cases} x_2[n] & \text{if } n \in [n_1, n_2) \\ x_1[n] & \text{otherwise} \end{cases}
$$

### Stem Mixing

If multi-track stems are available, remix them with random gain and pan:

- Randomize relative levels of drums, bass, vocals, and other instruments
- Create new mixes that the model hasn't seen
- Particularly powerful for training source separation and mixing models

## Room and Environment Simulation

### Convolution with Room Impulse Responses (RIRs)

$$
x'[n] = x[n] * h_{\text{RIR}}[n]
$$

Apply recorded or simulated room impulse responses to simulate different acoustic environments. Large RIR databases exist (OpenAIR, MIT IR Survey).

### Reverb Parameter Randomization

If using algorithmic reverb, randomize:
- Room size
- Decay time (RT60)
- Early reflection pattern
- Wet/dry mix

## Augmentation Strategies

### Online vs. Offline

| Strategy | Pros | Cons |
|---|---|---|
| Online (during training) | Infinite variation, no storage | Compute overhead |
| Offline (preprocessing) | Fast loading, reproducible | Storage cost, finite variation |

**Online augmentation** is standard for audio ML because storage is expensive and variation diversity is valuable.

### Augmentation Scheduling

- **Start aggressive, taper off**: strong augmentation early, reduce in later training stages
- **Curriculum augmentation**: start with clean data, gradually introduce harder augmentations
- **Probability-based**: each augmentation applied with independent probability $p$

### Composition

Chain multiple augmentations:

$$
x' = A_3(A_2(A_1(x)))
$$

Common pipelines:
1. Gain perturbation → Pitch shift → Add noise
2. Time stretch → EQ perturbation → Codec degradation
3. RIR convolution → Gain perturbation → SpecAugment

Order matters: apply time-domain transforms before frequency-domain transforms.
