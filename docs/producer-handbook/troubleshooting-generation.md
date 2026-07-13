---
sidebar_position: 2
title: Troubleshooting Generation
---

# Troubleshooting AI Music Generation

Use this quick diagnostic page when outputs are weak or inconsistent.

## Diagnose Before Rewriting

Change the smallest part of the prompt that can explain the failure. Start with the symptom, identify the constraint most likely responsible, and keep everything else fixed for the next batch.

| Symptom | First variable to test | Keep fixed |
| --- | --- | --- |
| Style drifts | Genre and era language | BPM, structure, instrumentation |
| Groove feels wrong | BPM and rhythmic feel | Genre, arrangement, mix terms |
| Sections blur together | Arrangement and contrast cues | Tempo, core instruments |
| Mix is crowded | Instrument count and ambience | Structure, groove |
| Mood is inconsistent | Emotional and dynamic language | Tempo, arrangement |

If the first variable does not improve the output, restore the baseline before testing another. Otherwise, several simultaneous edits can hide which instruction caused the change.

## Symptom: Results feel random every generation

Likely causes:

- Prompt is too vague
- Too many conflicting descriptors
- No structure tags

Fix:

- Add exact genre + BPM
- Remove contradictory tags (e.g., “minimal” and “maximal wall of sound”)
- Include section flow: `intro -> verse -> chorus -> outro`

## Symptom: Groove is wrong

Likely causes:

- BPM omitted
- Rhythm language too generic

Fix:

- State BPM explicitly
- Add groove terms: syncopated, half-time, straight 4/4, swung hats
- Add genre-specific drum hints (e.g., breakbeat, four-on-the-floor)

## Symptom: Mix sounds muddy

Likely causes:

- Overcrowded instrumentation
- Too much low-mid content
- Excess ambience descriptors

Fix:

- Reduce simultaneous layers in prompt
- Ask for cleaner arrangement and tighter low end
- Use controlled ambience terms (short plate, subtle hall, dry drums)

## Symptom: No clear song structure

Likely causes:

- Prompt only describes mood and timbre
- Missing arrangement cues

Fix:

- Add structural landmarks: intro, build, drop, breakdown, outro
- Specify section contrast goals (e.g., sparse verse, full chorus)

## Symptom: Output lacks emotional direction

Likely causes:

- Prompt gives technical tags but no emotional target

Fix:

- Add mood terms that align with the genre
- Anchor emotion to instrumentation and dynamics
- Keep emotional language consistent across sections

## Fast Recovery Loop

When a generation misses the target:

1. Keep what worked
2. Change one prompt variable
3. Generate 2–4 candidates
4. Compare against last best version
5. Repeat until direction is stable

## Know When to Regenerate or Edit

Regenerate when the failure affects the composition: the wrong groove, missing section, unsuitable melody, or genre drift. Edit the selected audio when the musical idea works but needs trimming, level changes, transition effects, stem balancing, or other production polish.

Repeatedly prompting for a mix fix can discard a strong performance. Conversely, detailed editing rarely rescues a candidate whose core rhythm or structure misses the brief.
