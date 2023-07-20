# extra-react-store
## Install
```sh
npm install --save extra-react-store
# or
yarn add extra-react-store
```

## Usage
```tsx
import { useMemo } from 'react'
import { createStoreContext, Store, useSelector, useUpdater } from 'extra-react-store'

interface IState {
  count: number
}

const Context = createStoreContext<IState>()

function App() {
  const store = useMemo<Store<IState>>(() => new Store({ count: 0 }), [])

  return (
    <Context.Provider value={store}>
      <Viewer />
      <Controller />
    </Context.Provider>
  )
}

function Viewer() {
  const count = useSelector(Context, state => state.count)

  return (
    <span>{count}</span>
  )
}

function Controller() {
  const update = useUpdater<IState>(Context)

  return (
    <button onClick={() => update(increment)}>Increment</button>
  )
}

function increment(state: IState): void {
  state.count++
}
```

## API
```ts
import { Draft } from 'immer'

type StoreContext<State> = React.Context<IStore<State>>

interface IStore<State> {
  getState(): State
  setState(newState: State): void
  subscribe(fn: (state: State) => void): () => void
}

type Updater<State> = (...args:
| [newState: State]
| [fn: (draft: Draft<State>) => void | State]
) => void
```

### Store
```ts
class Store<State> implements IStore<State> {
  constructor(initialState: State)
}
```

### createStoreContext
```ts
function createStoreContext<State>(): StoreContext<State>
```

### useSelector
```ts
function useSelector<State, Value>(
  context: StoreContext<State>
, selector: (state: State) => Value
, isEqual: (a: Value, b: Value) => boolean = isReferenceEqual
): Value
```

### useUpdater
```ts
function useUpdater<State>(context: StoreContext<State>): Updater<State>
```

### usePartialUpdater
```ts
function usePartialUpdater<State, PartialState>(
  context: StoreContext<State>
, extractPartialState: (state: State) => PartialState
, mergePartialState: (state: State, partialState: PartialState) => State
): Updater<PartialState>
```
