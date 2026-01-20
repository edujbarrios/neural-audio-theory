---
sidebar_position: 4
title: Mixing AI Outputs
---

# Mixing and Post-Processing AI Music Outputs

AI-generated music is raw material, not a finished product. This guide covers the essential mixing and post-processing techniques to bring AI outputs to release quality.

## Why Post-Processing Is Necessary

AI generators produce audio that is often:
- Slightly muddy in the low-mid range
- Lacking dynamic contrast between sections
- Missing the final polish that makes music sound "professional"
- Inconsistent in loudness between generations
- Over-compressed or under-compressed

Even the best AI outputs benefit from the same mixing attention that any raw recording would receive.

## Essential Processing Chain

### 1. Import and Assessment

Before touching any controls:

1. **Listen through** the entire output without making changes
2. **Identify problems**: muddiness, harsh frequencies, weak bass, timing issues
3. **Note strengths**: what the AI got right — preserve these
4. **Plan**: decide what needs fixing vs. what needs enhancing

### 2. Gain Staging

Set proper levels before any processing:

- Normalize to a reasonable peak level (-6 to -3 dBFS peak)
- This provides headroom for subsequent processing
- AI outputs sometimes have inconsistent peak levels

### 3. EQ (Equalization)

The most important tool for shaping AI audio.

**Common fixes for AI-generated music:**

| Problem | EQ Fix |
|---|---|
| Muddy low-mids | Cut 2–4 dB around 200–400 Hz |
| Harsh/brittle highs | Gentle cut around 3–5 kHz |
| Thin/weak feel | Slight boost at 100–200 Hz |
| Lacks air/sparkle | Shelf boost above 10 kHz |
| Boomy bass | High-pass filter at 30–40 Hz |
| Boxy midrange | Narrow cut at 400–800 Hz |

**Approach**: subtractive EQ first (remove problems), then additive (enhance character).

### 4. Dynamic Processing

#### Compression

Control dynamic range and add punch:

- **Gentle bus compression**: 2:1 ratio, slow attack, auto release, 1–3 dB gain reduction
- **Parallel compression**: blend heavily compressed version with original for energy without squashing
- **Multiband compression**: tame only the problematic frequency range

| Parameter | Setting for AI Music |
|---|---|
| Ratio | 2:1 to 4:1 |
| Attack | 10–30 ms (preserve transients) |
| Release | Auto or 100–200 ms |
| Threshold | Aim for 2–4 dB reduction |

#### Limiting

For final loudness:

- True peak limiter on the master bus
- Target -1 dBTP (true peak) or lower
- Aim for -14 LUFS for streaming platforms (Spotify, Apple Music)
- Don't over-limit — AI audio already has limited dynamic range

### 5. Stereo Processing

AI-generated stereo may have issues:

- **Mono compatibility check**: fold to mono and listen for phase cancellation
- **Stereo width**: gently widen with mid-side EQ or stereo enhancer
- **Bass mono**: ensure low frequencies (below ~150 Hz) are centered
- **Panning**: AI panning may be unbalanced — correct obvious issues

### 6. Reverb and Space

AI outputs often have built-in reverb that may be too much or too little:

- **If too much reverb**: you can't easily remove it, but EQ can reduce the effect
- **If too dry**: add room or plate reverb to taste
- **Send vs. insert**: use send for controlled reverb levels
- **Pre-delay**: 20–40 ms keeps vocals/leads from being washed out

### 7. Saturation and Warmth

Add analog character to digital-sounding AI output:

- **Tape saturation**: gentle warmth, slight high-frequency rolloff
- **Tube saturation**: adds even harmonics, musical coloring
- **Subtle amounts**: 10–20% wet, avoid obvious distortion

## Section-by-Section Processing

Different sections may need different treatment:

| Section | Common Needs |
|---|---|
| Intro | Reduce level slightly, roll off bass |
| Verse | Keep dynamics, less compression |
| Chorus | Boost energy, wider stereo, slightly louder |
| Drop | Maximum impact, full frequency range |
| Bridge | Different character, maybe narrower |
| Outro | Fade, roll off highs gradually |

Use automation to vary processing intensity across sections.

## Fixing Common AI Artifacts

### Metallic / Robotic Timbre

Caused by codec quantization or vocoder artifacts:
- Gentle cut around 2–4 kHz
- Add subtle saturation to mask metallic quality
- Light reverb smooths sharp edges

### Inconsistent Bass

AI bass can wander in level and pitch:
- Multiband compression on low end (20–200 Hz)
- Side-chain compress bass to kick if both present
- High-pass at 30 Hz to remove sub-rumble

### Vocal Artifacts

AI vocals may have glitches, pitch issues, or unnatural moments:
- Use a de-esser on harsh sibilance (4–8 kHz)
- Pitch correction (Melodyne, Auto-Tune) for wayward notes
- Edit out obvious glitches manually

### Noise Floor

Some AI outputs have a subtle background noise:
- Spectral denoising (iZotope RX, Audacity noise reduction)
- High-pass filter removes low-frequency rumble
- Gate can clean up gaps between sections

## Loudness Standards

| Platform | Target LUFS | True Peak |
|---|---|---|
| Spotify | -14 LUFS | -1 dBTP |
| Apple Music | -16 LUFS | -1 dBTP |
| YouTube | -14 LUFS | -1 dBTP |
| Broadcast (EBU) | -23 LUFS | -1 dBTP |
| Club / DJ play | -8 to -6 LUFS | -0.3 dBTP |

## Quick Quality Checklist

Before exporting your final mix:

- [ ] No clipping or distortion
- [ ] Bass is tight and controlled
- [ ] Vocals/lead are clear and present
- [ ] Stereo image is balanced and mono-compatible
- [ ] Sections have appropriate energy contrast
- [ ] Overall loudness meets target platform
- [ ] No obvious AI artifacts remain
- [ ] Beginning and end are clean (no abrupt cuts)
- [ ] Format is correct (WAV 44.1/48 kHz, 24-bit for masters)

## Recommended Signal Chain

```
AI Output
  │
  ▼
High-Pass Filter (30 Hz)
  │
  ▼
Subtractive EQ (problem frequencies)
  │
  ▼
Compression (gentle, 2–3 dB GR)
  │
  ▼
Additive EQ (character enhancement)
  │
  ▼
Saturation (subtle warmth)
  │
  ▼
Stereo Processing (if needed)
  │
  ▼
Reverb / Spatial (send)
  │
  ▼
Limiter (-14 LUFS, -1 dBTP)
  │
  ▼
Final Export
```
