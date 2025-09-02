import React, {type CSSProperties} from 'react';

interface Point {
  x: number;
  y: number;
  label: string;
  color: string;
  type: 'genre' | 'mood';
}

const GENRE_POINTS: Point[] = [
  {x: 2, y: 7, label: 'Jazz', color: '#6366f1', type: 'genre'},
  {x: 7, y: 8, label: 'Electronic', color: '#8b5cf6', type: 'genre'},
  {x: 5, y: 3, label: 'Rock', color: '#ec4899', type: 'genre'},
  {x: 8, y: 5, label: 'Hip-Hop', color: '#f59e0b', type: 'genre'},
  {x: 3, y: 5, label: 'Classical', color: '#10b981', type: 'genre'},
];

const MOOD_POINTS: Point[] = [
  {x: 1, y: 2, label: 'Melancholic', color: '#3b82f6', type: 'mood'},
  {x: 6, y: 9, label: 'Energetic', color: '#ef4444', type: 'mood'},
  {x: 4, y: 6, label: 'Dreamy', color: '#a78bfa', type: 'mood'},
  {x: 8, y: 2, label: 'Aggressive', color: '#f97316', type: 'mood'},
  {x: 2, y: 9, label: 'Euphoric', color: '#14b8a6', type: 'mood'},
];

const GRID_SIZE = 10;
const CELL_SIZE = 48;
const PADDING = 40;

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
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--ifm-color-emphasis-600)',
    marginBottom: '1rem',
  },
  gridWrapper: {
    position: 'relative' as const,
    display: 'inline-block',
  },
  svg: {
    display: 'block',
  },
  legend: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '1rem',
    flexWrap: 'wrap' as const,
  },
  legendSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  legendTitle: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    color: 'var(--ifm-color-emphasis-600)',
    letterSpacing: '0.05em',
  },
  legendItems: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap' as const,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.8125rem',
  },
};

function PointMarker({point}: {point: Point}) {
  const cx = PADDING + point.x * CELL_SIZE;
  const cy = PADDING + (GRID_SIZE - point.y) * CELL_SIZE;
  const isGenre = point.type === 'genre';

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={isGenre ? 16 : 12}
        fill={point.color}
        opacity={0.15}
      />
      <circle
        cx={cx}
        cy={cy}
        r={isGenre ? 6 : 5}
        fill={point.color}
        stroke="white"
        strokeWidth={2}
      />
      <text
        x={cx}
        y={cy - (isGenre ? 14 : 12)}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="var(--ifm-font-color-base)"
      >
        {point.label}
      </text>
    </g>
  );
}

export default function LatentSpaceGrid(): React.ReactElement {
  const width = PADDING * 2 + GRID_SIZE * CELL_SIZE;
  const height = PADDING * 2 + GRID_SIZE * CELL_SIZE;
  const allPoints = [...GENRE_POINTS, ...MOOD_POINTS];

  return (
    <div style={styles.container}>
      <div style={styles.title}>Latent Space Visualization</div>
      <div style={styles.subtitle}>
        2D projection of genre and mood coordinates in the model's latent space
      </div>

      <div style={styles.gridWrapper}>
        <svg
          width={width}
          height={height}
          style={styles.svg}
          viewBox={`0 0 ${width} ${height}`}
        >
          {/* Grid lines */}
          {Array.from({length: GRID_SIZE + 1}, (_, i) => (
            <g key={`grid-${i}`}>
              <line
                x1={PADDING + i * CELL_SIZE}
                y1={PADDING}
                x2={PADDING + i * CELL_SIZE}
                y2={PADDING + GRID_SIZE * CELL_SIZE}
                stroke="var(--ifm-color-emphasis-200)"
                strokeWidth={1}
              />
              <line
                x1={PADDING}
                y1={PADDING + i * CELL_SIZE}
                x2={PADDING + GRID_SIZE * CELL_SIZE}
                y2={PADDING + i * CELL_SIZE}
                stroke="var(--ifm-color-emphasis-200)"
                strokeWidth={1}
              />
            </g>
          ))}

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize={12}
            fill="var(--ifm-color-emphasis-600)"
            fontWeight={500}
          >
            Dimension 1 (Energy / Tempo)
          </text>
          <text
            x={12}
            y={height / 2}
            textAnchor="middle"
            fontSize={12}
            fill="var(--ifm-color-emphasis-600)"
            fontWeight={500}
            transform={`rotate(-90, 12, ${height / 2})`}
          >
            Dimension 2 (Complexity / Texture)
          </text>

          {/* Points */}
          {allPoints.map((point) => (
            <PointMarker key={point.label} point={point} />
          ))}
        </svg>
      </div>

      <div style={styles.legend}>
        <div style={styles.legendSection}>
          <span style={styles.legendTitle}>Genres</span>
          <div style={styles.legendItems}>
            {GENRE_POINTS.map((p) => (
              <span key={p.label} style={styles.legendItem}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: p.color,
                    display: 'inline-block',
                  }}
                />
                {p.label}
              </span>
            ))}
          </div>
        </div>
        <div style={styles.legendSection}>
          <span style={styles.legendTitle}>Moods</span>
          <div style={styles.legendItems}>
            {MOOD_POINTS.map((p) => (
              <span key={p.label} style={styles.legendItem}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: p.color,
                    display: 'inline-block',
                  }}
                />
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
