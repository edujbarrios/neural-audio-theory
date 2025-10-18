---
sidebar_position: 1
title: Transformers for Audio
---

# Transformers for Audio

Transformers model long-range dependencies in music by applying attention over tokenized audio representations.

## Scaled Dot-Product Attention

$$
\text{Attention}(Q,K,V)=\text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

This allows each audio token to aggregate context from other positions, improving coherence across bars and sections.

## Multi-Head Attention

$$
\text{MultiHead}(Q,K,V)=\text{Concat}(\text{head}_1,\dots,\text{head}_h)W^O
$$

Each head learns different structure (rhythm, harmony, instrumentation cues).

## Tokenization Strategies

Modern systems commonly use:

1. **Codec tokens** (for example EnCodec/SoundStream-like codes)
2. **Spectrogram patches**
3. **Quantized latent codes from VQ models**

Tokenization quality strongly affects downstream generation fidelity and efficiency.

## Autoregressive Audio Modeling

$$
p(x_{1:T})=\prod_{t=1}^{T}p_\theta(x_t\mid x_{<t})
$$

Autoregressive transformers are effective for structure and continuation tasks, but sampling can be slow for long sequences.

## Text-to-Audio Conditioning

Cross-attention injects text embeddings into the audio token stream:

$$
\text{CrossAttn}(Q_{\text{audio}},K_{\text{text}},V_{\text{text}})
$$

This maps prompt semantics (genre, mood, instrumentation, arrangement cues) to generation decisions during decoding.
