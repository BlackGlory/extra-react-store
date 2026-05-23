import { createContext } from 'react'
import { IStore, StoreContext } from './types.js'

export function createStoreContext<State>(): StoreContext<State> {
  const context = createContext<IStore<State>>({
    getState(): never {
      throw new Error(
        'StoreContext used outside of a Provider. Did you forget to wrap your component with <Context.Provider>?'
      )
    }
  , setState(): never {
      throw new Error(
        'StoreContext used outside of a Provider. Did you forget to wrap your component with <Context.Provider>?'
      )
    }
  , subscribe(): never {
      throw new Error(
        'StoreContext used outside of a Provider. Did you forget to wrap your component with <Context.Provider>?'
      )
    }
  })

  return context
}
