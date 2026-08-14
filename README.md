<p align="center">
  <a href="https://neural-audio-theory.vercel.app/">
    <img src="https://raw.githubusercontent.com/edujbarrios/neural-audio-theory/main/static/img/logo.svg" width="104" alt="Neural Audio Theory logo" />
  </a>
</p>

<h1 align="center">Neural Audio Theory</h1>

<p align="center">
  <strong>Learn to create with AI music systems—and understand how they work.</strong>
</p>

<p align="center">
  An open educational reference connecting practical music-generation workflows with the engineering foundations behind neural audio.
</p>

<p align="center">
  <a href="https://neural-audio-theory.vercel.app/"><img src="https://img.shields.io/badge/read_the_docs-live-40E0D0?style=flat-square" alt="Read the live documentation" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-22C7A9?style=flat-square" alt="MIT License" /></a>
  <a href="package.json"><img src="https://img.shields.io/badge/node-%3E%3D20-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 20 or newer" /></a>
  <a href="https://docusaurus.io/"><img src="https://img.shields.io/badge/Docusaurus-3.10-3ECC5F?style=flat-square&logo=docusaurus&logoColor=white" alt="Built with Docusaurus 3.10" /></a>
</p>

<p align="center">
  <a href="https://neural-audio-theory.vercel.app/docs/user-guides">User Guides</a>
  ·
  <a href="https://neural-audio-theory.vercel.app/docs/engineering">Engineering Docs</a>
  ·
  <a href="https://neural-audio-theory.vercel.app/blog">Engineering Notes</a>
  ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

---

## About the project

Neural Audio Theory is a documentation-first open-source project for the full AI music community. It gives producers actionable guidance without hiding the limitations of generative systems, and gives engineers a connected reference for the representations, architectures, training methods, and evaluation practices behind them.

The project treats practical and technical knowledge as two views of the same system. A prompt-writing guide can lead into text-audio alignment; a stem workflow can lead into neural codecs; a generation artifact can lead into model evaluation. Readers choose the depth they need without losing those connections.

