import { RocQueryResult, useRocQuery } from '../../hooks/useRocQuery';
import { TocEntry } from '../../types/db';
import Spinner from '../Spinner';

import { useHomeContext, useHomeDispatchContext } from './HomeContext';
import HomeSelector from './HomeSelector';

export default function HomeSamples() {
  const { loading, error, result } = useRocQuery<TocEntry>('sample_toc');
  if (error) {
    throw error;
  }
  return (
    <>
      <h1 className="mb-4 text-lg font-bold text-center">Sample TOC</h1>
      <div className="flex-1">
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
    <div className="space-y-2">
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
    <div className="flex justify-center mt-8">
      <Spinner className="w-8 h-8 text-alternative-500" />
    </div>
  );
}
