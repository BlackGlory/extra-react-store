import { useCallback, useContext } from 'react'
import { Draft, produce } from 'immer'
import { go, isFunction } from '@blackglory/prelude'
import { StoreContext, Updater } from './types.js'

export function usePartialUpdater<State, PartialState>(
  context: StoreContext<State>
, extractPartialState: (state: State) => PartialState
, mergePartialState: (state: State, partialState: PartialState) => State
): Updater<PartialState> {
  const store = useContext(context)

  const updater: Updater<PartialState> = useCallback(newPartialStateOrFn => {
    const oldState = store.getState()

    const newPartialState: PartialState = go(() => {
      if (isFunction(newPartialStateOrFn)) {
        const fn = newPartialStateOrFn
        const newPartialState = produce<PartialState, Draft<PartialState>>(
          extractPartialState(oldState)
          // @ts-ignore
        , fn
        )
        return newPartialState
      } else {
        const newPartialState = newPartialStateOrFn
        return newPartialState
      }
    })

    store.setState(mergePartialState(oldState, newPartialState))
  }, [store, extractPartialState, mergePartialState])

  return updater
}
