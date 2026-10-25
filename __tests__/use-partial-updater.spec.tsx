import { act, renderHook } from '@testing-library/react'
import { Store } from '@src/store.js'
import { createStoreContext } from '@src/create-store-context.js'
import { usePartialUpdater } from '@src/use-partial-updater.js'
import { createWrapper } from './utils.js'

describe('usePartialUpdater', () => {
  test('reference equality', () => {
    const store = new Store({})
    const context = createStoreContext<unknown>()
    const extractPartialState = vi.fn()
    const mergePartialState = vi.fn()

    const { rerender, result } = renderHook(
      () => usePartialUpdater(
        context
      , extractPartialState
      , mergePartialState
      )
    , { wrapper: createWrapper(context, store) }
    )
    const result1 = result.current
    rerender()
    const result2 = result.current

    expect(result2).toBe(result1)
  })

  test('state', () => {
    interface IState {
      shallow: {
        deep: string
      }
    }
    const context = createStoreContext<IState>()
    const store = new Store<IState>({
      shallow: {
        deep: 'foo'
      }
    })
    const listener = vi.fn()
    store.subscribe(listener)

    const { result } = renderHook(
      () => usePartialUpdater(
        context
      , state => state.shallow
      , (state, partialState) => ({
          ...state
        , shallow: partialState
        })
      )
    , { wrapper: createWrapper(context, store) }
    )
    act(() => {
      const update = result.current

      update({
        deep: 'bar'
      })
    })

    expect(listener).toBeCalledTimes(1)
    expect(listener).toBeCalledWith({
      shallow: {
        deep: 'bar'
      }
    })
    expect(store.getState()).toStrictEqual({
      shallow: {
        deep: 'bar'
      }
    })
  })

  describe('fn', () => {
    test('modify draft', () => {
      interface IState {
        shallow: {
          deep: string
        }
      }
      const context = createStoreContext<IState>()
      const store = new Store<IState>({
        shallow: {
          deep: 'foo'
        }
      })
      const listener = vi.fn()
      store.subscribe(listener)

      const { result } = renderHook(
        () => usePartialUpdater(
          context
        , state => state.shallow
        , (state, partialState) => ({
            ...state
          , shallow: partialState
          })
        )
      , { wrapper: createWrapper(context, store) }
      )
      act(() => {
        const update = result.current

        update(state => {
          state.deep = 'bar'
        })
      })

      expect(listener).toBeCalledTimes(1)
      expect(listener).toBeCalledWith({
        shallow: {
          deep: 'bar'
        }
      })
      expect(store.getState()).toStrictEqual({
        shallow: {
          deep: 'bar'
        }
      })
    })

    test('return a new state', () => {
      interface IState {
        shallow: {
          deep: string
        }
      }
      const context = createStoreContext<IState>()
      const store = new Store<IState>({
        shallow: {
          deep: 'foo'
        }
      })
      const listener = vi.fn()
      store.subscribe(listener)

      const { result } = renderHook(
        () => usePartialUpdater(
          context
        , state => state.shallow
        , (state, partialState) => ({
            ...state
          , shallow: partialState
          })
        )
      , { wrapper: createWrapper(context, store) }
      )
      act(() => {
        const update = result.current

        update(state => {
          return { deep: 'bar' }
        })
      })

      expect(listener).toBeCalledTimes(1)
      expect(listener).toBeCalledWith({
        shallow: {
          deep: 'bar'
        }
      })
      expect(store.getState()).toStrictEqual({
        shallow: {
          deep: 'bar'
        }
      })
    })
  })
})
