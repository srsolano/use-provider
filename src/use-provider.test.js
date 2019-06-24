import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { createProvider, useProvider, combineProviders } from './use-provider';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update': {
      return action.payload;
    }

    default: {
      return state;
    }
  }
};

const createTestComponent = TestProvider => {
  return function TestComponent() {
    const [state, dispatch] = useProvider(TestProvider);
    return (
      <div>
        State: {`${state}`}
        <button onClick={() => dispatch({ type: 'update', payload: 'bar' })}>
          click
        </button>
      </div>
    );
  };
};

describe('createProvider', () => {
  afterEach(cleanup);

  it('should create a valid context provider', () => {
    const TestProvider = createProvider('foo', reducer);
    const TestComponent = createTestComponent(TestProvider);

    const { container } = render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('should create a default context provider', () => {
    const TestProvider = createProvider();
    const TestComponent = createTestComponent(TestProvider);

    const { container } = render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('should provide default state and dispatch values', () => {
    const TestProvider = createProvider();
    const { result } = renderHook(() => useProvider(TestProvider), {
      wrapper: TestProvider
    });

    const dispatch = result.current[1];
    act(() => {
      dispatch();
    });

    const state = result.current[0];
    expect(state).toBe(null);
  });
});

describe('combineProviders', () => {
  it('should create a combined provider', () => {
    const ProviderA = createProvider('a', reducer);
    const ProviderB = createProvider('b', reducer);
    const CombinedProvider = combineProviders([ProviderA, ProviderB]);
    const ComponentA = createTestComponent(ProviderA);
    const ComponentB = createTestComponent(ProviderB);

    const { container } = render(
      <CombinedProvider>
        <ComponentA />
        <ComponentB />
      </CombinedProvider>
    );

    expect(container).toMatchSnapshot();
  });
});

describe('useProvider', () => {
  it('should return context state', () => {
    const TestProvider = createProvider('foo', reducer);
    const { result } = renderHook(() => useProvider(TestProvider), {
      wrapper: TestProvider
    });
    const state = result.current[0];
    expect(state).toBe('foo');
  });

  it('should return context dispatch', () => {
    const TestProvider = createProvider('foo', reducer);
    const { result } = renderHook(() => useProvider(TestProvider), {
      wrapper: TestProvider
    });

    const dispatch = result.current[1];
    act(() => {
      dispatch({ type: 'update', payload: 'bar' });
    });

    const state = result.current[0];
    expect(state).toBe('bar');
  });

  it('should not crash if is called with no params', () => {
    const { result } = renderHook(() => useProvider());
    expect(result.current).toEqual([undefined, undefined]);
  });
});
