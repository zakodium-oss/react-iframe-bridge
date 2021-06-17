import { useHomeContext, useHomeDispatchContext } from './HomeContext';

export default function HomeHeader() {
  const { rocUrl, database, iframePage } = useHomeContext();
  const dispatch = useHomeDispatchContext();
  return (
    <header className="flex flex-row p-2 space-x-4">
      <input
        name="rocUrl"
        type="text"
        className="flex-1"
        value={rocUrl}
        readOnly
      />
      <input
        name="database"
        type="text"
        className="flex-1"
        value={database}
        readOnly
      />
      <input
        name="iframe-page"
        value={iframePage}
        onChange={(event) => {
          dispatch({ type: 'SET_IFRAME_PAGE', payload: event.target.value });
        }}
      />
    </header>
  );
}
