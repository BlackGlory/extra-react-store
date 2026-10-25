import { useCallback } from 'react'
import { Draft, produce } from 'immer'
import { go } from '@blackglory/prelude'
import { isFunction } from 'extra-utils'
import { StoreContext, Updater } from './types.js'
import { useStrictContext } from 'extra-react-hooks'

export function usePartialUpdater<State, PartialState>(
  context: StoreContext<State>
, extractPartialState: (state: State) => PartialState
, mergePartialState: (state: State, partialState: PartialState) => State
): Updater<PartialState> {
  const store = useStrictContext(context)

  const updater: Updater<PartialState> = useCallback(newPartialStateOrFn => {
    const oldState = store.getState()

    const newPartialState: PartialState = go(() => {
      if (
        isFunction<(draft: Draft<PartialState>) => void | PartialState>(
          newPartialStateOrFn
        )
      ) {
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
