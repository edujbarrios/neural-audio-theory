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
        <div className={styles.pathGrid} aria-label="Choose a learning path">
          <Link className={clsx(styles.pathCard, styles.producerPath)} to="/docs/user-guides">
            <span className={styles.pathIcon} aria-hidden="true">♪</span>
            <span className={styles.pathCopy}>
              <span className={styles.pathLabel}>For music makers</span>
              <strong>Producer path</strong>
              <span>Prompt, arrange, troubleshoot, mix, and release.</span>
            </span>
            <span className={styles.pathArrow} aria-hidden="true">→</span>
          </Link>
          <Link className={clsx(styles.pathCard, styles.engineeringPath)} to="/docs/engineering">
            <span className={styles.pathIcon} aria-hidden="true">∿</span>
            <span className={styles.pathCopy}>
              <span className={styles.pathLabel}>For technical readers</span>
              <strong>Engineering path</strong>
              <span>Study signals, models, training, evaluation, and deployment.</span>
            </span>
            <span className={styles.pathArrow} aria-hidden="true">→</span>
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
          <div className={clsx('container', styles.startContainer)}>
            <div className={styles.startCopy}>
              <span className={styles.sectionLabel}>A connected curriculum</span>
              <Heading as="h2" id="start-heading">See the whole signal path</Heading>
              <p>
                Move from physical sound to representations, generation, and a measured output—without losing the connections between each layer.
              </p>
              <Link to="/docs/intro">Open the complete learning map →</Link>
            </div>
            <ol className={styles.signalFlow} aria-label="Neural audio learning sequence">
              <li><span>01</span><strong>Sound</strong><small>Waveforms & perception</small></li>
              <li><span>02</span><strong>Represent</strong><small>Spectra, tokens & latents</small></li>
              <li><span>03</span><strong>Generate</strong><small>Models & conditioning</small></li>
              <li><span>04</span><strong>Evaluate</strong><small>Listening & measurements</small></li>
            </ol>
          </div>
        </section>
      </main>
    </Layout>
  );
}
