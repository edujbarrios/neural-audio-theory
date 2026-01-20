---
sidebar_position: 6
title: Vocal Synthesis
---

# AI Vocal Synthesis

Vocal synthesis is one of the most challenging and impressive capabilities in AI music. This page covers the technology behind AI singing voices, voice cloning, and how to work with AI-generated vocals effectively.

## Types of AI Vocal Technology

### Text-to-Speech (TTS) for Singing

Adapts speech synthesis models to sing:
- Input: lyrics + melody (pitch contour + rhythm)
- Output: singing voice audio

### Singing Voice Synthesis (SVS)

Purpose-built models for singing:
- Input: musical score (notes, durations, lyrics)
- Output: expressive singing

### Voice Cloning / Voice Conversion

Transform one voice to sound like another:
- Input: source audio + target voice embedding
- Output: audio with source content in target voice timbre

### End-to-End (Text-to-Music with Vocals)

Full music generation systems that include vocals:
- Input: text prompt + lyrics
- Output: complete music with singing
- Examples: Suno, Udio

## Singing Voice Synthesis Architecture

### Typical SVS Pipeline

```
Musical Score ──▶ Text/Phoneme ──▶ Acoustic     ──▶ Vocoder ──▶ Singing
(MIDI + lyrics)   Encoder          Model              │        Audio
                      │               │                │
                      ▼               ▼                ▼
                  Phoneme         Mel/Latent       Waveform
                  Embeddings     Features
```

### Phoneme Encoding

Lyrics are converted to phonemes (speech sounds):

```
"Hello world" → /h ɛ l oʊ w ɜː l d/
```

Phoneme duration is determined by the note length in the musical score. Phoneme-to-frame alignment is critical for natural-sounding results.

### Acoustic Modeling

The acoustic model predicts mel spectrograms or latent features from phonemes + pitch:

$$
\hat{M} = f_\theta(\text{phonemes}, \text{pitch}, \text{duration}, \text{speaker\_id})
$$

**Pitch conditioning** is essential for singing (unlike speech TTS):

$$
f_0(t) = \text{MIDI\_to\_Hz}(\text{note}(t)) + \text{vibrato}(t) + \text{expression}(t)
$$

### Key Models

| Model | Architecture | Notable Feature |
|---|---|---|
| DiffSinger | Diffusion | Shallow diffusion for speed |
| VISinger | VITS-based | End-to-end, fast |
| NeuralSVS | Transformer | Expressive control |
| ACE Studio | Commercial | Professional quality |
| Synthesizer V | Commercial + AI | Hybrid synthesis + AI |

## Voice Cloning and Conversion

### How Voice Cloning Works

1. **Enroll**: extract a speaker/voice embedding from reference audio
2. **Condition**: use the embedding to guide generation
3. **Generate**: produce speech/singing in the target voice

$$
\hat{x} = G(\text{content}, \mathbf{v}_{\text{target}})
$$

where $\mathbf{v}_{\text{target}}$ is the voice embedding.

### Speaker Embedding

A fixed-dimensional vector capturing voice characteristics:

$$
\mathbf{v} = \text{SpeakerEncoder}(x_{\text{ref}}) \in \mathbb{R}^{256}
$$

The embedding captures:
- Vocal tract shape (formant structure)
- Pitch range and habitual pitch
- Breathiness, nasality, roughness
- Speaking/singing style

### Retrieval-Based Voice Conversion (RVC)

A popular open-source approach:

1. Extract **F0 (pitch)** from source audio
2. Extract **content features** using a pre-trained model (HuBERT)
3. **Retrieve** nearest voice features from a target voice index
4. **Convert** using a trained model conditioned on target features
5. **Vocoder** generates final waveform

```
Source Audio → HuBERT features → Index Retrieval → Conversion Model → Vocoder → Target Voice
                    ↓                                      ↑
               F0 extraction ─────────────────────────────┘
```

### Quality Factors

| Factor | Impact |
|---|---|
| Reference audio quality | High — garbage in, garbage out |
| Reference audio length | 1–10 minutes typically sufficient |
| Source-target similarity | Closer voices convert better |
| Pitch range match | Extreme range changes degrade quality |
| Language match | Same language works better |
| Singing vs. speech | Models trained on singing needed for singing |

## Vocal Quality in AI Music Generation

### What Makes AI Vocals Sound Good

1. **Intelligibility**: words are clearly understandable
2. **Natural prosody**: rhythm and emphasis feel human
3. **Pitch accuracy**: notes are on pitch (or expressively off-pitch)
4. **Timbre consistency**: voice sounds like the same person throughout
5. **Expressiveness**: dynamic variation, vibrato, breathiness
6. **Absence of artifacts**: no glitches, clicks, or unnatural timbres

### Common AI Vocal Issues

| Issue | Cause | Mitigation |
|---|---|---|
| Mumbled lyrics | Weak text-audio alignment | Simplify lyrics, use clearer phonemes |
| Pitch drift | Poor F0 conditioning | Specify melody constraints if possible |
| Robotic timbre | Vocoder artifacts | Post-process with saturation, EQ |
| Voice changes mid-song | Inconsistent embeddings | Generate shorter segments |
| Unnatural vibrato | Learned average vibrato pattern | Accept or post-process with pitch tools |
| Breath artifacts | Missing or excessive breath modeling | Manual editing |

## Working with AI Vocals as a Producer

### Post-Processing Chain for AI Vocals

```
AI Vocal Output
    │
    ▼
De-noise (remove background artifacts)
    │
    ▼
Pitch Correction (if needed)
    │
    ▼
Timing Alignment (if needed)
    │
    ▼
EQ (presence boost 2-5 kHz, cut mud 200-400 Hz)
    │
    ▼
Compression (smooth dynamics)
    │
    ▼
De-essing (tame sibilance 4-8 kHz)
    │
    ▼
Reverb / Delay (spatial context)
    │
    ▼
Final Level Setting
```

### Layering AI Vocals

- **Double tracking**: generate the same lyrics multiple times, layer with slight pan offset
- **Harmonies**: generate at different pitch targets or use pitch-shifting
- **Ad-libs**: generate shorter vocal fragments with different prompts
- **Whisper layers**: subtle whispered doubles add intimacy

### Prompt Tips for Better AI Vocals

| Prompt Element | Effect |
|---|---|
| "Female vocal" / "Male vocal" | Basic voice type |
| "Breathy vocal" | Airy, intimate quality |
| "Powerful belt vocal" | High energy, full voice |
| "Falsetto" | High, light vocal register |
| "Vocal harmonies" | Background harmony layers |
| "Vocal chops" | Processed, rhythmic vocal fragments |
| "Rap vocal" | Spoken/rhythmic delivery |
| "Whispered vocal" | Intimate, ASMR-like |

## Ethical Considerations

Voice cloning raises significant ethical issues:

- **Consent**: cloning a real person's voice without permission
- **Deepfakes**: creating fake recordings attributed to real people
- **Copyright**: vocal performances as intellectual property
- **Transparency**: disclosing AI-generated vocals

See [Responsible Use](../ethics-legal/responsible-use.md) for detailed guidance.

Many platforms now include voice detection watermarks and require consent documentation for voice cloning.
