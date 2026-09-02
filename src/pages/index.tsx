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
          Understand How Neural Audio and AI Music Systems Work
        </Heading>
        <p className={styles.heroSubtitle}>
          An open educational guide to creating with AI music tools and studying
          the signal representations, model architectures, conditioning methods,
          evaluation practices, and limitations behind them.
        </p>
        <div className={styles.pathGrid} aria-label="Choose a learning path">
          <Link className={clsx(styles.pathCard, styles.producerPath)} to="/docs/user-guides">
            <span className={styles.pathIcon} aria-hidden="true">♪</span>
            <span className={styles.pathCopy}>
              <span className={styles.pathLabel}>For music makers</span>
              <strong>Producer path</strong>
              <span>Prompt, compare, troubleshoot, edit, mix, and prepare releases.</span>
            </span>
            <span className={styles.pathArrow} aria-hidden="true">→</span>
          </Link>
          <Link className={clsx(styles.pathCard, styles.engineeringPath)} to="/docs/engineering">
            <span className={styles.pathIcon} aria-hidden="true">∿</span>
            <span className={styles.pathCopy}>
              <span className={styles.pathLabel}>For technical readers</span>
              <strong>Engineering path</strong>
              <span>Study signals, representations, models, training, evaluation, and deployment.</span>
            </span>
            <span className={styles.pathArrow} aria-hidden="true">→</span>
          </Link>
        </div>
        <p className={styles.proofLine}>
          Open source · producer and engineering tracks · equations, workflows, and cited technical claims
        </p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Neural Audio and AI Music Engineering"
      description="Open-source guide to neural audio, AI music workflows, model architectures, conditioning, evaluation, and system limitations.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.startSection} aria-labelledby="start-heading">
          <div className={clsx('container', styles.startContainer)}>
            <div className={styles.startCopy}>
              <span className={styles.sectionLabel}>A connected curriculum</span>
              <Heading as="h2" id="start-heading">Follow the signal path without assuming one universal architecture</Heading>
              <p>
                Move from physical sound to digital representations, model inputs and outputs,
                generation, and evaluation. The guide compares common design patterns while
                calling out where real systems differ or published details are unavailable.
              </p>
              <Link to="/docs/intro">Open the complete learning map →</Link>
              <br />
              <Link to="/docs/engineering/reliability-and-sourcing">Read the reliability and sourcing standard →</Link>
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
