import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={clsx('container', styles.heroContainer)}>
        <p className={styles.eyebrow}>Neural Audio Theory</p>
        <Heading as="h1" className={styles.heroTitle}>
          Understand How AI Music Systems Are Engineered
        </Heading>
        <p className={styles.heroSubtitle}>
          A practical, technically rigorous guide to creating with AI music
          systems, understanding their internals, and evaluating their limits.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Explore the guide
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/user-guides">
            Producer path
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/engineering">
            Engineering path
          </Link>
        </div>
        <p className={styles.proofLine}>
          Open source · 50+ focused chapters · equations, workflows, and primary references
        </p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Engineering AI Music"
      description="Open-source educational project about the engineering principles behind AI music generation.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.startSection} aria-labelledby="start-heading">
          <div className="container">
            <Heading as="h2" id="start-heading">Choose the depth you need</Heading>
            <p>
              Start with production decisions, or follow the full path from digital audio
              through representations, architectures, training, evaluation, and deployment.
            </p>
            <Link to="/docs/intro">See the complete learning map →</Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
