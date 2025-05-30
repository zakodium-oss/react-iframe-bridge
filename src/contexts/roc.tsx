import type { ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { Roc } from 'rest-on-couch-client';

const rocContext = createContext<Roc | null>(null);

export function useRoc<PublicUserInfo = unknown, PrivateUserInfo = unknown>() {
  const roc = useContext(rocContext) as Roc<PublicUserInfo, PrivateUserInfo>;
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
