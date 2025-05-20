import Input from '../Input';

import { useHomeContext, useHomeDispatchContext } from './HomeContext';

export default function HomeHeader() {
  const { rocUrl, database, iframePath } = useHomeContext();
  const dispatch = useHomeDispatchContext();
  return (
    <header className="flex flex-row p-2 space-x-4">
      <Input name="rocUrl" className="flex-1" value={rocUrl} readOnly />
      <Input name="database" value={database} readOnly />
      <Input
        name="iframe-page"
        value={iframePath}
        className="flex-1"
        onChange={(event) => {
          dispatch({ type: 'SET_IFRAME_PAGE', payload: event.target.value });
        }}
      />
    </header>
  );
}
