---
title: Mix Preparation and Diagnostics
---

# Mix Preparation and Diagnostics

A practical engineering workflow for AI-assisted productions, separated stems and conventional recordings. **Every value below is a listening starting point—not a signature that makes AI audio unrecognizable or a universal mix recipe.**

## 1. Establish a reproducible session

- Keep the **native sample rate** of the supplied source unless the destination requires conversion.
- Confirm a shared timeline, channel order and duration for every stem. Import at unity and check synchronization.
- Retain unprocessed source copies and an A/B reference with **matched perceived loudness**.
- Set the listening level before evaluating tonal balance. A louder signal often appears more detailed even when it is not.
- Use clip gain to avoid overloading nonlinear plugins. There is no universal `-6 dBFS` or `-18 dBFS` requirement for a floating-point DAW; manufacturer calibration and downstream headroom determine useful levels.
- Keep a timecoded issue log: *time / symptom / hypothesis / test / result*.

## 2. Diagnose the cause, not only the frequency

| Audible observation | Test before turning a knob | Candidate corrective action |
| --- | --- | --- |
| Low-mid muddiness | Solo kick/bass, examine arrangement, room and reverb returns | High-pass only nonessential sub-energy; use a broad, small cut where masking is audible |
| Harsh consonants or cymbals | Compare at low monitoring volume; check codec or source distortion | Dynamic EQ or de-esser targeted to the actual band |
| Metallic or watery texture | A/B original against separated stems in context | Replace a stem or repair a short passage rather than adding global filtering |
| Chorus collapses in mono | Compare mid/side, correlation and fold-down | Reduce excessive widening or correct polarity/alignment |
| Unstable bass level | Listen to kick/bass interaction over sections | Clip automation or gentle targeted compression; avoid one-size-fits-all low-end rules |
| Transient smearing | Compare source and post-processing attacks | Reduce limiting/denoising, revise separation or replace damaged events |

Frequency clues such as **200–500 Hz** for low-mid congestion or **4–9 kHz** for some vocal sibilance may help *locate* a problem. They are not automatic cut/boost bands; use playback and metering to identify the offending source.

## 3. Controlled processing starting points

| Process | Example initial values | What to listen for / stop condition |
| --- | --- | --- |
| Mix-bus compression | Ratio **1.5:1–2:1**, attack **10–30 ms**, release **50–200 ms** or auto, about **1–2 dB** gain reduction on strong sections | Punch and groove preserved; matched-bypass version not objectively preferable |
| Vocal compression | Ratio **2:1–4:1**, attack **5–25 ms**, release **40–150 ms**; threshold set by actual performance | Intelligibility without pumping or distorted breaths |
| De-esser / dynamic EQ | Narrow the detected resonance or sibilant band; apply the *minimum* attenuation that solves the issue | No lisping or dull consonants |
| Reverb | Audition short rooms/plates; initial vocal pre-delay **15–40 ms** if it improves separation | Source still readable and the decay does not cloud the next phrase |
| Saturation | Start with very low drive; gain-match before/after | Harmonics support the source without raising intermodulation or harshness |
| Stereo processing | Compare width, correlation, mid channel and mono fold-down | Center remains stable and important elements do not disappear |

**Threshold, attack and release are program-dependent.** These ranges are examples, not official Spotify/Suno specifications. For a stereo-only file, prioritize controlled EQ, level automation and surgical repair. Recreating independent instruments with source separation is an estimation task and can introduce leakage.

## 4. A/B testing protocol

1. Define one hypothesis: “the synth masks the vocal in the second chorus.”
2. Loop only the relevant section, but then check the full arrangement.
3. Change **one variable**. Render or freeze if the plugin is nondeterministic.
4. Match before/after loudness closely; take short blind or alternated listens.
5. Check mono, headphones and a small loudspeaker at moderate listening levels.
6. Keep the change only if intelligibility, balance or emotional impact improves.

## 5. Example: distorted AI vocal with a good instrumental

**Bad shortcut:** apply high-shelf cuts, aggressive noise reduction and widening to the complete stereo song.

**Better decision tree:** determine whether the distortion exists in the original render, separated vocal or master processing. If the source is already damaged, request a revised vocal/render or use a legitimate replacement performance. If it appears after separation, adjust the separator or edit the affected segment. If it appears only after limiting, restore dynamics and check true peak before adding more processors.

## 6. Technical handoff checklist

- [ ] The approved source and unprocessed version are preserved.
- [ ] All stems start at the same sample and render over the same time range.
- [ ] No unintended clipping, clicks, truncated transitions or misrouted channels.
- [ ] Processing choices are documented as choices—not as “anti-detection” settings.
- [ ] Mono compatibility and a level-matched reference comparison pass.
- [ ] Mix and premaster exports can be identified by revision.

Next: [Mastering for streaming](./mastering-for-streaming.md), [Provenance and release](./provenance-and-release.md), or the [producer's creative mixing guide](../producer-handbook/mixing-ai-outputs.md).
