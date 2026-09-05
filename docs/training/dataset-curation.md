---
sidebar_position: 1
title: Dataset Curation
---

# Dataset Curation for Audio ML

Training data strongly constrains what an audio model can learn. Dataset curation — collecting, cleaning, annotating, documenting, and organizing audio corpora — is therefore a central engineering task in audio ML.

## Data Sources

### Public Research Datasets

The numbers below refer to the canonical dataset releases or project pages, not necessarily to every mirror or later derivative.

| Dataset | Canonical scale | Content | Rights / access note |
|---|---|---|---|
| FMA (Free Music Archive) | 106,574 tracks; 343 days of audio | Multi-genre music | Audio in the canonical release is Creative Commons-licensed; preserve per-track license metadata |
| MusicCaps | 5,521 captioned music examples | 10-second YouTube music clips + musician-written captions | Dataset metadata/captions are research data; access to the underlying YouTube audio remains subject to the source platform and rights holder |
| AudioSet | 2,084,320 labeled 10-second clips | General audio, including music, speech, animals, and environmental sounds | Clips are referenced from YouTube; do not treat the dataset index as a blanket license to redistribute source audio |
| MUSDB18 | 150 full-length tracks (~10 h) | Mixtures plus drums, bass, vocals, and other stems | Academic-use access; underlying tracks come from multiple sources with track-specific rights |
| MTG-Jamendo | 55k+ full tracks | Music auto-tagging with genre, instrument, and mood/theme labels | Built from Jamendo music distributed under Creative Commons licenses; retain track-level license information |
| Lakh MIDI | 176,581 unique MIDI files | Symbolic music / MIDI | Rights and attribution should be checked against the canonical project notes; some files may be invalid or corrupt |
| NSynth | 305,979 notes from 1,006 instruments | Four-second monophonic note recordings at 16 kHz | Dataset release provides its own usage terms; verify them for the intended use rather than inferring rights from mirrors |

Dataset names are not substitutes for license review. Mirrors can attach different metadata, omit attribution fields, or package only a subset of the original release.

### Licensed / Proprietary Data

Commercial training corpora can include licensed catalogs, commissioned recordings, production libraries, first-party material, synthetic data, or other sources for which the operator has obtained the necessary rights. The exact composition of a closed model's training set should be treated as unknown unless the provider or another reliable source documents it.

Avoid statements such as "commercial systems typically train on millions of licensed tracks" unless a specific system and source support the claim.

### Web-Sourced Audio

Public availability on the web does not by itself establish permission to download, redistribute, or train on a recording. Web-sourced pipelines therefore need both technical filtering and rights-aware provenance.

Common engineering concerns include:

- duplicate or near-duplicate recordings;
- missing or inconsistent metadata;
- deleted or unavailable source URLs;
- codec and loudness variation;
- mislabeled content;
- uncertain ownership, consent, and license status.

See [Copyright & Training Data](../ethics-legal/copyright-and-training-data.md) for legal and policy considerations.

## Data Quality Pipeline

### 1. Ingestion and Format Standardization

- Convert audio to a consistent working format appropriate for the task, such as WAV at a chosen sample rate and channel layout
- Verify file integrity and reject truncated or unreadable files
- Preserve the original asset, source URL or identifier, retrieval date, and license/provenance metadata where permitted
- Remove exact duplicates with cryptographic hashes when byte identity is the desired criterion

### 2. Audio Quality Filtering

Automated checks can flag material for removal or review:

- **Noise / SNR estimation**: useful when a defensible noise estimate is available
- **Clipping detection**: identify sustained or severe clipping
- **Silence detection**: flag clips dominated by silence
- **Bandwidth analysis**: detect unexpectedly narrow or inconsistent spectra
- **Codec / container validation**: reject malformed or unsupported files

A simple SNR estimator for a signal $x[n]$ with a known noise-only region $x_{\text{noise}}$ is:

$$
\text{SNR} = 10 \log_{10} \frac{P_{\text{signal}}}{P_{\text{noise}}} = 10 \log_{10} \frac{\frac{1}{N}\sum |x[n]|^2}{\frac{1}{M}\sum |x_{\text{noise}}[n]|^2}
$$

This formula is only meaningful when the selected region is a reasonable estimate of the noise process.

### 3. Content Deduplication

Beyond exact duplicates, near-duplicate detection can use:

