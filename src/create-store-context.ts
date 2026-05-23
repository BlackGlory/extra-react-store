import { createContext } from 'react'
import { IStore, StoreContext } from './types.js'

export function createStoreContext<State>(): StoreContext<State> {
  const message = 'StoreContext used outside of a Provider. Did you forget to wrap your component with <Context.Provider>?'

  const context = createContext<IStore<State>>({
    getState(): never {
      throw new Error(message)
    }
  , setState(): never {
      throw new Error(message)
    }
  , subscribe(): never {
      throw new Error(message)
    }
  })

  return context
}
