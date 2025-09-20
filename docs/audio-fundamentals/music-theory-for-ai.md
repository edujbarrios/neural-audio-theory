---
sidebar_position: 3
title: Music Theory for AI
---

# Music Theory for AI

AI music systems learn implicit music theory from training data. Understanding the fundamentals helps explain why certain prompts work, what the model has likely internalized, and where current systems still struggle.

## Pitch and the Chromatic Scale

Western music divides the octave into 12 semitones. The frequency relationship between semitone $n$ and a reference pitch $f_{\text{ref}}$ (usually A4 = 440 Hz) is:

$$
f(n) = f_{\text{ref}} \cdot 2^{n/12}
$$

This exponential relationship means that pitch is fundamentally a logarithmic dimension — which is why log-frequency representations (mel, CQT) are more natural for music than linear frequency.

## Intervals

An interval is the distance between two pitches, measured in semitones:

| Semitones | Name | Sound Character |
|---|---|---|
| 0 | Unison | Identity |
| 1 | Minor 2nd | Tense, dissonant |
| 2 | Major 2nd | Stepping motion |
| 3 | Minor 3rd | Sad, dark |
| 4 | Major 3rd | Bright, happy |
| 5 | Perfect 4th | Open, suspended |
| 7 | Perfect 5th | Strong, stable |
| 12 | Octave | Same note class |

AI models encode interval relationships implicitly. When a model generates a chord progression, it is navigating learned distributions over interval patterns.

## Scales and Keys

A **scale** is a subset of pitches from the chromatic set. The two most fundamental:

- **Major scale**: W-W-H-W-W-W-H (W = whole step, H = half step)
- **Minor scale (natural)**: W-H-W-W-H-W-W

A **key** specifies both a root note and a scale, establishing a tonal center. Most popular music operates within a single key or moves between closely related keys.

### Key Signatures in AI Context

AI music generators have learned strong priors for key consistency. Prompts that specify mood (happy, dark, melancholic) implicitly bias toward major or minor tonality. Models rarely generate truly atonal music unless the training data includes significant atonal material.

## Chords and Harmony

A **chord** is three or more notes sounded simultaneously:

| Chord Type | Intervals (semitones from root) | Feel |
|---|---|---|
| Major triad | 0, 4, 7 | Bright, resolved |
| Minor triad | 0, 3, 7 | Dark, emotional |
| Diminished | 0, 3, 6 | Tense, unstable |
| Augmented | 0, 4, 8 | Mysterious, unresolved |
| Dominant 7th | 0, 4, 7, 10 | Bluesy, wants to resolve |
| Major 7th | 0, 4, 7, 11 | Jazzy, smooth |
| Minor 7th | 0, 3, 7, 10 | Warm, mellow |

### Chord Progressions

Common progressions appear frequently in training data and are strongly encoded in models:

- **I–V–vi–IV** (Pop: C–G–Am–F) — the most common pop progression
- **ii–V–I** (Jazz standard cadence)
- **I–vi–IV–V** (Classic doo-wop / 50s progression)
- **i–bVII–bVI–V** (Andalusian cadence, flamenco/metal)
- **I–IV–V–I** (Blues/rock foundation)

Models with text-to-music training have absorbed these patterns deeply. Prompt cues like "jazz," "pop," or "blues" activate corresponding harmonic priors.

## Rhythm and Meter

### Time Signatures

- **4/4**: four beats per measure — overwhelmingly dominant in popular music and AI training data
- **3/4**: waltz time
- **6/8**: compound duple, common in ballads
- **5/4, 7/8**: odd meters, rare in AI music output due to training data bias

### Rhythmic Subdivisions

$$
\text{Beat duration} = \frac{60}{BPM} \;\text{seconds}
$$

| Subdivision | Relationship |
|---|---|
| Quarter note | 1 beat |
| Eighth note | 1/2 beat |
| Sixteenth note | 1/4 beat |
| Triplet | 1/3 of a beat |

### Groove and Swing

**Swing** shifts every other subdivision away from the grid:

$$
t_{\text{swung}} = t_{\text{grid}} + \delta \cdot \text{swing\_ratio}
$$

AI models learn groove from training data. Specifying "swung," "syncopated," or "straight" in prompts can influence rhythmic feel, though control precision varies.

## Song Structure

Most Western popular music follows sectional forms:

| Section | Typical Function |
|---|---|
| Intro | Establish mood, introduce elements |
| Verse | Tell the story, lower energy |
| Pre-chorus | Build tension toward chorus |
| Chorus | Hook, highest energy, main melody |
| Bridge | Contrast, new harmonic area |
| Drop | Peak energy (EDM-specific) |
| Breakdown | Stripped-back, tension builder |
| Outro | Wind down, resolve |

AI models have learned these structural conventions. Explicit structure tags in prompts (e.g., `intro → verse → chorus → bridge → chorus → outro`) help guide the generation trajectory.

## Dynamics and Expression

Dynamic markings indicate loudness levels:

| Marking | Level |
|---|---|
| pp (pianissimo) | Very soft |
| p (piano) | Soft |
| mp (mezzo-piano) | Moderately soft |
| mf (mezzo-forte) | Moderately loud |
| f (forte) | Loud |
| ff (fortissimo) | Very loud |

**Crescendo** (gradually louder) and **decrescendo** (gradually softer) create energy arcs. AI models learn dynamic curves from training data, with builds and drops being particularly well-represented in EDM-heavy datasets.

## Timbre and Orchestration

Timbre — the "color" of a sound — is determined by:

1. **Harmonic content**: overtone distribution
2. **Spectral envelope**: amplitude shape across frequencies
3. **Temporal envelope**: ADSR (Attack, Decay, Sustain, Release)
4. **Noise components**: breath, bow noise, pick attack

AI models encode timbre in embedding space, allowing prompts to specify instruments and production characteristics. The specificity of timbre control depends on how well-represented an instrument is in training data.

## Why This Matters for AI Music

| Music Theory Concept | How AI Models Use It |
|---|---|
| Pitch / intervals | Encoded in spectral representations |
| Scales / keys | Implicit statistical prior from training |
| Chord progressions | Sequence patterns in latent trajectories |
| Rhythm / meter | Temporal structure in token sequences |
| Song structure | State transitions during generation |
| Dynamics | Energy envelope in latent space |
| Timbre | Embedding clusters for instruments |

Understanding music theory helps you write better prompts, diagnose generation problems, and interpret model behavior.
