import { Store } from '@src/store.js'

describe('Store', () => {
  test('constructor', () => {
    const store = new Store({ value: 'foo' })

    expect(store.getState()).toStrictEqual({ value: 'foo' })
  })

  test('getState', () => {
    const store = new Store({ value: 'foo' })

    const result = store.getState()

    expect(result).toStrictEqual({ value: 'foo' })
  })

  test('setState', () => {
    const store = new Store({ value: 'foo' })
    const fn = vi.fn()
    store.subscribe(fn)

    store.setState({ value: 'bar' })

    expect(store.getState()).toStrictEqual({ value: 'bar' })
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith({ value: 'bar' })
  })

  describe('subscribe', () => {
    test('unsubscribe', () => {
      const store = new Store({ value: 'foo' })
      const fn = vi.fn()

      const unsubscribe = store.subscribe(fn)
      unsubscribe()
      store.setState({ value: 'bar' })

      expect(fn).not.toBeCalled()
    })

    test('not changed', () => {
      const store = new Store({ value: 'foo' })
      const fn = vi.fn()

      store.subscribe(fn)

      expect(fn).not.toBeCalled()
    })

    test('changed', () => {
      const store = new Store({ value: 'foo' })
      const fn1 = vi.fn()
      const fn2 = vi.fn()

      store.subscribe(fn1)
      store.subscribe(fn2)
      store.setState({ value: 'bar' })

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith({ value: 'bar' })
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith({ value: 'bar' })
    })
  })
})
