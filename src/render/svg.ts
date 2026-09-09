import type { ContributionDay } from '../github/types'
import { buildChart } from './chart'
import type { Colors } from './theme'

function escapeXml(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!,
  )
}

export interface GraphSvgArgs {
  width: number
  height: number
  radius: number
  colors: Colors
  title: string | null
  area: boolean
  grid: boolean
  contributions: ContributionDay[]
}

function styleBlock(colors: Colors): string {
  return `
    <style>
      .title { font: 600 20px 'Segoe UI', Ubuntu, sans-serif; fill: #${colors.titleColor}; }
      .grid { stroke: #${colors.text}; stroke-width: 1px; stroke-opacity: 0.3; stroke-dasharray: 2px; }
      .line { fill: none; stroke: #${colors.line}; stroke-width: 3px; stroke-dasharray: 5000; stroke-dashoffset: 5000; animation: dash 5s ease-in-out forwards; }
      .area { fill: #${colors.fill}; fill-opacity: 0.15; stroke: none; }
      .point { fill: #${colors.point}; animation: blink 1s ease-in-out forwards; }
      .label { font: 400 11px 'Segoe UI', Ubuntu, sans-serif; fill: #${colors.text}; }

      @keyframes dash {
        to { stroke-dashoffset: 0; }
      }

      @keyframes blink {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    </style>
  `
}

function titleBlock(title: string | null): string {
  return title ? `<text x="20" y="34" class="title">${escapeXml(title)}</text>` : ''
}

function gridBlock(grid: boolean, lines: ReturnType<typeof buildChart>['gridLines']): string {
  if (!grid) return ''
  return lines
    .map((l) => `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" class="grid" />`)
    .join('')
}

function areaBlock(area: boolean, areaPath: string): string {
  return area ? `<path d="${areaPath}" class="area" />` : ''
}

export function graphSvg({
  width,
  height,
  radius,
  colors,
  title,
  area,
  grid,
  contributions,
}: GraphSvgArgs): string {
  const padding = { top: title ? 60 : 20, right: 20, bottom: 30, left: 20 }
  const chart = buildChart(contributions, { width, height, padding })

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" rx="${radius}" width="100%" height="100%"
        fill="#${colors.bg}" stroke="#${colors.border}" stroke-width="1" />

      ${styleBlock(colors)}

      ${titleBlock(title)}

      ${gridBlock(grid, chart.gridLines)}

      ${areaBlock(area, chart.areaPath)}
      <path d="${chart.linePath}" class="line" />

      ${chart.points.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" class="point" />`).join('')}

      ${chart.labels.map((l) => `<text x="${l.x}" y="${l.y}" class="label" text-anchor="middle">${escapeXml(l.text)}</text>`).join('')}
    </svg>
  `
}

export function errorSvg(message: string): string {
  return `
    <svg width="420" height="200" viewBox="0 0 420 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>text { font: 600 14px 'Segoe UI', Ubuntu, sans-serif; }</style>
      <rect x="0.5" y="0.5" rx="4.5" width="99%" height="99%" fill="#44475a" stroke="#E4E2E2" />
      <text x="20" y="100" fill="#bd93f9">${escapeXml(message)}</text>
    </svg>
  `
}
