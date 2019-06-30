const PolicyBuilder = require('../lib/builder')

describe('PolicyBuilder', () => {
  let builder

  beforeEach(() => {
    builder = new PolicyBuilder('test')
  })

  describe('constructor(name)', () => {
    it('throws if name is not a string', () => {
      expect(() => new PolicyBuilder())
        .toThrow('Expected name to be a string.')

      expect(() => new PolicyBuilder(false))
        .toThrow('Expected name to be a string.')
    })

    it('uses name argument as name property', () => {
      const builder = new PolicyBuilder('name property')

      expect(builder).toHaveProperty('name', 'name property')
    })
  })

  describe('action(name, action)', () => {
    it('throws if name is not a string', () => {
      expect(() => builder.action())
        .toThrow('Expected name to be a string.')

      expect(() => builder.action(false))
        .toThrow('Expected name to be a string.')

      expect(() => builder.action([]))
        .toThrow('Expected name to be a string.')
    })

    it('throws if action is not a function', () => {
      expect(() => builder.action('test'))
        .toThrow('Expected action to be a function.')

      expect(() => builder.action('test', false))
        .toThrow('Expected action to be a function.')

      expect(() => builder.action('test', []))
        .toThrow('Expected action to be a function.')
    })

    it('registers action and returns builder instance', () => {
      const action = () => {}

      expect(builder.action('test', action)).toBe(builder)
      expect(builder.actionsByName).toHaveProperty('test', action)
    })
  })

  describe('modifier(name, modifier)', () => {
    it('throws if name is not a string', () => {
      expect(() => builder.modifier())
        .toThrow('Expected name to be a string.')

      expect(() => builder.modifier(false))
        .toThrow('Expected name to be a string.')

      expect(() => builder.modifier([]))
        .toThrow('Expected name to be a string.')
    })

    it('throws if modifier is not a function', () => {
      expect(() => builder.modifier('test'))
        .toThrow('Expected modifier to be a function.')

      expect(() => builder.modifier('test', false))
        .toThrow('Expected modifier to be a function.')

      expect(() => builder.modifier('test', []))
        .toThrow('Expected modifier to be a function.')
    })

    it('registers modifier and returns builder instance', () => {
      const modifier = () => {}

      expect(builder.modifier('test', modifier)).toBe(builder)
      expect(builder.modifiersByName).toHaveProperty('test', modifier)
    })
  })
})
