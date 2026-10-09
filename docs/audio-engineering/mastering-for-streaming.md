---
title: Mastering for Streaming
---

# Mastering for Streaming: Spotify and Other Destinations

The purpose of streaming mastering is to deliver **a musically convincing, technically sound recording**. Loudness recommendations are playback engineering guidance, not rules for classifying a source or hiding AI provenance.

## Spotify's published reference values

**Source checked: October 2026.** These are Spotify's own published recommendations, not measurement guarantees for every device.

| Parameter | Published guidance | Engineering interpretation |
| --- | --- | --- |
| Normal playback loudness | **−14 LUFS integrated** (ITU-R BS.1770) | A normalization reference applied at playback; not a universal creative loudness requirement |
| True peak on the recommended target | **Below −1 dBTP** | Provides margin during lossy encoding; measure the exported master |
| If mastering louder than −14 LUFS | **Below −2 dBTP** | Spotify advises extra peak margin to reduce encoding distortion |
| Premium playback options | **−11 / −14 / −19 LUFS** (Loud / Normal / Quiet) | Listener settings vary; do not optimize for only one mode |
| Delivered format | **Native stereo FLAC preferred; WAV accepted** | Send one highest-quality native stereo master, not multiple custom “Spotify versions” |
| Sampling / word length | **44.1 kHz or higher; 24-bit when native; 16-bit only when highest available** | Retain native master resolution; no unnecessary up/downsampling before delivery |

References: [Spotify loudness normalization](https://support.spotify.com/es/artists/article/loudness-normalization/) and [Spotify audio file formats](https://support.spotify.com/es-eu/artists/article/audio-file-formats/).

**Important distinction:** −14 LUFS is Spotify's normalization/reference recommendation, **not an upload acceptance threshold**. A higher-loudness master is typically turned down during normal playback. True-peak safety, audible distortion and musical dynamics still matter.

## Mastering protocol

1. **Receive an approved mix.** Request a stereo premaster without unnecessary brickwall limiting, unless limiting is essential to the mix aesthetic.
2. **Listen for upstream problems.** Fix vocal masking, clicks, stereo instability and damaged AI artifacts at the mix or source if possible.
3. **Set the artistic loudness.** Level-match reference tracks before judging impact. Use LUFS-I, LUFS short-term and dynamics as context, not a race to a number.
4. **Control peaks carefully.** Monitor true peak (dBTP) with reliable oversampling; audition limiting artifacts, transient loss and low-frequency pumping.
5. **Render once to the required native format.** Keep the sample rate and bit depth of the native master when supported; dither once only for an actual fixed-point bit-depth reduction.
6. **Measure the rendered file.** Record LUFS-I, max dBTP, sample peak, duration, channel count and any delivery exceptions.
7. **Audition an encoded preview.** Check for overs, consonant grit, smeared cymbals and missing tails after a representative lossy transcode.
8. **Archive the native master and metadata.** Preserve credits, permissions, source version and provenance.

## A decision example

A punchy dance master measures **−10 LUFS-I / −2.2 dBTP** and passes an artifact check. On normal Spotify playback it will generally be attenuated toward the platform's reference; a forced reduction to −14 LUFS may *or may not* improve the musical result. Compare the two versions at the same perceived level before choosing. This is an illustrative engineering decision, **not a recommendation to always master at −10 LUFS**.

## Common misconceptions

- **“Every master must be exactly −14 LUFS.”** No. The service publishes a reference, and playback gain is not the same as changing the master file.
- **“A true-peak ceiling fixes bad mix balance.”** No. It limits overs, not masking or collapsed transients.
- **“EQ, saturation, resampling or limiting makes a track undetectable as AI.”** There is no substantiated universal setting. These controls have ordinary sonic purposes; they should not be used to conceal origin or defeat provenance signals.
- **“Lossless delivery means listeners always hear lossless.”** Playback depends on eligibility, device and settings.

## Delivery checklist

- [ ] One approved stereo master in native supported lossless resolution.
- [ ] Integrated LUFS and max dBTP recorded from the exported file.
- [ ] No unintentional clipping after encoding or conversion.
- [ ] No cut tails, wrong channel order, accidental silence or duplicate versions.
- [ ] Distributor's current requirements, credits, rights and AI disclosures confirmed.
- [ ] Source, master and measurement report archived.

See [mix diagnostics](./mix-session-and-diagnostics.md), [provenance and release](./provenance-and-release.md), and [detailed QC](../producer-handbook/quality-control-and-delivery.md).
