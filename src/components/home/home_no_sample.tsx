import { useHomeContext, useHomeDispatchContext } from './home_context.js';
import HomeSelector from './home_selector.js';

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
