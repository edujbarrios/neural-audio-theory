# Contributing to Neural Audio Theory

Thank you for your interest in contributing. This is a developer/researcher-facing project — contributions should maintain technical accuracy and the established tone of the documentation.

## Ways to contribute

- **Fix errors** — typos, broken math, incorrect technical statements
- **Improve existing pages** — add depth, clearer explanations, better examples
- **Add new doc pages** — fill gaps in coverage (see open issues for requested topics)
- **Report issues** — flag anything wrong via a GitHub Issue

---

## Workflow

### 1. Fork and clone

```bash
git clone https://github.com/YOUR_USERNAME/neural-audio-theory.git
cd neural-audio-theory
npm install
```

### 2. Create a branch

Use a descriptive prefix:

```bash
git checkout -b fix/mel-spectrogram-formula
git checkout -b feat/bark-scale-section
git checkout -b docs/improve-vae-explanation
```

### 3. Run locally

```bash
npm start
```

Preview at `http://localhost:3000/neural-audio-theory/`.

### 4. Make your changes

- All documentation lives in `docs/`
- New pages must be registered in `sidebars.ts` at the correct difficulty tier
- Math must use KaTeX syntax: `$inline$` or `$$block$$`

### 5. Open a pull request

- Write a clear title (e.g. `fix: correct FFT formula in signal-processing-basics`)
- Describe what you changed and why
- Reference any related issue with `Closes #N`

---

## Style guidelines

| Rule | Detail |
|---|---|
| Audience | Technically literate — developers, ML researchers, audio engineers |
| Tone | Precise and direct. No filler. |
| Math | Always KaTeX. Never write equations as plain text. |
| Code | Use fenced code blocks with language identifiers |
| Links | Link to related internal pages where relevant |
| Headers | Concise and descriptive. Avoid vague titles like "Overview" |

### Difficulty tiers (for `sidebars.ts` placement)

| Tier | Description |
|---|---|
| Beginner | Conceptual, no math required |
| Practical | Creator/producer-facing tools and workflows |
| Foundational Technical | Introductory signal processing and audio concepts |
| Intermediate | Concepts, model overviews, embeddings |
| Technical | Math-heavy — FFT, attention, loss functions |
| Advanced | Architecture internals, training, fine-tuning, research-level |

---

## Reporting issues

Open a [GitHub Issue](https://github.com/edujbarrios/neural-audio-theory/issues) and include:

- The affected page / section
- What is wrong
- What the correct information should be (with a source if possible)

---

## Code of conduct

Be respectful. Technical disagreements are fine — personal attacks are not.
