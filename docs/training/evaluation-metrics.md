---
sidebar_position: 4
title: Evaluation Metrics
---

# Evaluation Metrics for AI Music

AI-music evaluation is multidimensional. No single objective score establishes musical quality, prompt adherence, originality, perceptual fidelity, or production usefulness. A defensible evaluation combines metrics chosen for the task with controlled listening tests when human perception is part of the claim.

## Fréchet Audio Distance (FAD)

FAD was introduced as a reference-free distributional metric for audio enhancement. It compares fitted Gaussian distributions of embeddings from reference and evaluated audio:

$$
\text{FAD}=\|\boldsymbol\mu_r-\boldsymbol\mu_g\|^2+\mathrm{tr}\left(\boldsymbol\Sigma_r+\boldsymbol\Sigma_g-2(\boldsymbol\Sigma_r\boldsymbol\Sigma_g)^{1/2}\right).
$$

Lower values mean the fitted embedding distributions are closer under that exact pipeline. FAD is used in generative-audio research, but describing it as *the* most widely used quality metric is difficult to substantiate and risks implying more than it measures.

A FAD number is not portable across arbitrary implementations. Report at least:

- embedding model and checkpoint;
- sample rate and preprocessing;
- clip duration and segmentation;
- reference corpus;
- number of clips;
- treatment of silence and failed generations;
- implementation/version.

Changing the embedding model produces a different Fréchet-style metric. The original FAD work used VGGish; a CLAP- or music-encoder-based Fréchet distance should be named accordingly rather than silently presented as the identical protocol.

## Inception-style and kernel distances

### Inception Score

$$
\text{IS}=\exp\left(\mathbb E_x[D_{\mathrm{KL}}(p(y|x)\|p(y))]\right).
$$

The interpretation depends entirely on the classifier and label space. A confident classifier does not prove perceptual quality or musical coherence.

### Kernel distances

Maximum Mean Discrepancy and kernel-based distances can compare embedding distributions without fitting the same Gaussian model. Claims such as “better for small samples” must be tied to a particular estimator and experiment; they are not a universal guarantee.

## Spectral and reconstruction metrics

### Multi-resolution STFT loss

A common form aggregates spectral terms across several STFT settings:

$$
\mathcal L_{\mathrm{MRSTFT}}=\frac{1}{M}\sum_{m=1}^{M}(\mathcal L_{\mathrm{sc}}^{(m)}+\mathcal L_{\mathrm{mag}}^{(m)}).
$$

These metrics are useful when a target waveform or reconstruction exists. They do not, by themselves, measure whether an unconstrained generated song is musically preferable.

### SI-SDR

SI-SDR is particularly useful for source-separation and reconstruction tasks where a time-aligned reference signal exists:

$$
s_{\mathrm{proj}}=\frac{\langle\hat s,s\rangle}{\|s\|^2}s,
$$

$$
\mathrm{SI\!\text{-}\!SDR}=10\log_{10}\frac{\|s_{\mathrm{proj}}\|^2}{\|\hat s-s_{\mathrm{proj}}\|^2}.
$$

It is not a general-purpose score for free-form music generation.

## Text-audio alignment

A CLAP-style cosine score is

$$
\mathrm{score}=\cos(\mathbf e_{\mathrm{text}},\mathbf e_{\mathrm{audio}}).
$$

This measures compatibility according to one pretrained embedding model. It can miss negation, chronology, counting, arrangement detail, or attributes outside the encoder's training distribution. Compare systems with the same checkpoint and preprocessing, and supplement aggregate scores with prompt-category tests and counterfactual or hard-negative prompts.

## Musical attribute tests

Tempo, key, pitch, beat, and structure can be evaluated when the prompt or source defines a testable target. The metric inherits the errors of the detector used to estimate that attribute. A “key accuracy” result based on an automatic key detector is not ground truth unless the detector itself has been validated for the tested material.

Prefer task-specific reports such as:

| Claim | Useful evidence |
| --- | --- |
| follows requested tempo | annotated target + tempo estimator validated on the domain |
| preserves melody | note/F0 alignment plus listening review |
| follows section order | human or reliably annotated structural timeline |
| matches text prompt | blinded ratings plus a fixed embedding score |
| preserves source signal | SI-SDR/spectral metrics plus artifact-focused listening |

## PESQ and ViSQOL

PESQ is standardized for speech-quality evaluation and should not be treated as a generic music-quality score.

ViSQOL is a full-reference perceptual metric with separate speech and audio modes. The current official implementation documents 48 kHz input for audio mode and 16 kHz wideband input for speech mode; audio mode downmixes multichannel input to mono for comparison. Its MOS-LQO output is a model prediction, not a human MOS measurement.

Do not describe ViSQOL as universally “more robust than PESQ for music.” Use its documented audio mode, disclose the version and settings, and validate correlation with listeners for the degradation types that matter to the project.

## Human evaluation

### MOS-style ratings

A mean opinion score summarizes listener ratings, but the scale labels, instructions, population, playback conditions, anchors, and statistical analysis must be specified. Different studies that both report “MOS” are not automatically comparable.

### Pairwise preference

A/B tests are useful for relative judgments when systems can be evaluated on matched prompts or sources. Randomize side/order and analyze paired outcomes rather than treating every rating as independent.

### MUSHRA

ITU-R BS.1534 defines the MUSHRA method for intermediate audio quality. A proper MUSHRA study uses a hidden reference and anchors and follows the standard's test design. Merely presenting several clips on a 0–100 slider is not sufficient to claim a standards-compliant MUSHRA test.

## Reproducible evaluation protocol

1. **Define the unit of analysis.** A prompt, song, source recording, and listener rating are different statistical units.
2. **Freeze generation settings.** Record checkpoint/model label, sampler, seed policy, candidate count, reranking, duration, and failure handling.
3. **Match budgets.** If one workflow allows four candidates plus manual selection, give competitors an equivalent selection budget or report the asymmetry.
4. **Use paired material.** Compare systems on the same prompts or source items wherever possible.
5. **Separate dimensions.** Fidelity, prompt adherence, structure, diversity, latency, and memorization risk should not be hidden in one arbitrary weighted score.
6. **Quantify uncertainty.** Report confidence or posterior intervals, effect sizes, sample counts, and the resampling unit.
7. **Preserve artifacts.** Keep raw outputs, prompts, seeds, metric inputs, exclusions, and analysis code.
8. **Include listening evidence when making perceptual claims.** Objective metrics may be sufficient for a narrow engineering property, but claims about listener preference or perceived musical quality require listener data.

## Common failure modes

| Failure | Consequence |
| --- | --- |
| selecting only successful outputs | evaluates a curated demo rather than reliability |
| unequal candidate budgets | gives one system more chances to succeed |
| changing loudness/mastering between systems | confounds generation and post-processing |
| embedding checkpoint changes | makes distribution scores non-comparable |
| per-clip split of the same recording | creates leakage between train/test identities |
| treating repeated listener ratings as independent | understates uncertainty |
| calling an objective predictor “MOS” | confuses model prediction with human judgment |

## Primary references and standards

- Kilgour et al., [Fréchet Audio Distance](https://arxiv.org/abs/1812.08466) (2019).
- ITU-R, [BS.1534: Method for the subjective assessment of intermediate quality level of audio systems](https://www.itu.int/rec/R-REC-BS.1534/).
- ITU-T, [P.808: Subjective evaluation of speech quality with a crowdsourcing approach](https://www.itu.int/rec/T-REC-P.808/).
- Google, [ViSQOL official repository](https://github.com/google/visqol).

Sources checked: 2026-09-05.
