const { NotAuthorizedError } = require('./errors')

class BasePolicy {
  constructor(context) {
    if (context === null || context === undefined) {
      throw new Error('Policy cannot be initialized without context.')
    }

    this.modifiers = this.modifiers || {}
    this.actions = this.actions || {}
    this.context = context
  }

  modify(name, value) {
    if (typeof name !== 'string') {
      throw new Error('Expected name to be a string.')
    }

    if (!this.modifiers[name]) {
      throw new Error(`Cannot find modifier "${name}".`)
    }

    const modifier = this.modifiers[name]

    if (typeof modifier !== 'function') {
      throw new Error('Expected modifier to be a function.')
    }

    return modifier(value, this.context)
  }

  async can(actionName) {
    if (typeof actionName !== 'string') {
      throw new Error('Expected action name to be a string.')
    }

    if (!this.actions[actionName]) {
      throw new Error(`Cannot find action "${actionName}".`)
    }

    const action = this.actions[actionName]

    if (typeof action !== 'function') {
      throw new Error('Expected action to be a function.')
    }

    const result = await action(this.context)
    return result === true
  }

  async authorize(actionName) {
    const allowed = await this.can(actionName)

    if (!allowed) {
      throw new NotAuthorizedError({
        policy: this.name,
        action: actionName,
        context: this.context
      })
    }
  }
}

BasePolicy.build = builder => {
  class Policy extends BasePolicy {}

  Object.assign(Policy.prototype, {
    name: builder.name,
    modifiers: builder.modifiersByName,
    actions: builder.actionsByName
  })

  return Policy
}

module.exports = BasePolicy
