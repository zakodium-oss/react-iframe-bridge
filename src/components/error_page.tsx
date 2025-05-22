import type { ReactNode } from 'react';

interface ErrorPageProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export default function ErrorPage(props: ErrorPageProps) {
  return (
    <div style={{ maxWidth: '56rem', margin: 'auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingInline: '0.5rem',
          paddingTop: '1rem',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginTop: '4rem',
              color: '#1c398e',
            }}
          >
            {props.title}
          </h1>
          <h2 style={{ marginTop: '4rem', fontSize: '1.125rem' }}>
            {props.subtitle}
          </h2>
          <div style={{ marginTop: '1rem' }}>{props.children}</div>
        </div>
      </div>
    </div>
  );
}
