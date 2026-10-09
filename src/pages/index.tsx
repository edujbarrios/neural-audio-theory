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
          Create better music. Engineer better audio.
        </Heading>
        <p className={styles.heroSubtitle}>
          A hands-on learning hub with distinct routes for music producers,
          sound engineers, and AI/DSP developers. Make creative decisions,
          diagnose the audio signal, or explore the models behind it.
        </p>
        <div className={styles.pathGrid} aria-label="Choose a learning path">
          <Link className={clsx(styles.pathCard, styles.producerPath)} to="/docs/user-guides">
            <span className={styles.pathIcon} aria-hidden="true">♪</span>
            <span className={styles.pathCopy}>
              <span className={styles.pathLabel}>Create the music</span>
              <strong>Music producer</strong>
              <span>Build a brief, craft prompts, direct performances, arrange, edit and approve the track.</span>
            </span>
            <span className={styles.pathArrow} aria-hidden="true">→</span>
          </Link>
          <Link className={clsx(styles.pathCard, styles.engineeringPath)} to="/docs/audio-engineering">
            <span className={styles.pathIcon} aria-hidden="true">≋</span>
            <span className={styles.pathCopy}>
              <span className={styles.pathLabel}>Shape and verify the sound</span>
              <strong>Sound engineer</strong>
              <span>Prepare sessions, diagnose artifacts, mix, measure loudness, master and deliver.</span>
            </span>
            <span className={styles.pathArrow} aria-hidden="true">→</span>
          </Link>
        </div>
        <Link className={styles.technicalStrip} to="/docs/engineering">
          <span><strong>Building AI audio systems?</strong> Explore signal processing, neural codecs,
            model architectures, evaluation and deployment.</span>
          <span aria-hidden="true">AI / DSP engineering →</span>
        </Link>
        <p className={styles.proofLine}>
          Open source · role-specific guides · practical settings with context · primary sources
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
              <Heading as="h2" id="start-heading">From a creative idea to a release-ready master</Heading>
              <p>
                Follow the handoff from producer to sound engineer. Start with an
                approved arrangement; continue through corrective listening,
                mixing and mastering; finish with measurable quality control
                and a transparent release record.
              </p>
              <Link to="/docs/user-guides">Explore the producer workflow →</Link>
              <br />
              <Link to="/docs/audio-engineering/mastering-for-streaming">See streaming mastering settings →</Link>
            </div>
            <ol className={styles.signalFlow} aria-label="Neural audio learning sequence">
              <li><span>01</span><strong>Direct</strong><small>Brief, prompt & select</small></li>
              <li><span>02</span><strong>Produce</strong><small>Arrange, edit & approve</small></li>
              <li><span>03</span><strong>Engineer</strong><small>Repair, mix & master</small></li>
              <li><span>04</span><strong>Verify</strong><small>Measure, credit & release</small></li>
            </ol>
          </div>
        </section>
      </main>
    </Layout>
  );
}
