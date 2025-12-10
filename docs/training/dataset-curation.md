---
sidebar_position: 1
title: Dataset Curation
---

# Dataset Curation for Audio ML

The quality of an AI music model is bounded by its training data. Dataset curation — the process of collecting, cleaning, annotating, and organizing audio corpora — is one of the highest-leverage engineering tasks in any audio ML project.

## Data Sources

### Public Research Datasets

| Dataset | Size | Content | License |
|---|---|---|---|
| FMA (Free Music Archive) | 106 days | Multi-genre music | CC licenses |
| MusicCaps | 5.5k clips | YouTube clips + text captions | Research |
| AudioSet | 2M+ clips | General audio + music | Research |
| MUSDB18 | 150 tracks | Multi-stem mixes | Research |
| MTG-Jamendo | 55k tracks | Multi-tag music | CC |
| Lakh MIDI | 176k MIDI files | MIDI transcriptions | Research |
| NSynth | 305k samples | Individual notes | CC-BY |

### Licensed / Proprietary Data

Commercial systems typically train on much larger proprietary datasets:

- Licensed music catalogs (millions of tracks)
- Production music libraries
- User-uploaded content (with terms of service)
- Synthetic data from MIDI rendering

### Web-Scraped Audio

- Large scale but noisy
- Quality, licensing, and content vary wildly
- Requires aggressive filtering pipelines
- Ethical and legal concerns (see [Copyright & Training Data](../ethics-legal/copyright-and-training-data.md))

## Data Quality Pipeline

### 1. Ingestion and Format Standardization

- Convert all audio to a consistent format (e.g., WAV, 48 kHz, mono or stereo, float32)
- Verify file integrity (detect truncated or corrupted files)
- Remove exact duplicates (hash-based deduplication)

### 2. Audio Quality Filtering

Remove low-quality samples using automated checks:

- **SNR estimation**: discard clips below a noise floor threshold
- **Clipping detection**: reject heavily clipped recordings
- **Silence detection**: filter clips that are mostly silence
- **Bandwidth analysis**: reject uploads with suspiciously narrow bandwidth (e.g., speech-band-only content labeled as music)

A simple SNR estimator for a signal $x[n]$ with noise-only region $x_{\text{noise}}$:

$$
\text{SNR} = 10 \log_{10} \frac{P_{\text{signal}}}{P_{\text{noise}}} = 10 \log_{10} \frac{\frac{1}{N}\sum |x[n]|^2}{\frac{1}{M}\sum |x_{\text{noise}}[n]|^2}
$$

### 3. Content Deduplication

Beyond exact duplicates, detect near-duplicates:

- **Audio fingerprinting** (Chromaprint, Neural Audio Fingerprint)
- **Embedding similarity**: compute embeddings and cluster; remove items too close to others
- **Cover song detection**: identify and handle different performances of the same composition

Deduplication prevents models from memorizing specific recordings and improves generalization.

### 4. Metadata and Annotation

Useful metadata for training:

| Annotation | Method | Purpose |
|---|---|---|
| Genre/style tags | Classifier + manual | Conditioning labels |
| BPM / tempo | Beat tracker (madmom, librosa) | Tempo conditioning |
| Key / scale | Key detection algorithm | Harmonic conditioning |
| Mood / energy | Text classifier or manual | Descriptive conditioning |
| Captions | Human annotation or LLM | Text-to-music training |
| Instrument tags | Multi-label classifier | Instrumentation control |
| Quality score | MOS prediction model | Curriculum learning |

### 5. Segmentation

Full-length tracks are typically segmented into clips:

- **Fixed-length chunks** (e.g., 10s, 30s) — simple but may split musical phrases
- **Beat-aligned chunks** — cut on downbeats for rhythmic coherence
- **Section-aligned chunks** — segment by structural boundaries (intro, verse, chorus)
- **Overlap strategy** — 50% hop for data augmentation

## Data Balance and Bias

### Genre Imbalance

Training datasets are rarely balanced across genres. Pop, rock, and electronic music are overrepresented; classical, jazz, and non-Western traditions are underrepresented.

Mitigation strategies:
- **Oversampling** underrepresented genres
- **Weighted sampling** during training
- **Stratified batching** to ensure diversity per batch
- **Targeted data collection** for thin categories

### Quality Distribution

Not all tracks are equally well-produced. Including low-quality recordings can help robustness but may lower average output quality.

**Curriculum learning** — training on high-quality data first, then mixing in noisier data — can balance robustness and quality.

## Scale Considerations

| Dataset Scale | Tracks | Typical Use |
|---|---|---|
| Small | 1k–10k | Research prototypes, fine-tuning |
| Medium | 10k–100k | Competitive research models |
| Large | 100k–1M | Production-ready systems |
| Very Large | 1M+ | State-of-the-art commercial systems |

Scaling laws for audio models suggest that data quality matters more than raw quantity up to a point, after which scale becomes critical for rare concepts and styles.

## Validation and Test Sets

- **Hold out** a representative test set before any training
- **Stratify** by genre, tempo, key, and quality
- **Never contaminate** test data with training data (check for near-duplicates)
- **Include both objective and human evaluation** samples
