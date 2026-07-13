<p align="center">
  <img src="https://raw.githubusercontent.com/edujbarrios/neural-audio-theory/main/static/img/logo.svg" width="96" alt="Neural Audio Theory logo" />
</p>

<h1 align="center">Neural Audio Theory</h1>

<p align="center">
  <a href="https://neural-audio-theory.vercel.app/">
    <img src="https://img.shields.io/badge/docs-live-40E0D0.svg" alt="Docs live" />
  </a>
  <a href="https://open.spotify.com/intl-es/artist/2C15mEsXxAqiKWKG4skXHY">
    <img src="https://img.shields.io/badge/author-Spotify-1DB954.svg" alt="Author on Spotify" />
  </a>
</p>

---

> [!WARNING]
> **This repository is intended for developers, researchers, and technically-minded contributors only.**
> If you are looking for the documentation website, visit [neural-audio-theory.vercel.app](https://neural-audio-theory.vercel.app/) instead.
> The source code here covers project configuration, site scaffolding, and content architecture — not the learning material itself.

## About

Neural Audio Theory is a documentation website that serves two audiences: people using AI music tools and people engineering the systems behind them.

The published site separates the material into two paths:

- **User Guides** — plain-language concepts, prompting, production workflows, troubleshooting, model overviews, and responsible-use guidance
- **Engineering Docs** — signal processing, representations, model architecture, training, evaluation, APIs, and multi-model systems

The paths share one content base so practical guidance can link to deeper technical explanations without forcing every reader through the same navigation.

## Features

- **Audience-Specific Navigation** — dedicated User Guides and Engineering Docs entry points
- **Engineering-Focused Documentation** — FFT, embedding geometry, training losses, and generation pipelines
- **Producer-Focused Guidance** — prompting, vocals, troubleshooting, mixing, and delivery workflows
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
  howpublished = {\url{https://neural-audio-theory.vercel.app/}},
  note         = {Open-source educational documentation project}
}
```

Or in plain text:

> Barrios, E. J. (2026). *Neural Audio Theory: Engineering Foundations of AI Music Generation*. Retrieved from https://neural-audio-theory.vercel.app/

---

## License

This project is licensed under the [MIT License](LICENSE).

