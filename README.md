# Neural Audio Theory

**By Eduardo J. Barrios**

> Open-source educational project on the engineering foundations of AI music generation.

## About

Neural Audio Theory is a documentation website that explains how modern AI music systems are built, from signal processing and embedding design to transformer/diffusion training and prompt conditioning.

## Features

- **Engineering-Focused Documentation** — FFT, embedding geometry, training losses, and generation pipelines
- **Architecture Guides** — Transformers and diffusion models for music and general audio synthesis
- **Prompt Engineering Guide** — practical conditioning strategies grounded in ML behavior
- **Interactive Components** — latent space visualization and prompt constructor utilities
- **Dark Yellow Design System** — always-dark UI with a yellow-accent palette

## Tech Stack

| Technology | Purpose |
|---|---|
| [Docusaurus 3](https://docusaurus.io/) | Static site generation and documentation framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development across config and components |
| [React](https://react.dev/) | Interactive UI components |
| [KaTeX](https://katex.org/) | LaTeX math rendering (remark-math + rehype-katex) |


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20.0 or higher
- npm v9 or higher

### Installation

```bash
git clone https://github.com/edujbarrios/neural-audio-theory.git
cd neural-audio-theory
npm install
```

### Development

```bash
npm start
```

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

## License

This project is licensed under the [MIT License](LICENSE).
