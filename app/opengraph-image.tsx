import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BaytyAI — AI for GCC Facilities Management and Construction';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#07090C',
        padding: '64px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Top-left wordmark */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            color: '#C5A572',
            fontSize: '14px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          BAYTYAI
        </span>
      </div>

      {/* Center heading */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p
          style={{
            color: '#6E7681',
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          AI-NATIVE OPERATIONS INFRASTRUCTURE
        </p>
        <h1
          style={{
            color: '#E6E9EE',
            fontSize: '56px',
            fontWeight: 600,
            lineHeight: 1.1,
            margin: 0,
            maxWidth: '900px',
          }}
        >
          AI for GCC Facilities Management &amp; Construction Mega Projects
        </h1>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ color: '#6E7681', fontSize: '14px' }}>
          Laith Hamoda · Senior AI Prompt Engineer · GCC
        </span>
        <span style={{ color: '#C5A572', fontSize: '14px', letterSpacing: '0.05em' }}>
          baytyai.com
        </span>
      </div>
    </div>,
    { ...size },
  );
}
