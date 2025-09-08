---
sidebar_position: 99
title: Glossary
---

# Glossary of AI Music Terms

A comprehensive reference for terminology used throughout this handbook and in the broader AI music field.

---

### A-weighting
A frequency weighting curve that approximates human hearing sensitivity. Used in loudness measurements to emphasize frequencies where the ear is most sensitive (2–5 kHz).

### AAC (Advanced Audio Coding)
A lossy audio codec that superseded MP3. Default format for Apple and YouTube. Better quality than MP3 at equivalent bitrates.

### ADSR (Attack, Decay, Sustain, Release)
The four stages of a sound's amplitude envelope. Attack is the rise time, Decay is the initial fall, Sustain is the held level, Release is the fade after the note ends.

### Aliasing
Distortion that occurs when a signal is sampled below the Nyquist rate. High frequencies fold back as phantom low-frequency content.

### Attention (Self-Attention)
A mechanism that allows each element in a sequence to attend to (weight) all other elements. Fundamental to transformer architectures. See [Attention Mathematics](./mathematics/attention-math.md).

### Autoregressive Model
A model that generates output sequentially, with each step conditioned on all previous steps: $p(x_{1:T}) = \prod_t p(x_t | x_{<t})$.

### Batch Size
The number of training examples processed in one forward/backward pass. Larger batches provide more stable gradients but require more memory.

### BPM (Beats Per Minute)
The tempo of a piece of music. 120 BPM means two beats per second.

