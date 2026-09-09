import { z } from '@hono/zod-openapi'

export const graphQuerySchema = z.object({
  user: z.string().optional().openapi({ description: 'GitHub username', example: 'pyyupsk' }),
  theme: z.string().optional().openapi({ description: 'Color theme name', example: 'default' }),
  days: z
    .string()
    .optional()
    .openapi({ description: 'Days back from today (1-90)', example: '30' }),
  from: z.string().optional().openapi({ description: 'Start date (YYYY-MM-DD), overrides days' }),
  to: z.string().optional().openapi({ description: 'End date (YYYY-MM-DD)' }),
  height: z
    .string()
    .optional()
    .openapi({ description: 'SVG height in px (200-600)', example: '400' }),
  radius: z
    .string()
    .optional()
    .openapi({ description: 'Corner radius in px (0-30)', example: '8' }),
  area: z
    .string()
    .optional()
    .openapi({ description: 'Fill area under the line', example: 'false' }),
  grid: z
    .string()
    .optional()
    .openapi({ description: 'Show horizontal grid lines', example: 'true' }),
  title: z.string().optional().openapi({ description: 'Custom title, or "false" to hide it' }),
  bg: z.string().optional().openapi({ description: 'Background color override (hex, no #)' }),
  border: z.string().optional().openapi({ description: 'Border color override (hex, no #)' }),
  text: z.string().optional().openapi({ description: 'Text color override (hex, no #)' }),
  'title-color': z.string().optional().openapi({ description: 'Title color override (hex, no #)' }),
  line: z.string().optional().openapi({ description: 'Line color override (hex, no #)' }),
  point: z.string().optional().openapi({ description: 'Point color override (hex, no #)' }),
  fill: z.string().optional().openapi({ description: 'Fill color override (hex, no #)' }),
})
