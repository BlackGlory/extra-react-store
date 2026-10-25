import { render, renderHook } from '@testing-library/react'
import { Store } from '@src/store.js'
import { StoreContext, Updater } from '@src/types.js'
import { createStoreContext } from '@src/create-store-context.js'
import { usePartialUpdater } from '@src/use-partial-updater.js'

describe('usePartialUpdater', () => {
  test('reference equality', () => {
    const store = new Store({})
    const Context = createStoreContext<unknown>()
    const extractPartialState = vi.fn()
    const mergePartialState = vi.fn()

    const { rerender, result } = renderHook(
      () => usePartialUpdater(
        Context
      , extractPartialState
      , mergePartialState
      )
    , {
        wrapper({ children }) {
          return (
            <Context.Provider value={store}>
              {children}
            </Context.Provider>
          )
        }
      }
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
    const callback = vi.fn((update: Updater<IState['shallow']>) => {
      update({
        deep: 'bar'
      })
    })

    render(
      <context.Provider value={store}>
        <Tester
          context={context}
          extractPartialState={state => state.shallow}
          mergePartialState={(state, partialState) => ({
            ...state
          , shallow: partialState
          })}
          callback={callback}
        />
      </context.Provider>
    )

    expect(callback).toBeCalledTimes(1)
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
      const callback = vi.fn((update: Updater<IState['shallow']>) => {
        update(state => {
          state.deep = 'bar'
        })
      })

      render(
        <context.Provider value={store}>
          <Tester
            context={context}
            extractPartialState={state => state.shallow}
            mergePartialState={(state, partialState) => ({
              ...state
            , shallow: partialState
            })}
            callback={callback}
          />
        </context.Provider>
      )

      expect(callback).toBeCalledTimes(1)
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
      const callback = vi.fn((update: Updater<IState['shallow']>) => {
        update(state => {
          return { deep: 'bar' }
        })
      })

      render(
        <context.Provider value={store}>
          <Tester
            context={context}
            extractPartialState={state => state.shallow}
            mergePartialState={(state, partialState) => ({
              ...state
            , shallow: partialState
            })}
            callback={callback}
          />
        </context.Provider>
      )

      expect(callback).toBeCalledTimes(1)
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

function Tester<State, PartialState>({
  context
, extractPartialState
, mergePartialState
, callback
}: {
  context: StoreContext<State>
  extractPartialState: (state: State) => PartialState
  mergePartialState: (state: State, partialState: PartialState) => State
  callback: (updater: Updater<PartialState>) => void
}) {
  const update = usePartialUpdater<State, PartialState>(
    context
  , extractPartialState
  , mergePartialState
  )
  callback(update)
  return null
}
