---
sidebar_position: 4
title: Controllable Generation
---

# Controllable Generation

Controllable generation enables fine-grained steering of AI music output beyond simple text prompts. This page covers the techniques that give users precise control over musical attributes like pitch, dynamics, timing, and style.

## The Control Spectrum

Control methods range from coarse to fine-grained:

```
Coarse ◀────────────────────────────────────────▶ Fine

Text prompt → Style transfer → Audio conditioning → MIDI input → Per-frame controls
```

| Control Level | Example | Precision |
|---|---|---|
| Text prompt | "upbeat jazz" | Low |
| Reference audio | "like this song" | Medium |
| Melody conditioning | Hum + generate | Medium-high |
| Chord conditioning | I-V-vi-IV | High |
| MIDI control | Note-by-note | Very high |
| Frame-level control | Energy, pitch per frame | Maximum |

## Text-Based Control

### Prompt Engineering

The baseline control method. Quality depends on:

- Vocabulary alignment with training data
- Specificity of descriptors
- Consistency of prompt elements

See the [Prompt Engineering Guide](../suno-prompting-guide.md) and [Genre-Specific Prompting](../producer-handbook/genre-specific-prompting.md) for detailed strategies.

### Classifier-Free Guidance (CFG)

Control the strength of text conditioning during inference:

$$
\hat{\epsilon} = (1 + w) \epsilon_\theta(x_t, t, c) - w \cdot \epsilon_\theta(x_t, t, \varnothing)
$$

| Guidance Scale $w$ | Effect |
|---|---|
| 0 | Unconditioned (ignores prompt) |
| 1–3 | Balanced (natural, diverse) |
| 5–7 | Strong adherence (less diverse) |
| 10+ | Very literal (may reduce quality) |

### Negative Prompts

Specify what to avoid:

$$
\hat{\epsilon} = \epsilon_\theta(x_t, t, c_{\text{pos}}) + w \cdot (\epsilon_\theta(x_t, t, c_{\text{pos}}) - \epsilon_\theta(x_t, t, c_{\text{neg}}))
$$

Example: "jazz piano trio" (positive) + "electronic, synthesizer, drums" (negative) steers away from unwanted elements.

## Audio Conditioning

### Style Transfer

Use a reference audio clip to guide the generation:

$$
\mathbf{c}_{\text{style}} = E_{\text{audio}}(x_{\text{ref}})
$$

The style embedding captures timbre, production quality, and overall aesthetic without copying specific notes.

### Melody Conditioning

Provide a melody (humming, whistling, or MIDI) that the model follows:

$$
\mathbf{c}_{\text{melody}} = \text{Chroma}(x_{\text{melody}}) \in \mathbb{R}^{12 \times T}
$$

The chromagram captures pitch class over time, allowing the model to match the melody while generating its own arrangement.

MusicGen-Melody uses this approach with a reference audio input.

### Audio Inpainting

Regenerate only specific time segments while keeping the rest:

$$
x_{\text{output}} = m \odot x_{\text{original}} + (1-m) \odot G_\theta(\text{noise}, c)
$$

where $m$ is a binary mask indicating which regions to keep.

In diffusion models, inpainting is natural:
1. Add noise only to the masked region
2. Denoise while conditioning on unmasked context
3. Blend at boundaries

### Audio-to-Audio Translation

Transform existing audio while preserving structure:

$$
x_{\text{out}} = G_\theta(x_{\text{in}}, c_{\text{style}})
$$

- Input: piano recording → Output: orchestral arrangement
- Input: rough demo → Output: polished production
- Input: electronic track → Output: acoustic version

## Structural Control

### Section Tags

Explicit structural markers in prompts:

```
[Intro] ambient pad, gentle piano
[Verse] add drums, bass enters, vocal melody
[Chorus] full energy, all instruments, anthemic
[Bridge] stripped back, just piano and vocal
[Outro] gradual fade, reverb tails
```

### Temporal Conditioning

Provide per-section control signals:

