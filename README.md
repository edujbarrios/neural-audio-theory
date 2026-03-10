# Neural Audio Theory

<p align="center">
  <img src="static/img/logo.svg" width="96" alt="Neural Audio Theory logo" />
</p>

<p align="center">
  <a href="https://github.com/edujbarrios/neural-audio-theory/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-teal.svg" alt="MIT License" />
  </a>
  <a href="https://neural-audio-theory.vercel.app/">
    <img src="https://img.shields.io/badge/docs-live-40E0D0.svg" alt="Docs live" />
  </a>
  <a href="https://open.spotify.com/intl-es/artist/2C15mEsXxAqiKWKG4skXHY">
    <img src="https://img.shields.io/badge/author-Spotify-1DB954.svg" alt="Author on Spotify" />
  </a>
</p>

<p align="center">
  <strong>Open-source educational project on the engineering foundations of AI music generation.</strong><br/>
  <em>By <a href="https://github.com/edujbarrios">Eduardo J. Barrios</a></em>
</p>

---

> [!WARNING]
> **This repository is intended for developers, researchers, and technically-minded contributors only.**
> If you are looking for the documentation website, visit [neural-audio-theory.vercel.app](https://neural-audio-theory.vercel.app/) instead.
> The source code here covers project configuration, site scaffolding, and content architecture — not the learning material itself.

## About

Neural Audio Theory is a documentation website that explains how modern AI music systems are built — from signal processing and embedding design to transformer/diffusion training and prompt conditioning.

## Features

- **Engineering-Focused Documentation** — FFT, embedding geometry, training losses, and generation pipelines
- **Architecture Guides** — Transformers and diffusion models for music and general audio synthesis
- **Prompt Engineering Guide** — practical conditioning strategies grounded in ML behavior
- **Interactive Components** — latent space visualization and prompt constructor utilities
- **Turquoise & Teal Design System** — always-dark UI with the edujbarrios brand palette

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

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit improvements, new pages, or bug reports.

---

## Citing this project

If you found this resource useful and want to reference it in your work or research, feel free to cite it as:

```bibtex
@misc{barrios2026neuralaudiotheory,
  author       = {Eduardo J. Barrios},
  title        = {Neural Audio Theory: Engineering Foundations of AI Music Generation},
  year         = {2026},
  howpublished = {\url{https://edujbarrios.github.io/neural-audio-theory/}},
  note         = {Open-source educational documentation project}
}
```

Or in plain text:

> Barrios, E. J. (2026). *Neural Audio Theory: Engineering Foundations of AI Music Generation*. Retrieved from https://edujbarrios.github.io/neural-audio-theory/

---

## License

This project is licensed under the [MIT License](LICENSE).

