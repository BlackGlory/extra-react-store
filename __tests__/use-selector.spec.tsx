import { render, screen, act } from '@testing-library/react'
import { Store } from '@src/store.js'
import { createStoreContext } from '@src/create-store-context.js'
import { StoreContext } from '@src/types.js'
import { useSelector } from '@src/use-selector.js'
import { useRenderCounter } from 'extra-react-hooks'
import { assert } from '@blackglory/prelude'

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

    screen.getByText(JSON.stringify({ count: 1, value: 'foo' }))
    expect(selector).toBeCalledTimes(1)
    expect(selector).toBeCalledWith({ value: 'foo' })
    expect(selector).toReturnWith('foo')
  })

  describe('rerender', () => {
    describe('state update', () => {
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

        screen.getByText(JSON.stringify({ count: 1, value: 'foo' }))
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

        screen.getByText(JSON.stringify({ count: 2, value: 'bar' }))
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

        screen.getByText(JSON.stringify({ count: 2, value: 'foo' }))
        expect(selector).toBeCalledTimes(3)
        expect(selector).nthCalledWith(1, { value: 'foo' })
        expect(selector).nthReturnedWith(1, 'foo')
        expect(selector).nthCalledWith(2, { value: 'bar' })
        expect(selector).nthReturnedWith(2, 'bar')
        expect(selector).nthCalledWith(3, { value: 'foo' })
        expect(selector).nthReturnedWith(3, 'foo')
      })

      test('edge: zombie children', () => {
        interface IState {
          list: string[]
        }
        const context = createStoreContext<IState>()
        const store = new Store<IState>({ list: ['foo', 'bar'] })
        render(
          <context.Provider value={store}>
            <Parent />
          </context.Provider>
        )

        act(() => {
          store.setState({ list: ['bar'] })
        })

        screen.getByText(JSON.stringify({ value: 'bar' }))

        function Parent() {
          const list = useSelector(context, x => x.list)

          return list.map((value, i) => <Child context={context} key={value} index={i} />)
        }

        function Child({ context, index }: {
          index: number
          context: StoreContext<IState>
        }) {
          const value = useSelector(context, x => {
            const result = x.list[index]
            assert(result)

            return result
          })

          return JSON.stringify({ value })
        }
      })
    })

    test('selector update', () => {
      const context = createStoreContext<null>()
      const store = new Store<null>(null)
      const selector1 = vi.fn(() => 'foo')
      const selector2 = vi.fn(() => 'bar')
      const { rerender } = render(
        <context.Provider value={store}>
          <Tester context={context} selector={selector1} />
        </context.Provider>
      )

      rerender(
        <context.Provider value={store}>
          <Tester context={context} selector={selector2} />
        </context.Provider>
      )

      screen.getByText(JSON.stringify({ count: 2, value: 'bar' }))
      expect(selector1).toBeCalledTimes(1)
      expect(selector2).toBeCalledTimes(1)
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
