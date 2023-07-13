export type StoreContext<State> = React.Context<IStore<State>>

export interface IStore<State> {
  getState(): State
  setState(newState: State): void
  subscribe(fn: (state: State) => void): () => void
}
