---
sidebar_position: 1
title: AI Music Agents Overview
---

# AI Music Agents

An **AI music agent** is an orchestration layer that chains multiple AI models together — each contributing a different capability — to produce results no single model can achieve alone. Rather than sending one prompt to one service, an agent decides *which models to invoke*, *in what order*, and *how to pass outputs between them*.

This section covers the patterns, architectures, and concrete recipes for building agent-driven music workflows.

## Why Agents?

Every current AI music model excels at something and struggles with something else:

| Model | Strengths | Weaknesses |
|-------|-----------|------------|
| **Suno** | Full-song generation, vocal quality, catchy hooks | Limited structural control, no stem output |
| **Sonauto** | Extend/inpaint, lyrics alignment, API-first | Shorter base generations (v2 ~95 s) |
| **MusicGen** | Melody conditioning, open weights, deterministic | No vocals, shorter clips |
| **MusicLM** | Semantic richness from text, good timbre | Closed, lower audio fidelity |
| **Stable Audio** | High-fidelity stereo, timing control, long-form | Primarily instrumental |
| **Jukebox** | Raw audio style transfer, genre depth | Extremely slow, legacy |

An agent can route tasks to whichever model fits best, or pipeline several models in sequence to compound their strengths.

## What's Covered

| Guide | Description |
|-------|-------------|
| [Multi-Model Pipelines](./multi-model-pipelines) | Chain models sequentially: generate → extend → separate → remix |
| [Orchestration Patterns](./orchestration-patterns) | Selector, fan-out/fan-in, critic-loop, and hybrid agent patterns |
| [Building a Music Agent](./building-a-music-agent) | Step-by-step: design, implement, and deploy an agent in Python |