$$
\mathbf{c}(t) = \text{Interp}(\mathbf{c}_1, \mathbf{c}_2; t) \quad \text{for } t \in [t_1, t_2]
$$

This allows smooth transitions between different conditioning states.

### Energy Curves

Specify an energy trajectory:

```
Energy
│     ╱‾‾╲      ╱‾‾‾╲
│    ╱    ╲    ╱     ╲
│   ╱      ╲  ╱       ╲
│  ╱        ╲╱         ╲___
└──────────────────────────── Time
  intro  build drop break drop  outro
```

Map to a numerical signal that conditions the model frame-by-frame.

## Musical Attribute Control

### Pitch / Key Control

Force generation into a specific key:

$$
\mathbf{c}_{\text{key}} = \text{one\_hot}(\text{key}) \in \{0,1\}^{24}
$$

(12 pitch classes × 2 for major/minor)

### Tempo Control

Condition on exact BPM:

$$
\mathbf{c}_{\text{tempo}} = \text{embed}(BPM) \in \mathbb{R}^{d}
$$

Some models support smooth tempo changes within a generation.

### Instrument Control

Specify which instruments should be present:

$$
\mathbf{c}_{\text{inst}} = \sum_{i \in \text{active}} \text{embed}(i)
$$

Or use multi-hot encoding over an instrument vocabulary.

### Dynamics Control

Per-frame loudness conditioning:

$$
L(t) = \text{target\_loudness}(t) \quad \text{LUFS}
$$

Allows specifying crescendos, drops, and dynamic arcs precisely.

## MIDI-Level Control

### MIDI-Conditioned Generation

Provide a MIDI file as input, generate audio output:

$$
x = G_\theta(\text{MIDI}, c_{\text{style}})
$$

This gives note-level control (pitch, timing, velocity) while the model handles:
- Timbre (instrument sounds)
- Production (effects, spatial positioning)
- Expression (micro-timing, dynamics beyond MIDI velocity)

### Advantages

- Exact pitch and rhythm control
- Full arrangement control
- Combine with style conditioning for versatile output

### Challenges

- Requires MIDI input (not always available)
- Expressiveness limited by MIDI representation
- Model must generalize across MIDI → audio mapping

## Latent Space Manipulation

### Direct Latent Editing

Modify specific dimensions of the latent representation:

$$
\mathbf{z}' = \mathbf{z} + \alpha \cdot \mathbf{d}_{\text{attribute}}
$$

where $\mathbf{d}_{\text{attribute}}$ is a direction in latent space corresponding to a musical attribute.

Finding directions:
- **Linear probes**: train a linear classifier on labeled data
- **Contrastive pairs**: compute the difference between "with" and "without" attribute
- **PCA of attribute subspace**: find the principal direction of variation

### Interpolation for Smooth Transitions

Blend between two musical states:

$$
\mathbf{z}(t) = \text{slerp}(\mathbf{z}_A, \mathbf{z}_B; t)
$$

Useful for:
- Crossfading between styles
- Gradual tempo/energy changes
- Morphing between instruments

## Control in Practice

### Building a Control Interface

Effective control UIs for music generation:

| Control | UI Element | Mapping |
|---|---|---|
| Genre | Dropdown / tags | Text embedding |
| BPM | Slider (60–200) | Tempo conditioning |
| Energy | Curve editor | Frame-level energy |
| Key | Dropdown (C Major, etc.) | Key embedding |
| Instruments | Checkboxes | Multi-hot / text |
| Duration | Slider (5–300s) | Duration conditioning |
| Guidance | Slider (1–15) | CFG scale |
| Structure | Section editor | Temporal segmented prompts |

### Control Hierarchy

For best results, layer controls from coarse to fine:

1. **Genre and style** (text prompt) — broadest
2. **Tempo and key** (numerical) — structural constraints
3. **Instruments** (text/selection) — sonic palette
4. **Structure** (section tags) — arrangement
5. **Energy curve** (per-frame) — dynamics
6. **Melody/MIDI** (note-level) — pitch content

Coarser controls should be set first; fine-grained controls refine within the space defined by coarser ones.
