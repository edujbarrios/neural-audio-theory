---
sidebar_position: 2
title: Diffusion Models
---

# Diffusion Models for Audio

Diffusion models synthesize audio by learning a vector field or denoising rule that transports noise toward the data distribution. In music systems, the generated variable may be a waveform, a time-frequency representation, or—most commonly in large systems—a compressed continuous latent. Those choices are not interchangeable: they set the sequence length, decoder error floor, conditioning interface, and latency budget.

This page uses the variance-preserving diffusion formulation, then connects it to score prediction, flow matching, and practical sampler design.

## Forward Process

$$
q(x_t\mid x_{t-1})=\mathcal{N}(x_t;\sqrt{1-\beta_t}x_{t-1},\beta_t\mathbf{I})
$$

Closed-form sampling from clean data $x_0$:

$$
x_t=\sqrt{\bar{\alpha}_t}x_0+\sqrt{1-\bar{\alpha}_t}\epsilon,\quad \epsilon\sim\mathcal{N}(0,\mathbf{I})
$$

where $\alpha_t=1-\beta_t$ and $\bar{\alpha}_t=\prod_{s=1}^{t}\alpha_s$.

## What the network predicts

$$
p_\theta(x_{t-1}\mid x_t)=\mathcal{N}(x_{t-1};\boldsymbol{\mu}_\theta(x_t,t),\sigma_t^2\mathbf{I})
$$

A U-Net or diffusion transformer can predict one of several equivalent targets:

| Parameterization | Target | Practical consequence |
| --- | --- | --- |
| noise prediction | $\epsilon$ | Simple and common; loss weighting varies strongly with signal-to-noise ratio |
| data prediction | $x_0$ | Direct reconstruction target; can be unstable at very low SNR |
| velocity prediction | $v=\sqrt{\bar\alpha_t}\epsilon-\sqrt{1-\bar\alpha_t}x_0$ | Better-balanced target across noise levels in many latent systems |
| score prediction | $\nabla_{x_t}\log p_t(x_t)$ | Natural connection to score-based SDE samplers |

The targets can be converted algebraically when the noise schedule is known. A benchmark must therefore report the parameterization, schedule, loss weighting, and sampler—not just the number of inference steps.

## Training Objective

$$
\mathcal{L}_{\text{simple}}=\mathbb{E}_{t,x_0,\epsilon}[\|\epsilon-\epsilon_\theta(x_t,t,c)\|^2]
$$

The unweighted objective is a useful baseline, but modern systems commonly weight examples by SNR or sample time non-uniformly. Otherwise, easy or noisy regions of the trajectory can dominate training without improving perceived audio quality.

## Conditioning and classifier-free guidance

$$
\hat{\epsilon}_\theta=(1+w)\epsilon_\theta(x_t,t,c)-w\epsilon_\theta(x_t,t,\varnothing)
$$

During training, conditioning is randomly dropped so the same model learns conditional and unconditional predictions. At inference, guidance moves the prediction away from the unconditional result. Larger guidance often improves prompt alignment initially, but excessive guidance can reduce diversity, exaggerate transients, or cause saturation. The useful range is model- and sampler-specific.

Text alone is rarely enough for precise musical control. Production systems may also condition on:

- timing grids, chords, melody, or MIDI-like events;
- reference-audio embeddings or a masked source latent;
- section, instrumentation, and loudness metadata;
- spatial or stem assignments.

Controls should be evaluated independently. A high text-audio similarity score does not establish correct chord timing or melodic fidelity.

## Latent Diffusion for Efficiency

Many systems diffuse in compressed latent space:

1. Encode waveform/spectrogram to latent $\mathbf{z}_0$
2. Run diffusion on $\mathbf{z}$ instead of raw audio
3. Decode denoised latent to waveform

This reduces denoiser memory and compute, but it does not preserve quality automatically. The autoencoder introduces a reconstruction ceiling, and latent geometry can discard phase, stereo image, transients, or quiet detail. Always report reconstruction metrics and listening results for the codec or autoencoder separately from the generative model.

## Discrete tokens are a different model family

Diffusion over continuous codec latents and autoregression over discrete codec indices are sometimes both called “latent audio generation,” but their objectives differ. A continuous latent diffusion model predicts a denoising target. A token model predicts categorical codebook entries. Hybrid systems can combine them—for example, a semantic token planner followed by a diffusion decoder—but conclusions about sampling temperature, sequence rate, or likelihood do not transfer directly.

## Samplers and the speed-quality frontier

The training process defines a family of marginals; the sampler chooses how to traverse them. Common choices include stochastic ancestral solvers, deterministic DDIM-like updates, and higher-order ODE/SDE solvers. Fewer network evaluations reduce latency, but step count alone is not a fair speed metric: model size, latent rate, guidance passes, solver order, and hardware all matter.

For a useful comparison, report:

1. neural function evaluations per generated second;
2. end-to-end real-time factor, including decoding;
3. peak memory and numerical precision;
4. prompt adherence, distributional metrics, and blinded listening results;
5. identical prompts, durations, seeds, and post-processing.

## Flow matching and rectified paths

Flow-matching models learn a time-dependent velocity field $u_\theta(x_t,t,c)$ along a chosen probability path:

$$
\mathcal{L}_{\mathrm{FM}}=\mathbb{E}_{t,x_0,x_1}\left[\left\|u_\theta(x_t,t,c)-u_t(x_t\mid x_0,x_1)\right\|_2^2\right].
$$

They are closely related to diffusion probability-flow ODEs but permit other paths, including straighter interpolants that may require fewer solver steps. “Flow” does not by itself guarantee real-time inference; the learned path, model architecture, conditioning, and solver tolerance determine the result.

## Engineering checklist for music generation

- Keep training clips and evaluation crops long enough to measure musical structure, not only local texture.
- Separate autoencoder reconstruction failures from denoiser failures.
- Validate mono compatibility, stereo image, loudness, clipping, and boundary behavior before release.
- Measure memorization and nearest-neighbor similarity in addition to aggregate quality.
- Preserve sampler configuration and random seeds in experiment artifacts.
- Avoid mastering each system differently during a controlled comparison.

## Primary references

- Ho et al., [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) (2020)
- Song et al., [Score-Based Generative Modeling through Stochastic Differential Equations](https://arxiv.org/abs/2011.13456) (2021)
- Lipman et al., [Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747) (2023)
- Liu et al., [AudioLDM: Text-to-Audio Generation with Latent Diffusion Models](https://arxiv.org/abs/2301.12503) (2023)
