import type { BudgetCalculation } from '../types'
import { getAccounts } from './dataService'
import { getTransactions, getUpcomingTransactions } from './dataService'
import { getMonthlySetup, isNewMonth } from './monthlySetup'
import { analyzeFixedCosts } from './fixedCostAnalyzer'

export async function calculateDailyBudget(): Promise<BudgetCalculation> {
  const accounts = await getAccounts()
  const transactions = await getTransactions()
  const upcomingTransactions = await getUpcomingTransactions()
  const setup = await getMonthlySetup()

  // If no setup or new month, return default values (will trigger setup)
  if (!setup || await isNewMonth()) {
    return {
      dailyAvailable: 0,
      monthlyAvailable: 0,
      upcomingDeductions: 0,
      savingsAllocation: 0,
      riskFactor: 0,
      recommendations: ['Bitte Monats-Setup durchführen'],
      fixedCostInsights: [],
    }
  }

  // Calculate fixed costs using automatic analysis
  const { total: fixedCosts, insights: fixedCostInsights } = analyzeFixedCosts(transactions, upcomingTransactions)
  
  // Calculate monthly income from transaction history
  const incomeTransactions = transactions.filter(t => t.type === 'income')
  const lastMonthIncome = incomeTransactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return transactionDate >= thirtyDaysAgo
    })
    .reduce((sum, t) => sum + t.amount, 0)
  
  // Use setup income or calculated income
  const monthlyIncome = setup.monthlyIncome || lastMonthIncome || 3000

  // Calculate variable budget: Income - Fixed Costs - Savings Goal
  const variableBudget = monthlyIncome - fixedCosts - setup.savingsGoal

  // Calculate how much has been spent this month (excluding today)
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  monthStart.setHours(0, 0, 0, 0)
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const spentThisMonth = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      transactionDate.setHours(0, 0, 0, 0)
      // Only count expenses from this month, but not today
      return transactionDate >= monthStart && 
             transactionDate < today && 
             t.type === 'expense'
    })
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate remaining budget: total variable budget minus what was already spent
  const remainingBudget = variableBudget - spentThisMonth

  // Calculate daily limit (distribute remaining budget over remaining days)
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()
  const remainingDaysInMonth = daysInMonth - dayOfMonth + 1

  // Calculate average daily budget for the month
  const averageDailyBudget = variableBudget / daysInMonth

  // Minimum daily amount that should always be available (for necessities like food, transport)
  const MINIMUM_DAILY_AMOUNT = 12.50 // 12,50€ minimum per day

  // Flexible daily limit calculation:
  // - Base: Average daily budget (what you "should" spend per day)
  // - Plus: Accumulated unused budget from previous days
  // - This allows spending more on some days if you spent less on others
  
  // Calculate how much was "planned" to be spent by now (average daily * days passed)
  const daysPassed = dayOfMonth - 1 // Days that have passed (excluding today)
  const plannedSpending = averageDailyBudget * daysPassed

  // Calculate unused budget: planned spending minus actual spending
  // If positive: you spent less than planned (have unused budget)
  // If negative: you spent more than planned (over budget)
  const unusedBudget = plannedSpending - spentThisMonth

  // Daily available = average daily budget + accumulated unused budget / remaining days
  // This way, if you spent less earlier, you have more available now
  const calculatedDailyAvailable = averageDailyBudget + (unusedBudget / remainingDaysInMonth)

  // Use the calculated amount, but never go below the minimum
  // However, if remaining budget is negative, we still allow the minimum
  const dailyAvailable = remainingBudget > 0 
    ? Math.max(calculatedDailyAvailable, MINIMUM_DAILY_AMOUNT)
    : MINIMUM_DAILY_AMOUNT

  // Calculate 3-day rolling window limit (3x daily available)
  const threeDayLimit = dailyAvailable * 3

  // Calculate spent in last 3 days (rolling window: today, yesterday, day before yesterday)
  const threeDaysAgo = new Date(today)
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 2) // 2 days ago (so we include today, yesterday, and 2 days ago)
  threeDaysAgo.setHours(0, 0, 0, 0)

  const spentLast3Days = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      transactionDate.setHours(0, 0, 0, 0)
      // Include transactions from the last 3 days (today, yesterday, day before yesterday)
      return transactionDate >= threeDaysAgo && 
             transactionDate <= today && 
             t.type === 'expense'
    })
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate risk factor based on 3-day window
  const budgetUsage = (spentLast3Days / threeDayLimit) * 100
  const riskFactor = Math.min(1, Math.max(0, budgetUsage / 100))

  // Generate recommendations
  const recommendations: string[] = []
  
  // Check if we're using the minimum (budget exceeded or very tight)
  const isUsingMinimum = remainingBudget <= 0 || calculatedDailyAvailable < MINIMUM_DAILY_AMOUNT
  
  const remainingIn3Days = threeDayLimit - spentLast3Days
  
  if (isUsingMinimum) {
    recommendations.push(`⚠️ Budget überschritten oder sehr knapp. Nur noch ${MINIMUM_DAILY_AMOUNT.toFixed(2)}€ pro Tag für notwendige Ausgaben verfügbar.`)
  } else if (spentLast3Days >= threeDayLimit) {
    recommendations.push('⚠️ 3-Tage-Limit erreicht! Größere Käufe werden blockiert.')
  } else if (spentLast3Days >= threeDayLimit * 0.8) {
    recommendations.push('Du näherst dich deinem 3-Tage-Limit. Sei vorsichtig mit weiteren Ausgaben.')
  } else {
    recommendations.push(`Du kannst in den nächsten 3 Tagen noch ${remainingIn3Days.toFixed(2)}€ ausgeben.`)
  }

  return {
    dailyAvailable: Math.max(0, threeDayLimit), // Return 3-day limit as "dailyAvailable" for compatibility
    monthlyAvailable: Math.max(0, variableBudget),
    upcomingDeductions: fixedCosts,
    savingsAllocation: setup.savingsGoal,
    riskFactor,
    recommendations,
    fixedCostInsights,
  }
}

