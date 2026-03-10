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
          Sure, everyone knows you&apos;re cool for dropping AI-generated tracks
          before anyone even noticed. But hey — let&apos;s actually learn how it
          works, so you can speak about it with real authority.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Launch Docs
          </Link>
        </div>
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
      </main>
    </Layout>
  );
}
