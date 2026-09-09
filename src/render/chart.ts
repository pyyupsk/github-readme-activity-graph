import type { ContributionDay } from '../github/types'

export interface ChartOptions {
  width: number
  height: number
  padding: { top: number; right: number; bottom: number; left: number }
}

export interface ChartResult {
  linePath: string
  areaPath: string
  points: { x: number; y: number }[]
  gridLines: { x1: number; y1: number; x2: number; y2: number }[]
  labels: { x: number; y: number; text: string }[]
}

export function buildChart(
  days: ContributionDay[],
  { width, height, padding }: ChartOptions,
): ChartResult {
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom
  const max = Math.max(1, ...days.map((d) => d.contributionCount))

  const points = days.map((day, i) => {
    const x = padding.left + (days.length === 1 ? 0 : (i / (days.length - 1)) * plotWidth)
    const y = padding.top + plotHeight - (day.contributionCount / max) * plotHeight
    return { x, y }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')

  const baseline = padding.top + plotHeight
  const areaPath = points.length
    ? `${linePath} L${points.at(-1)!.x},${baseline} L${points[0].x},${baseline} Z`
    : ''

  const gridSteps = 4
  const gridLines = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const y = padding.top + (i / gridSteps) * plotHeight
    return { x1: padding.left, y1: y, x2: width - padding.right, y2: y }
  })

  const labelEvery = Math.ceil(days.length / 8) || 1
  const labels = points
    .filter((_, i) => i % labelEvery === 0)
    .map((p, i) => ({ x: p.x, y: height - padding.bottom / 2, text: days[i * labelEvery].date }))

  return { linePath, areaPath, points, gridLines, labels }
}
