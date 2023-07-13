import { render, screen, act } from '@testing-library/react'
import { Store } from '@src/store.js'
import { createStoreContext } from '@src/create-store-context.js'
import { StoreContext } from '@src/types.js'
import { useSelector } from '@src/use-selector.js'
import { useRenderCounter } from 'extra-react-hooks'

describe('useSelector', () => {
  test('render', () => {
    interface IState {
      value: string
    }
    const context = createStoreContext<IState>()
    const store = new Store<IState>({ value: 'foo' })
    const selector = vi.fn((state: IState) => state.value)

    render(
      <context.Provider value={store}>
        <Tester context={context} selector={selector} />
      </context.Provider>
    )

    expect(screen.queryByText('Render: 1')).not.toBeNull()
    expect(selector).toBeCalledTimes(1)
    expect(selector).toBeCalledWith({ value: 'foo' })
    expect(selector).toReturnWith('foo')
  })

  describe('rerender', () => {
    test('same value', () => {
      interface IState {
        value: string
      }
      const context = createStoreContext<IState>()
      const store = new Store<IState>({ value: 'foo' })
      const selector = vi.fn((state: IState) => state.value)

      render(
        <context.Provider value={store}>
          <Tester context={context} selector={selector} />
        </context.Provider>
      )
      act(() => {
        store.setState({ value: 'foo' })
      })

      expect(screen.queryByText('Render: 1')).not.toBeNull()
      expect(selector).toBeCalledTimes(2)
      expect(selector).nthCalledWith(1, { value: 'foo' })
      expect(selector).nthReturnedWith(1, 'foo')
      expect(selector).nthCalledWith(2, { value: 'foo' })
      expect(selector).nthReturnedWith(2, 'foo')
    })

    test('diff value', () => {
      interface IState {
        value: string
      }
      const context = createStoreContext<IState>()
      const store = new Store<IState>({ value: 'foo' })
      const selector = vi.fn((state: IState) => state.value)

      render(
        <context.Provider value={store}>
          <Tester context={context} selector={selector} />
        </context.Provider>
      )
      act(() => {
        store.setState({ value: 'bar' })
      })

      expect(screen.queryByText('Render: 2')).not.toBeNull()
      expect(selector).toBeCalledTimes(2)
      expect(selector).nthCalledWith(1, { value: 'foo' })
      expect(selector).nthReturnedWith(1, 'foo')
      expect(selector).nthCalledWith(2, { value: 'bar' })
      expect(selector).nthReturnedWith(2, 'bar')
    })
  })
})

function Tester<IState>({ context, selector }: {
  context: StoreContext<IState>
  selector: (state: IState) => string
}) {
  const count = useRenderCounter()
  useSelector(context, selector)
  return `Render: ${count}`
}
