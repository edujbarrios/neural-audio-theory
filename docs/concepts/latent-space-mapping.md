---
sidebar_position: 2
title: Latent Space Mapping
---

# Latent Space Mapping

Latent spaces are learned coordinate systems where nearby points correspond to perceptually related audio outcomes.

## Probabilistic Encoding

A VAE-style encoder maps input $x$ to a posterior distribution:

$$
q_\phi(\mathbf{z}|x)=\mathcal{N}(\boldsymbol{\mu}_\phi(x),\boldsymbol{\sigma}_\phi^2(x))
$$

Sampling uses reparameterization:

$$
\mathbf{z}=\boldsymbol{\mu}+\boldsymbol{\sigma}\odot\boldsymbol{\epsilon},\quad \boldsymbol{\epsilon}\sim\mathcal{N}(0,\mathbf{I})
$$

## Geometry and Musical Semantics

Well-trained latent spaces tend to show:

- **Timbre neighborhoods** (similar instrument tone clusters)
- **Style manifolds** (genre and production traits)
- **Continuous controls** (energy, density, brightness, tension)

These structures make interpolation and editing possible without explicit symbolic rules.

## Interpolation

Linear path between two points:

$$
\mathbf{z}_t=(1-t)\mathbf{z}_A+t\mathbf{z}_B,\quad t\in[0,1]
$$

Spherical interpolation preserves norm and often sounds smoother:

$$
\text{slerp}(\mathbf{z}_A,\mathbf{z}_B;t)=\frac{\sin((1-t)\theta)}{\sin\theta}\mathbf{z}_A+\frac{\sin(t\theta)}{\sin\theta}\mathbf{z}_B
$$

where

$$
\theta=\arccos\left(\frac{\mathbf{z}_A\cdot\mathbf{z}_B}{\|\mathbf{z}_A\|\|\mathbf{z}_B\|}\right)
$$

## Training Objective (ELBO)

$$
\mathcal{L}_{\text{ELBO}}=\mathbb{E}_{q_\phi(\mathbf{z}|x)}[\log p_\theta(x|\mathbf{z})]-D_{\text{KL}}\left(q_\phi(\mathbf{z}|x)\,\|\,p(\mathbf{z})\right)
$$

- Reconstruction term preserves musical detail
- KL term regularizes the space for stable sampling and interpolation