- **Audio fingerprinting** for recordings that are perceptually the same despite encoding changes
- **Embedding similarity** for broader similarity search and clustering
- **Cover / version detection** when composition-level overlap matters to the evaluation design

Deduplication is especially important around validation and test sets because leakage can inflate measured performance. It does not automatically guarantee that a generative model cannot memorize training examples.

### 4. Metadata and Annotation

Useful metadata depends on the task:

| Annotation | Possible method | Example purpose |
|---|---|---|
| Genre/style tags | Human labels, provider metadata, classifier | Conditioning or retrieval |
| BPM / tempo | Beat tracker + review | Tempo conditioning or analysis |
| Key / scale | Key estimator + review | Harmonic conditioning |
| Mood / energy | Human annotation or model-assisted labeling | Descriptive conditioning |
| Captions | Human annotation or model-assisted drafting with review | Text-audio training |
| Instrument tags | Human labels or multi-label classifier | Instrumentation control |
| Quality score | Listening panel or validated predictor | Filtering or curriculum design |
| Rights metadata | Source records and license documents | Usage-policy enforcement and audit |

Model-generated labels can reduce annotation cost but should not be presented as ground truth without validation.

### 5. Segmentation

Full-length tracks can be segmented in several ways:

- **Fixed-length chunks** — simple and reproducible, but may split musical phrases
- **Beat-aligned chunks** — useful when the beat tracker is reliable
- **Section-aligned chunks** — useful when structural boundaries are available or estimated
- **Overlapping windows** — increase the number of training examples but also increase dependence between adjacent examples

There is no universal best clip length or overlap percentage; choose them to match the model context window, task, and evaluation protocol.

## Data Balance and Bias

### Representation Imbalance

Before claiming that particular genres, regions, languages, or production styles are over- or underrepresented, measure the dataset being used. Broad statements about "music datasets" can be misleading because composition varies substantially between corpora.

Useful mitigations include:
- targeted data collection;
- weighted or stratified sampling;
- subgroup-aware validation sets;
- reporting coverage and uncertainty instead of assuming balanced representation.

### Quality Distribution

A heterogeneous corpus can contain studio masters, live recordings, archival transfers, lossy uploads, and synthetic material. Whether lower-fidelity examples improve robustness or degrade target quality is an empirical question for the specific training setup.

Curriculum learning is one possible strategy, but it should be validated rather than assumed to be superior.

## Scale Considerations

Dataset size alone does not determine whether a model is a prototype, a competitive research system, or production-ready. Model capacity, task difficulty, diversity, annotation quality, legal availability, compute, optimization, and evaluation all matter.

Use track counts, hours, unique artists, unique compositions, and effective post-deduplication duration as descriptive statistics rather than universal quality tiers. For sequence models, token counts and context-window coverage may be more informative than raw track count.

Claims about scaling laws should cite the particular study, model family, and measured regime; they should not be generalized to all audio generation systems without evidence.

## Validation and Test Sets

- Hold out evaluation data before model selection when practical
- Stratify or otherwise balance test coverage according to the intended use case
- Check exact and near-duplicate leakage across train, validation, and test partitions
- Keep evaluation metadata and preprocessing versioned
- Combine objective measures with human evaluation when perceptual quality is part of the target
- Document exclusions, unavailable source files, and licensing constraints that change the effective test set

## Sources checked

Checked September 2026 against canonical project pages and primary dataset documentation:

- [FMA project repository](https://github.com/mdeff/fma) — 106,574 tracks and 343 days of Creative Commons-licensed audio
- [AudioSet project page](https://research.google.com/audioset/) — 2,084,320 human-labeled 10-second clips from YouTube
- [MUSDB18 documentation](https://sigsep.github.io/datasets/musdb.html) — 150 tracks, 100/50 train-test split, mixed underlying licenses and academic-use access
- [MTG-Jamendo dataset](https://mtg.github.io/mtg-jamendo-dataset/) — more than 55,000 Creative Commons-licensed tracks with music tags
- [Lakh MIDI Dataset](https://colinraffel.com/projects/lmd/) — 176,581 unique MIDI files, including a 45,129-file matched subset
- [NSynth dataset](https://magenta.tensorflow.org/datasets/nsynth) — 305,979 four-second notes from 1,006 instruments
- Agostinelli et al., *MusicLM: Generating Music From Text* — MusicCaps contains 5,521 examples with musician-written captions
