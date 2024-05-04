import { useHomeContext, useHomeDispatchContext } from './HomeContext';

export default function HomeHeader() {
  const { rocUrl, database, iframePath } = useHomeContext();
  const dispatch = useHomeDispatchContext();
  return (
    <header className="flex flex-row p-2 space-x-4">
      <input
        name="rocUrl"
        type="text"
        className="flex-1 form-input"
        value={rocUrl}
        readOnly
      />
      <input
        name="database"
        type="text"
        className="form-input"
        value={database}
        readOnly
      />
      <input
        name="iframe-page"
        value={iframePath}
        type="text"
        className="flex-1 form-input"
        onChange={(event) => {
          dispatch({ type: 'SET_IFRAME_PAGE', payload: event.target.value });
        }}
      />
    </header>
  );
}
