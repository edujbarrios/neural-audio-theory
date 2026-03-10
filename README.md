# Neural Audio Theory

**By Eduardo J. Barrios**

> Open-source educational project on the engineering foundations of AI music generation.

> [!WARNING]
> **This repository is intended for developers, researchers, and technically-minded contributors only.**
> If you are looking for the documentation website, visit [the live site](https://edujbarrios.github.io/neural-audio-theory/) instead.
> The source code here covers project configuration, site scaffolding, and content architecture — not the learning material itself.



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

## Contributing

Contributions are welcome and appreciated. Here is how to get involved:

### Fixing or improving existing docs

1. Fork the repository
2. Create a branch: `git checkout -b fix/your-topic`
3. Edit the relevant `.md` file inside `docs/`
4. Run `npm start` locally to preview your changes
5. Open a pull request with a clear description of what you changed and why

### Adding a new doc page

1. Create your `.md` file in the appropriate `docs/` subfolder
2. Register it in `sidebars.ts` at the correct difficulty position
3. Make sure it follows the same tone and technical depth as surrounding pages
4. Open a pull request

### Reporting issues

Open a [GitHub Issue](https://github.com/edujbarrios/neural-audio-theory/issues) describing the problem, the affected page, and the expected correction.

### Style guidelines

- Write in clear, precise English aimed at technically literate readers
- Use KaTeX for all math expressions (`$inline$` or `$$block$$`)
- Link to related internal pages where relevant
- Keep section headers concise and descriptive

---

## Citing this project

If you found this resource useful and want to reference it in your work or research, feel free to cite it as:

```bibtex
@misc{barrios2025neuralaudiotheory,
  author       = {Eduardo J. Barrios},
  title        = {Neural Audio Theory: Engineering Foundations of AI Music Generation},
  year         = {2025},
  howpublished = {\url{https://edujbarrios.github.io/neural-audio-theory/}},
  note         = {Open-source educational documentation project}
}
```

Or in plain text:

> Barrios, E. J. (2025). *Neural Audio Theory: Engineering Foundations of AI Music Generation*. Retrieved from https://edujbarrios.github.io/neural-audio-theory/

---

## License

This project is licensed under the [MIT License](LICENSE).
