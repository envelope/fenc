const User = require('../../models/User')

exports.admin = new User({ id: 1, role: 'admin' })
exports.writer = new User({ id: 2, role: 'writer' })
exports.guest = new User({ id: 3, role: 'guest' })
