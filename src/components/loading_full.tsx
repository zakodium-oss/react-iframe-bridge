import Spinner from './spinner.js';

export default function LoadingFull() {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner
        style={{ width: '2.5rem', height: '2.5rem', color: '#6a7282' }}
      />
    </div>
  );
}
