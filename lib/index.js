const PolicyBuilder = require('./builder')
const Policy = require('./policy')

module.exports = fenc

const policiesByName = {}

function fenc(policyName, context) {
  if (!policiesByName[policyName]) {
    throw new Error(
      `Cannot find policy "${policyName}". Did you forget to register it?`
    )
  }

  return new policiesByName[policyName](context)
}

Object.assign(fenc, {
  register: registerPolicy,
  policy: name => new PolicyBuilder(name),
  use
})

function registerPolicy(...builders) {
  for (const builder of builders) {
    if (builder instanceof PolicyBuilder !== true) {
      throw new Error('Expected builder to be instance of PolicyBuilder.')
    }

    policiesByName[builder.name] = Policy.build(builder)
  }
}

function use(plugin) {
  if (typeof plugin !== 'function') {
    throw new Error('Plugin must be a function.')
  }

  plugin(fenc)

  return fenc
}
