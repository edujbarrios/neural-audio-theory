---
sidebar_position: 3
title: Mel Spectrograms
---

# Mel Spectrograms

Mel spectrograms are a widely used time-frequency representation in speech, music-information retrieval, text-to-audio, and neural-vocoder pipelines. They reduce a linear-frequency magnitude or power spectrum with a perceptually motivated filter bank. They are useful, but they are not the universal representation for modern music generation: current systems also operate on waveform samples, complex STFTs, continuous latents, and discrete neural-codec tokens.

## From STFT to mel features

For a windowed frame, a common STFT convention is

$$
X(m,k)=\sum_{n=0}^{N-1}x[n+mH]w[n]e^{-j2\pi kn/N}.
$$

For real-valued input, implementations commonly retain $N/2+1$ non-negative-frequency bins. A mel feature can be computed from magnitude or power. With power,

$$
S(m,k)=|X(m,k)|^2,
$$

and a mel filter bank gives

$$
M(m,b)=\sum_k W(b,k)S(m,k).
$$

Logarithmic or decibel compression is then often applied, for example

$$
M_{\log}(m,b)=\log(M(m,b)+\epsilon).
$$

The exact scale, normalization, power exponent, and floor are part of the model contract. Two tensors both called “mel spectrograms” are not necessarily interchangeable.

## Mel-frequency conventions

One commonly cited formula is

$$
m(f)=2595\log_{10}\left(1+\frac{f}{700}\right),
$$

with inverse

$$
f(m)=700\left(10^{m/2595}-1\right).
$$

This is not the only mel convention. Libraries differ in formulas and filter normalization; for example, librosa exposes HTK and Slaney-style choices. Reproduce the implementation used by the training pipeline rather than assuming a formula from the name alone.

## Filter-bank design

A conventional triangular mel bank:

1. chooses $f_{\min}$, $f_{\max}$, and the number of bands;
2. maps the frequency limits into the selected mel convention;
3. places band centers on that scale;
4. maps centers back to Hz;
5. applies overlapping filters to STFT magnitude or power bins.

Lower-frequency bands are usually narrower in Hz than upper-frequency bands. This is a perceptual frequency warping, not a claim that the representation exactly models human pitch or loudness.

## Parameters are model-specific

There is no single standard set of “music ML” mel parameters. Published systems use different sample rates, FFT sizes, hops, mel-band counts, frequency ranges, and compression rules. When reproducing a model, copy those values from its preprocessing code or paper.

| Parameter | What it controls |
| --- | --- |
| sample rate | available audio bandwidth |
| FFT/window length | time-frequency analysis resolution |
| hop length | frame rate and overlap |
| mel bands | feature dimensionality and frequency aggregation |
| $f_{\min},f_{\max}$ | analyzed frequency range |
| magnitude vs power | spectral quantity fed to the filter bank |
| log/dB rule | dynamic-range compression |
| filter convention | exact band placement and normalization |

A larger FFT does not automatically give a useful “better” frequency representation: window duration, hop, sample rate, zero-padding, and the stationarity of the signal all matter. Likewise, reducing the hop increases frame density but also computation and statistical redundancy.

## Invertibility

A complex STFT can support exact or near-exact reconstruction when the transform, window, hop, boundary handling, and inverse satisfy the appropriate overlap-add conditions. Calling every complex STFT “perfectly invertible” without those conditions is too broad.

Magnitude-only and mel representations discard information, especially phase and frequency detail. Their inversion therefore requires additional assumptions or a learned model.

### Griffin–Lim

Griffin–Lim iteratively searches for a signal whose STFT magnitude is consistent with a target magnitude spectrogram. A mel spectrogram first needs an approximate projection back toward a linear-frequency magnitude representation. Reconstruction quality depends strongly on analysis parameters and iteration count; it should not be described by a universal quality label.

### Neural vocoders

Learned vocoders can map acoustic features such as mel spectrograms to waveform samples. Representative publications include WaveNet, WaveGlow, HiFi-GAN, BigVGAN, and Vocos, but their quality and speed are benchmark-dependent.

- **HiFi-GAN** reports high-fidelity parallel waveform synthesis and fast inference in the authors' speech benchmarks.
- **BigVGAN** reports improved generalization on several out-of-distribution conditions in its published evaluation.
- **Vocos** directly predicts Fourier coefficients and reports large speed gains over the time-domain baselines used in its paper.

Do not turn those paper-specific results into a permanent ranking or claim that one vocoder is the most common production choice. Measure the exact checkpoint on the target domain and hardware.

## Use in generative systems

Mel spectrograms can be targets or intermediate representations in generative audio systems, including some diffusion and TTS pipelines. Other diffusion or flow systems operate in waveform or compressed latent spaces instead. The generic forward noising equation

$$
\mathbf{z}_t=\sqrt{\bar\alpha_t}\,\mathbf{z}_0+\sqrt{1-\bar\alpha_t}\,\boldsymbol\epsilon
$$

does not imply that $\mathbf{z}_0$ is a mel spectrogram; its meaning depends on the model.

## Dynamic-range alternatives

Power-law compression is one possible transform:

$$
M_{\text{power}}(m,b)=M(m,b)^\gamma,\qquad 0<\gamma<1.
$$

Per-Channel Energy Normalization (PCEN) is another family of transformations with automatic gain-control behavior. Its parameters are task-dependent; robustness claims should be tied to the datasets and experiments in which PCEN was evaluated.

## Implementation checklist

- record library and version;
- record sample rate, window, FFT and hop;
- record mel formula, band normalization, and frequency bounds;
- record magnitude/power choice and log or dB transform;
- use identical preprocessing at training and inference;
- test reconstruction or downstream accuracy when changing any parameter.

Common implementations include `torchaudio.transforms.MelSpectrogram`, `librosa.feature.melspectrogram`, and TensorFlow signal primitives. Their defaults are not guaranteed to match one another.

## Primary references

- Stevens, Volkmann & Newman, *A Scale for the Measurement of the Psychological Magnitude Pitch* (1937), foundational mel-scale work.
- Griffin & Lim, *Signal Estimation from Modified Short-Time Fourier Transform* (1984).
- Kong, Kim & Bae, [HiFi-GAN](https://arxiv.org/abs/2010.05646) (NeurIPS 2020).
- Lee et al., [BigVGAN](https://arxiv.org/abs/2206.04658) (2022).
- Siuzdak, [Vocos](https://arxiv.org/abs/2306.00814) (2023).
- librosa, [mel filter-bank documentation](https://librosa.org/doc/latest/generated/librosa.filters.mel.html).

Sources checked: 2026-09-05.
