import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const contextMap = new Map();

export function createProvider(initialState = null, reducer = state => state) {
  const StateContext = createContext(null);
  const DispatchContext = createContext(null);

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </DispatchContext.Provider>
    );
  };
  Provider.propTypes = { children: PropTypes.node };

  contextMap.set(Provider, { StateContext, DispatchContext });

  return Provider;
}

export function combineProviders(providers) {
  const [first, ...rest] = providers;
  return function Combined({ children }) {
    return rest.reduce((Combined, Provider) => {
      return (
        <Combined>
          <Provider>{children}</Provider>
        </Combined>
      );
    }, first);
  };
}

export function useProvider(Provider) {
  const { StateContext = {}, DispatchContext = {} } =
    contextMap.get(Provider) || {};
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  if (state === undefined || dispatch === undefined) {
    console.error(
      "useProvider must be called with a Provider existent in the component's tree"
    );
  }

  return [state, dispatch];
}
