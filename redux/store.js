import {useMemo} from 'react';
import {applyMiddleware, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {
  composeWithDevTools,
} from 'redux-devtools-extension/logOnlyInProduction';
import reducers from './reducers';
import customMiddleware from './middleware';

const initializeStore = initialState => {
  return createStore(
      reducers,
      initialState,
      composeWithDevTools(
          applyMiddleware(
              thunkMiddleware,
              customMiddleware,
          ),
      ),
  );
};

export const useStore = initialState =>
  useMemo(() => initializeStore(initialState), [initialState]);
