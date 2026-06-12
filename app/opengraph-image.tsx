import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Bayty — verified construction management for the UAE and GCC';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A1628',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: 600,
              color: '#C9A84C',
              letterSpacing: '0.12em',
              fontFamily: 'serif',
            }}
          >
            BAYTY
          </span>
        </div>
        <p
          style={{
            fontSize: 28,
            fontWeight: 300,
            color: 'rgba(248,246,241,0.65)',
            letterSpacing: '0.06em',
            textAlign: 'center',
            maxWidth: 800,
            margin: 0,
          }}
        >
          Verified construction management for the UAE &amp; GCC
        </p>
        <div
          style={{
            marginTop: 48,
            width: 48,
            height: 1,
            backgroundColor: '#C9A84C',
            opacity: 0.4,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
