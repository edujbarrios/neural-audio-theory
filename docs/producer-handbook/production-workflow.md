---
sidebar_position: 1
title: Production Workflow
---

# AI Music Production Workflow (Producer Handbook)

This page turns the technical concepts into a practical workflow for music producers who want repeatable AI-assisted results.

## 1) Define the Track Brief

Before prompting, lock these constraints:

- **Goal**: demo, social snippet, full release, sync cue
- **Genre and reference zone**: e.g., melodic techno with cinematic pads
- **Target BPM and energy curve**: where tension should rise/fall
- **Arrangement target**: intro, build, drop, breakdown, outro

Short briefs reduce random outputs and speed up iteration.

## 2) Build a Structured Prompt

Use an ordered prompt template:

1. Genre / subgenre
2. BPM and groove
3. Core instrumentation
4. Song structure
5. Mix/texture direction

Example structure (adapt to your style):

`Melodic techno, 126 BPM, analog bass, airy vocal textures, intro -> build -> drop -> breakdown -> outro, dark wide mix, short plate reverb`

## 3) Generate in Small Batches

- Run **2–4 generations** per prompt revision
- Keep only the strongest candidate each round
- Change **one variable at a time** (BPM, structure, texture, or instrumentation)

This keeps comparisons valid and helps you learn what each change actually does.

### Use a Selection Gate

Before promoting a candidate into production, check it against the same brief used to generate it:

- The main musical idea is memorable and supports the intended use
- Tempo and groove remain stable
- Required sections are present and clearly differentiated
- Lead elements are usable without major reconstruction
- No artifact repeatedly distracts from the performance

Reject candidates that fail a core musical requirement. Keep fixable mix or transition issues as production notes instead of restarting generation automatically.

## 4) Curate and Edit Like a Producer

After selecting a candidate:

- Trim weak intro/outro bars
- Layer additional drums or bass for impact
- Fix transitions with risers, fills, or automation
- Rebalance tonal density between sections

Treat AI output as raw material, not a final master.

## 5) Pre-Mix and Final Mix Checks

Use a simple quality checklist:

- **Low-end clarity**: kick and bass are not masking each other
- **Vocal/intended lead focus**: lead element stays readable
- **Section contrast**: drop feels bigger than build
- **Stereo discipline**: mono-compatible low frequencies
- **Headroom**: avoid clipping and leave mastering space

## 6) Export and Version Control

Save each approved step with clear naming:

- `trackname_v01_promptA`
- `trackname_v02_promptA_structureFix`
- `trackname_v03_mixPrep`

Document prompt changes so you can reproduce successful directions.

For each approved version, save a compact record:

```text
Source: service/model and version
Prompt: full prompt text
Settings: seed, duration, and other exposed controls
Decision: why this candidate was selected
Edits: trims, layers, processing, and replacements
Rights: account, license, and source-material notes
```

This record connects the generated source to the edited session and makes later revisions, credits, and rights review much easier.

## 7) Prepare the Handoff

Export files that let the next stage begin without reopening the creative session:

- A full-resolution stereo mix at the session sample rate
- Consolidated stems that all begin at the same timestamp
- A reference mix showing the intended balance and processing
- Tempo, meter, key, and arrangement notes
- A text file containing the version record and open issues

Use lossless audio for production handoffs. Reserve compressed formats for quick review copies unless the recipient requests otherwise.

## Final Delivery Checklist

Before calling the version complete:

- [ ] File names identify the track, version, and content
- [ ] Exports start and end cleanly, with reverb tails intact
- [ ] Sample rate and bit depth match the delivery specification
- [ ] Stems line up when imported into an empty session
- [ ] The reference mix does not clip
- [ ] Credits and source-material notes are current
- [ ] Listening checks pass on headphones, monitors, and a small speaker
- [ ] The approved prompt and generation settings are archived

Store the project record beside the audio deliverables so the musical and provenance history travel together.

Use the dedicated [Quality Control and Delivery](./quality-control-and-delivery.md) workflow to validate rendered files, stems, metadata, checksums, and AI-specific risks before handoff.
