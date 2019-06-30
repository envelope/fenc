class NotAuthorizedError extends Error {
  constructor({ policy, action, context }) {
    super('Not Authorized')

    this.name = this.constructor.name
    this.policy = policy
    this.action = action
    this.context = context

    Error.captureStackTrace(this, this.constructor)
  }
}

exports.NotAuthorizedError = NotAuthorizedError
