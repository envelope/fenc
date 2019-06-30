const Policy = require('../lib/policy')
const Builder = require('../lib/builder')
const { NotAuthorizedError } = require('../lib/errors')

describe('Policy', () => {
  describe('.build(builder)', () => {
    it('creates a policy class with modifiers and actions from builder', () => {
      const builder = new Builder('test')
      const modifyQuery = () => {}
      const canCreate = () => {}

      builder.modifier('query', modifyQuery)
      builder.action('create', canCreate)

      const TestPolicy = Policy.build(builder)
      const { prototype } = TestPolicy

      expect(TestPolicy.__proto__).toBe(Policy)
      expect(prototype).toHaveProperty('modifiers.query', modifyQuery)
      expect(prototype).toHaveProperty('actions.create', canCreate)
    })
  })

  describe('constructor(context)', () => {
    it('uses context argument as context property', () => {
      const context = { post: 1 }
      const policy = new Policy(context)

      expect(policy.context).toBe(context)
    })

    it('throws if context is null or undefined', () => {
      const errorMessage = 'Policy cannot be initialized without context.'

      expect(() => new Policy()).toThrow(errorMessage)

      expect(() => new Policy(null)).toThrow(errorMessage)

      expect(() => new Policy(undefined)).toThrow(errorMessage)
    })

  })

  describe('modify(name, value)', () => {
    it('throws if name is not a string', () => {
      const policy = new Policy({})
      const errorMessage = 'Expected name to be a string.'

      expect(() => policy.modify()).toThrow(errorMessage)
      expect(() => policy.modify(false)).toThrow(errorMessage)
    })

    it('throws if modifier is not defined', () => {
      const policy = new Policy({})

      expect(() => policy.modify('nope'))
        .toThrow('Cannot find modifier "nope".')
    })

    it('throws if modifier is not a function', () => {
      const policy = new Policy({})
      policy.modifiers.test = 'string'

      expect(() => policy.modify('test'))
        .toThrow('Expected modifier to be a function.')
    })

    it('calls modifier with value and context', () => {
      const context = { currentUser: { role: 'admin' } }
      const policy = new Policy(context)
      const modifier = policy.modifiers.test = jest.fn(() => 'return value')
      const modified = policy.modify('test', 'value')

      expect(modifier).toHaveBeenCalledWith('value', context)
      expect(modified).toBe('return value')
    })
  })

  describe('action', () => {
    let policy
    let context

    beforeEach(() => {
      context = { testContext: true }
      class TestPolicy extends Policy {}

      TestPolicy.prototype.actions = {
        read() {
          return true
        },
        delete: 'string'
      }

      policy = new TestPolicy(context)
    })

    describe('can(actionName)', () => {
      it('rejects if action name is not a string', async () => {
        const errorMessage = 'Expected action name to be a string.'

        await expect(policy.can()).rejects.toThrow(errorMessage)
        await expect(policy.can(false)).rejects.toThrow(errorMessage)
        await expect(policy.can(null)).rejects.toThrow(errorMessage)
      })

      it('rejects if action is not found', async () => {
        await expect(policy.can('list'))
          .rejects.toThrow('Cannot find action "list".')
      })

      it('rejects if found action is not a function', async () => {
        await expect(policy.can('delete'))
          .rejects.toThrow('Expected action to be a function.')
      })

      it('calls action with context', async () => {
        policy.actions.update = jest.fn()
        await policy.can('update')
        expect(policy.actions.update).toHaveBeenCalledWith(context)
      })

      it('returns true if action returns true', async () => {
        expect(await policy.can('read')).toBe(true)
      })

      it('returns false if action returns other values than true', async () => {
        policy.actions.read = () => 'string'
        expect(await policy.can('read')).toBe(false)

        policy.actions.read = () => null
        expect(await policy.can('read')).toBe(false)

        policy.actions.read = () => 'true'
        expect(await policy.can('read')).toBe(false)
      })
    })

    describe('authorize(actionName)', () => {
      it('rejects with NotAuthorizedError if not allowed', async () => {
        policy.actions.read = () => false

        await expect(policy.authorize('read'))
          .rejects.toThrow(NotAuthorizedError)
      })

      it('does not reject if allowed', async () => {
        await expect(policy.authorize('read')).resolves
      })
    })
  })
})
