import { useRef } from 'react'
import { useIIFE, useForceUpdate, useStrictContext } from 'extra-react-hooks'
import { StoreContext } from './types.js'
import { isReferenceEqual } from 'extra-utils'

export function useSelector<State, Value>(
  context: StoreContext<State>
, selector: (state: State) => Value
, isEqual: (a: Value, b: Value) => boolean = isReferenceEqual
): Value {
  // 可以用React 18的useSyncExternalStore, 但毫无必要:
  // - useSyncExternalStore的实现比现有实现的性能差.
  // - useSyncExternalStore的实现包含现有实现的一部分功能, 但不支持自定义isEqual.
  //   为了支持isEqual, useSelector需要重复一部分useSyncExternalStore逻辑, 完全是白费功夫.
  // - useSyncExternalStore在内部也使用setState, 而且实现方式比useForceUpdate差.
  //   这导致useSyncExternalStore不仅性能差,
  //   还共享了useForceUpdate的全部弊端(渲染时跨组件setState会报错).
  // - useSyncExternalStore为了支持SSR需要额外提供一个getServerSnapshot.
  //   但对于一个状态管理库而言, getSnapshot和getServerSnapshot必然是等价的, 毫无区分的必要性.

  const forceUpdate = useForceUpdate()
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

  useIIFE(() => {
    return store.subscribe(state => {
      try {
        const newValue = selector(state)

        if (!isEqual(valueRef.current!, newValue)) {
          valueRef.current = newValue
          updateRequireRef.current = false
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
