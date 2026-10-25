import { renderHook } from '@testing-library/react'
import { Store } from '@src/store.js'
import { createStoreContext } from '@src/create-store-context.js'
import { useStrictContext } from 'extra-react-hooks'
import { createWrapper } from '@test/utils.js'

test('createStoreContext', () => {
  const context = createStoreContext()
  const store = new Store({})

  const { result } = renderHook(
    () => useStrictContext(context)
  , { wrapper: createWrapper(context, store) }
  )

  expect(result.current).toBe(store)
})