### Chromagram
A 12-dimensional representation of audio that collapses all octaves into pitch classes (C, C#, D, ..., B). Used for harmony analysis and melody conditioning.

### CLAP (Contrastive Language-Audio Pretraining)
A model trained to align text and audio in a shared embedding space. Used for evaluation (CLAP score) and conditioning. See [Text-Audio Alignment](./concepts/text-audio-alignment.md).

### Classifier-Free Guidance (CFG)
A technique that amplifies the effect of conditioning during diffusion model inference by combining conditional and unconditional predictions: $\hat{\epsilon} = (1+w)\epsilon_{\text{cond}} - w\epsilon_{\text{uncond}}$.

### Codec
A system that encodes and decodes audio. Traditional codecs (MP3, Opus) use hand-designed algorithms; neural codecs (EnCodec, SoundStream) use learned networks.

### Codebook
A dictionary of discrete vector codes used in vector quantization. Each audio frame is mapped to its nearest codebook entry.

### Conditioning
The mechanism by which external information (text prompts, MIDI, reference audio) influences generation. Implemented via cross-attention, FiLM, or concatenation.

### Contrastive Learning
A training paradigm that learns representations by pulling similar pairs together and pushing dissimilar pairs apart in embedding space. InfoNCE is the standard loss.

### Cross-Attention
Attention where queries come from one sequence (e.g., audio) and keys/values from another (e.g., text). The primary mechanism for injecting text conditioning into audio models.

### DAW (Digital Audio Workstation)
Software for recording, editing, mixing, and producing music. Examples: Ableton Live, Logic Pro, FL Studio, Pro Tools.

### Diffusion Model
A generative model that learns to reverse a noise-adding process. Generates samples by iteratively denoising random noise. See [Diffusion Models](./architecture/diffusion-models.md).

### Discriminator
The critic network in a GAN that distinguishes real data from generated data. In audio, multi-scale and multi-period discriminators capture different temporal patterns.

### Distillation (Knowledge Distillation)
Training a smaller model to reproduce the behavior of a larger model. Used to create faster, more efficient models.

### ELBO (Evidence Lower Bound)
The training objective for VAEs: $\mathcal{L} = \text{Reconstruction} - \text{KL Divergence}$.

### Embedding
A dense vector representation of data (text, audio, images) in a continuous space. Similar items have similar embeddings.

### EnCodec
Meta's neural audio codec using residual vector quantization. Compresses audio to discrete tokens at 1.5–24 kbps. Core component of MusicGen.

### Epoch
One complete pass through the entire training dataset.

### FAD (Fréchet Audio Distance)
The standard metric for evaluating generative audio quality. Measures distributional distance between real and generated audio embeddings. Lower is better.

### Feature Matching Loss
A training loss that compares intermediate layer activations (features) of a discriminator, rather than just its final output. Reduces artifacts in GAN-generated audio.

### FFT (Fast Fourier Transform)
An efficient algorithm for computing the Discrete Fourier Transform, converting time-domain signals to frequency-domain. See [FFT](./mathematics/fft.md).

### FiLM (Feature-wise Linear Modulation)
A conditioning mechanism: $\gamma(c) \odot h + \beta(c)$. Modulates intermediate features using scale and shift parameters derived from conditioning input.

### Fine-Tuning
Continuing training of a pre-trained model on a new, typically smaller dataset. Specializes the model for a specific task or domain. See [Fine-Tuning & Adaptation](./advanced/fine-tuning-and-adaptation.md).

### GAN (Generative Adversarial Network)
A framework with two networks — generator and discriminator — trained adversarially. In audio, primarily used for vocoders. See [GAN Architectures](./architecture/gan-architectures.md).

### Gradient Clipping
Limiting the magnitude of gradients during training to prevent exploding gradients and training instability.

### Guidance Scale
The parameter $w$ in classifier-free guidance that controls the trade-off between prompt adherence and output diversity.

### HiFi-GAN
A widely used GAN-based vocoder that converts mel spectrograms to high-fidelity waveforms. See [GAN Architectures](./architecture/gan-architectures.md).

### Hop Size
The stride (in samples) between successive STFT frames. Smaller hop size = finer time resolution but more frames.

### InfoNCE
The contrastive learning loss function used in CLAP, MuLan, and similar models. Maximizes similarity of positive pairs relative to negative pairs.

### Inpainting
Regenerating a specific region of audio while keeping the surrounding context. Natural in diffusion models.

### KL Divergence (Kullback-Leibler Divergence)
A measure of how one probability distribution differs from another. Used as a regularizer in VAEs to keep the latent distribution close to a prior.

### Latent Diffusion
Running diffusion in a compressed latent space rather than directly on audio. Faster and more memory-efficient. Used in Stable Audio.

### Latent Space
A learned, compressed coordinate system where data is represented as dense vectors. Nearby points correspond to perceptually similar audio. See [Latent Space Mapping](./concepts/latent-space-mapping.md).

### LoRA (Low-Rank Adaptation)
A parameter-efficient fine-tuning technique that adds small, trainable low-rank matrices to frozen model weights. See [Fine-Tuning & Adaptation](./advanced/fine-tuning-and-adaptation.md).

### Loss Function
A mathematical function that measures how well a model's predictions match the target. The model is trained to minimize this function. See [Loss Functions](./mathematics/loss-functions.md).

### LUFS (Loudness Units Full Scale)
A standardized loudness measurement (EBU R 128). Target levels: -14 LUFS for Spotify, -16 LUFS for Apple Music.

### Mel Scale
A perceptual frequency scale where equal distances correspond to equal perceived pitch differences. $m = 2595 \log_{10}(1 + f/700)$.

### Mel Spectrogram
A time-frequency representation of audio using mel-scaled frequency bands and log compression. The most common input format for audio ML models. See [Mel Spectrograms](./mathematics/mel-spectrograms.md).

### MIDI (Musical Instrument Digital Interface)
A symbolic music representation encoding notes, velocities, and timing as discrete events. Does not contain audio, only performance data.

### Mixed Precision
Training with both FP16 (or BF16) and FP32 operations to reduce memory usage and increase speed while maintaining precision.

### MOS (Mean Opinion Score)
A subjective quality rating (1–5 scale) from human listeners. The gold standard for audio quality evaluation.

### MuLan
Google's music-specific text-audio alignment model. Used in MusicLM for conditioning.

### Multi-Head Attention
Attention computed in parallel across multiple heads, each with different learned projections. Different heads can capture different aspects of musical structure.

### Neural Codec
A learned audio compression model using encoder-decoder networks with vector quantization. Examples: EnCodec, SoundStream, DAC. See [Neural Audio Codecs](./concepts/neural-audio-codecs.md).

### Nyquist Frequency
Half the sample rate ($f_s/2$). The maximum frequency that can be represented without aliasing.

### Opus
State-of-the-art traditional audio codec. Excellent quality at low bitrates. Widely used in streaming and real-time communication.

### Overfitting
When a model memorizes training data instead of learning general patterns. Recognized by low training loss but poor performance on new data.

### PCM (Pulse Code Modulation)
Standard uncompressed digital audio format. Stores each sample as a fixed-point or floating-point number.

### Perceptual Loss
A loss function that operates on intermediate features of a perceptual model rather than raw signal values. Produces more natural-sounding results than pixel/sample-level losses.

### Quantization (Model)
Reducing the numerical precision of model weights (e.g., FP32 → INT8) to decrease model size and increase inference speed.

### Quantization (Audio)
The process of mapping continuous amplitude values to discrete levels. Determined by bit depth.

### Reparameterization Trick
A technique for backpropagating through a sampling operation: $z = \mu + \sigma \odot \epsilon$ where $\epsilon \sim \mathcal{N}(0, I)$.

### Residual Vector Quantization (RVQ)
A cascaded quantization scheme where each codebook quantizes the residual from the previous codebook. Used in EnCodec, SoundStream, and DAC.

### RoPE (Rotary Position Embedding)
A positional encoding method that encodes relative positions through rotation of query and key vectors. Increasingly standard in transformers.

### Sample Rate
The number of audio samples captured per second. 44,100 Hz (CD quality) means 44,100 samples per second.

### SDR (Signal-to-Distortion Ratio)
A metric for source separation quality. Higher SDR means cleaner separation.

### Softmax
A function that converts a vector of scores into a probability distribution: $\sigma(z_i) = e^{z_i} / \sum_j e^{z_j}$.

### SoundStream
Google's neural audio codec (2021). Pioneer of the RVQ architecture for audio compression. Used in AudioLM and MusicLM.

### Spectrogram
A visual representation of the frequency content of audio over time. Computed via STFT.

### STFT (Short-Time Fourier Transform)
The Fourier transform applied to overlapping windowed segments of a signal. Produces a time-frequency representation.

### Temperature
A parameter that controls the randomness of sampling. Higher temperature = more diverse but less predictable output. Lower temperature = more conservative but more predictable.

### Token
A discrete unit in a sequence. In audio AI, tokens can be codec codes, quantized latent codes, or spectrogram patches.

### Transformer
A neural network architecture based on self-attention. Dominant in language modeling and increasingly used for audio. See [Transformers for Audio](./architecture/transformers-for-audio.md).

### U-Net
An encoder-decoder architecture with skip connections. Standard backbone for diffusion model denoisers. See [U-Net for Audio](./architecture/u-net-for-audio.md).

### VAE (Variational Autoencoder)
A generative model with a probabilistic encoder and decoder, trained to maximize the evidence lower bound (ELBO). See [VAEs for Audio](./architecture/variational-autoencoders.md).

### Vector Quantization (VQ)
Mapping continuous vectors to the nearest entry in a learned codebook. Converts continuous representations to discrete tokens.

### Vocoder
A model that converts intermediate representations (mel spectrograms, latent codes) into audio waveforms. Modern vocoders use GANs (HiFi-GAN, BigVGAN).

### VQ-VAE (Vector Quantized VAE)
A VAE variant that uses discrete codebook quantization instead of continuous Gaussian latent variables. Foundation of Jukebox and neural audio codecs.

### Waveform
The raw amplitude-over-time representation of audio. The most fundamental audio format.

### Window Function
A function applied to signal frames before FFT to reduce spectral leakage. Common choices: Hann, Hamming, Blackman.
