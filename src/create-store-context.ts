import { createStrictContext } from 'extra-react-hooks'
import { StoreContext } from './types.js'

export function createStoreContext<State>(): StoreContext<State> {
  return createStrictContext()
}
