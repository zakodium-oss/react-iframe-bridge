import { createContext, ReactNode, useContext, useMemo } from 'react';
import { Roc } from 'rest-on-couch-client';

const rocContext = createContext<Roc | null>(null);

export function useRoc() {
  const roc = useContext(rocContext);
  if (!roc) {
    throw new Error('missing roc');
  }
  return roc;
}

export function RocProvider(props: {
  children: ReactNode;
  url: string;
  database: string;
}) {
  const { url, database, children } = props;
  const roc = useMemo(() => new Roc({ url, database }), [url, database]);
  return <rocContext.Provider value={roc}>{children}</rocContext.Provider>;
}
