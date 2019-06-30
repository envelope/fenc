/* istanbul ignore file */
const fenc = require('../..')

const posts = fenc.policy('posts')

/**
 * Filter posts by the current user's role.
 */
posts.modifier('posts',
  (posts, { currentUser }) => {
    // Admins can se all posts.
    if (currentUser.role === 'admin') {
      return posts
    }

    // Writers can see their own and published posts.
    if (currentUser.role === 'writer') {
      return posts.filter(post =>
        post.author_id === currentUser.id || post.status === 'published'
      )
    }

    // Others can only see published posts.
    return posts.filter(post => post.status === 'published')
  }
)

/**
 * Define which roles can update a post.
 */
posts.action('update',
  ({ post, currentUser }) => {
    // Admins can update all posts.
    if (currentUser.role === 'admin') {
      return true
    }

    // Writers can update their own posts.
    if (currentUser.role === 'writer' && post.author_id === currentUser.id) {
      return true
    }
  }
)

module.exports = { posts }
