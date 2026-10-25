import { render } from '@testing-library/react'
import { Store } from '@src/store.js'
import { IStore, StoreContext } from '@src/types.js'
import { createStoreContext } from '@src/create-store-context.js'
import { useStrictContext } from 'extra-react-hooks'

test('createStoreContext', () => {
  interface IState {
    value: string
  }
  const Context = createStoreContext<IState>()
  const store = new Store<IState>({ value: 'foo' })
  const callback = vi.fn()

  render(
    <Context.Provider value={store}>
      <Tester context={Context} callback={callback} />
    </Context.Provider>
  )

  expect(callback).toBeCalledTimes(1)
  expect(callback).toBeCalledWith(store)
})

function Tester<State>({ callback, context }: {
  callback: (value: IStore<State>) => void
  context: StoreContext<State>
}) {
  const value = useStrictContext(context)
  callback(value)
  return null
}
