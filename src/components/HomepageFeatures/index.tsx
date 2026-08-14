import type {ReactNode, SVGProps} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Icon: (props: SVGProps<SVGSVGElement>) => ReactNode;
  description: ReactNode;
  href: string;
  accent: 'coral' | 'violet' | 'cyan';
};

function SignalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M2 12h3l2-4 4 9 2-5 2 3h7" />
      <circle cx="7" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function NodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="5" r="2" />
      <circle cx="19" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
      <path d="M7 12h10M12 7v10M6.7 10.7 10.6 6.8M17.3 10.7 13.4 6.8M6.7 13.3l3.9 3.9M17.3 13.3l-3.9 3.9" />
    </svg>
  );
}

function PromptIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 5h16v10H8l-4 4V5Z" />
      <path d="M8 9h8M8 12h6" />
    </svg>
  );
}

const FeatureList: FeatureItem[] = [
  {
    title: 'Signal Representation Pipeline',
    Icon: SignalIcon,
    description: (
      <>
        Track the engineering path from waveform capture to STFT, mel scaling,
        and latent embeddings used by modern generative audio stacks.
      </>
    ),
    href: '/docs/audio-fundamentals/digital-audio-basics',
    accent: 'coral',
  },
  {
    title: 'Model Internals and Training',
    Icon: NodeIcon,
    description: (
      <>
        Study how transformer attention, diffusion denoising, and objective
        functions interact to optimize timbre, rhythm, and structural coherence.
      </>
    ),
    href: '/docs/architecture/transformers-for-audio',
    accent: 'violet',
  },
  {
    title: 'Conditioning and Prompt Control',
    Icon: PromptIcon,
    description: (
      <>
        Learn how text tokens become conditioning vectors that steer genre,
        arrangement, and dynamics in text-to-music inference pipelines.
      </>
    ),
    href: '/docs/advanced/controllable-generation',
    accent: 'cyan',
  },
];

function Feature({title, Icon, description, href, accent}: FeatureItem) {
  return (
    <Link className={clsx(styles.featureCard, styles[accent])} to={href}>
      <div className={styles.cardTopline} aria-hidden="true" />
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap}>
          <Icon className={styles.featureIcon} aria-hidden="true" />
        </div>
        <span className={styles.exploreLabel}>Explore →</span>
      </div>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </Link>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span>Inside the guide</span>
          <Heading as="h2">From sound to system</Heading>
          <p>Follow the complete technical path, or enter at the layer relevant to your work.</p>
        </div>
        <div className={styles.featureGrid}>
          {FeatureList.map((props) => (
            <Feature key={props.href} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
