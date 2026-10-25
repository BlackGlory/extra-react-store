import { Draft } from 'immer'
import { StrictContext } from 'extra-react-hooks'

export type StoreContext<State> = StrictContext<IStore<State>>

export interface IStore<State> {
  getState(): State
  setState(newState: State): void
  subscribe(fn: (state: State) => void): () => void
}

export type Updater<State> = (...args:
| [newState: State]
| [fn: (draft: Draft<State>) => void | State]
) => void
