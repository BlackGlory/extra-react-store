import { Emitter } from '@blackglory/structures'
import { IStore } from './types.js'

export class Store<State> implements IStore<State> {
  private state: State
  private emitter = new Emitter<{ stateChanged: [state: State] }>()

  constructor(initialState: State) {
    this.state = initialState
  }

  getState(): State {
    return this.state
  }

  setState(newState: State): void {
    this.state = newState
    this.emitter.emit('stateChanged', newState)
  }

  subscribe(fn: (state: State) => void): () => void {
    return this.emitter.on('stateChanged', fn)
  }
}
