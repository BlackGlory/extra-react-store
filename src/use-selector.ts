import { useState, useContext, useEffect } from 'react'
import { StoreContext } from './types.js'

export function useSelector<State, Value>(
  context: StoreContext<State>
, selector: (state: State) => Value
): Value {
  const store = useContext(context)
  const [value, setValue] = useState(() => selector(store.getState()))

  useEffect(() => {
    return store.subscribe(state => {
      const newValue = selector(state)

      // 若新旧状态引用相等, 不会发生重新渲染.
      setValue(newValue)
    })
  }, [store, selector, value])

  return value
}
