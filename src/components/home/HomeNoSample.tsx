import { useHomeContext, useHomeDispatchContext } from './HomeContext';
import HomeSelector from './HomeSelector';

export default function HomeNoSample() {
  const { iframeMode } = useHomeContext();
  const dispatch = useHomeDispatchContext();
  return (
    <div>
      <HomeSelector
        onClick={() => dispatch({ type: 'OPEN_NO_SAMPLE' })}
        selected={iframeMode === 'no-sample'}
        text="No sample"
      />
    </div>
  );
}
