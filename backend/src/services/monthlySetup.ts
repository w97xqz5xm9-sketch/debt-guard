import type { Transaction } from '../types'
import { analyzeFixedCosts } from './fixedCostAnalyzer'

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

export function getMonthlySetup(): MonthlySetup | null {
  return currentSetup
}

export function setMonthlySetup(setup: MonthlySetup | null): void {
  currentSetup = setup
}

export function isNewMonth(): boolean {
  if (!currentSetup) return true
  
  const now = new Date()
  const setupDate = new Date(currentSetup.monthStartDate)
  
  // Check if we're in a different month
  return now.getMonth() !== setupDate.getMonth() || 
         now.getFullYear() !== setupDate.getFullYear()
}

// Calculate fixed costs from transaction history
export function calculateFixedCosts(transactions: Transaction[], upcomingTransactions: Transaction[] = []): number {
  const { total } = analyzeFixedCosts(transactions, upcomingTransactions)
  return total
}

