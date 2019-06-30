class Posts {
  constructor(posts) {
    this.posts = posts
  }

  filter(fn) {
    return this.posts.filter(fn)
  }

  all() {
    return this.posts
  }

  wherePublished() {
    return this.filter(post => post.status === 'published')
  }

  wherePublishedOrAuthorIs(author) {
    return this.filter(
      post => post.status === 'published' || post.author === author.id
    )
  }
}

module.exports = new Posts([
  { id: 1, title: 'Post 1', status: 'published', author: 1 },
  { id: 2, title: 'Post 2', status: 'published', author: 2 },
  { id: 3, title: 'Post 3', status: 'private', author: 2 },
  { id: 4, title: 'Post 4', status: 'private', author: 1 }
])
