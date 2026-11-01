import { useCallback, useRef, useSyncExternalStore } from 'react'
import { useIIFE, useStrictContext } from 'extra-react-hooks'
import { StoreContext } from './types.js'
import { isReferenceEqual } from 'extra-utils'

export function useSelector<State, Value>(
  context: StoreContext<State>
, selector: (state: State) => Value
, isEqual: (a: Value, b: Value) => boolean = isReferenceEqual
): Value {
  const store = useStrictContext(context)

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

  const getSnapshot = useCallback(() => valueRef.current!, [valueRef])
  return useSyncExternalStore(
    useCallback((onStoreChange: () => void) => {
      return store.subscribe(state => {
        try {
          const newValue = selector(state)

          if (!isEqual(valueRef.current!, newValue)) {
            valueRef.current = newValue
            updateRequireRef.current = false
            onStoreChange()
          }
        } catch {
          updateRequireRef.current = true
          onStoreChange()
        }
      })
    }, [store, selector, isEqual, updateRequireRef, valueRef])
  , getSnapshot
  , getSnapshot
  )
}