> [!TIP]
> The repository contains the Docusaurus source, configuration, and all documentation content. For the best reading experience, use the [published documentation site](https://neural-audio-theory.vercel.app/).

## Choose your path

| Path | Designed for | What you will find |
| --- | --- | --- |
| **[User Guides](https://neural-audio-theory.vercel.app/docs/user-guides)** | Musicians, producers, and curious readers | Plain-language concepts, prompting, vocals, production workflows, troubleshooting, model overviews, and responsible-use guidance |
| **[Engineering Docs](https://neural-audio-theory.vercel.app/docs/engineering)** | Developers, researchers, audio engineers, and technical readers | Signal processing, representations, model architecture, training, evaluation, APIs, agents, and advanced system design |

Both paths share one knowledge base and cross-link where a practical decision benefits from a technical explanation.

Technical and time-sensitive claims follow a published [reliability and sourcing standard](https://neural-audio-theory.vercel.app/docs/engineering/reliability-and-sourcing), including explicit treatment of documented facts, observations, inference, and unknowns.

## What is covered

- **AI music workflows** — planning, prompting, candidate selection, editing, mixing, stem separation, delivery, and troubleshooting
- **Vocal direction** — register, technique, tone, delivery, arrangement roles, and reusable prompt recipes
- **Audio foundations** — digital audio, formats, psychoacoustics, music theory, FFTs, and mel spectrograms
- **Representations** — symbolic music, embeddings, latent spaces, spectrograms, and neural audio codecs
- **Generative architectures** — transformers, diffusion models, VAEs, GANs, and U-Nets
- **Training and evaluation** — dataset curation, augmentation, objectives, strategies, metrics, and listening tests
- **Models and integrations** — model overviews, hosted APIs, open-source tools, DAW integration, and API design patterns
- **AI music agents** — multi-model pipelines, orchestration, observability, and evaluation
- **Responsible development and use** — copyright, training data, attribution, consent, and release considerations

## Project highlights

- Two audience-specific documentation paths with stable page URLs
- More than 50 focused guides across practical, foundational, and advanced topics
- Equations rendered with KaTeX and code examples with syntax highlighting
- Interactive React components for prompt construction and latent-space concepts
- Cross-references between producer workflows and engineering explanations
- Static production builds suitable for fast global deployment

## Technology

| Technology | Role |
| --- | --- |
| [Docusaurus 3](https://docusaurus.io/) | Documentation framework and static-site generation |
| [React 19](https://react.dev/) | Interactive documentation components |
| [TypeScript](https://www.typescriptlang.org/) | Typed configuration and component development |
| [MDX](https://mdxjs.com/) | Documentation content with embedded React |
| [KaTeX](https://katex.org/) | Mathematical notation through Remark and Rehype plugins |
| [Prism](https://prismjs.com/) | Syntax highlighting |
| [Vercel](https://vercel.com/) | Production deployment |

## Quick start

### Requirements

- Node.js 20 or newer
- npm 9 or newer
- Git

### Run locally

```bash
git clone https://github.com/edujbarrios/neural-audio-theory.git
cd neural-audio-theory
npm install
npm start
```

Docusaurus starts the development server at `http://localhost:3000` and reloads when documentation or source files change.

### Validate a change

```bash
npm run typecheck
npm run build
```

The production build is written to `build/`. Run `npm run serve` to inspect that output locally.

### Available commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the local development server with live reload |
| `npm run build` | Generate an optimized production site and validate document links |
| `npm run serve` | Serve the generated `build/` directory locally |
| `npm run typecheck` | Check TypeScript configuration and components |
| `npm run clear` | Remove Docusaurus caches and generated metadata |
| `npm run write-heading-ids` | Add explicit IDs to documentation headings |

## Working on the documentation

All learning material lives in `docs/` as Markdown or MDX. Navigation is intentionally divided between `userGuidesSidebar` and `engineeringSidebar` in `sidebars.ts`.

When adding or moving a page:

1. Choose the audience that benefits most from the page.
2. Add concise front matter and a single descriptive H1.
3. Register the document in the appropriate sidebar.
4. Link related practical and technical pages where useful.
5. Run the typecheck and production build before opening a pull request.

### Content quality principles

- **Accurate** — distinguish established behavior from model-specific observations or inference.
- **Audience-aware** — explain unfamiliar terms in User Guides; preserve technical precision in Engineering Docs.
- **Actionable** — connect concepts to decisions, diagnostics, examples, or implementation patterns.
- **Reproducible** — include relevant settings, assumptions, units, and evaluation criteria.
- **Responsible** — address rights, consent, attribution, provenance, and limitations where they affect use.
- **Connected** — prefer useful internal links over repeating the same explanation in multiple pages.

Use `$...$` for inline mathematics and `$$...$$` for display equations. Code blocks should include a language identifier whenever one applies.

## Repository structure

```text
neural-audio-theory/
├── blog/                    # Engineering notes and author metadata
├── docs/                    # User Guides and Engineering Docs content
│   ├── producer-handbook/  # Practical production workflows
│   ├── audio-fundamentals/ # Digital audio and listening foundations
│   ├── concepts/           # Representations, embeddings, and alignment
│   ├── architecture/       # Neural generation architectures
│   ├── training/           # Data, optimization, and evaluation
│   ├── agents/             # Multi-model systems and observability
│   └── advanced/           # Fine-tuning, control, and real-time inference
├── src/
│   ├── components/         # Reusable and interactive React components
│   ├── css/                # Global visual system
│   └── pages/              # Custom site pages
├── static/                 # Logos, icons, social cards, and robots.txt
├── docusaurus.config.ts    # Site, navigation, plugin, and theme configuration
├── sidebars.ts             # Audience-specific documentation navigation
├── package.json            # Dependencies, scripts, and runtime requirements
└── vercel.json             # Production build and routing configuration
```

## Deployment

The site is configured as a static Docusaurus deployment on Vercel:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `build`

No runtime server or database is required. Other static hosts can deploy the same `build/` output; update `url` and `baseUrl` in `docusaurus.config.ts` when hosting under a different origin or path.

## Support and feedback

- Use [GitHub Issues](https://github.com/edujbarrios/neural-audio-theory/issues) for factual corrections, content requests, rendering defects, and accessibility problems.
- Include the affected page, expected result, actual result, and a reliable source when reporting a technical inaccuracy.
- Do not include private prompts, licensed source audio, access tokens, or personal information in public reports.

## Contributing

Contributions that improve accuracy, clarity, coverage, examples, navigation, accessibility, or the reader experience are welcome.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. It explains the branch workflow, documentation conventions, KaTeX usage, validation expectations, and issue-reporting guidance.

Good first contributions include:

- Correcting an inaccurate or outdated explanation
- Improving a confusing example or diagram
- Adding a missing cross-reference
- Expanding a practical troubleshooting case
- Reporting a broken link, rendering problem, or accessibility issue

## Citation

If this project supports your work, teaching, or research, cite it as:

```bibtex
@misc{barrios2026neuralaudiotheory,
  author       = {Eduardo J. Barrios},
  title        = {Neural Audio Theory: Engineering Foundations of AI Music Generation},
  year         = {2026},
  howpublished = {\url{https://neural-audio-theory.vercel.app/}},
  note         = {Open-source educational documentation project}
}
```

Plain text:

> Barrios, E. J. (2026). *Neural Audio Theory: Engineering Foundations of AI Music Generation*. https://neural-audio-theory.vercel.app/

## Author

Created and maintained by [Eduardo J. Barrios](https://github.com/edujbarrios). You can also find the author's music on [Spotify](https://open.spotify.com/intl-es/artist/2C15mEsXxAqiKWKG4skXHY).

## License

Released under the [MIT License](LICENSE). You may use, copy, modify, merge, publish, and distribute the project under its terms.
