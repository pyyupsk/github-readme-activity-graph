import { describe, expect, test } from 'bun:test'

import { parseParams, resolveRange } from './params'

describe('parseParams', () => {
  test('defaults when query is empty', () => {
    const params = parseParams({})
    expect(params.username).toBe('')
    expect(params.theme).toBe('default')
    expect(params.days).toBe(30)
    expect(params.height).toBe(400)
    expect(params.radius).toBe(8)
    expect(params.area).toBe(false)
    expect(params.grid).toBe(true)
    expect(params.hideTitle).toBe(false)
  })

  test('clamps out-of-range numeric params', () => {
    const params = parseParams({ days: '999', height: '10', radius: '-5' })
    expect(params.days).toBe(90)
    expect(params.height).toBe(200)
    expect(params.radius).toBe(0)
  })

  test('hides title when title=false', () => {
    const params = parseParams({ title: 'false' })
    expect(params.title).toBeNull()
    expect(params.hideTitle).toBe(true)
  })

  test('valid from/to overrides days', () => {
    const params = parseParams({ from: '2024-01-01', to: '2024-01-10' })
    expect(params.from).toBe('2024-01-01T00:00:00.000Z')
    expect(params.to).toBe('2024-01-10T00:00:00.000Z')
    expect(params.days).toBe(9)
  })

  test('ignores invalid date range and falls back to days', () => {
    const params = parseParams({ from: '2024-01-10', to: '2024-01-01', days: '15' })
    expect(params.from).toBeNull()
    expect(params.to).toBeNull()
    expect(params.days).toBe(15)
  })
})

describe('resolveRange', () => {
  test('uses provided from/to as-is', () => {
    const range = resolveRange({ from: 'a', to: 'b', days: 30 })
    expect(range).toEqual({ from: 'a', to: 'b' })
  })

  test('derives from/to from days when absent', () => {
    const range = resolveRange({ from: null, to: null, days: 7 })
    expect(new Date(range.from).getTime()).toBeLessThan(new Date(range.to).getTime())
  })
})
