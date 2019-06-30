const PolicyBuilder = require('./builder')
const Policy = require('./policy')

module.exports = fenc

const policiesByName = {}

function fenc(policyName, context) {
  return new policiesByName[policyName](context)
}

Object.assign(fenc, {
  register: registerPolicy,
  policy: name => new PolicyBuilder(name)
})

function registerPolicy(...builders) {
  for (const builder of builders) {
    policiesByName[builder.name] = Policy.build(builder)
  }
}
