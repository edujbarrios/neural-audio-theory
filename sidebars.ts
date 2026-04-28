import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    // ── 01–03  Beginner ──────────────────────────────────────────
    { type: 'doc', id: 'intro',                label: '01 · Introduction' },
    { type: 'doc', id: 'for-dummies',          label: '02 · For Dummies' },
    { type: 'doc', id: 'suno-prompting-guide', label: '03 · Prompt Engineering Guide' },
    // ── 04  Ethics ───────────────────────────────────────────────
    {
      type: 'category',
      label: '04 · Ethics & Legal',
      items: [
        'ethics-legal/responsible-use',
        'ethics-legal/copyright-and-training-data',
      ],
    },
    // ── 05–07  Practical / Creator-facing ───────────────────────
    {
      type: 'category',
      label: '05 · Producer Handbook',
      items: [
        'producer-handbook/production-workflow',
        'producer-handbook/troubleshooting-generation',
        'producer-handbook/genre-specific-prompting',
        'producer-handbook/mixing-ai-outputs',
        'producer-handbook/stem-separation',
        'producer-handbook/vocal-synthesis',
      ],
    },
    {
      type: 'category',
      label: '06 · Tools & Ecosystem',
      items: [
        'tools/daw-integration',
        'tools/open-source-tools',
        'tools/api-reference-patterns',
      ],
    },
    {
      type: 'category',
      label: '07 · APIs',
      items: [
        'apis/index',
        'apis/suno-api',
        'apis/sonauto-api',
      ],
    },
    {
      type: 'category',
      label: '08 · AI Music Agents',
      items: [
        'agents/index',
        'agents/multi-model-pipelines',
        'agents/orchestration-patterns',
        'agents/building-a-music-agent',
      ],
    },
    // ── 09  Foundational Technical ───────────────────────────────
    {
      type: 'category',
      label: '09 · Audio Fundamentals',
      items: [
        'audio-fundamentals/digital-audio-basics',
        'audio-fundamentals/psychoacoustics',
        'audio-fundamentals/music-theory-for-ai',
        'audio-fundamentals/audio-formats-and-codecs',
      ],
    },
    // ── 10–11  Intermediate ──────────────────────────────────────
    {
      type: 'category',
      label: '10 · Concepts',
      items: [
        'concepts/music-representations',
        'concepts/audio-embeddings',
        'concepts/neural-audio-codecs',
        'concepts/latent-space-mapping',
        'concepts/text-audio-alignment',
      ],
    },
    {
      type: 'category',
      label: '11 · Model Zoo',
      items: [
        'model-zoo/udio-and-suno',
        'model-zoo/musicgen',
        'model-zoo/musiclm',
        'model-zoo/stable-audio',
        'model-zoo/jukebox',
      ],
    },
    // ── 12–13  Technical / Math-heavy ────────────────────────────
    {
      type: 'category',
      label: '12 · Mathematics',
      items: [
        'mathematics/signal-processing-basics',
        'mathematics/fft',
        'mathematics/mel-spectrograms',
        'mathematics/loss-functions',
        'mathematics/attention-math',
      ],
    },
    {
      type: 'category',
      label: '13 · Architecture',
      items: [
        'architecture/transformers-for-audio',
        'architecture/variational-autoencoders',
        'architecture/gan-architectures',
        'architecture/diffusion-models',
        'architecture/u-net-for-audio',
      ],
    },
    // ── 14–15  Advanced / Research-level ─────────────────────────
    {
      type: 'category',
      label: '14 · Training',
      items: [
        'training/dataset-curation',
        'training/data-augmentation',
        'training/training-strategies',
        'training/evaluation-metrics',
      ],
    },
    {
      type: 'category',
      label: '15 · Advanced Topics',
      items: [
        'advanced/multimodal-generation',
        'advanced/controllable-generation',
        'advanced/fine-tuning-and-adaptation',
        'advanced/real-time-inference',
      ],
    },
    // ── 16  Reference ─────────────────────────────────────────────
    { type: 'doc', id: 'glossary', label: '16 · Glossary' },
  ],
};

export default sidebars;
