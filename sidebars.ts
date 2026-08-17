import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  userGuidesSidebar: [
    {type: 'doc', id: 'user-guides/index', label: 'User Guides Home'},
    {type: 'doc', id: 'for-dummies', label: '1. AI Music in Plain Language'},
    {type: 'doc', id: 'suno-prompting-guide', label: '2. Prompt Engineering Guide'},
    {
      type: 'category',
      label: '3. Produce and Finish',
      items: [
        'producer-handbook/production-workflow',
        'producer-handbook/troubleshooting-generation',
        'producer-handbook/genre-specific-prompting',
        'producer-handbook/mixing-ai-outputs',
        'producer-handbook/quality-control-and-delivery',
        'producer-handbook/stem-separation',
        'producer-handbook/vocal-synthesis',
      ],
    },
    {
      type: 'category',
      label: '4. Extend Your Workflow',
      items: [
        'tools/daw-integration',
        'tools/open-source-tools',
      ],
    },
    {
      type: 'category',
      label: 'Models and Platforms',
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
      label: '5. Release Responsibly',
      items: [
        'ethics-legal/responsible-use',
        'ethics-legal/copyright-and-training-data',
      ],
    },
  ],

  engineeringSidebar: [
    {type: 'doc', id: 'engineering/index', label: 'Engineering Docs Home'},
    {type: 'doc', id: 'engineering/reliability-and-sourcing', label: 'Reliability & Sourcing'},
    {
      type: 'category',
      label: '1. Audio Fundamentals',
      items: [
        'audio-fundamentals/digital-audio-basics',
        'audio-fundamentals/psychoacoustics',
        'audio-fundamentals/music-theory-for-ai',
        'audio-fundamentals/audio-formats-and-codecs',
      ],
    },
    {
      type: 'category',
      label: '2. Representations and Concepts',
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
      label: '3. Mathematics',
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
      label: '4. Model Architecture',
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
      label: '5. Training and Evaluation',
      items: [
        'training/dataset-curation',
        'training/data-augmentation',
        'training/training-strategies',
        'training/evaluation-metrics',
        'training/benchmark-design',
      ],
    },
    {
      type: 'category',
      label: '6. APIs and Integration',
      items: [
        'apis/index',
        'apis/suno-api',
        'apis/treblo-api',
        'tools/api-reference-patterns',
      ],
    },
    {
      type: 'category',
      label: '7. AI Music Agents',
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
      label: '8. Advanced Systems',
      items: [
        'advanced/multimodal-generation',
        'advanced/controllable-generation',
        'advanced/long-form-generation',
        'advanced/fine-tuning-and-adaptation',
        'advanced/real-time-inference',
      ],
    },
    {type: 'doc', id: 'glossary', label: 'Glossary'},
  ],
};

export default sidebars;
