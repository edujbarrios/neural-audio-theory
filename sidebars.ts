import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    // ── Beginner ────────────────────────────────────────────────
    'intro',
    'for-dummies',
    'suno-prompting-guide',
    {
      type: 'category',
      label: 'Ethics & Legal',
      items: [
        'ethics-legal/responsible-use',
        'ethics-legal/copyright-and-training-data',
      ],
    },
    // ── Practical / Creator-facing ───────────────────────────────
    {
      type: 'category',
      label: 'Producer Handbook',
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
      label: 'Tools & Ecosystem',
      items: [
        'tools/daw-integration',
        'tools/open-source-tools',
        'tools/api-reference-patterns',
      ],
    },
    // ── Foundational Technical ───────────────────────────────────
    {
      type: 'category',
      label: 'Audio Fundamentals',
      items: [
        'audio-fundamentals/digital-audio-basics',
        'audio-fundamentals/psychoacoustics',
        'audio-fundamentals/music-theory-for-ai',
        'audio-fundamentals/audio-formats-and-codecs',
      ],
    },
    // ── Intermediate ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Concepts',
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
      label: 'Model Zoo',
      items: [
        'model-zoo/udio-and-suno',
        'model-zoo/musicgen',
        'model-zoo/musiclm',
        'model-zoo/stable-audio',
        'model-zoo/jukebox',
      ],
    },
    // ── Technical / Math-heavy ───────────────────────────────────
    {
      type: 'category',
      label: 'Mathematics',
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
      label: 'Architecture',
      items: [
        'architecture/transformers-for-audio',
        'architecture/variational-autoencoders',
        'architecture/gan-architectures',
        'architecture/diffusion-models',
        'architecture/u-net-for-audio',
      ],
    },
    // ── Advanced / Research-level ────────────────────────────────
    {
      type: 'category',
      label: 'Training',
      items: [
        'training/dataset-curation',
        'training/data-augmentation',
        'training/training-strategies',
        'training/evaluation-metrics',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      items: [
        'advanced/multimodal-generation',
        'advanced/controllable-generation',
        'advanced/fine-tuning-and-adaptation',
        'advanced/real-time-inference',
      ],
    },
    // ── Reference ────────────────────────────────────────────────
    'glossary',
  ],
};

export default sidebars;
