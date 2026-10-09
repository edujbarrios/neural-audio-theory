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
    title: 'Produce and arrange',
    Icon: SignalIcon,
    description: (
      <>
        Plan a track, write controlled prompts, select takes, direct vocals
        and shape the arrangement before committing to a mix.
      </>
    ),
    href: '/docs/user-guides',
    accent: 'coral',
  },
  {
    title: 'Mix and master audio',
    Icon: NodeIcon,
    description: (
      <>
        Prepare DAW sessions, identify masking or separation artifacts,
        use measured processing and validate final masters for streaming.
      </>
    ),
    href: '/docs/audio-engineering',
    accent: 'violet',
  },
  {
    title: 'Research and build AI systems',
    Icon: PromptIcon,
    description: (
      <>
        Explore waveforms, spectrograms, codec tokens, model architectures,
        conditioning, benchmarks and production integrations.
      </>
    ),
    href: '/docs/engineering',
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
          <Heading as="h2">Choose the detail level that fits your work</Heading>
          <p>
            One knowledge base, three clearly separated workflows. Practical guides
            link to deeper engineering explanations when needed.
          </p>
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
