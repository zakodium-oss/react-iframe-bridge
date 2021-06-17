import { Reducer, useEffect, useReducer } from 'react';
import { IQueryResult } from 'rest-on-couch-client';

import { useRoc } from '../contexts/roc';

export type RocQueryResult<T> = IQueryResult<[string, string], T>;

interface RocQueryState<T = unknown> {
  loading: boolean;
  error: null | Error;
  result: null | RocQueryResult<T>[];
}

type RocQueryHookResult<T> = RocQueryState<T>;

type RocQueryAction<T> =
  | { type: 'SET_RESULT'; value: RocQueryResult<T>[] }
  | { type: 'ERROR'; value: Error }
  | { type: 'LOAD' };

function rocQueryReducer<T>(
  state: RocQueryState<T>,
  action: RocQueryAction<T>,
): RocQueryState<T> {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        error: null,
        loading: true,
      };
    case 'SET_RESULT':
      return {
        loading: false,
        error: null,
        result: action.value,
      };
    case 'ERROR':
      return { loading: false, error: action.value, result: null };
    default:
      throw new Error('unreachable');
  }
}

interface RocQueryHookOptions {
  mine?: boolean;
}

export function useRocQuery<T = unknown>(
  viewName: string,
  options: RocQueryHookOptions = {},
): RocQueryHookResult<T> {
  const { mine = false } = options;
  const roc = useRoc();
  const [state, dispatch] = useReducer<
    Reducer<RocQueryState<T>, RocQueryAction<T>>
  >(rocQueryReducer, {
    loading: true,
    error: null,
    result: null,
  });
  useEffect(() => {
    dispatch({ type: 'LOAD' });
    const query = roc.getQuery<[string, string], T>(viewName, { mine });
    query
      .fetch()
      .then((result) => dispatch({ type: 'SET_RESULT', value: result }))
      .catch((err) => {
        dispatch({ type: 'ERROR', value: err });
      });
  }, [roc, viewName, mine]);

  return state;
}
