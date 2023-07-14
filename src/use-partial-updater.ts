import { useCallback, useContext } from 'react'
import { Updater } from 'use-immer'
import { produce } from 'immer'
import { go, isFunction } from '@blackglory/prelude'
import { StoreContext } from './types.js'

export function usePartialUpdater<State, PartialState>(
  context: StoreContext<State>
, extractPartialState: (state: State) => PartialState
, mergePartialState: (state: State, partialState: PartialState) => State
): Updater<PartialState> {
  const store = useContext(context)

  const updater: Updater<PartialState> = useCallback(newStateOrFn => {
    const oldState = store.getState()

    const newPartialState: PartialState = go(() => {
      if (isFunction(newStateOrFn)) {
        const fn = newStateOrFn
        return produce(extractPartialState(oldState), fn)
      } else {
        const newState = newStateOrFn
        return newState
      }
    })

    store.setState(mergePartialState(oldState, newPartialState))
  }, [store, extractPartialState, mergePartialState])

  return updater
}
