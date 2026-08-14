---
title: Quality Control and Delivery
---

# Quality Control and Delivery

Quality control is the final attempt to find objective defects before listeners do. It is separate from creative approval: a track can be artistically finished while still containing clipped samples, a broken export, missing tails, incorrect metadata, or a stem that does not line up.

## Freeze the delivery specification

Write the destination requirements before exporting:

| Requirement | Example decision |
| --- | --- |
| deliverables | stereo master, instrumental, clean version, aligned stems |
| sample format | WAV or another requested lossless container |
| sample rate | match the label, distributor, game, film, or client specification |
| bit depth | preserve the mix/master session precision required by the recipient |
| channel layout | mono, stereo, or declared multichannel order |
| start and end | exact timeline start, count-in policy, and complete effect tails |
| loudness | destination-specific target or unconstrained master |
| metadata | title, version, writers, performers, identifiers, and AI-use disclosure where required |

Do not choose a universal streaming loudness number and master every release to it. Playback services may normalize, change policies, or use different measurement and album rules. Deliver to the actual specification and preserve an unconstrained archival master when appropriate.

## Export from a controlled session

Before rendering:

1. Disable unintended solo, mute, loop, and monitoring states.
2. Confirm the intended mix revision and automation pass.
3. Check whether random or analog-modeled processors produce nondeterministic renders.
4. Include reverb and delay tails without adding unnecessary silence.
5. Bypass monitor-only room correction, headphone correction, and loudness matching.
6. Render offline only if every plug-in supports it reliably; otherwise use a real-time export.

Keep the project sample rate through production. Apply sample-rate conversion once, with a known high-quality converter, when the delivery format requires it. Add dither only when reducing fixed-point bit depth, and do it once at the final quantization stage.

## Measure the rendered file

Analyze the export itself, not only the live session output.

- **sample peak:** catches samples at or beyond digital full scale;
- **true peak:** estimates peaks that can appear between samples during reconstruction or lossy encoding;
- **integrated and short-term loudness:** describes level over the program and within sections;
- **loudness range or dynamics:** helps detect an accidentally flattened or unusually variable render;
- **DC offset:** reveals asymmetric bias that wastes headroom;
- **silence and dropout detection:** catches truncated, missing, or failed sections;
- **duration and channel count:** catches wrong export ranges and mono/stereo mistakes.

Meters are diagnostics, not taste. A value outside a common range may be intentional; a value that contradicts the delivery contract is a defect.

## Listen in passes

One distracted listen is not quality control. Use separate passes with explicit goals:

### Technical pass

Listen at a moderate fixed level for clicks, discontinuities, clipping, codec warble, spectral holes, unstable imaging, unexpected noise, and damaged transients. Mark timestamps instead of fixing while listening.

### Musical pass

Check lyric intelligibility, timing, tuning, section order, transitions, repeated-generation seams, and whether edits changed the intended groove or emotional arc.

### Translation pass

Compare on a trusted full-range system, headphones, a small mono speaker, and quiet playback. The goal is not identical sound everywhere; it is preservation of the lead, groove, balance, and absence of new defects.

### Start/end pass

Audition the first and last seconds at elevated monitoring gain. Look for truncated breaths, clicks, excessive pre-roll, cut reverb tails, and noise that becomes obvious as the music fades.

Protect hearing and calibrate monitoring sensibly. Louder playback can make a version seem better without revealing whether it is better.

## Stem validation

All stems must share the same start time, duration, sample rate, bit depth, and channel layout. Import them into a blank session at unity gain and verify:

- the files align without manual nudging;
- their sum matches the intended stem-print reference within expected differences;
- master-bus processing has been included or excluded according to the handoff specification;
- side-chain-dependent processing still behaves as intended;
- no stem contains another stem by accident;
- empty leading regions are preserved when alignment requires them.

A perfect null is not always possible when processors are nonlinear, random, oversampled, or rendered in separate passes. Document the reason rather than claiming sample-identical reconstruction.

## AI-specific checks

- Scan vocal and lead passages for malformed syllables, identity drift, and abrupt timbral changes.
- Inspect extension and inpainting boundaries both in context and soloed.
- Confirm that separated stems do not introduce unacceptable bleed, musical-noise artifacts, or missing transients.
- Compare suspicious melodies, lyrics, and recordings against known source material when similarity risk is material.
- Preserve the provider/model label, prompt or request record, edit history, terms review date, and downloaded-source hash.
- Confirm consent and authorization for every uploaded reference, cloned voice, lyric, and performance.

## Package the delivery

Use predictable names such as:

```text
Artist_Title_Master_v07_24b_48k.wav
Artist_Title_Instrumental_v07_24b_48k.wav
Artist_Title_Stems_v07/
Artist_Title_DeliveryNotes_v07.txt
```

Generate a checksum manifest for material handoffs so the recipient can detect incomplete or altered transfers. The notes should state the approved version, formats, known limitations, credits, contact, and any non-obvious synchronization or master-bus decisions.

## Sign-off checklist

- [ ] Delivery requirements are written and satisfied.
- [ ] Exported files were measured and listened to from start to finish.
- [ ] No unintended clipping, dropouts, truncation, or channel errors remain.
- [ ] Stems align in a blank session and follow the processing specification.
- [ ] Compressed review copies were auditioned separately from lossless masters.
- [ ] Credits, rights, consent, and AI-use records are complete.
- [ ] File names, metadata, version numbers, and checksums agree.
- [ ] The project, source renders, final masters, and provenance record are archived in at least two locations.

Return to the [Production Workflow](./production-workflow.md), or review [Mixing AI Outputs](./mixing-ai-outputs.md) before final export.
