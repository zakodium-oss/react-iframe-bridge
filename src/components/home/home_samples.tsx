import type { RocQueryResult } from '../../hooks/use_roc_query.js';
import { useRocQuery } from '../../hooks/use_roc_query.js';
import type { TocEntry } from '../../types/db.js';
import Spinner from '../spinner.js';

import { useHomeContext, useHomeDispatchContext } from './home_context.js';
import HomeSelector from './home_selector.js';

export default function HomeSamples() {
  const { loading, error, result } = useRocQuery<TocEntry>('sample_toc');
  if (error) {
    return <div>Failed to load sample ToC: {error?.message}</div>;
  }
  return (
    <>
      <h1
        style={{
          marginBottom: '1rem',
          textAlign: 'center',
          fontSize: '1.125rem',
          fontWeight: 'bold',
        }}
      >
        Sample TOC
      </h1>
      <div style={{ flex: 1 }}>
        {loading || !result ? <Loading /> : <SampleToc samples={result} />}
      </div>
    </>
  );
}

function SampleToc(props: { samples: Array<RocQueryResult<TocEntry>> }) {
  const { selectedSample } = useHomeContext();
  const dispatch = useHomeDispatchContext();
  function selectSample(id: string) {
    dispatch({ type: 'SELECT_SAMPLE', payload: id });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {props.samples.map((sample) => (
        <HomeSelector
          key={sample.id}
          selected={sample.id === selectedSample}
          text={sample.value.reference}
          onClick={() => selectSample(sample.id)}
        />
      ))}
    </div>
  );
}

function Loading() {
  return (
    <div
      style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
    >
      <Spinner style={{ width: '2rem', height: '2rem', color: '#6a7282' }} />
    </div>
  );
}
