import { useContext, useRef } from 'react'
import { useIIFE, useForceUpdate } from 'extra-react-hooks'
import { StoreContext } from './types.js'
import { isReferenceEqual } from 'extra-utils'

export function useSelector<State, Value>(
  context: StoreContext<State>
, selector: (state: State) => Value
, isEqual: (a: Value, b: Value) => boolean = isReferenceEqual
): Value {
  const forceUpdate = useForceUpdate()
  const store = useContext(context)

  const updateRequireRef = useRef<boolean>(true)
  useIIFE(() => {
    return () => {
      updateRequireRef.current = true
    }
  }, [selector])

  const valueRef = useRef<Value>(undefined)
  if (updateRequireRef.current) {
    valueRef.current = selector(store.getState())
    updateRequireRef.current = false
  }

  useIIFE(() => {
    return store.subscribe(state => {
      try {
        const newValue = selector(state)

        if (!isEqual(valueRef.current!, newValue)) {
          valueRef.current = newValue
          forceUpdate()
        }
      } catch {
        updateRequireRef.current = true
        forceUpdate()
      }
    })
  }, [store, selector, isEqual, forceUpdate, valueRef, updateRequireRef])

  return valueRef.current!
}
