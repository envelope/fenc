const fenc = require('fenc')
const posts = require('../../services/posts')
const { admin, writer, guest } = require('../fixtures/users')

fenc.register(require('../../policies/posts'))

describe('posts policy', () => {
  describe('action: create', () => {
    it('allows admin role', async () => {
      const policy = fenc('posts', { currentUser: admin })

      expect(await policy.can('create')).toEqual(true)
    })

    it('allows writer role', async () => {
      const policy = fenc('posts', { currentUser: writer })

      expect(await policy.can('create')).toEqual(true)
    })

    it('rejects guest role', async () => {
      const policy = fenc('posts', { currentUser: guest })

      expect(await policy.can('create')).toEqual(false)
    })
  })

  describe('modifier: params', () => {
    const params = {
      title: 'My New Post',
      content: 'Hello, world!'
    }

    describe('admin', () => {
      it('returns params', () => {
        const policy = fenc('posts', { currentUser: admin })

        expect(policy.modify('params', params)).toEqual(params)
      })
    })

    describe('writer', () => {
      it('ensures status is pending', () => {
        const policy = fenc('posts', { currentUser: writer })

        expect(policy.modify('params', params))
          .toEqual({ ...params, status: 'pending' })
      })
    })
  })

  describe('modifier: query', () => {
    describe('admin', () => {
      it('returns all posts', () => {
        const policy = fenc('posts', { currentUser: admin })

        expect(policy.modify('query', posts)).toEqual(posts.all())
      })
    })

    describe('guest', () => {
      it('returns published posts', () => {
        const policy = fenc('posts', { currentUser: guest })

        expect(policy.modify('query', posts)).toEqual(posts.wherePublished())
      })
    })

    describe('writer', () => {
      it('returns posts where the user is author and published posts', () => {
        const policy = fenc('posts', { currentUser: writer })

        expect(policy.modify('query', posts))
          .toEqual(posts.wherePublishedOrAuthorIs(writer))
      })
    })
  })
})
