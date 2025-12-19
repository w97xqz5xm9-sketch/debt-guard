import type { Transaction, FixedCostInsight, FixedCostAnalysis } from '../types'

const recurringCategories = ['Rechnungen', 'Versicherung', 'Abonnement', 'Miete', 'Transport']

const keywordMatchers = [
  { pattern: /miete|rent/i, name: 'Miete', category: 'Rechnungen' },
  { pattern: /strom|gas|energie/i, name: 'Strom & Gas', category: 'Rechnungen' },
  { pattern: /internet|telefon|vodafone|telekom|dsl/i, name: 'Internet & Telefon', category: 'Rechnungen' },
  { pattern: /versicherung|insurance/i, name: 'Versicherung', category: 'Versicherung' },
  { pattern: /netflix|spotify|disney|prime|audible/i, name: 'Streaming & Medien', category: 'Abonnement' },
  { pattern: /fitness|gym|studio/i, name: 'Fitnessabo', category: 'Abonnement' },
]

const DEFAULT_FIXED_COSTS: Array<{ name: string; amount: number; category: string }> = []

interface GroupedCost {
  key: string
  name: string
  category: string
  amounts: number[]
  dates: string[]
  source: FixedCostInsight['source']
  keywordHit: boolean
}

const inferFrequency = (dates: string[]): FixedCostInsight['frequency'] => {
  if (dates.length < 2) return 'monthly'

  const sorted = dates
    .map(date => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime())

  const diffs = sorted.slice(1).map((date, idx) => {
    const previous = sorted[idx]
    return (date.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
  })

  const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length

  if (avgDiff <= 8) return 'weekly'
  if (avgDiff <= 20) return 'bi-weekly'
  if (avgDiff <= 45) return 'monthly'
  return 'irregular'
}

const nextDueDateFromFrequency = (lastOccurrence: string, frequency: FixedCostInsight['frequency']): string | undefined => {
  const baseDate = new Date(lastOccurrence)
  const next = new Date(baseDate)

  switch (frequency) {
    case 'weekly':
      next.setDate(baseDate.getDate() + 7)
      break
    case 'bi-weekly':
      next.setDate(baseDate.getDate() + 14)
      break
    case 'monthly':
      next.setMonth(baseDate.getMonth() + 1)
      break
    default:
      return undefined
  }

  return next.toISOString()
}

const buildInsightFromGroup = (group: GroupedCost): FixedCostInsight => {
  const total = group.amounts.reduce((sum, amount) => sum + amount, 0)
  const averageAmount = total / group.amounts.length
  const lastOccurrence = group.dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).pop() ?? new Date().toISOString()
  const frequency = inferFrequency(group.dates)
  const confidenceBase = group.keywordHit ? 0.6 : 0.4
  const confidence = Math.min(1, confidenceBase + Math.min(group.amounts.length * 0.1, 0.3))

  return {
    id: group.key,
    name: group.name,
    category: group.category,
    averageAmount,
    lastAmount: group.amounts[group.amounts.length - 1],
    frequency,
    confidence,
    lastOccurrence,
    nextDueDate: nextDueDateFromFrequency(lastOccurrence, frequency),
    source: group.source,
  }
}

export function analyzeFixedCosts(transactions: Transaction[], upcomingTransactions: Transaction[] = []): FixedCostAnalysis {
  const groups = new Map<string, GroupedCost>()

  const addToGroup = (key: string, name: string, category: string, amount: number, date: string, source: FixedCostInsight['source'], keywordHit: boolean) => {
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name,
        category,
        amounts: [],
        dates: [],
        source,
        keywordHit,
      })
    }

    const group = groups.get(key)!
    group.amounts.push(amount)
    group.dates.push(date)
    group.keywordHit = group.keywordHit || keywordHit
  }

  const expenseTransactions = transactions.filter(t => t.type === 'expense')

  expenseTransactions.forEach(transaction => {
    let matched = false

    for (const matcher of keywordMatchers) {
      if (matcher.pattern.test(transaction.description)) {
        addToGroup(
          `keyword:${matcher.name}`,
          matcher.name,
          matcher.category,
          transaction.amount,
          transaction.date,
          'history',
          true,
        )
        matched = true
        break
      }
    }

    if (!matched && recurringCategories.includes(transaction.category)) {
      addToGroup(
        `category:${transaction.category}`,
        transaction.category,
        transaction.category,
        transaction.amount,
        transaction.date,
        'history',
        false,
      )
    }
  })

  upcomingTransactions.forEach(transaction => {
    const matcher = keywordMatchers.find(m => m.pattern.test(transaction.description))
    const key = matcher ? `keyword:${matcher.name}` : `upcoming:${transaction.description.toLowerCase()}`
    const name = matcher ? matcher.name : transaction.description
    const category = matcher ? matcher.category : transaction.category || 'Rechnungen'

    addToGroup(
      key,
      name,
      category,
      transaction.amount,
      transaction.date,
      'upcoming',
      Boolean(matcher),
    )
  })

  let insights = Array.from(groups.values()).map(group => buildInsightFromGroup(group))
  let total = insights.reduce((sum, insight) => sum + insight.averageAmount, 0)

  // No default fixed costs - return empty if no transactions found
  // If total === 0, return empty insights and 0 total
  if (total === 0 && DEFAULT_FIXED_COSTS.length === 0) {
    return {
      total: 0,
      insights: [],
    }
  }

  // Only use default costs if they exist and no transactions found
  if (total === 0 && DEFAULT_FIXED_COSTS.length > 0) {
    insights = DEFAULT_FIXED_COSTS.map((cost, index) => ({
      id: `default-${index}`,
      name: cost.name,
      category: cost.category,
      averageAmount: cost.amount,
      lastAmount: cost.amount,
      frequency: 'monthly',
      confidence: 0.3,
      lastOccurrence: new Date().toISOString(),
      nextDueDate: undefined,
      source: 'estimated',
    }))
    total = DEFAULT_FIXED_COSTS.reduce((sum, cost) => sum + cost.amount, 0)
  }

  insights.sort((a, b) => b.averageAmount - a.averageAmount)

  return {
    total,
    insights,
  }
}


