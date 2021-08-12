import { ready, onMessage } from 'iframe-bridge/iframe';
import { produce } from 'immer';
import {
  createContext,
  ReactNode,
  Reducer,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { Roc, RocDocument } from 'rest-on-couch-client';

import ErrorPage from '../components/ErrorPage';
import LoadingFull from '../components/LoadingFull';
import { SampleEntryContent } from '../types/db';
import { ActionType } from '../types/util';

const iframeBridgeContext = createContext<IframeBridgeReadyContextType | null>(
  null,
);

export function useIframeBridgeContext(): IframeBridgeReadyContextType {
  const context = useContext(iframeBridgeContext);
  if (!context) {
    throw new Error('Iframe bridge context is not ready');
  }
  return context;
}

export function useIframeBridgeSample(): RocDocument<SampleEntryContent> {
  const context = useIframeBridgeContext();
  if (!context.sample) {
    throw new Error('No sample in context');
  }
  return context.sample;
}

interface IframeBridgeContextType {
  state: 'initial' | 'loading' | 'ready' | 'standalone-error';
  data: IframeDataMessage | null;
  roc: Roc | null;
  hasSample: boolean;
  sample: RocDocument<SampleEntryContent> | null;
}

interface IframeBridgeReadyContextTypeBase {
  state: 'ready';
  data: IframeDataMessage;
  roc: Roc;
}

interface IframeBridgeReadyContextTypeWithSample
  extends IframeBridgeReadyContextTypeBase {
  hasSample: true;
  sample: RocDocument<SampleEntryContent>;
}

interface IframeBridgeReadyContextTypeWithoutSample
  extends IframeBridgeReadyContextTypeBase {
  hasSample: false;
  sample: null;
}

type IframeBridgeReadyContextType =
  | IframeBridgeReadyContextTypeWithSample
  | IframeBridgeReadyContextTypeWithoutSample;

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
  | ActionType<'SET_SAMPLE', RocDocument<SampleEntryContent>>
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
  }, [props.allowStandalone, state.state]);

  useEffect(() => {
    if (!state.roc || !state.data || !state.data.uuid) return;
    let cancelled = false;
    const document = state.roc.getDocument<SampleEntryContent>(state.data.uuid);
    document
      .fetch()
      .then(() => {
        if (!cancelled) {
          dispatch({ type: 'SET_SAMPLE', payload: document });
        }
      })
      .catch((error) => {
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
      <div className="w-screen h-screen">
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
