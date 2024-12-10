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

    expect(screen.queryByText(JSON.stringify({ count: 1, value: 'foo' }))).not.toBeNull()
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

      expect(screen.queryByText(JSON.stringify({ count: 1, value: 'foo' }))).not.toBeNull()
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

      expect(screen.queryByText(JSON.stringify({ count: 2, value: 'bar' }))).not.toBeNull()
      expect(selector).toBeCalledTimes(2)
      expect(selector).nthCalledWith(1, { value: 'foo' })
      expect(selector).nthReturnedWith(1, 'foo')
      expect(selector).nthCalledWith(2, { value: 'bar' })
      expect(selector).nthReturnedWith(2, 'bar')
    })

    test('edge: update value before component re-renders', () => {
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
        store.setState({ value: 'foo' })
      })

      expect(screen.queryByText(JSON.stringify({ count: 2, value: 'foo' }))).not.toBeNull()
      expect(selector).toBeCalledTimes(3)
      expect(selector).nthCalledWith(1, { value: 'foo' })
      expect(selector).nthReturnedWith(1, 'foo')
      expect(selector).nthCalledWith(2, { value: 'bar' })
      expect(selector).nthReturnedWith(2, 'bar')
      expect(selector).nthCalledWith(3, { value: 'foo' })
      expect(selector).nthReturnedWith(3, 'foo')
    })
  })
})

function Tester<State>({ context, selector }: {
  context: StoreContext<State>
  selector: (state: State) => string
}) {
  const count = useRenderCounter()
  const value = useSelector(context, selector)

  return JSON.stringify({ count, value })
}
