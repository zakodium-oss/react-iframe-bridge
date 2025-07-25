import { useId } from 'react';

import Input from '../input.js';

import { useHomeContext, useHomeDispatchContext } from './home_context.js';

interface HomeHeaderProps {
  pages?: string[];
}

export default function HomeHeader(props: HomeHeaderProps) {
  const { pages = [] } = props;
  const { rocUrl, database, iframePath } = useHomeContext();
  const dispatch = useHomeDispatchContext();
  const pageListId = useId();
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
        list={pageListId}
      />
      <datalist id={pageListId}>
        {pages.map((page) => (
          <option key={page} value={page} />
        ))}
      </datalist>
    </header>
  );
}
