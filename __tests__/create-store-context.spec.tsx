import { useContext } from 'react'
import { render, screen } from '@testing-library/react'
import { Store } from '@src/store.js'
import { IStore } from '@src/types.js'
import { createStoreContext } from '@src/create-store-context.js'

test('createStoreContext', () => {
  interface IState {
    value: string
  }
  const context = createStoreContext<IState>()
  const store = new Store<IState>({ value: 'foo' })
  const callback = vi.fn()

  render(
    <context.Provider value={store}>
      <Tester callback={callback} />
    </context.Provider>
  )

  expect(callback).toBeCalledTimes(1)
  expect(callback).toBeCalledWith(store)

  function Tester({ callback }: { callback: (value: IStore<IState>) => void}) {
    const value = useContext(context)
    callback(value)
    return <></>
  }
})
