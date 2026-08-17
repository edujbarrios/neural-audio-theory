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

## Symptom: Vocals are unclear or unnatural

Likely causes:

- The requested range or delivery conflicts with the style
- Lyrics contain awkward stress patterns or crowded syllables
- Vocal and accompaniment descriptors compete for focus

Fix:

- Specify a comfortable register and a single delivery style
- Shorten dense lines and read them aloud to check their rhythm
- Reduce competing lead instruments and request space around the vocal

## Symptom: Transitions feel abrupt

Likely causes:

- Sections are named but their relationship is not described
- Energy changes without a transition cue
- Too many sections are compressed into a short duration

Fix:

- Describe the transition: drum fill, riser, held chord, or brief pause
- State the energy change between adjacent sections
- Simplify the arrangement or allow more time for each section

## Fast Recovery Loop

When a generation misses the target:

1. Keep what worked
2. Change one prompt variable
3. Generate 2–4 candidates
4. Compare against last best version
5. Repeat until direction is stable

Record each attempt in a small comparison table instead of relying on memory:

| Attempt | Single change | Candidates | Best result | Decision |
| --- | --- | ---: | --- | --- |
| Baseline | Original prompt | 4 | Candidate B | Keep as reference |
| A | Reduce instrument count | 4 | Candidate A | Clearer mix; promote |
| B | Add transition cue | 4 | Candidate D | Better transition; promote |

Stop the loop when one of these conditions is true:

- the candidate meets the track brief and can move to production;
- two controlled attempts fail to improve the same symptom, suggesting the model or source material is the constraint;
- the remaining issue is cheaper and more predictable to fix in the DAW;
- the next attempt would exceed the time, credit, or review budget.

## Know When to Regenerate or Edit

Regenerate when the failure affects the composition: the wrong groove, missing section, unsuitable melody, or genre drift. Edit the selected audio when the musical idea works but needs trimming, level changes, transition effects, stem balancing, or other production polish.

Repeatedly prompting for a mix fix can discard a strong performance. Conversely, detailed editing rarely rescues a candidate whose core rhythm or structure misses the brief.

## Capture a Useful Bug Report

When a failure is repeatable, save enough context for another person—or your future self—to reproduce it:

- Model or service version, when available
- Full prompt and negative prompt
- Seed, duration, and generation settings
- Expected behavior and actual behavior
- Timestamp or candidate identifier
- A short audio excerpt that demonstrates the problem

Avoid reporting only that an output “sounds bad.” Name the audible event and its location, such as `vocal consonants smear at 00:42` or `tempo shifts during the second chorus`.
