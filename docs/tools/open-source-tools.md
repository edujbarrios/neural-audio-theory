---
sidebar_position: 2
title: Open-Source Tools
---

# Open-Source AI Music Tools

The open-source audio ecosystem includes research code, pretrained model weights, production-oriented libraries, and archived projects. Those categories have different licenses and maintenance expectations, so check the linked upstream project before adopting a tool.

## Music Generation Models

### MusicGen (Meta AudioCraft)

- **Repository**: [`facebookresearch/audiocraft`](https://github.com/facebookresearch/audiocraft)
- **Capability**: text-conditioned and melody-conditioned music generation
- **Released model sizes**: 300M, 1.5B, and 3.3B parameter variants, plus melody-conditioned variants
- **License**: MIT for AudioCraft code; CC-BY-NC 4.0 for the released model weights
- **Representation**: autoregressive Transformer over a 32 kHz EnCodec tokenizer
- **Published training-data statement**: the AudioCraft documentation says MusicGen was trained on 20,000 hours of licensed music, including internal data, Shutterstock, and Pond5

Treat the code license and model-weight license separately; MIT licensing of the repository does not make the released weights MIT-licensed.

### AudioLDM 2

- **Repository**: [`haoheliu/AudioLDM2`](https://github.com/haoheliu/AudioLDM2)
- **Capability**: text-to-audio generation, including music-oriented examples
- **Architecture**: latent diffusion with language-of-audio representations

Check the repository and model card for the exact checkpoint license, sample rate, and intended use before deployment. Different AudioLDM 2 checkpoints and wrappers can expose different defaults.

### Stable Audio Open 1.0

- **Repository**: [`Stability-AI/stable-audio-tools`](https://github.com/Stability-AI/stable-audio-tools)
- **Model card**: [`stabilityai/stable-audio-open-1.0`](https://huggingface.co/stabilityai/stable-audio-open-1.0)
- **Capability**: text-conditioned audio generation
- **Architecture**: autoencoder + T5 text conditioning + transformer-based latent diffusion model
- **Output documented by the model card**: variable-length stereo audio up to 47 seconds at 44.1 kHz
- **License**: governed by the license attached to the released model; review the current Stability AI terms for the intended use

### Riffusion

- **Repository**: [`riffusion/riffusion`](https://github.com/riffusion/riffusion)
- **Capability**: music generation through spectrogram-image diffusion
- **Approach**: generates spectrogram-like images and converts them back to audio

The original project is historically important, but verify repository maintenance and model licensing before treating it as a current production recommendation.

### MusicLDM

- **Repository**: [`RetroCirce/MusicLDM`](https://github.com/RetroCirce/MusicLDM)
- **Capability**: text-to-music research
- **Architecture**: latent diffusion with music-oriented conditioning

Use the paper and repository for the specific checkpoint and evaluation claims rather than inferring them from the model name.

## Neural Audio Codecs

### EnCodec

- **Repository**: [`facebookresearch/audiocraft`](https://github.com/facebookresearch/audiocraft)
- **Capability**: neural audio compression / tokenization
- **Released configurations**: include 24 kHz mono and 48 kHz stereo models at multiple target bandwidths
- **Code license**: MIT within AudioCraft

### Descript Audio Codec (DAC)

- **Repository**: [`descriptinc/descript-audio-codec`](https://github.com/descriptinc/descript-audio-codec)
- **Capability**: neural audio compression
- **Released sample-rate families**: include 16, 24, and 44.1 kHz checkpoints

Check the repository's current license and model cards for checkpoint-specific terms.

## Source Separation

### Demucs

- **Original repository**: [`facebookresearch/demucs`](https://github.com/facebookresearch/demucs)
- **Capability**: music source separation, commonly vocals / drums / bass / other
- **Architecture**: the v4 release includes Hybrid Transformer Demucs
- **License**: MIT
- **Maintenance status**: the original Meta repository was archived in January 2025 and explicitly states that it is no longer maintained; it points users to a fork for important bug fixes

Demucs remains a useful reference and practical separator, but an archived repository should not be described as the permanently "state-of-the-art" current choice.

### Open-Unmix

- **Repository**: [`sigsep/open-unmix-pytorch`](https://github.com/sigsep/open-unmix-pytorch)
- **Capability**: music source separation
- **Architecture**: spectrogram-domain model using bidirectional LSTMs

Open-Unmix is especially useful as a reproducible research baseline. Compare benchmark protocols before ranking it against newer systems.

## Singing Voice and Voice Conversion

### DiffSinger

- **Repository**: [`MoonInTheRiver/DiffSinger`](https://github.com/MoonInTheRiver/DiffSinger)
- **Capability**: singing voice synthesis from score and linguistic conditioning
- **Architecture**: diffusion-based acoustic modeling in the original work

### so-vits-svc

- **Repository**: [`svc-develop-team/so-vits-svc`](https://github.com/svc-develop-team/so-vits-svc)
- **Capability**: singing voice conversion

### RVC (Retrieval-Based Voice Conversion)

- **Repository**: [`RVC-Project/Retrieval-based-Voice-Conversion-WebUI`](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI)
- **Capability**: voice conversion for speech and singing

Voice-conversion tools can implicate consent, publicity, impersonation, and dataset rights. A repository being open source does not establish permission to clone or distribute a person's voice.

## Audio Processing and Analysis Libraries

### librosa

- **Project**: [librosa](https://librosa.org/)
- **Language**: Python
- **Capability**: audio analysis and feature extraction
- **Features**: STFT, mel spectrograms, chroma features, beat tracking, onset detection, pitch-related utilities, and MFCCs
- **Install**: `pip install librosa`

### torchaudio

- **Project**: [torchaudio](https://pytorch.org/audio/)
- **Language**: Python / PyTorch
- **Capability**: audio I/O, transforms, datasets, and model utilities

The supported feature set changes with PyTorch releases; use the documentation matching the installed version.

### Essentia

- **Project**: [Essentia](https://essentia.upf.edu/)
- **Language**: C++ with Python bindings
- **Capability**: music information retrieval and audio analysis

### madmom

- **Repository**: [`CPJKU/madmom`](https://github.com/CPJKU/madmom)
- **Capability**: beat, downbeat, onset, and related music-information-retrieval tasks

Avoid describing a fixed library as "state-of-the-art" without a current benchmark. Benchmark leadership changes, while the software may remain useful as a reproducible implementation.

### pedalboard

- **Repository**: [`spotify/pedalboard`](https://github.com/spotify/pedalboard)
- **Language**: Python / C++
- **Capability**: audio effects and plugin processing
- **Install**: `pip install pedalboard`

## Vocoders

### HiFi-GAN

- **Repository**: [`jik876/hifi-gan`](https://github.com/jik876/hifi-gan)
- **Capability**: mel-spectrogram-to-waveform neural vocoding

### BigVGAN

- **Repository**: [`NVIDIA/BigVGAN`](https://github.com/NVIDIA/BigVGAN)
- **Capability**: neural vocoding across broad audio conditions

The BigVGAN papers report strong results on their evaluation suites, but "state-of-the-art" is benchmark- and date-dependent. Cite the specific paper, dataset, and metric when making a comparative claim.

### Vocos

- **Repository**: [`gemelo-ai/vocos`](https://github.com/gemelo-ai/vocos)
- **Capability**: neural vocoding using an inverse-STFT-oriented decoder

## Pretrained Audio Models

### CLAP (Contrastive Language-Audio Pretraining)

- **Repository**: [`LAION-AI/CLAP`](https://github.com/LAION-AI/CLAP)
- **Capability**: text-audio representation learning, retrieval, and zero-shot classification

A "CLAP score" is not a universal perceptual-quality metric; results depend on the exact checkpoint and scoring procedure.

### MERT

- **Repository**: [`yizhilll/MERT`](https://github.com/yizhilll/MERT)
- **Capability**: self-supervised music representation learning and embedding extraction

### BEATs

- **Repository**: [`microsoft/unilm`](https://github.com/microsoft/unilm) (BEATs project)
- **Capability**: general audio representation learning and classification

## Evaluation Tools and Metrics

### Fréchet Audio Distance (FAD)

FAD compares distributions of embeddings extracted from generated and reference audio. The score depends on the embedding model, preprocessing, reference set, and implementation, so always report those details rather than treating "FAD" as one implementation-independent number.

### DNSMOS

- **Repository**: [`microsoft/DNS-Challenge`](https://github.com/microsoft/DNS-Challenge)
- **Capability**: non-intrusive speech-quality estimation developed for noise-suppression evaluation

DNSMOS is a speech-oriented quality estimator. It should not be presented as a validated general-purpose metric for music-generation quality without task-specific evidence.

## Choosing a Tool

Selection should be based on the actual task and verified upstream status:

1. Check whether the repository is maintained or archived.
2. Separate code license, model-weight license, and training-data rights.
3. Confirm input/output sample rate, channel count, duration limits, and hardware requirements from the model card or current docs.
4. Prefer benchmark results with named datasets and metrics over labels such as "best" or "state-of-the-art."
5. Pin versions for reproducible experiments.

## Sources checked

Checked September 2026 against upstream project documentation and model cards, including:

- [AudioCraft / MusicGen documentation](https://github.com/facebookresearch/audiocraft)
- [Stable Audio Open 1.0 model card](https://huggingface.co/stabilityai/stable-audio-open-1.0)
- [Stable Audio Tools](https://github.com/Stability-AI/stable-audio-tools)
- [Demucs repository](https://github.com/facebookresearch/demucs)

For every other listed project, follow the linked upstream repository before relying on version-sensitive claims.