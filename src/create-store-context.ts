import { createContext } from 'react'
import { IStore, StoreContext } from './types.js'

export function createStoreContext<State>(): StoreContext<State> {
  const context = createContext<IStore<State>>({} as IStore<State>)
  return context
}
