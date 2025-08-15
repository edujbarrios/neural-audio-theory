import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    'for-dummies',
    'suno-prompting-guide',
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
      label: 'Concepts',
      items: [
        'concepts/audio-embeddings',
        'concepts/latent-space-mapping',
        'concepts/neural-audio-codecs',
        'concepts/text-audio-alignment',
        'concepts/music-representations',
      ],
    },
    {
      type: 'category',
      label: 'Mathematics',
      items: [
        'mathematics/fft',
        'mathematics/loss-functions',
        'mathematics/mel-spectrograms',
        'mathematics/attention-math',
        'mathematics/signal-processing-basics',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/transformers-for-audio',
        'architecture/diffusion-models',
        'architecture/variational-autoencoders',
        'architecture/gan-architectures',
        'architecture/u-net-for-audio',
      ],
    },
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
      label: 'Model Zoo',
      items: [
        'model-zoo/musiclm',
        'model-zoo/musicgen',
        'model-zoo/stable-audio',
        'model-zoo/jukebox',
        'model-zoo/udio-and-suno',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      items: [
        'advanced/multimodal-generation',
        'advanced/real-time-inference',
        'advanced/fine-tuning-and-adaptation',
        'advanced/controllable-generation',
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
    {
      type: 'category',
      label: 'Ethics & Legal',
      items: [
        'ethics-legal/copyright-and-training-data',
        'ethics-legal/responsible-use',
      ],
    },
    'glossary',
  ],
};

export default sidebars;
