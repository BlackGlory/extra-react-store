import { useState, useContext, useEffect } from 'react'
import { StoreContext } from './types.js'

export function useSelector<State, Value>(
  context: StoreContext<State>
, selector: (state: State) => Value
, isEqual: (a: Value, b: Value) => boolean = (a, b) => a === b
): Value {
  const store = useContext(context)
  const [[value], setBox] = useState(() => [selector(store.getState())])

  useEffect(() => {
    return store.subscribe(state => {
      const newValue = selector(state)

      if (!isEqual(value, newValue)) {
        setBox([newValue])
      }
    })
  }, [store, selector, value, setBox])

  return value
}
