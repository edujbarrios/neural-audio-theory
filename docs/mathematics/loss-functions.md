---
sidebar_position: 2
title: Loss Functions
---

# Loss Functions for Audio Generation

A loss specifies the numerical objective optimized during training. Its effect on perceived quality, stability, or controllability depends on the architecture, data, weighting, optimization procedure, and evaluation protocol; a loss name alone does not guarantee a particular audible result.

## Pointwise reconstruction losses

For predicted representation $S_{\mathrm{pred}}$ and target $S_{\mathrm{target}}$:

$$
\mathcal L_{\mathrm{L1}}=\frac{1}{TF}\sum_{t,f}|S_{\mathrm{pred}}(t,f)-S_{\mathrm{target}}(t,f)|,
$$

$$
\mathcal L_{\mathrm{L2}}=\frac{1}{TF}\sum_{t,f}(S_{\mathrm{pred}}(t,f)-S_{\mathrm{target}}(t,f))^2.
$$

L2 penalizes large numerical errors quadratically; L1 grows linearly. Statements such as “L1 preserves transients better” are experiment-dependent and should be supported by a controlled comparison on the representation and task being discussed.

For audio, pointwise losses can be applied to waveform samples, magnitudes, log magnitudes, mel features, latents, or other representations. These objectives are not equivalent.

## Adversarial objectives

The original GAN minimax value function is

$$
\min_G\max_D\;\mathbb E_{x\sim p_{\mathrm{data}}}[\log D(x)]+\mathbb E_{z\sim p_z}[\log(1-D(G(z)))].
$$

Practical audio GANs often use different generator/discriminator losses, including non-saturating, least-squares, hinge, or Wasserstein-style objectives. Therefore the original minimax equation should not be presented as the universal “audio adversarial loss.”

HiFi-GAN, for example, combines adversarial objectives with feature-matching and mel-spectrogram reconstruction terms. Its multi-period discriminators are designed to inspect periodic structure at several periods, while multi-scale discriminators inspect waveforms at multiple resolutions. Claims about rhythm, timbre, or long-range musical form should be tied to an experiment rather than inferred from the discriminator name.

## Feature matching and perceptual losses

A generic feature-space loss can be written as

$$
\mathcal L_{\mathrm{feat}}=\sum_l\lambda_l\|\phi_l(x)-\phi_l(\hat x)\|_p.
$$

Here $\phi_l$ may be an internal discriminator activation or a separate pretrained representation. Feature matching has improved synthesis results in published systems such as HiFi-GAN, but it does not universally “reduce metallic artifacts” or outperform every reconstruction objective. Its behavior depends on the features, layers, normalization, weights, and data domain.

When a pretrained network supplies $\phi$, document its checkpoint and training domain; the resulting loss inherits that model's biases and invariances.

## Diffusion objectives

For a variance-preserving forward process, one common parameterization is

$$
x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\,\epsilon,
$$

with a noise-prediction objective

$$
\mathcal L_{\epsilon}=\mathbb E_{t,x_0,\epsilon}\left[\|\epsilon-\epsilon_\theta(x_t,t)\|^2\right].
$$

Noise prediction is only one parameterization. Diffusion and flow systems may instead predict $x_0$, a velocity variable $v$, a score, or a flow/vector field, with weighting choices that alter the effective objective. Do not infer a system's training target from the word “diffusion” alone.

## KL terms in variational models

For a diagonal Gaussian approximate posterior $q_\phi(z|x)=\mathcal N(\mu,\mathrm{diag}(\sigma^2))$ and standard-normal prior,

$$
D_{\mathrm{KL}}(q_\phi(z|x)\|p(z))=\frac12\sum_i(\sigma_i^2+\mu_i^2-1-\log\sigma_i^2).
$$

In a VAE, the KL term is part of the evidence lower bound and regularizes the approximate posterior toward the prior. It **does not prevent posterior collapse**. With an expressive decoder or an overly strong KL pressure, the model can instead learn a posterior close to the prior and use little information from $z$—the phenomenon commonly called posterior collapse or KL vanishing.

Mitigations studied in the literature include KL annealing, free bits, modified objectives, architectural changes, and constraints on the inference network. Their effectiveness is task-dependent.

## Multi-objective training

Audio systems frequently combine several losses:

$$
\mathcal L=\lambda_1\mathcal L_1+\lambda_2\mathcal L_2+\cdots.
$$

The coefficients are part of the model specification. A raw loss magnitude is not necessarily comparable across objectives, datasets, or implementations, so report weights, reduction conventions, units, and any adaptive loss-balancing scheme.

When claiming that a loss improves quality, report an ablation with the same data, model capacity, training budget, inference settings, and evaluation protocol.

## Primary references

- Goodfellow et al., [Generative Adversarial Nets](https://arxiv.org/abs/1406.2661) (2014).
- Kingma & Welling, [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114) (2013).
- Ho, Jain & Abbeel, [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) (2020).
- Kong, Kim & Bae, [HiFi-GAN](https://arxiv.org/abs/2010.05646) (2020).

Sources checked: 2026-09-05.
