import Input from '../input.js';

import { useHomeContext, useHomeDispatchContext } from './home_context.js';

export default function HomeHeader() {
  const { rocUrl, database, iframePath } = useHomeContext();
  const dispatch = useHomeDispatchContext();
  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        padding: '0.5rem',
      }}
    >
      <Input name="rocUrl" style={{ flex: 1 }} value={rocUrl} readOnly />
      <Input name="database" value={database} readOnly />
      <Input
        name="iframe-page"
        value={iframePath}
        style={{ flex: 1 }}
        onChange={(event) => {
          dispatch({ type: 'SET_IFRAME_PAGE', payload: event.target.value });
        }}
      />
    </header>
  );
}
