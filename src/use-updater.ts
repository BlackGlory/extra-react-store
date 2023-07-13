import { useCallback, useContext } from 'react'
import { Updater } from 'use-immer'
import { produce } from 'immer'
import { go, isFunction } from '@blackglory/prelude'
import { StoreContext } from './types.js'

export function useUpdater<State>(context: StoreContext<State>): Updater<State> {
  const store = useContext(context)

  const updater: Updater<State> = useCallback(newStateOrFn => {
    const state = go(() => {
      if (isFunction(newStateOrFn)) {
        const fn = newStateOrFn
        const newState = produce(store.getState(), fn)
        return newState
      } else {
        const newState = newStateOrFn
        return newState
      }
    })
    store.setState(state)
  }, [store])

  return updater
}
