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
  changeCount?: number // Number of times setup was changed this month
  changeMonth?: string // Month when changes were tracked (YYYY-MM format)
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
        changeCount: row.change_count || 0,
        changeMonth: row.change_month || undefined,
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
        `INSERT INTO monthly_setup (savings_goal, fixed_costs, monthly_income, variable_budget, daily_limit, month_start_date, change_count, change_month)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          setup.savingsGoal,
          setup.fixedCosts,
          setup.monthlyIncome,
          setup.variableBudget,
          setup.dailyLimit,
          setup.monthStartDate,
          setup.changeCount || 0,
          setup.changeMonth || null,
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

// Check if setup can be changed (max 3 times per month)
export async function canChangeSetup(): Promise<{ allowed: boolean; remaining: number }> {
  const setup = await getMonthlySetup()
  if (!setup) {
    return { allowed: true, remaining: 3 }
  }

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  
  // Reset counter if it's a new month
  if (setup.changeMonth !== currentMonth) {
    return { allowed: true, remaining: 3 }
  }

  const changeCount = setup.changeCount || 0
  const remaining = Math.max(0, 3 - changeCount)

  if (changeCount >= 3) {
    return { allowed: false, remaining: 0 }
  }

  return { allowed: true, remaining }
}

// Increment change count when setup is changed
export async function incrementChangeCount(): Promise<void> {
  const setup = await getMonthlySetup()
  if (!setup) return

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  
  // Reset counter if it's a new month
  if (setup.changeMonth !== currentMonth) {
    setup.changeCount = 1
    setup.changeMonth = currentMonth
  } else {
    setup.changeCount = (setup.changeCount || 0) + 1
  }

  // Save updated setup
  await setMonthlySetup(setup)
}

// Calculate fixed costs from transaction history
export function calculateFixedCosts(transactions: Transaction[], upcomingTransactions: Transaction[] = []): number {
  const { total } = analyzeFixedCosts(transactions, upcomingTransactions)
  return total
}
