const fenc = require('fenc')
const posts = require('./services/posts')
const User = require('./models/User')

fenc.register(require('./policies/posts'))

const admin = new User({ id: 1, role: 'admin' })
const writer = new User({ id: 2, role: 'writer' })
const guest = new User({ id: 3, role: 'guest' })

function getPostsWithUser(user) {
  // Retrieve our `posts` policy object passing our user to the context.
  const policy = fenc('posts', { currentUser: user })

  // Filter our posts query
  return policy.modify('query', posts)
}

console.log(
  'A user with the `admin` role can see following posts:\n',
  getPostsWithUser(admin)
)

console.log(
  '\nA user with the `writer` role and has id 2 can see following posts:\n',
  getPostsWithUser(writer)
)

console.log(
  '\nA guest can see following posts:\n',
  getPostsWithUser(guest)
)

function canUserCreatePost(user) {
  // Retrieve our `posts` policy object passing our user to the context and
  // call the `can` method. `can` returns a Promise that resolves to either
  // `true` or `false`.
  return fenc('posts', { currentUser: user }).can('create')
}

canUserCreatePost(admin).then(can => {
  console.log(
    '\nCan a user with the role `admin` create a post?', can ? 'yes' : 'no'
  )
})

canUserCreatePost(writer).then(can => {
  console.log(
    '\nCan a user with the role `writer` create a post?', can ? 'yes' : 'no'
  )
})

canUserCreatePost(guest).then(can => {
  console.log(
    '\nCan a user with the role `guest` create a post?', can ? 'yes' : 'no'
  )
})
