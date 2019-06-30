const fenc = require('fenc')

// Let's create a policy for our `Post` model.
const policy = module.exports = fenc.policy('posts')

// Here we're defining our first action "create".
policy.action('create', ({ currentUser }) => {
  // If the user trying to create a new post has the role `admin` or `writer`
  // we'll allow it.
  return currentUser.role === 'admin' || currentUser.role === 'writer'
})

// Here we're defining a modifier. A modifier is a function that may
// modify and return a value based on the policy context.
policy.modifier('query', (posts, { currentUser }) => {
  // Admins can see all posts. Let's allow this:
  if (currentUser.role === 'admin') {
    return posts.all()
  }

  // Writers can see their own and published posts.
  if (currentUser.role === 'writer') {
    return posts.wherePublishedOrAuthorIs(currentUser)
  }

  // Guests and other roles can only see published posts.
  return posts.wherePublished()
})

// Here we're defining a modifier that ensures the `status` property is always
// "pending" for other roles than `admin`.
policy.modifier('params', (params, { currentUser }) => {
  if (currentUser.role === 'admin') {
    return params
  }

  return { ...params, status: 'pending' }
})
