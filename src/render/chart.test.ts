import { describe, expect, test } from 'bun:test'

import { buildChart } from './chart'

const padding = { top: 20, right: 20, bottom: 30, left: 20 }

describe('buildChart', () => {
  test('produces one point per day', () => {
    const days = [
      { date: '2024-01-01', contributionCount: 1 },
      { date: '2024-01-02', contributionCount: 5 },
      { date: '2024-01-03', contributionCount: 0 },
    ]
    const chart = buildChart(days, { width: 200, height: 100, padding })
    expect(chart.points).toHaveLength(3)
    expect(chart.linePath.startsWith('M')).toBe(true)
  })

  test('handles empty contributions without crashing', () => {
    const chart = buildChart([], { width: 200, height: 100, padding })
    expect(chart.points).toHaveLength(0)
    expect(chart.linePath).toBe('')
    expect(chart.areaPath).toBe('')
  })

  test('single day places point at left edge', () => {
    const chart = buildChart([{ date: '2024-01-01', contributionCount: 3 }], {
      width: 200,
      height: 100,
      padding,
    })
    expect(chart.points[0].x).toBe(padding.left)
  })

  test('max contribution day sits at the top of the plot area', () => {
    const days = [
      { date: '2024-01-01', contributionCount: 1 },
      { date: '2024-01-02', contributionCount: 10 },
    ]
    const chart = buildChart(days, { width: 200, height: 100, padding })
    expect(chart.points[1].y).toBe(padding.top)
  })
})
