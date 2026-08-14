---
sidebar_position: 4
title: Evaluation Metrics
---

# Evaluation Metrics for AI Music

Evaluating generated music is challenging because quality is multidimensional and inherently subjective. This page covers the objective metrics, perceptual scores, and human evaluation methods used in the field.

## Objective Audio Metrics

### Fréchet Audio Distance (FAD)

FAD is the most widely used metric for generative audio quality. It measures the distributional distance between generated and real audio embeddings:

$$
\text{FAD} = \|\boldsymbol{\mu}_r - \boldsymbol{\mu}_g\|^2 + \text{tr}\left(\boldsymbol{\Sigma}_r + \boldsymbol{\Sigma}_g - 2\left(\boldsymbol{\Sigma}_r \boldsymbol{\Sigma}_g\right)^{1/2}\right)
$$

where $(\boldsymbol{\mu}_r, \boldsymbol{\Sigma}_r)$ and $(\boldsymbol{\mu}_g, \boldsymbol{\Sigma}_g)$ are the mean and covariance of embeddings from real and generated audio respectively.

**Lower FAD indicates closer fitted embedding distributions under the chosen setup.** It is not a direct measure of musical quality. FAD is sensitive to the embedding model, sample duration, resampling, loudness, reference corpus, and sample count. Scores produced with different pipelines are not directly comparable.

Embedding model choices include:
- **VGGish**: original, widely used but dated
- **CLAP**: more recent, captures text-audio alignment
- **MERT**: music-oriented representations; using it creates a Fréchet-style embedding distance, not the original VGGish FAD protocol

The Gaussian estimate is biased at finite sample counts. Use the same number of clips for every system, bootstrap the complete pipeline, and publish the exact embedding checkpoint and preprocessing code.

### Fréchet Inception Distance (FID)

FID applied to spectrogram images, using a vision model (e.g., Inception) as the embedding extractor. Less common than FAD for audio but still used in some papers.

### Inception Score (IS)

$$
\text{IS} = \exp\left(\mathbb{E}_x \left[ D_{\text{KL}}(p(y|x) \| p(y)) \right]\right)
$$

Measures both quality (confident class predictions) and diversity (uniform marginal distribution). Originally for images; adapted for audio with audio classifiers.

### Kernel Inception Distance (KID)

$$
\text{KID} = \text{MMD}^2(\{f(x_r)\}, \{f(x_g)\})
$$

Unbiased alternative to FID/FAD, uses Maximum Mean Discrepancy. Better statistical properties with small sample sizes.

## Spectral Metrics

### Multi-Resolution STFT Loss

Used both for training and evaluation:

$$
\mathcal{L}_{\text{MRSTFT}} = \frac{1}{M}\sum_{m=1}^{M}\left(\mathcal{L}_{\text{sc}}^{(m)} + \mathcal{L}_{\text{mag}}^{(m)}\right)
$$

where spectral convergence and log-magnitude losses are computed at multiple STFT resolutions.

**Spectral convergence**:

$$
\mathcal{L}_{\text{sc}} = \frac{\||\text{STFT}(x)| - |\text{STFT}(\hat{x})|\|_F}{\||\text{STFT}(x)|\|_F}
$$

### Log-Spectral Distance (LSD)

$$
\text{LSD} = \frac{1}{T}\sum_{t=1}^{T}\sqrt{\frac{1}{K}\sum_{k=1}^{K}\left(10\log_{10}\frac{|X(t,k)|^2}{|\hat{X}(t,k)|^2}\right)^2}
$$

Measures per-frame spectral distortion in dB. Lower is better.

### Mel Cepstral Distortion (MCD)

$$
\text{MCD} = \frac{10}{\ln 10}\sqrt{2\sum_{i=1}^{D}(c_i - \hat{c}_i)^2}
$$

where $c_i$ and $\hat{c}_i$ are mel cepstral coefficients. Widely used in speech synthesis; applicable to singing voice.

## Text-Audio Alignment Metrics

### CLAP similarity

Using a pre-trained CLAP (Contrastive Language-Audio Pretraining) model:

$$
\text{CLAP Score} = \text{cos\_sim}(\mathbf{e}_{\text{text}}, \mathbf{e}_{\text{audio}})
$$

Measures compatibility under one pretrained model. Higher is not universally better: the model can reward audible prompt keywords while missing arrangement, negation, counting, or fine temporal control. Report results by prompt category and include hard negatives or counterfactual prompts.

### Text-Audio Relevance

Can also be computed using:
- ImageBind (multimodal alignment)
- MuLan (music-language model)

## Musical Attribute Metrics

### Tempo Accuracy

Compare detected BPM of generated audio vs. target:

$$
\text{Tempo Error} = |BPM_{\text{detected}} - BPM_{\text{target}}|
$$

### Key Accuracy

Percentage of generated clips where the detected musical key matches the prompted or target key.

### Pitch Quality

- **F0 RMSE**: root mean square error of fundamental frequency trajectory
- **Voicing Decision Error**: accuracy of voiced/unvoiced detection
- **Gross Pitch Error (GPE)**: percentage of frames with >50 cent pitch error

### Rhythm Metrics

- **Beat F1**: precision and recall of detected beat positions vs. reference
- **Downbeat F1**: accuracy of measure-level timing
- **Groove consistency**: autocorrelation analysis of onset patterns

## Perceptual Quality Scores

### PESQ (Perceptual Evaluation of Speech Quality)

$$
\text{PESQ} \in [-0.5, 4.5]
$$

Designed for speech; sometimes repurposed for vocal evaluation. Higher is better.

