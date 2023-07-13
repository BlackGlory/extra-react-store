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

const context = createStoreContext<IState>()

function App() {
  const store = useMemo<Store<IState>>(() => new Store({ count: 0 }), [])

  return (
    <context.Provider value={store}>
      <Viewer />
      <Controller />
    </context.Provider>
  )
}

function Viewer() {
  const count = useSelector(context, state => state.count)

  return (
    <span>{count}</span>
  )
}

function Controller() {
  const update = useUpdater<IState>(context)

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
type StoreContext<State> = React.Context<IStore<State>>

interface IStore<State> {
  getState(): State
  setState(newState: State): void
  subscribe(fn: (state: State) => void): () => void
}
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
): Value
```

### useUpdater
```ts
import { Updater } from 'use-immer'

function useUpdater<State>(context: StoreContext<State>): Updater<State>
```
