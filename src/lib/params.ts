export interface ColorOverrides {
  bg?: string
  border?: string
  text?: string
  titleColor?: string
  line?: string
  point?: string
  fill?: string
}

export interface GraphParams {
  username: string
  theme: string
  days: number
  from: string | null
  to: string | null
  height: number
  radius: number
  area: boolean
  grid: boolean
  title: string | null
  hideTitle: boolean
  colors: ColorOverrides
}

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return value === 'true'
}

function parseDate(value: string | undefined): string | null {
  if (!value || !DATE_FORMAT.test(value)) return null
  const parsed = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
}

export function resolveRange(params: Pick<GraphParams, 'from' | 'to' | 'days'>): { from: string; to: string } {
  return {
    from: params.from ?? new Date(Date.now() - params.days * 86_400_000).toISOString(),
    to: params.to ?? new Date(Date.now() + 86_400_000).toISOString(),
  }
}

export function parseParams(query: Record<string, string | undefined>): GraphParams {
  const username = query.user ?? ''

  const from = parseDate(query.from)
  const to = parseDate(query.to)
  const hasValidRange = from !== null && to !== null && from < to && to <= new Date().toISOString()

  const days = hasValidRange
    ? Math.round((Date.parse(to as string) - Date.parse(from as string)) / 86_400_000)
    : clamp(Number(query.days) || 30, 1, 90)

  return {
    username,
    theme: query.theme ?? 'default',
    days,
    from: hasValidRange ? from : null,
    to: hasValidRange ? to : null,
    height: clamp(Number(query.height) || 400, 200, 600),
    radius: clamp(Number(query.radius) || 8, 0, 30),
    area: parseBool(query.area, false),
    grid: parseBool(query.grid, true),
    title: query.title === 'false' ? null : (query.title ?? null),
    hideTitle: query.title === 'false',
    colors: {
      bg: query.bg,
      border: query.border,
      text: query.text,
      titleColor: query['title-color'],
      line: query.line,
      point: query.point,
      fill: query.fill,
    },
  }
}
