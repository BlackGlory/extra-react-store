import { Store } from '@src/store.js'
import { StoreContext } from '@src/types.js'

export function createWrapper<T>(context: StoreContext<T>, store: Store<T>) {
  return function ({ children }: { children: React.ReactNode}) {
    return (
      <context.Provider value={store}>
        {children}
      </context.Provider>
    )
  }
}
