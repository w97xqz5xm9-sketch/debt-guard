import type { Transaction } from '../types'
import { analyzeFixedCosts } from './fixedCostAnalyzer'
import { query } from './database'

// Monthly setup service - handles month start configuration
export interface MonthlySetup {
  savingsGoal: number // selectable tier from setup UI
  fixedCosts: number // AI-calculated fixed costs
  monthlyIncome: number
  variableBudget: number // What can be spent variably
  dailyLimit: number // Daily spending limit
  monthStartDate: string
}

let currentSetup: MonthlySetup | null = null

// Check if database is available
async function useDatabase(): Promise<boolean> {
  try {
    await query('SELECT 1')
    return true
  } catch {
    return false
  }
}

export async function getMonthlySetup(): Promise<MonthlySetup | null> {
  if (await useDatabase()) {
    try {
      const result = await query(
        'SELECT * FROM monthly_setup ORDER BY month_start_date DESC LIMIT 1'
      )
      if (result.rows.length === 0) {
        return null
      }
      const row = result.rows[0]
      return {
        savingsGoal: parseFloat(row.savings_goal),
        fixedCosts: parseFloat(row.fixed_costs),
        monthlyIncome: parseFloat(row.monthly_income),
        variableBudget: parseFloat(row.variable_budget),
        dailyLimit: parseFloat(row.daily_limit),
        monthStartDate: row.month_start_date.toISOString(),
      }
    } catch (error) {
      console.error('Error fetching setup from database:', error)
      return currentSetup
    }
  }
  return currentSetup
}

export async function setMonthlySetup(setup: MonthlySetup | null): Promise<void> {
  if (setup === null) {
    currentSetup = null
    if (await useDatabase()) {
      try {
        await query('DELETE FROM monthly_setup')
      } catch (error) {
        console.error('Error deleting setup from database:', error)
      }
    }
    return
  }

  if (await useDatabase()) {
    try {
      // Delete existing setup and insert new one
      await query('DELETE FROM monthly_setup')
      await query(
        `INSERT INTO monthly_setup (savings_goal, fixed_costs, monthly_income, variable_budget, daily_limit, month_start_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          setup.savingsGoal,
          setup.fixedCosts,
          setup.monthlyIncome,
          setup.variableBudget,
          setup.dailyLimit,
          setup.monthStartDate,
        ]
      )
    } catch (error) {
      console.error('Error saving setup to database:', error)
      currentSetup = setup
    }
  } else {
    currentSetup = setup
  }
}

export async function isNewMonth(): Promise<boolean> {
  const setup = await getMonthlySetup()
  if (!setup) return true
  
  const now = new Date()
  const setupDate = new Date(setup.monthStartDate)
  
  // Check if we're in a different month
  return now.getMonth() !== setupDate.getMonth() || 
         now.getFullYear() !== setupDate.getFullYear()
}

// Calculate fixed costs from transaction history
export function calculateFixedCosts(transactions: Transaction[], upcomingTransactions: Transaction[] = []): number {
  const { total } = analyzeFixedCosts(transactions, upcomingTransactions)
  return total
}
