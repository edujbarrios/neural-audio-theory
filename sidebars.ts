import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  userGuidesSidebar: [
    {type: 'doc', id: 'user-guides/index', label: 'User Guides Home'},
    {type: 'doc', id: 'for-dummies', label: 'AI Music in Plain Language'},
    {type: 'doc', id: 'suno-prompting-guide', label: 'Prompt Engineering Guide'},
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
      label: 'Practical Tools',
      items: [
        'tools/daw-integration',
        'tools/open-source-tools',
      ],
    },
    {
      type: 'category',
      label: 'Model Guide',
      items: [
        'model-zoo/udio-and-suno',
        'model-zoo/musicgen',
        'model-zoo/musiclm',
        'model-zoo/stable-audio',
        'model-zoo/jukebox',
      ],
    },
    {
      type: 'category',
      label: 'Ethics & Legal',
      items: [
        'ethics-legal/responsible-use',
        'ethics-legal/copyright-and-training-data',
      ],
    },
  ],

  engineeringSidebar: [
    {type: 'doc', id: 'engineering/index', label: 'Engineering Docs Home'},
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
      label: 'Core Concepts',
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
    {
      type: 'category',
      label: 'Training & Evaluation',
      items: [
        'training/dataset-curation',
        'training/data-augmentation',
        'training/training-strategies',
        'training/evaluation-metrics',
      ],
    },
    {
      type: 'category',
      label: 'APIs & Integration',
      items: [
        'apis/index',
        'apis/suno-api',
        'apis/sonauto-api',
        'tools/api-reference-patterns',
      ],
    },
    {
      type: 'category',
      label: 'AI Music Agents',
      items: [
        'agents/index',
        'agents/multi-model-pipelines',
        'agents/orchestration-patterns',
        'agents/building-a-music-agent',
        'agents/evaluation-and-observability',
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
    {type: 'doc', id: 'glossary', label: 'Glossary'},
  ],
};

export default sidebars;
