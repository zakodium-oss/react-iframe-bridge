import { produce } from 'immer';
import {
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useContext,
  useReducer,
} from 'react';

import { RocProvider } from '../../contexts/roc';
import { useSaveToLocalStorage } from '../../hooks/localStorage';
import { ActionType } from '../../types/util';
import { getItem } from '../../utils/localStorage';

interface HomeContextType {
  rocUrl: string;
  database: string;
  iframePath: string;
  iframeMode: 'closed' | 'sample' | 'no-sample';
  selectedSample: string | null;
}

function getInitialHomeContext(
  config: Pick<
    HomeContextProviderProps,
    'rocUrl' | 'database' | 'defaultPath'
  > = {},
): HomeContextType {
  const {
    rocUrl = 'http://localhost:3000/api/fake-roc',
    database = 'eln',
    defaultPath = '/dev/base-page',
  } = config;
  return {
    rocUrl,
    database,
    iframePath: (getItem('dev-home-iframe-path') as string) || defaultPath,
    iframeMode: 'closed',
    selectedSample: null,
  };
}

type HomeContextAction =
  | ActionType<'SELECT_SAMPLE', string>
  | ActionType<'OPEN_NO_SAMPLE'>
  | ActionType<'SET_IFRAME_PAGE', string>;

const homeReducer: Reducer<HomeContextType, HomeContextAction> = produce(
  (state: HomeContextType, action: HomeContextAction) => {
    switch (action.type) {
      case 'OPEN_NO_SAMPLE':
        state.iframeMode = 'no-sample';
        state.selectedSample = null;
        break;
      case 'SELECT_SAMPLE':
        state.iframeMode = 'sample';
        state.selectedSample = action.payload;
        break;
      case 'SET_IFRAME_PAGE':
        state.iframePath = action.payload;
        break;
      default:
        throw new Error('unreachable');
    }
  },
);

const homeContext = createContext(getInitialHomeContext());
const homeDispatchContext = createContext<Dispatch<HomeContextAction>>(() => {
  // noop
});

interface HomeContextProviderProps {
  children: ReactNode;
  rocUrl?: string;
  database?: string;
  defaultPath?: string;
}

export function HomeContextProvider(props: HomeContextProviderProps) {
  const { children, ...initial } = props;
  const [homeState, dispatch] = useReducer(
    homeReducer,
    initial,
    getInitialHomeContext,
  );
  useSaveToLocalStorage('dev-home-iframe-path', homeState.iframePath);

  return (
    <homeContext.Provider value={homeState}>
      <homeDispatchContext.Provider value={dispatch}>
        <RocProvider url={homeState.rocUrl} database={homeState.database}>
          {children}
        </RocProvider>
      </homeDispatchContext.Provider>
    </homeContext.Provider>
  );
}

export function useHomeContext() {
  return useContext(homeContext);
}

export function useHomeDispatchContext() {
  return useContext(homeDispatchContext);
}
