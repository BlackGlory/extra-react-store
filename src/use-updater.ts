import { useCallback } from 'react'
import { StoreContext, Updater } from './types.js'
import { usePartialUpdater } from './use-partial-updater.js'

export function useUpdater<State>(context: StoreContext<State>): Updater<State> {
  return usePartialUpdater(
    context
  , useCallback(state => state, [])
  , useCallback((_, value) => value, [])
  )
}
