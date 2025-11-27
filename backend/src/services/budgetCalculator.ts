import type { BudgetCalculation } from '../types'
import { getAccounts } from './dataService'
import { getTransactions, getUpcomingTransactions } from './dataService'
import { getMonthlySetup, isNewMonth } from './monthlySetup'
import { analyzeFixedCosts } from './fixedCostAnalyzer'

export async function calculateDailyBudget(): Promise<BudgetCalculation> {
  const accounts = await getAccounts()
  const transactions = await getTransactions()
  const upcomingTransactions = await getUpcomingTransactions()
  const setup = getMonthlySetup()

  // If no setup or new month, return default values (will trigger setup)
  if (!setup || isNewMonth()) {
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

  // Calculate fixed costs using AI analysis
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

  // Calculate daily limit (distribute variable budget over remaining days)
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()
  const remainingDaysInMonth = daysInMonth - dayOfMonth + 1

  const dailyAvailable = variableBudget / remainingDaysInMonth

  // Calculate spent today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const spentToday = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      transactionDate.setHours(0, 0, 0, 0)
      return transactionDate.getTime() === today.getTime() && t.type === 'expense'
    })
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate risk factor
  const budgetUsage = (spentToday / dailyAvailable) * 100
  const riskFactor = Math.min(1, Math.max(0, budgetUsage / 100))

  // Generate recommendations
  const recommendations: string[] = []
  
  if (spentToday >= dailyAvailable) {
    recommendations.push('⚠️ Tageslimit erreicht! Größere Käufe werden blockiert.')
  } else if (spentToday >= dailyAvailable * 0.8) {
    recommendations.push('Du näherst dich deinem Tageslimit. Sei vorsichtig mit weiteren Ausgaben.')
  } else {
    recommendations.push(`Du kannst heute noch ${(dailyAvailable - spentToday).toFixed(2)}€ ausgeben.`)
  }

  return {
    dailyAvailable: Math.max(0, dailyAvailable),
    monthlyAvailable: Math.max(0, variableBudget),
    upcomingDeductions: fixedCosts,
    savingsAllocation: setup.savingsGoal,
    riskFactor,
    recommendations,
    fixedCostInsights,
  }
}

