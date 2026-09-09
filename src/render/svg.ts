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

      <style>
        .title { font: 600 20px 'Segoe UI', Ubuntu, sans-serif; fill: #${colors.titleColor}; }
        .grid { stroke: #${colors.text}; stroke-width: 1px; stroke-opacity: 0.3; stroke-dasharray: 2px; }
        .line { fill: none; stroke: #${colors.line}; stroke-width: 3px; }
        .area { fill: #${colors.fill}; fill-opacity: 0.15; stroke: none; }
        .point { fill: #${colors.point}; }
        .label { font: 400 11px 'Segoe UI', Ubuntu, sans-serif; fill: #${colors.text}; }
      </style>

      ${title ? `<text x="20" y="34" class="title">${escapeXml(title)}</text>` : ''}

      ${grid ? chart.gridLines.map((l) => `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" class="grid" />`).join('') : ''}

      ${area ? `<path d="${chart.areaPath}" class="area" />` : ''}
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
