import { describe, expect, test } from 'bun:test'

import { resolveColors } from './theme'

describe('resolveColors', () => {
  test('falls back to default theme for unknown name', () => {
    const colors = resolveColors('does-not-exist', {})
    expect(colors.fill).toBe('9e4c98')
  })

  test('applies theme colors', () => {
    const colors = resolveColors('dracula', {})
    expect(colors.bg).toBe('44475a')
  })

  test('overrides win over theme defaults', () => {
    const colors = resolveColors('dracula', { bg: '000000' })
    expect(colors.bg).toBe('000000')
    expect(colors.fill).toBe('ff79c6')
  })

  test('ignores empty override values', () => {
    const colors = resolveColors('dracula', { bg: '' })
    expect(colors.bg).toBe('44475a')
  })

  test('redical is an alias of radical', () => {
    expect(resolveColors('redical', {})).toEqual(resolveColors('radical', {}))
  })
})
