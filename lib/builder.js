class PolicyBuilder {
  constructor(name) {
    if (typeof name !== 'string') {
      throw new Error('Expected name to be a string.')
    }

    this.name = name
    this.actionsByName = {}
    this.modifiersByName = {}
  }

  action(name, action) {
    if (typeof name !== 'string') {
      throw new Error('Expected name to be a string.')
    }
    if (typeof action !== 'function') {
      throw new Error('Expected action to be a function.')
    }

    this.actionsByName[name] = action
    return this
  }

  modifier(name, modifier) {
    if (typeof name !== 'string') {
      throw new Error('Expected name to be a string.')
    }
    if (typeof modifier !== 'function') {
      throw new Error('Expected modifier to be a function.')
    }

    this.modifiersByName[name] = modifier
    return this
  }
}

module.exports = PolicyBuilder
