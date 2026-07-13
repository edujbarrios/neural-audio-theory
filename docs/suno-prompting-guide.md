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

## Turn an Idea into a Testable Prompt

Start with a one-sentence brief, then translate each part into a constraint the model can act on.

| Brief question | Prompt constraint | Example |
| --- | --- | --- |
| What style is it? | Genre and subgenre | `melodic drum and bass` |
| How should it move? | Tempo, meter, and groove | `174 BPM, driving breakbeat` |
| What carries the track? | Lead and supporting instruments | `reese bass, atmospheric pads` |
| How should it develop? | Section sequence and contrast | `sparse intro -> full drop -> short outro` |
| How should it feel sonically? | Mix and texture | `wide stereo, controlled low end` |

This translation makes vague goals visible. For example, replace `make the chorus exciting` with `half-time verse -> full-time chorus, doubled drums, brighter synth layer`.

## Resolve Conflicting Constraints

Prompt terms compete for influence. When two instructions imply different arrangements or textures, decide which one is primary instead of asking the model to satisfy both equally.

- Replace `minimal, huge wall of sound` with `minimal verse, dense chorus`.
- Replace `acoustic, heavily processed synth texture` with `acoustic guitar lead over subtle granular ambience`.
- Replace `slow and energetic` with `92 BPM, double-time hi-hats`.

Assigning each descriptor to a section, instrument, or rhythmic layer preserves the creative contrast while removing ambiguity.

## Run Controlled Prompt Experiments

Treat each revision as a small experiment:

1. Save a baseline prompt and its strongest output.
2. Choose one variable to test, such as groove, instrumentation, structure, or mix language.
3. Keep the seed and generation settings fixed when the system exposes them.
4. Generate the same number of candidates for the baseline and revision.
5. Compare the outputs against a short rubric instead of relying on memory.

| Criterion | Question |
| --- | --- |
| Style match | Does the output stay inside the intended genre and era? |
| Structure | Are sections distinct and ordered as requested? |
| Groove | Do tempo, meter, and rhythmic feel match the brief? |
| Timbre | Are the requested sound sources recognizable? |
| Mix direction | Is the density, space, and stereo character appropriate? |

Record the prompt, settings, candidate count, and result. If a revision improves one criterion but damages another, keep the useful phrase and narrow its scope in the next prompt.

:::tip Keep a prompt changelog
Write one sentence per revision: `Changed X because Y; result Z.` This is enough to reproduce successful decisions without creating heavy project documentation.
:::

## Practical Guidance

- Lead with style and tempo constraints
- Use concrete instrument/production terms
- Add structure explicitly
- Keep descriptors consistent (avoid conflicting tags)
- Iterate with small prompt edits and compare outputs
- Preserve generation settings during comparisons when possible
- Score results against the same short rubric

Prompt quality improves control, but dataset scope and model architecture still bound what can be generated.
