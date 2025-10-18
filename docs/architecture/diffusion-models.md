---
sidebar_position: 2
title: Diffusion Models
---

# Diffusion Models for Audio

Diffusion models synthesize audio by learning to reverse a controlled noise process. They are widely used for high-fidelity text-to-audio generation.

## Forward Process

$$
q(x_t\mid x_{t-1})=\mathcal{N}(x_t;\sqrt{1-\beta_t}x_{t-1},\beta_t\mathbf{I})
$$

Closed-form sampling from clean data $x_0$:

$$
x_t=\sqrt{\bar{\alpha}_t}x_0+\sqrt{1-\bar{\alpha}_t}\epsilon,\quad \epsilon\sim\mathcal{N}(0,\mathbf{I})
$$

where $\alpha_t=1-\beta_t$ and $\bar{\alpha}_t=\prod_{s=1}^{t}\alpha_s$.

## Reverse Process

$$
p_\theta(x_{t-1}\mid x_t)=\mathcal{N}(x_{t-1};\boldsymbol{\mu}_\theta(x_t,t),\sigma_t^2\mathbf{I})
$$

A U-Net-like denoiser predicts noise $\epsilon_\theta(x_t,t,c)$, optionally conditioned on text or other controls $c$.

## Training Objective

$$
\mathcal{L}_{\text{simple}}=\mathbb{E}_{t,x_0,\epsilon}[\|\epsilon-\epsilon_\theta(x_t,t,c)\|^2]
$$

This objective is simple, stable, and effective for audio domains.

## Classifier-Free Guidance

$$
\hat{\epsilon}_\theta=(1+w)\epsilon_\theta(x_t,t,c)-w\epsilon_\theta(x_t,t,\varnothing)
$$

The guidance scale $w$ trades off prompt adherence and diversity.

## Latent Diffusion for Efficiency

Many systems diffuse in compressed latent space:

1. Encode waveform/spectrogram to latent $\mathbf{z}_0$
2. Run diffusion on $\mathbf{z}$ instead of raw audio
3. Decode denoised latent to waveform

This reduces memory and compute cost while preserving quality.

## Engineering Notes for Music Generation

Practical systems combine diffusion with:

- text encoders for prompt conditioning
- temporal control tokens (intro, drop, bridge, outro)
- post-processing (loudness normalization, limiting, optional stem mixing)

The final quality depends on data curation, conditioning fidelity, and scheduler design as much as model size.
