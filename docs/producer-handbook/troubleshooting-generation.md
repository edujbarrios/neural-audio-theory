---
sidebar_position: 2
title: Troubleshooting Generation
---

# Troubleshooting AI Music Generation

Use this quick diagnostic page when outputs are weak or inconsistent.

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

