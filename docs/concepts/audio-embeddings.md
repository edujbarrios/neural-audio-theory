---
sidebar_position: 1
title: Audio Embeddings
---

# Audio Embeddings

Audio embeddings are dense vectors that encode perceptual and structural properties of sound so downstream models can reason over them efficiently.

## From Waveform to Embedding

Given a waveform segment $x \in \mathbb{R}^{T}$, an encoder $E_\phi$ maps it to a latent vector:

$$
\mathbf{z} = E_\phi(x) \in \mathbb{R}^{d}
$$

In production systems, the input is often a log-mel spectrogram or neural codec representation rather than raw waveform samples.

## Typical Front-End Steps

1. **Resample and normalize** to a fixed sample rate and loudness range
2. **Frame with STFT** to obtain time-frequency bins
3. **Project to mel bands** to reduce dimensionality and align with auditory resolution
4. **Apply log compression** to stabilize dynamic range for training

Mel conversion from frequency $f$ (Hz):

$$
m = 2595 \log_{10}\left(1 + \frac{f}{700}\right)
$$

## Similarity and Retrieval

Embedding spaces support nearest-neighbor lookup and contrastive training.

$$
\text{sim}(\mathbf{z}_1, \mathbf{z}_2) = \frac{\mathbf{z}_1 \cdot \mathbf{z}_2}{\|\mathbf{z}_1\|\|\mathbf{z}_2\|}
$$

High cosine similarity usually indicates related instrumentation, texture, or rhythmic profile.

## Contrastive Objective (InfoNCE)

For positive pair $(i,j)$ in a batch:

$$
\mathcal{L}_{\text{InfoNCE}} = -\log \frac{\exp(\text{sim}(\mathbf{z}_i, \mathbf{z}_j)/\tau)}{\sum_{k=1}^{2N}\mathbb{1}_{[k\neq i]}\exp(\text{sim}(\mathbf{z}_i, \mathbf{z}_k)/\tau)}
$$

This objective pulls matched audio/text or audio/audio pairs together and pushes mismatched examples apart, improving controllability in generative pipelines.
