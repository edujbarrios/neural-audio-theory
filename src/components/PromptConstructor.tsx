import React, {useState, type CSSProperties} from 'react';

const GENRES = [
  'Jazz',
  'Electronic',
  'Rock',
  'Hip-Hop',
  'Classical',
  'Ambient',
  'Pop',
  'R&B',
  'Metal',
  'Lo-Fi',
] as const;

const TEXTURES = [
  'Warm analog',
  'Crisp digital',
  'Lo-fi vinyl',
  'Atmospheric reverb',
  'Distorted grit',
  'Clean and polished',
  'Ethereal pads',
  'Punchy and dry',
] as const;

const styles: Record<string, CSSProperties> = {
  container: {
    margin: '2rem 0',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--ifm-color-emphasis-300)',
    backgroundColor: 'var(--ifm-background-surface-color)',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--ifm-color-emphasis-600)',
    marginBottom: '1.25rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.375rem',
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--ifm-color-emphasis-700)',
  },
  select: {
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid var(--ifm-color-emphasis-300)',
    backgroundColor: 'var(--ifm-background-color)',
    color: 'var(--ifm-font-color-base)',
    fontSize: '0.875rem',
  },
  numberInput: {
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid var(--ifm-color-emphasis-300)',
    backgroundColor: 'var(--ifm-background-color)',
    color: 'var(--ifm-font-color-base)',
    fontSize: '0.875rem',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  outputSection: {
    borderTop: '1px solid var(--ifm-color-emphasis-200)',
    paddingTop: '1.25rem',
  },
  outputLabel: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--ifm-color-emphasis-600)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  promptOutput: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: 'var(--ifm-color-emphasis-100)',
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
  },
  hint: {
    fontSize: '0.75rem',
    color: 'var(--ifm-color-emphasis-500)',
    marginTop: '0.75rem',
    fontStyle: 'italic' as const,
  },
};

function buildPrompt(genre: string, bpm: number, texture: string): string {
  const parts: string[] = [];

  parts.push(`[Genre: ${genre}]`);
  parts.push(`[BPM: ${bpm}]`);
  parts.push(`[Texture: ${texture}]`);
  parts.push('');
  parts.push('[Intro]');
  parts.push(`${texture} ${genre.toLowerCase()} introduction, building atmosphere at ${bpm} BPM`);
  parts.push('');
  parts.push('[Verse]');
  parts.push(`Evolving ${genre.toLowerCase()} progression with ${texture.toLowerCase()} character`);
  parts.push('');
  parts.push('[Chorus]');
  parts.push(`Full ${genre.toLowerCase()} energy, ${texture.toLowerCase()} tones, driving rhythm at ${bpm} BPM`);
  parts.push('');
  parts.push('[Outro]');
  parts.push(`Gradual resolution, fading ${texture.toLowerCase()} elements`);

  return parts.join('\n');
}

export default function PromptConstructor(): React.ReactElement {
  const [genre, setGenre] = useState<string>(GENRES[0]);
  const [bpm, setBpm] = useState<number>(120);
  const [texture, setTexture] = useState<string>(TEXTURES[0]);

  const prompt = buildPrompt(genre, bpm, texture);

  return (
    <div style={styles.container}>
      <div style={styles.title}>Prompt Constructor</div>
      <div style={styles.subtitle}>
        Build structured Suno prompts using latent-space principles
      </div>

      <div style={styles.grid}>
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="genre-select">
            Genre
          </label>
          <select
            id="genre-select"
            style={styles.select}
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="bpm-input">
            BPM
          </label>
          <input
            id="bpm-input"
            type="number"
            min={40}
            max={240}
            step={1}
            style={styles.numberInput}
            value={bpm}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 40 && value <= 240) {
                setBpm(value);
              }
            }}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="texture-select">
            Texture
          </label>
          <select
            id="texture-select"
            style={styles.select}
            value={texture}
            onChange={(e) => setTexture(e.target.value)}
          >
            {TEXTURES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.outputSection}>
        <div style={styles.outputLabel}>Generated Prompt</div>
        <div style={styles.promptOutput}>{prompt}</div>
        <div style={styles.hint}>
          Each parameter anchors the generation to a specific region in latent
          space. More specific inputs → narrower output distribution.
        </div>
      </div>
    </div>
  );
}
