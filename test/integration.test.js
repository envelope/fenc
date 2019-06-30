const path = require('path')
const policies = require('./helpers/policies')

describe('integration', () => {
  let fenc
  let admin = { id: 1, role: 'admin' }
  let guest = { id: 2, role: 'guest' }
  let writer = { id: 3, role: 'writer' }
  let entities = [
    { id: 1, title: 'Post 1', status: 'published', author_id: 1 },
    { id: 2, title: 'Post 2', status: 'scheduled', author_id: 1 },
    { id: 3, title: 'Post 3', status: 'private', author_id: 3 }
  ]

  beforeEach(() => {
    delete require.cache[path.resolve(__dirname, '../lib')]
    fenc = require('../lib')

    fenc.register(policies.posts)
  })

  it('returns published posts for guests', () => {
    const posts = fenc('posts', { currentUser: guest })
      .modify('posts', entities)

    expect(posts).toEqual(entities.slice(0, 1))
  })

  it('returns all posts for admins', () => {
    const posts = fenc('posts', { currentUser: admin })
      .modify('posts', entities)

    expect(posts).toEqual(entities)
  })

  it('allows admins to update posts', async () => {
    const policy = fenc('posts', { currentUser: admin, post: entities[2] })

    expect(await policy.can('update')).toBe(true)
  })

  it('allows writers to update their own posts', async () => {
    const currentUser = writer
    const ownPost = fenc('posts', { currentUser, post: entities[2] })
    const otherPost = fenc('posts', { currentUser, post: entities[0] })

    expect(await ownPost.can('update')).toBe(true)
    expect(await otherPost.can('update')).toBe(false)
  })

  it('is not allowed for guests to update posts', async () => {
    const policy = fenc('posts', { currentUser: guest, post: entities[0] })

    expect(await policy.can('update')).toBe(false)
  })
})
