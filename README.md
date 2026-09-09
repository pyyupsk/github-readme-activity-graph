# GitHub Readme Activity Graph

Generate a GitHub contribution activity graph as an SVG for your README.

```md
![](https://graph.fasu.dev/graph?user=pyyupsk)
```

## `/graph`

Returns an SVG image.

| Param                                                          | Default                       | Description                                    |
| -------------------------------------------------------------- | ----------------------------- | ---------------------------------------------- |
| `user`                                                         | _(required)_                  | GitHub username                                |
| `theme`                                                        | `default`                     | Color theme name (see `src/render/theme.ts`)   |
| `days`                                                         | `30`                          | Number of days back from today (1–90)          |
| `from`                                                         | -                             | Start date (`YYYY-MM-DD`), overrides `days`    |
| `to`                                                           | -                             | End date (`YYYY-MM-DD`)                        |
| `height`                                                       | `400`                         | SVG height in px (200–600)                     |
| `radius`                                                       | `8`                           | Corner radius in px (0–30)                     |
| `area`                                                         | `false`                       | Fill the area under the line                   |
| `grid`                                                         | `true`                        | Show horizontal grid lines                     |
| `title`                                                        | `<name>'s Contribution Graph` | Custom title, or `false` to hide it            |
| `bg`, `border`, `text`, `title-color`, `line`, `point`, `fill` | -                             | Override individual theme colors (hex, no `#`) |

## `/data`

Returns the same contribution data as JSON, without rendering an SVG.

```json
{ "name": "...", "contributions": [{ "date": "...", "contributionCount": 0 }] }
```

Accepts the same `user`, `days`, `from`, `to` params as `/graph`.

## Development

```txt
bun install
bun run dev
```

```txt
bun run deploy
```

[Generate/sync types from your Worker config](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
bun run typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

Requires a `GH_TOKEN` binding (GitHub personal access token, no scopes needed for public contribution data) — set it in `.dev.vars` for local dev and as a secret for deployment.

## Credit

Themes and the GitHub GraphQL query are ported from [Ashutosh00710/github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph).
