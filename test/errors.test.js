const { NotAuthorizedError } = require('../lib/errors')

describe('errors', () => {
  describe('NotAuthorizedError', () => {
    it('adds policy, action and context properties', () => {
      const context = { user: { id: 1 } }
      const error = new NotAuthorizedError({
        policy: 'users',
        action: 'update',
        context
      })

      expect(error).toHaveProperty('policy', 'users')
      expect(error).toHaveProperty('action', 'update')
      expect(error).toHaveProperty('context', context)
    })
  })
})
