---
sidebar_position: 2
title: Prompt Engineering Guide
---

# Prompt Engineering for AI Music Systems

This guide explains prompt construction from an engineering perspective. A prompt is converted to conditioning embeddings that bias generation trajectories in latent space.

## Conditioning Embeddings

Text prompt tokens are encoded as:

$$
\mathbf{c}=\text{TextEncoder}(\text{prompt})\in\mathbb{R}^d
$$

The conditioning vector $\mathbf{c}$ is injected into the generator (cross-attention, FiLM-like modulation, or concatenative conditioning depending on architecture).

## Why Specific Prompts Work Better

Detailed terms map closer to narrower concept clusters.

- **Specific**: `"120 BPM house groove, side-chained bass, airy female vocal chop"`
- **Vague**: `"electronic song"`

Sharper conditioning reduces output variance:

$$
\operatorname{Var}[x\mid\mathbf{c}_{\text{specific}}]\ll\operatorname{Var}[x\mid\mathbf{c}_{\text{vague}}]
$$

## Structure Tokens and Arrangement Control

Section cues influence state transitions during generation:

$$
\mathbf{h}_{t+1}=f_\theta(\mathbf{h}_t,x_t,\mathbf{s}_{\text{tag}})
$$

Useful tags include intro, verse, chorus, bridge, and outro descriptors.

## Prompt Template (Engineering-Oriented)

Use this order for predictable outputs:

1. **Genre / subgenre**
2. **Tempo and meter**
3. **Instrumentation and production style**
4. **Arrangement structure**
5. **Mix and texture descriptors**

Example:

`Melodic drum and bass, 174 BPM, reese bass, chopped amen break, atmospheric pads, female vocal ad-libs, intro -> build -> drop -> outro, wide stereo, short plate reverb`

## Practical Guidance

- Lead with style and tempo constraints
- Use concrete instrument/production terms
- Add structure explicitly
- Keep descriptors consistent (avoid conflicting tags)
- Iterate with small prompt edits and compare outputs

Prompt quality improves control, but dataset scope and model architecture still bound what can be generated.
