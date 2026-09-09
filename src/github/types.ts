export interface ContributionDay {
  date: string
  contributionCount: number
}

export interface Week {
  contributionDays: ContributionDay[]
}

export interface ContributionsResult {
  name: string | null
  contributions: ContributionDay[]
}

export interface GraphQLResponse {
  data?: {
    user: {
      name: string | null
      contributionsCollection: {
        contributionCalendar: {
          weeks: Week[]
        }
      }
    } | null
  }
  errors?: { message: string; type: string }[]
}
