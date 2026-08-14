import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'Neural Audio Theory',
  tagline: 'Sure, you drop AI tracks. Now learn how they actually work.',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://neural-audio-theory.vercel.app',
  baseUrl: '/',

  organizationName: 'edujbarrios',
  projectName: 'neural-audio-theory',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    metadata: [
      {
        name: 'keywords',
        content:
          'neural audio, AI music, music generation, audio machine learning, digital signal processing',
      },
      {name: 'author', content: 'Eduardo J. Barrios'},
      {property: 'og:type', content: 'website'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Neural Audio Theory',
      logo: {
        alt: 'Neural Audio Theory mark',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Overview',
        },
        {
          type: 'docSidebar',
          sidebarId: 'userGuidesSidebar',
          position: 'left',
          label: 'User Guides',
        },
        {
          type: 'docSidebar',
          sidebarId: 'engineeringSidebar',
          position: 'left',
          label: 'Engineering Docs',
        },
        {to: '/blog', label: 'Engineering Notes', position: 'left'},
        {
          href: 'https://github.com/edujbarrios/neural-audio-theory',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://open.spotify.com/intl-es/artist/2C15mEsXxAqiKWKG4skXHY',
          label: '🎵 Spotify',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'User Guides',
              to: '/docs/user-guides',
            },
            {
              label: 'Engineering Docs',
              to: '/docs/engineering',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/edujbarrios/neural-audio-theory',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Eduardo J. Barrios<br/><a href="https://github.com/edujbarrios" target="_blank" rel="noopener noreferrer" class="author-button">✍️ Written by edujbarrios</a>`,
    },
    prism: {
      theme: prismThemes.nightOwl,
      darkTheme: prismThemes.nightOwl,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
