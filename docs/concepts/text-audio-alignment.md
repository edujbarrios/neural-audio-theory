---
sidebar_position: 4
title: Text-Audio Alignment (CLAP)
---

# Text-Audio Alignment and CLAP

Text-audio alignment models learn a shared embedding space where text descriptions and audio recordings are geometrically close when semantically related. These models are critical for text-conditioned music generation, retrieval, and evaluation.

## The Core Idea

Given a text description $t$ and an audio clip $a$, we want:

$$
\text{sim}(f_{\text{text}}(t), g_{\text{audio}}(a)) \begin{cases} \text{high} & \text{if } t \text{ describes } a \\ \text{low} & \text{otherwise} \end{cases}
$$

This is the same paradigm as CLIP (for images + text), applied to audio.

## CLAP: Contrastive Language-Audio Pretraining

CLAP is the most widely used text-audio alignment model in music AI.

### Architecture

```
Text ──▶ Text Encoder ──▶ Projection ──▶ eₜ ∈ ℝᵈ
                                              │
                                         cosine sim
                                              │
Audio ──▶ Audio Encoder ──▶ Projection ──▶ eₐ ∈ ℝᵈ
```

**Text encoder**: Typically a pre-trained language model (BERT, RoBERTa, or GPT-2)

**Audio encoder**: Typically a pre-trained audio model:
- **HTSAT**: Hierarchical Token-Semantic Audio Transformer
- **PANNs**: Pre-trained Audio Neural Networks
- **PANN-CNN14**: Convolutional architecture

**Projection heads**: Linear layers that map each encoder's output to a shared $d$-dimensional space (typically $d = 512$ or $d = 1024$).

### Contrastive Training

CLAP is trained with the InfoNCE contrastive loss on matched text-audio pairs:

$$
\mathcal{L}_{\text{CLAP}} = -\frac{1}{2N}\sum_{i=1}^{N}\left[\log \frac{e^{\text{sim}(\mathbf{e}_t^i, \mathbf{e}_a^i)/\tau}}{\sum_{j=1}^{N} e^{\text{sim}(\mathbf{e}_t^i, \mathbf{e}_a^j)/\tau}} + \log \frac{e^{\text{sim}(\mathbf{e}_a^i, \mathbf{e}_t^i)/\tau}}{\sum_{j=1}^{N} e^{\text{sim}(\mathbf{e}_a^i, \mathbf{e}_t^j)/\tau}}\right]
$$

where $\tau$ is a learnable temperature parameter.

This symmetrical loss pushes matched pairs together and mismatched pairs apart in both directions (text→audio and audio→text).

### Training Data

CLAP models are trained on large-scale text-audio pair datasets:

| Dataset | Size | Content |
|---|---|---|
| AudioSet (with labels) | 2M clips | General audio + music |
| LAION-Audio-630K | 630K pairs | Web-scraped audio + captions |
| WavCaps | 400K pairs | Weakly labeled audio + generated captions |
| FreeSound | 500K+ clips | User-uploaded with tags |
| MusicCaps | 5.5K clips | Music with expert captions |

## MuLan (Music Language Model)

Google's MuLan is a music-specific text-audio alignment model used in MusicLM:

### Key Differences from CLAP

- Trained specifically on music (not general audio)
- Uses a contrastive loss with a music-tailored audio encoder
- Trained on 50M+ music-text pairs
- Not publicly released

### MuLan Architecture

$$
\mathbf{e}_t = \text{Proj}_t(\text{BERT}(t)) \in \mathbb{R}^{128}
$$

$$
\mathbf{e}_a = \text{Proj}_a(\text{AudioEncoder}(a)) \in \mathbb{R}^{128}
$$

MuLan uses a lower embedding dimension (128) compared to CLAP (512), which is sufficient given its music-focused training.

## Applications in Music AI

### 1. Text-to-Music Conditioning

Text-audio alignment models provide conditioning embeddings for generators:

$$
\mathbf{c} = f_{\text{text}}(\text{prompt})
$$

This embedding is injected into the generator via cross-attention, FiLM modulation, or concatenation.

### 2. Audio Retrieval

Find audio clips matching a text query:

$$
a^* = \arg\max_{a \in \mathcal{D}} \text{sim}(f_{\text{text}}(q), g_{\text{audio}}(a))
$$

### 3. Audio Captioning (Reverse Direction)

Find the text description that best matches an audio clip:

$$
t^* = \arg\max_{t \in \mathcal{T}} \text{sim}(f_{\text{text}}(t), g_{\text{audio}}(a))
$$

### 4. Evaluation (CLAP Score)

Measure how well generated audio matches its text prompt:

$$
\text{CLAP Score} = \frac{1}{N}\sum_{i=1}^{N} \text{cos\_sim}(f_{\text{text}}(t_i), g_{\text{audio}}(\hat{a}_i))
$$

This is now a standard metric for text-to-audio generation systems.

### 5. Zero-Shot Classification

Classify audio without training a classifier:

$$
\hat{y} = \arg\max_{c \in \mathcal{C}} \text{sim}(f_{\text{text}}(\text{"a sound of } c\text{"}), g_{\text{audio}}(a))
$$

## Embedding Space Geometry

Well-trained text-audio embedding spaces exhibit useful structure:

### Semantic Clusters

- Genre terms cluster together (rock, metal, punk form a neighborhood)
- Instrument descriptions form coherent regions
- Mood/emotion terms arrange along interpretable dimensions

### Compositional Structure

CLAP spaces show some degree of compositionality:

$$
\mathbf{e}_{\text{"acoustic guitar"}} + \mathbf{e}_{\text{"jazz"}} \approx \mathbf{e}_{\text{"jazz guitar"}}
$$

This compositionality enables mixing and interpolating conditioning vectors for creative control.

### Limitations of Current Alignment

| Challenge | Detail |
|---|---|
| Fine-grained control | "126 BPM" vs. "128 BPM" may not be distinguishable |
| Negation | "no drums" is poorly handled |
| Temporal structure | "intro then drop" is weakly encoded |
| Novel combinations | Unusual genre fusions may have poor coverage |
| Musical notation | Specific chords, keys, and scales are underrepresented |

## CLAP Variants

| Model | Audio Encoder | Text Encoder | Embedding Dim |
|---|---|---|---|
| LAION-CLAP | HTSAT | RoBERTa | 512 |
| Microsoft CLAP | PANN | BERT | 1024 |
| MuLan | Custom | BERT | 128 |
| CLAP (Wu et al.) | HTSAT | GPT-2 | 512 |

## Engineering Considerations

### Choosing a CLAP Model

- **For evaluation**: use the most widely adopted variant for comparability
- **For conditioning**: larger embedding dimensions capture more detail
- **For music-specific tasks**: music-trained models (MuLan) outperform general audio models
- **For open research**: LAION-CLAP is the most accessible open-weight option

### Improving Alignment Quality

- **Hard negative mining**: train with confusable text-audio pairs
- **Data scaling**: more diverse pairs improve generalization
- **Multi-task training**: combine contrastive loss with classification or captioning
- **Prompt augmentation**: paraphrase text descriptions to improve robustness
