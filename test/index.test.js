const fenc = require('../lib')
const Policy = require('../lib/policy')
const PolicyBuilder = require('../lib/builder')
const policies = require('./helpers/policies')

describe('fenc', () => {
  describe('policy(name)', () => {
    it('returns a new policy builder with the given name', () => {
      const builder = fenc.policy('users')

      expect(builder).toBeInstanceOf(PolicyBuilder)
      expect(builder).toHaveProperty('name', 'users')
    })
  })

  describe('register(...builders)', () => {
    it('throws if given invalid policy builders', () => {
      expect(() => fenc.register(policies.posts, {}))
        .toThrow('Expected builder to be instance of PolicyBuilder.')
    })
  })

  describe('fenc(policyName, context)', () => {
    it('throws if policy is not registered', () => {
      expect(() => fenc('not-found'))
        .toThrow(
          'Cannot find policy "not-found". Did you forget to register it?'
        )
    })

    it('returns a new policy instance with the given context', () => {
      fenc.register(policies.posts)

      const context = { post: { id: 1 } }
      const policy = fenc('posts', context)

      expect(policy).toBeInstanceOf(Policy)
      expect(policy).toHaveProperty('context', context)
    })
  })
})
