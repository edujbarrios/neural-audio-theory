---
sidebar_position: 2
title: Open-Source Tools
---

# Open-Source AI Music Tools

The open-source ecosystem for AI music is rich and growing. This page catalogs the most important tools, libraries, and models available for music generation, processing, and analysis.

## Music Generation Models

### MusicGen (Meta)

- **Repository**: `facebookresearch/audiocraft`
- **Capability**: Text-to-music generation
- **Models**: Small (300M), Medium (1.5B), Large (3.3B), Melody
- **License**: MIT (code), CC-BY-NC (models)
- **Input**: Text prompts, optional melody audio
- **Output**: 32 kHz mono, up to 30 seconds

### AudioLDM 2

- **Repository**: `haoheliu/AudioLDM2`
- **Capability**: Text-to-audio and text-to-music
- **Architecture**: Latent diffusion with AudioMAE + T5 conditioning
- **License**: Research
- **Input**: Text prompts
- **Output**: 16 kHz, variable length

### Stable Audio Open

- **Repository**: `Stability-AI/stable-audio-tools`
- **Capability**: Text-to-music generation
- **Architecture**: Latent diffusion
- **License**: Stability AI Community License
- **Input**: Text prompts with duration conditioning
- **Output**: 44.1 kHz stereo

### Riffusion

- **Repository**: `riffusion/riffusion`
- **Capability**: Text-to-music via spectrogram diffusion
- **Architecture**: Fine-tuned Stable Diffusion on spectrograms
- **License**: MIT
- **Approach**: Generates spectrograms as images, converts to audio

### MusicLDM

- **Repository**: `RetroCirce/MusicLDM`
- **Capability**: Text-to-music
- **Architecture**: Latent diffusion with beat-aware conditioning
- **License**: Research

## Neural Audio Codecs

### EnCodec

- **Repository**: `facebookresearch/audiocraft` (part of Audiocraft)
- **Capability**: Neural audio compression
- **Rates**: 1.5–24 kbps
- **Sample rates**: 24 kHz, 48 kHz
- **License**: MIT

### Descript Audio Codec (DAC)

- **Repository**: `descriptinc/descript-audio-codec`
- **Capability**: High-quality neural audio compression
- **Sample rates**: 16, 24, 44.1 kHz
- **License**: MIT

## Source Separation

### Demucs

- **Repository**: `facebookresearch/demucs`
- **Capability**: Music source separation (vocals, drums, bass, other)
- **Architecture**: Hybrid Transformer Demucs
- **License**: MIT
- **Quality**: State-of-the-art open source

### Open-Unmix

- **Repository**: `sigsep/open-unmix-pytorch`
- **Capability**: Music source separation
- **Architecture**: Bidirectional LSTM
- **License**: MIT

## Singing Voice Synthesis

### DiffSinger

- **Repository**: `MoonInTheRiver/DiffSinger`
- **Capability**: Singing voice synthesis from musical score
- **Architecture**: Diffusion-based acoustic model
- **License**: Apache 2.0

### so-vits-svc

- **Repository**: `svc-develop-team/so-vits-svc`
- **Capability**: Singing voice conversion
- **Architecture**: VITS-based with speaker conditioning
- **License**: MIT

### RVC (Retrieval-Based Voice Conversion)

- **Repository**: `RVC-Project/Retrieval-based-Voice-Conversion-WebUI`
- **Capability**: Voice conversion for speech and singing
- **Architecture**: HuBERT + index retrieval + vocoder
- **License**: MIT

## Audio Processing and Analysis Libraries

### librosa

- **Language**: Python
- **Capability**: Audio analysis, feature extraction
- **Features**: STFT, mel spectrograms, chromagrams, beat tracking, onset detection, pitch tracking, MFCCs
- **Install**: `pip install librosa`
- **Essential for**: virtually every audio ML project

### torchaudio

- **Language**: Python (PyTorch)
- **Capability**: Audio loading, transforms, pretrained models
- **Features**: STFT, mel spectrogram, resampling, augmentations, pretrained wav2vec2/HuBERT
- **Install**: `pip install torchaudio`
- **Essential for**: PyTorch-based audio ML

### Essentia

- **Language**: Python / C++
- **Capability**: Music information retrieval (MIR)
- **Features**: Key detection, BPM, genre classification, mood analysis, chord recognition
- **Install**: `pip install essentia`
- **Essential for**: music analysis and metadata extraction

### madmom

- **Language**: Python
- **Capability**: Beat tracking, onset detection, chord recognition
- **Features**: State-of-the-art beat and downbeat tracking
- **Install**: `pip install madmom`

### pedalboard

- **Language**: Python (Spotify)
- **Capability**: Audio effects processing
- **Features**: EQ, compression, reverb, delay, chorus, distortion
- **Install**: `pip install pedalboard`
- **Essential for**: audio augmentation and post-processing

## Vocoders

### HiFi-GAN

- **Repository**: `jik876/hifi-gan`
- **Capability**: Mel spectrogram to waveform
- **Quality**: Excellent
- **Speed**: Real-time on GPU

### BigVGAN

- **Repository**: `NVIDIA/BigVGAN`
- **Capability**: Universal vocoder
- **Quality**: State-of-the-art
- **License**: MIT

### Vocos

- **Repository**: `gemelo-ai/vocos`
- **Capability**: ISTFT-based vocoder
- **Quality**: Very good
- **Speed**: Extremely fast

## Pretrained Audio Models

### CLAP (Contrastive Language-Audio Pretraining)

- **Repository**: `LAION-AI/CLAP`
- **Capability**: Text-audio alignment, zero-shot classification
- **Use**: Evaluation (CLAP score), conditioning, retrieval

### MERT (Music Understanding Model)

- **Repository**: `yizhilll/MERT`
- **Capability**: Music understanding, embedding extraction
- **Architecture**: Self-supervised transformer for music
- **Use**: Feature extraction, music tagging, embedding-based evaluation

### BEATs

- **Repository**: `microsoft/unilm` (BEATs subdirectory)
- **Capability**: Audio understanding
- **Use**: Audio classification, embedding extraction

## Evaluation Tools

### FAD (Fréchet Audio Distance)

- **Repository**: `google-research/google-research` (frechet_audio_distance)
- **Capability**: Compute FAD between generated and reference audio
- **Use**: Standard evaluation metric

### DNSMOS (Deep Noise Suppression MOS)

- **Repository**: `microsoft/DNS-Challenge`
- **Capability**: Predict Mean Opinion Score from audio
- **Use**: Quick quality estimation without human listeners

## Getting Started Recommendations

### For Beginners

1. Start with **librosa** for audio analysis
2. Try **MusicGen** for text-to-music generation
3. Use **Demucs** for stem separation
4. Explore **HiFi-GAN** to understand vocoders

### For Researchers

1. **Audiocraft** (MusicGen + EnCodec) as a full pipeline
2. **torchaudio** for data loading and preprocessing
3. **CLAP** for evaluation
4. **Stable Audio Tools** for latent diffusion experiments

### For Producers

1. **Demucs** for stem separation
2. **RVC** for voice conversion experiments
3. **pedalboard** for batch audio processing
4. **Essentia** for analyzing generated audio (BPM, key, etc.)
