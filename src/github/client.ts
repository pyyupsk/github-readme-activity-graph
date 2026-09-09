import { safe } from '../lib/safe'
import { contributionsQuery } from './query'
import type { ContributionDay, ContributionsResult, GraphQLResponse } from './types'

export class RateLimitedError extends Error { }
export class InvalidUserError extends Error { }

export async function fetchContributions(
  username: string,
  token: string,
  from: string,
  to: string,
): Promise<ContributionsResult> {
  const [err, res] = await safe(
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'github-readme-activity-graph',
      },
      body: JSON.stringify({
        query: contributionsQuery,
        variables: { login: username, from, to },
      }),
    }),
  )

  if (err) throw err

  const body = (await res.json()) as GraphQLResponse

  if (body.errors) {
    if (body.errors[0].type === 'RATE_LIMITED') {
      throw new RateLimitedError('GitHub API rate limit exceeded')
    }
    throw new InvalidUserError(`Can't fetch contributions for "${username}"`)
  }

  if (!body.data?.user) {
    throw new InvalidUserError(`Can't fetch contributions for "${username}"`)
  }

  const contributions: ContributionDay[] = body.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) => week.contributionDays,
  )

  return { name: body.data.user.name, contributions }
}

export function describeError(err: unknown): string {
  if (err instanceof RateLimitedError) return '💥 API rate limit exceeded. Please deploy your own instance.'
  if (err instanceof InvalidUserError) return err.message
  return 'Something unexpected happened 💥'
}
