import { useState, useContext, useEffect } from 'react'
import { StoreContext } from './types.js'
import { isReferenceEqual } from 'extra-utils'

export function useSelector<State, Value>(
  context: StoreContext<State>
, selector: (state: State) => Value
, isEqual: (a: Value, b: Value) => boolean = isReferenceEqual
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
