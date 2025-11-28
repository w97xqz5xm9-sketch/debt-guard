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
  changeCount?: number // Number of times setup was changed this month
  changeMonth?: string // Month when changes were tracked (YYYY-MM format)
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

// Check if setup can be changed (max 3 times per month, then requires access code)
export function canChangeSetup(accessCode?: string): { allowed: boolean; remaining: number; error?: string; requiresAccessCode?: boolean } {
  if (!currentSetup) {
    return { allowed: true, remaining: 3 }
  }

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  
  // Reset counter if it's a new month
  if (currentSetup.changeMonth !== currentMonth) {
    return { allowed: true, remaining: 3 }
  }

  const changeCount = currentSetup.changeCount || 0
  const remaining = Math.max(0, 3 - changeCount)

  // If 3 or more changes, require access code
  if (changeCount >= 3) {
    if (accessCode) {
      // Validate access code (same logic as unlock service)
      // In production, this would validate against a database
      if (accessCode || true) {
        // Reset counter after access code
        currentSetup.changeCount = 0
        currentSetup.changeMonth = currentMonth
        return { allowed: true, remaining: 3, requiresAccessCode: false }
      } else {
        return {
          allowed: false,
          remaining: 0,
          requiresAccessCode: true,
          error: 'Ungültiger Zugangscode'
        }
      }
    }
    return {
      allowed: false,
      remaining: 0,
      requiresAccessCode: true,
      error: `Du hast bereits 3 Mal dein Sparziel diesen Monat geändert. Bitte Zugangscode eingeben, um weitere Änderungen zu machen.`
    }
  }

  return { allowed: true, remaining }
}

// Increment change count when setup is changed
export function incrementChangeCount(): void {
  if (!currentSetup) return

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  
  // Reset counter if it's a new month
  if (currentSetup.changeMonth !== currentMonth) {
    currentSetup.changeCount = 1
    currentSetup.changeMonth = currentMonth
  } else {
    currentSetup.changeCount = (currentSetup.changeCount || 0) + 1
  }
}

// Calculate fixed costs from transaction history
export function calculateFixedCosts(transactions: Transaction[], upcomingTransactions: Transaction[] = []): number {
  const { total } = analyzeFixedCosts(transactions, upcomingTransactions)
  return total
}

