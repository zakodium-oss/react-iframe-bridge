// https://github.com/import-js/eslint-plugin-import/issues/1810

import { onMessage, ready } from 'iframe-bridge/iframe';
import { produce } from 'immer';
import type { ReactNode, Reducer } from 'react';
import { createContext, useContext, useEffect, useReducer } from 'react';
import type { RocDocument } from 'rest-on-couch-client';
import { Roc } from 'rest-on-couch-client';

import ErrorPage from '../components/error_page.js';
import LoadingFull from '../components/loading_full.js';
import type { SampleEntryContent, SampleEntryId } from '../types/db.js';
import type { ActionType } from '../types/util.js';

const iframeBridgeContext = createContext<IframeBridgeReadyContextType<
  any,
  any
> | null>(null);

export function useIframeBridgeContext<
  PublicUserInfo = unknown,
  PrivateUserInfo = unknown,
>(): IframeBridgeReadyContextType<PublicUserInfo, PrivateUserInfo> {
  const context = useContext(iframeBridgeContext);
  if (!context) {
    throw new Error('Iframe bridge context is not ready');
  }
  return context;
}

export function useIframeBridgeSample(): RocDocument<
  SampleEntryContent,
  SampleEntryId
> {
  const context = useIframeBridgeContext();
  if (!context.sample) {
    throw new Error('No sample in context');
  }
  return context.sample;
}

interface IframeBridgeContextType<
  PublicUserInfo = unknown,
  PrivateUserInfo = unknown,
> {
  state: 'initial' | 'loading' | 'ready' | 'standalone-error';
  data: IframeDataMessage | null;
  roc: Roc<PublicUserInfo, PrivateUserInfo> | null;
  hasSample: boolean;
  sample: RocDocument<SampleEntryContent, SampleEntryId> | null;
}

interface IframeBridgeReadyContextTypeBase<PublicUserInfo, PrivateUserInfo> {
  state: 'ready';
  data: IframeDataMessage;
  roc: Roc<PublicUserInfo, PrivateUserInfo>;
}

interface IframeBridgeReadyContextTypeWithSample<
  PublicUserInfo,
  PrivateUserInfo,
> extends IframeBridgeReadyContextTypeBase<PublicUserInfo, PrivateUserInfo> {
  hasSample: true;
  sample: RocDocument<SampleEntryContent, SampleEntryId>;
}

interface IframeBridgeReadyContextTypeWithoutSample<
  PublicUserInfo,
  PrivateUserInfo,
> extends IframeBridgeReadyContextTypeBase<PublicUserInfo, PrivateUserInfo> {
  hasSample: false;
  sample: null;
}

type IframeBridgeReadyContextType<
  PublicUserInfo = unknown,
  PrivateUserInfo = unknown,
> =
  | IframeBridgeReadyContextTypeWithSample<PublicUserInfo, PrivateUserInfo>
  | IframeBridgeReadyContextTypeWithoutSample<PublicUserInfo, PrivateUserInfo>;

interface IframeDataMessage {
  couchDB: {
    url: string;
    database: string;
  };
  uuid: string;
}

type IframeMessage =
  | {
      type: 'tab.data';
      message: IframeDataMessage;
    }
  | { type: 'tab.focus' };

type IframeBridgeContextAction =
  | ActionType<'RECEIVE_DATA', IframeDataMessage>
  | ActionType<'SET_SAMPLE', RocDocument<SampleEntryContent, SampleEntryId>>
  | ActionType<'STANDALONE_TIMEOUT'>;

const iframeBridgeReducer: Reducer<
  IframeBridgeContextType,
  IframeBridgeContextAction
> = produce(
  (state: IframeBridgeContextType, action: IframeBridgeContextAction) => {
    switch (action.type) {
      case 'RECEIVE_DATA': {
        state.data = action.payload;
        state.roc = new Roc(action.payload.couchDB);
        if (action.payload.uuid) {
          state.state = 'loading';
          state.hasSample = true;
          state.sample = null;
        } else {
          state.state = 'ready';
        }
        break;
      }
      case 'SET_SAMPLE': {
        state.sample = action.payload;
        state.state = 'ready';
        break;
      }
      case 'STANDALONE_TIMEOUT': {
        state.state = 'standalone-error';
        break;
      }
      default:
        throw new Error('unreachable');
    }
  },
);

const initialState: IframeBridgeContextType = {
  state: 'initial',
  data: null,
  roc: null,
  hasSample: false,
  sample: null,
};

export function IframeBridgeProvider(props: {
  children: ReactNode;
  requireSample?: boolean;
  allowStandalone?: boolean;
}) {
  const [state, dispatch] = useReducer(iframeBridgeReducer, initialState);

  useEffect(() => {
    onMessage((message: IframeMessage) => {
      switch (message.type) {
        case 'tab.data': {
          dispatch({ type: 'RECEIVE_DATA', payload: message.message });
          break;
        }
        case 'tab.focus': {
          // Ignore this event. Happens in C6H6 when an already opened tab is
          // refocused.
          break;
        }
        default:
          // eslint-disable-next-line no-console
          console.error(message);
          throw new Error('unreachable');
      }
    });
    ready();
  }, []);

  useEffect(() => {
    if (!props.allowStandalone && state.state === 'initial') {
      const timeout = setTimeout(() => {
        dispatch({ type: 'STANDALONE_TIMEOUT' });
      }, 3000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [props.allowStandalone, state.state]);

  useEffect(() => {
    if (!state.roc || !state.data?.uuid) return;
    let cancelled = false;
    const document = state.roc.getDocument<SampleEntryContent, SampleEntryId>(
      state.data.uuid,
    );
    document
      .fetch()
      .then(() => {
        if (!cancelled) {
          dispatch({ type: 'SET_SAMPLE', payload: document });
        }
      })
      .catch((error: unknown) => {
        // TODO: handle error
        // eslint-disable-next-line no-console
        console.error(error);
      });
    return () => {
      cancelled = true;
    };
  }, [state.roc, state.data]);

  if (state.state === 'standalone-error') {
    return (
      <ErrorPage
        title="Invalid access"
        subtitle="This page cannot be accessed without iframe-bridge."
      />
    );
  }

  if (state.state !== 'ready') {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <LoadingFull />
      </div>
    );
  }

  if (!state.hasSample && props.requireSample) {
    return (
      <ErrorPage
        title="Invalid access"
        subtitle="This page must be accessed with a sample."
      />
    );
  }

  return (
    <iframeBridgeContext.Provider value={state as IframeBridgeReadyContextType}>
      {props.children}
    </iframeBridgeContext.Provider>
  );
}
