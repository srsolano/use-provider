# use-provider

A React Hook that uses providers created with React Context.

[![version](https://img.shields.io/npm/v/use-provider.svg)](https://www.npmjs.com/package/use-provider)
[![minified size](https://img.shields.io/bundlephobia/min/use-provider.svg)](https://www.npmjs.com/package/use-provider)
[![downloads](https://img.shields.io/npm/dt/use-provider.svg)](https://www.npmjs.com/package/use-provider)
[![build](https://travis-ci.com/srsolano/use-provider.svg)](https://travis-ci.com/srsolano/use-provider)

## Installation

### npm

```bash
npm install use-provider --save
```

### yarn

```bash
yarn add use-provider
```

## Usage

### createProvider(initialState, reducer)

```JavaScript
// providers.js

import { createProvider } from './use-provider';

const initialStateA = { counter: 0 };
const reducerA = (state, action) => {
  switch (action.type) {
    case 'increment': {
      return { counter: state.counter + 1 };
    }

    default: {
      return state;
    }
  }
};

const initialStateB = { counter: 0 };
const reducerB = (state, action) => {
  switch (action.type) {
    case 'increment': {
      return { counter: state.counter + 1 };
    }

    default: {
      return state;
    }
  }
};

export const ProviderA = createProvider(initialStateA, reducerA);
export const ProviderB = createProvider(initialStateB, reducerB);

...
```

```JavaScript
// index.js

...

import { ProviderA, ProviderB } from './providers';

ReactDOM.render(
  <ProviderA>
    <ProviderB>
      <App />
    </ProviderB>
  </ProviderA>,
  document.getElementById('root')
);

...
```

### useProvider(provider)

Each time you call `useProvider` inside a component you are 'connecting' the component to the provider's context. `useProvider` returns the current `state` and a `dispatch` function to send actions that generate a new state (like in Redux).

```JavaScript
// App.js

...

import { useProvider } from './use-provider';
import { ProviderA, ProviderB } from './providers';

const ChildComponent = React.memo(
  function ChildComponent() {
    const [stateA, dispatchA] = useProvider(ProviderA);

    return (
      <div>
        <p>Counter A: {stateA.counter}</p>
        <button onClick={() => dispatchA({ type: 'increment' })}>
          Increment state A
        </button>
      </div>
    );
  }
)

// NOTE: ChildComponent is using React.memo to only rerender when stateA is updated by either
// ChildCompenent or App, otherwise it would also rerender when App component updates stateB.

function App() {
  const [stateA, dispatchA] = useProvider(ProviderA);
  const [stateB, dispatchB] = useProvider(ProviderB);

  return (
    <div>
      <p>Counter A: {stateA.counter}</p>
      <p>Counter B: {stateB.counter}</p>
      <button onClick={() => dispatchA({ type: 'increment' })}>
        Increment state A
      </button>
      <button onClick={() => dispatchB({ type: 'increment' })}>
        Increment state B
      </button>
      <ChildComponent />
    </div>
  );
}


...
```

### combineProviders([providers])

`combineProviders` lets you combine multiple providers into a single one that shares each of the contained states through the component tree. To connect components to any of the combined providers you do it calling `useProvider(provider)` the same way as with single providers.

```JavaScript

const CombinedProvider = composeProviders([
    ProviderA,
    ProviderB,
    ...
])

ReactDOM.render(
  <CombinedProvider>
    <App />
  </CombinedProvider>,
  document.getElementById('root')
);

```

## License

MIT
