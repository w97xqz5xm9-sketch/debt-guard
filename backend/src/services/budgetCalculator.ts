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

  // Calculate 3-day rolling window limit: (Gesamt Budget - Sparziel) / 10
  // Gesamt Budget = monthlyIncome - fixedCosts
  // Also: (monthlyIncome - fixedCosts - savingsGoal) / 10 = variableBudget / 10
  const threeDayLimit = variableBudget / 10

  // Get current date and time
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  today.setHours(0, 0, 0, 0)
  
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  monthStart.setHours(0, 0, 0, 0)
  
  // Calculate how much has been spent this month (including today)
  const spentThisMonth = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      transactionDate.setHours(0, 0, 0, 0)
      // Count all expenses from this month including today
      return transactionDate >= monthStart && 
             transactionDate <= today && 
             t.type === 'expense'
    })
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate remaining budget: total variable budget minus what was already spent
  const remainingBudget = variableBudget - spentThisMonth

  // Minimum daily amount that should always be available (for necessities like food, transport)
  const MINIMUM_DAILY_AMOUNT = 12.50 // 12,50€ minimum per day
  const MINIMUM_3_DAY_AMOUNT = MINIMUM_DAILY_AMOUNT * 3 // Minimum for 3 days

  // Ensure 3-day limit is never below minimum
  const finalThreeDayLimit = Math.max(threeDayLimit, MINIMUM_3_DAY_AMOUNT)

  // Calculate spent in last 3 days (rolling window: today, yesterday, day before yesterday)
  // This is a true rolling window - always the last 3 calendar days
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
  // Risk factor is based on how much of the 3-day limit is used
  const budgetUsage = finalThreeDayLimit > 0 ? (spentLast3Days / finalThreeDayLimit) * 100 : 0
  const riskFactor = Math.min(1, Math.max(0, budgetUsage / 100))

  // Generate recommendations
  const recommendations: string[] = []
  
  // Check if we're using the minimum (budget exceeded or very tight)
  const isUsingMinimum = remainingBudget <= 0 || finalThreeDayLimit <= MINIMUM_3_DAY_AMOUNT
  
  const remainingIn3Days = Math.max(0, finalThreeDayLimit - spentLast3Days)
  
  if (isUsingMinimum) {
    recommendations.push(`⚠️ Budget überschritten oder sehr knapp. Nur noch ${MINIMUM_3_DAY_AMOUNT.toFixed(2)}€ für 3 Tage für notwendige Ausgaben verfügbar.`)
  } else if (spentLast3Days >= finalThreeDayLimit) {
    recommendations.push(`⚠️ 3-Tage-Limit erreicht! Du hast bereits ${spentLast3Days.toFixed(2)}€ von ${finalThreeDayLimit.toFixed(2)}€ ausgegeben. Größere Käufe werden blockiert.`)
  } else if (spentLast3Days >= finalThreeDayLimit * 0.8) {
    recommendations.push(`⚠️ Du näherst dich deinem 3-Tage-Limit. Bereits ${spentLast3Days.toFixed(2)}€ von ${finalThreeDayLimit.toFixed(2)}€ ausgegeben. Sei vorsichtig mit weiteren Ausgaben.`)
  } else {
    recommendations.push(`Du kannst in den nächsten 3 Tagen noch ${remainingIn3Days.toFixed(2)}€ ausgeben (von ${finalThreeDayLimit.toFixed(2)}€ Limit).`)
  }

  return {
    dailyAvailable: Math.max(0, finalThreeDayLimit), // Return 3-day limit as "dailyAvailable" for compatibility
    monthlyAvailable: Math.max(0, variableBudget),
    upcomingDeductions: fixedCosts,
    savingsAllocation: setup.savingsGoal,
    riskFactor,
    recommendations,
    fixedCostInsights,
  }
}

