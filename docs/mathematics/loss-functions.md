---
sidebar_position: 2
title: Loss Functions
---

# Loss Functions for Audio Generation

Loss design determines what a model improves during training, so it directly shapes musical realism, stability, and controllability.

## Reconstruction Losses

Given predicted spectrogram $S_{\text{pred}}$ and target $S_{\text{target}}$:

$$
\mathcal{L}_{\text{L1}}=\frac{1}{TF}\sum_{t=1}^{T}\sum_{f=1}^{F}|S_{\text{pred}}(t,f)-S_{\text{target}}(t,f)|
$$

$$
\mathcal{L}_{\text{L2}}=\frac{1}{TF}\sum_{t=1}^{T}\sum_{f=1}^{F}(S_{\text{pred}}(t,f)-S_{\text{target}}(t,f))^2
$$

L1 often preserves transients better; L2 heavily penalizes large errors.

## Adversarial Objectives

For generator $G$ and discriminator $D$:

$$
\mathcal{L}_{\text{adv}}=\mathbb{E}[\log D(x_{\text{real}})]+\mathbb{E}[\log(1-D(G(z)))]
$$

In audio, multi-period and multi-scale discriminators help capture both micro-timbre and long-range rhythmic structure.

## Perceptual / Feature Matching Losses

$$
\mathcal{L}_{\text{perc}}=\sum_{l=1}^{L}\lambda_l\|\phi_l(S_{\text{pred}})-\phi_l(S_{\text{target}})\|_2^2
$$

Feature matching reduces metallic artifacts and improves subjective quality compared with pure reconstruction loss.

## Diffusion Noise-Prediction Loss

$$
\mathcal{L}_{\text{diff}}=\mathbb{E}_{t,x_0,\epsilon}[\|\epsilon-\epsilon_\theta(x_t,t)\|^2]
$$

with

$$
x_t=\sqrt{\bar{\alpha}_t}x_0+\sqrt{1-\bar{\alpha}_t}\epsilon
$$

This trains the denoiser to recover clean signal structure from different noise levels.

## KL Regularization in Latent Models

$$
D_{\text{KL}}(q_\phi(\mathbf{z}|x)\|p(\mathbf{z}))=\frac{1}{2}\sum_{i=1}^{d}(\sigma_i^2+\mu_i^2-1-\log\sigma_i^2)
$$

KL terms prevent latent collapse and support stable sampling at inference time.
