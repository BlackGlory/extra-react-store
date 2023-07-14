import { render } from '@testing-library/react'
import { Store } from '@src/store.js'
import { StoreContext } from '@src/types.js'
import { createStoreContext } from '@src/create-store-context.js'
import { useUpdater } from '@src/use-updater.js'
import { Updater } from 'use-immer'

describe('useUpdater', () => {
  test('state', () => {
    interface IState {
      value: string
    }
    const context = createStoreContext<IState>()
    const store = new Store<IState>({ value: 'foo' })
    const listener = vi.fn()
    store.subscribe(listener)
    const callback = vi.fn((update: Updater<IState>) => update({ value: 'bar' }))

    render(
      <context.Provider value={store}>
        <Tester
          context={context}
          callback={callback}
        />
      </context.Provider>
    )

    expect(callback).toBeCalledTimes(1)
    expect(listener).toBeCalledTimes(1)
    expect(listener).toBeCalledWith({ value: 'bar' })
    expect(store.getState()).toStrictEqual({ value: 'bar' })
  })

  test('fn', () => {
    interface IState {
      value: string
    }
    const context = createStoreContext<IState>()
    const store = new Store<IState>({ value: 'foo' })
    const listener = vi.fn()
    store.subscribe(listener)
    const callback = vi.fn((update: Updater<IState>) => update(state => {
      state.value = 'bar'
    }))

    render(
      <context.Provider value={store}>
        <Tester
          context={context}
          callback={callback}
        />
      </context.Provider>
    )

    expect(callback).toBeCalledTimes(1)
    expect(listener).toBeCalledTimes(1)
    expect(listener).toBeCalledWith({ value: 'bar' })
    expect(store.getState()).toStrictEqual({ value: 'bar' })
  })
})

function Tester<State>({ context, callback }: {
  context: StoreContext<State>
  callback: (updater: Updater<State>) => void
}) {
  const update = useUpdater(context)
  callback(update)
  return <></>
}