### ViSQOL (Virtual Speech Quality Objective Listener)

Perceptual quality estimator using spectro-temporal comparison:

$$
\text{ViSQOL} \in [1.0, 5.0]
$$

More robust than PESQ for music content.

### SI-SDR (Scale-Invariant Signal-to-Distortion Ratio)

$$
s_{\text{proj}} = \frac{\langle\hat{s}, s\rangle}{\|s\|^2}\, s
$$

$$
\text{SI-SDR} = 10\log_{10} \frac{\|s_{\text{proj}}\|^2}{\|\hat{s} - s_{\text{proj}}\|^2}
$$

Used primarily for source separation quality. Higher is better.

## Human Evaluation

### Mean Opinion Score (MOS)

Listeners rate audio samples on a 1–5 scale:

| Score | Quality |
|---|---|
| 5 | Excellent |
| 4 | Good |
| 3 | Fair |
| 2 | Poor |
| 1 | Bad |

MOS is useful but expensive, and a mean can hide listener disagreement. Study size should come from a power analysis or sequential design rather than a fixed folklore threshold. Design guidelines:

- define the target population and screen listening equipment when relevant
- Randomize presentation order
- Include anchor samples (real music, known-bad examples)
- collect repeated or sentinel trials to estimate reliability
- Report uncertainty and the number of listeners and ratings per condition

### AB Preference Testing

Present two samples (A and B) and ask which is preferred. Simpler than MOS, captures relative quality.

### MUSHRA (Multi-Stimulus with Hidden Reference and Anchor)

- Present multiple versions simultaneously
- Include a hidden reference (real audio)
- Include a low-quality anchor
- Listeners rate each on 0–100 scale
- Good for comparing multiple systems

### Attribute Rating

Rate specific dimensions independently:

- **Audio quality**: production fidelity, absence of artifacts
- **Musicality**: harmonic coherence, melodic quality
- **Text adherence**: how well the audio matches the prompt
- **Creativity / interestingness**: novelty and engagement
- **Structure**: presence of coherent arrangement

## Evaluation Best Practices

| Practice | Reason |
|---|---|
| Report multiple metrics | No single metric captures everything |
| Always include human evaluation | Objective metrics can diverge from perception |
| Use large evaluation sets | Small sets have high variance |
| Compare on the same test set | Ensure fair comparisons |
| Report confidence intervals | Quantify uncertainty |
| Disclose evaluation conditions | Sample rate, duration, number of listeners |

## A reproducible evaluation protocol

### 1. Freeze the evaluation unit

Define whether one observation is a clip, prompt, song, continuation, or listener rating. Multiple clips generated from one prompt are correlated and must not be treated as independent prompts. Keep train, validation, and test identities disjoint at the work or recording level when possible.

### 2. Pre-register system settings

Freeze checkpoints, samplers, guidance, candidate count, reranking, duration, random seeds, loudness processing, and failure handling. If a product generates four candidates and a human selects one, compare that workflow against other systems with an equivalent selection budget.

### 3. Use paired comparisons

Generate every system output from the same prompt or source item. Analyze paired differences and resample at the highest independent level—usually prompt or source—not individual rating. For listener studies, a mixed-effects model can account for both listener and item variation.

### 4. Separate evaluation dimensions

At minimum, distinguish:

- signal fidelity and artifacts;
- prompt or control adherence;
- musical coherence over time;
- diversity within and across prompts;
- memorization or similarity risk;
- latency, throughput, and resource use.

A single weighted score hides trade-offs and makes the result depend on arbitrary weights.

### 5. Quantify uncertainty

Publish confidence intervals or posterior intervals, paired effect sizes, sample counts, and the resampling unit. Correct for multiple comparisons when testing many systems or attributes. Statistical significance without a practically meaningful effect size is not a useful product decision.

### 6. Preserve artifacts

Store prompt IDs, seeds, model and dependency versions, raw outputs, metric inputs, excluded cases, and analysis code. Normalize only copies used for a declared listening condition; retain original renders for artifact and loudness analysis.

## Common evaluation leaks

| Leak | Why it invalidates a comparison |
| --- | --- |
| Selecting only successful outputs | Measures a curated demo, not system reliability |
| Different candidate budgets | Gives one system more chances to succeed |
| Reference corpus overlaps training data | Can reward memorization or familiar production |
| Per-clip random split of one recording | Places near-duplicate material in train and test |
| Different mastering chains | Confounds model quality with loudness and post-processing |
| Unblinded system labels | Introduces brand and expectation bias |
| Treating every listener rating as independent | Produces confidence intervals that are too narrow |

## Metric Correlation Summary

| Metric | Correlates With | Limitations |
|---|---|---|
| FAD | Overall distributional quality | Doesn't capture per-sample issues |
| CLAP Score | Text-audio relevance | Bounded by CLAP model quality |
| MOS | Perceived quality | Expensive, subjective variance |
| LSD | Spectral accuracy | Doesn't capture temporal coherence |
| Tempo/Key accuracy | Musical correctness | Narrow attributes only |

## Primary references and standards

- Kilgour et al., [Fréchet Audio Distance: A Reference-Free Metric for Evaluating Music Enhancement Algorithms](https://arxiv.org/abs/1812.08466) (2019)
- ITU-R, [BS.1534: Method for the subjective assessment of intermediate quality level of audio systems](https://www.itu.int/rec/R-REC-BS.1534/) (MUSHRA)
- ITU-T, [P.808: Subjective evaluation of speech quality with a crowdsourcing approach](https://www.itu.int/rec/T-REC-P.808/)
