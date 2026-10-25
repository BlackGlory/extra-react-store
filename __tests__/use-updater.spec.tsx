import { act, renderHook } from '@testing-library/react'
import { Store } from '@src/store.js'
import { createStoreContext } from '@src/create-store-context.js'
import { useUpdater } from '@src/use-updater.js'
import { createWrapper } from '@test/utils.js'

describe('useUpdater', () => {
  test('reference equality', () => {
    const store = new Store({})
    const context = createStoreContext<unknown>()

    const { rerender, result } = renderHook(
      () => useUpdater(context)
    , { wrapper: createWrapper(context, store) }
    )
    const result1 = result.current
    rerender()
    const result2 = result.current

    expect(result2).toBe(result1)
  })

  test('state', () => {
    interface IState {
      value: string
    }
    const context = createStoreContext<IState>()
    const store = new Store<IState>({ value: 'foo' })
    const listener = vi.fn()
    store.subscribe(listener)

    const { result } = renderHook(
      () => useUpdater(context)
    , { wrapper: createWrapper(context, store) }
    )
    act(() => {
      const update = result.current

      update({ value: 'bar' })
    })

    expect(listener).toBeCalledTimes(1)
    expect(listener).toBeCalledWith({ value: 'bar' })
    expect(store.getState()).toStrictEqual({ value: 'bar' })
  })

  describe('fn', () => {
    test('modify draft', () => {
      interface IState {
        value: string
      }
      const context = createStoreContext<IState>()
      const store = new Store<IState>({ value: 'foo' })
      const listener = vi.fn()
      store.subscribe(listener)

      const { result } = renderHook(
        () => useUpdater(context)
      , { wrapper: createWrapper(context, store) }
      )
      act(() => {
        const update = result.current

        update(state => {
          state.value = 'bar'
        })
      })

      expect(listener).toBeCalledTimes(1)
      expect(listener).toBeCalledWith({ value: 'bar' })
      expect(store.getState()).toStrictEqual({ value: 'bar' })
    })

    test('return a new state', () => {
      interface IState {
        value: string
      }
      const context = createStoreContext<IState>()
      const store = new Store<IState>({ value: 'foo' })
      const listener = vi.fn()
      store.subscribe(listener)

      const { result } = renderHook(
        () => useUpdater(context)
      , { wrapper: createWrapper(context, store) }
      )
      act(() => {
        const update = result.current
        update(state => {
          return { value: 'bar' }
        })
      })

      expect(listener).toBeCalledTimes(1)
      expect(listener).toBeCalledWith({ value: 'bar' })
      expect(store.getState()).toStrictEqual({ value: 'bar' })
    })
  })
})
