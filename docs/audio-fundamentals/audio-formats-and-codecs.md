---
sidebar_position: 4
title: Audio Formats & Codecs
---

# Audio Formats and Codecs

Audio format choices affect storage, fidelity, interoperability, and reproducibility. Codec quality is not a single fixed number: it depends on bitrate, signal type, encoder implementation, listening conditions, and the comparison protocol.

## Uncompressed audio

### WAV (RIFF/WAVE)

WAV is a container commonly used for PCM audio. For 44.1 kHz, 16-bit stereo PCM, the raw payload is about 1,411.2 kbit/s, or roughly 10.6 MB per minute before container overhead.

### AIFF

AIFF is another container commonly used for uncompressed PCM audio. It can carry equivalent sample data to WAV; container choice alone does not determine audio fidelity.

### Raw PCM

Raw PCM contains sample values without a self-describing container header, so sample rate, sample format, channel count, and byte order must be known separately.

## Lossless compression

### FLAC

FLAC reconstructs the encoded PCM samples exactly. Compression ratio depends strongly on the source material, so avoid treating one percentage range as a guarantee.

### ALAC

Apple Lossless is also lossless: decoding restores the encoded PCM samples. FLAC and ALAC differ in ecosystem and implementation details rather than in whether the decoded result is bit-exact.

## Lossy perceptual codecs

### MP3 and AAC

MP3 and AAC are perceptual codecs. Audible quality varies with encoder, bitrate, signal, and listener. Statements such as “artifacts become audible below 192 kbps” or “AAC is always better than MP3 at the same bitrate” are too absolute without a specific listening test.

For ML datasets, lossy source material can be usable, but it may encode compression artifacts that a model can learn. Preserve original lossless masters when high-fidelity reconstruction is an objective.

### Opus

Opus is standardized in RFC 6716 (with later updates). It combines technology derived from SILK and CELT and can operate across speech and music use cases.

RFC 6716 documents a bitrate range of 6 to 510 kbit/s and gives **sweet spots**, not universal transparency thresholds. For 20 ms frames it lists, among other examples, about 48–64 kbit/s for fullband mono music and 64–128 kbit/s for fullband stereo music.

Do not describe Opus as permanently “state-of-the-art” without naming a benchmark. Its practical strengths are that it is standardized, flexible, low-latency-capable, and widely implemented.

## Neural audio codecs

Neural codecs use learned encoders/decoders and quantization to represent audio at compact rates. Their quality must be evaluated for a particular model, checkpoint, signal domain, and bitrate.

### EnCodec

Meta's released EnCodec repository documents two multi-bandwidth pretrained models:

- a causal 24 kHz mono model supporting 1.5, 3, 6, 12, and 24 kbit/s;
- a non-causal 48 kHz stereo model supporting 3, 6, 12, and 24 kbit/s.

The repository also exposes discrete codes, which is why EnCodec-style representations are useful in token-based generative systems.

Do not turn paper-specific listening results into the universal claim that EnCodec is “comparable to Opus at much lower bitrates.” Comparisons depend on the exact EnCodec model, Opus settings, content, and evaluation protocol.

### SoundStream and DAC

SoundStream and Descript Audio Codec are related neural-codec systems built around learned compression and quantization. Architectural and quality comparisons should cite the corresponding paper/checkpoint rather than a generic ranking.

## Residual vector quantization

With residual vector quantization, several codebooks successively approximate a latent vector:

$$
\hat{\mathbf{z}} = \sum_{q=1}^{Q} \mathbf{e}_{q}(k_q)
$$

and each stage quantizes the residual left by earlier stages. It is safe to say that later stages refine the reconstruction; it is **not** generally safe to assign universal semantic roles such as “early codebooks = pitch/rhythm” and “late codebooks = timbre/noise” unless a particular model has been experimentally analyzed that way.

## Choosing formats for ML work

| Stage | Common choices | Why |
| --- | --- | --- |
| Archival / reference masters | WAV, FLAC, AIFF | Preserve PCM fidelity |
| Training input | Decoded PCM tensors, often sourced from WAV/FLAC | Explicit sample access and preprocessing |
| Token-based generation | Codec tokens from the selected neural codec | Compact discrete representation |
| Intermediate production | WAV or FLAC | Avoid unnecessary additional lossy generations |
| Web preview | Opus, AAC, or another browser-supported delivery codec | Reduce transfer size |

These are workflow recommendations, not format requirements.

## Bitrate is not a quality score

A table that labels 128 kbit/s Opus “transparent”, 320 kbit/s MP3 “near-transparent”, or 6 kbit/s EnCodec “good for music” turns context-dependent listening judgments into facts. Instead, compare codecs using controlled tests that record:

1. codec and encoder version;
2. bitrate/mode and channel configuration;
3. source corpus and sample rate;
4. loudness handling;
5. objective metrics, if used;
6. blinded listening protocol and number of listeners.

For reference, CD-format stereo PCM at 44.1 kHz and 16 bits/sample is 1,411.2 kbit/s. Comparing that number directly with a neural codec bitrate gives a compression factor, **not** a perceptual-quality equivalence.

## Sources checked

Checked 5 September 2026:

- [RFC 6716: Definition of the Opus Audio Codec](https://www.rfc-editor.org/rfc/rfc6716)
- [Meta EnCodec repository](https://github.com/facebookresearch/encodec)
- [AudioCraft EnCodec documentation](https://github.com/facebookresearch/audiocraft/blob/main/docs/ENCODEC.md)

Use codec papers and standardized specifications for technical claims, and use listening tests for perceptual-quality claims.
