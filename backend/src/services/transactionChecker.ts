import { calculateDailyBudget } from './budgetCalculator'
import { getTransactions } from './dataService'

export interface TransactionCheckResult {
  allowed: boolean
  warning?: string
  blockReason?: string
}

export async function checkTransaction(
  amount: number,
  description: string
): Promise<TransactionCheckResult> {
  const budget = await calculateDailyBudget()
  const transactions = await getTransactions()
  
  // Get today's date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
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

  const MINIMUM_DAILY_AMOUNT = 12.50 // Same as in budgetCalculator
  // budget.dailyAvailable now represents the 3-day limit
  const threeDayLimit = budget.dailyAvailable
  const availableAfterTransaction = threeDayLimit - spentLast3Days - amount

  // Always allow small necessary purchases (under minimum) even if budget is exceeded
  // This ensures users can always buy essentials like food, public transport, etc.
  if (amount <= MINIMUM_DAILY_AMOUNT && availableAfterTransaction >= -MINIMUM_DAILY_AMOUNT) {
    // Small purchase within minimum allowance - always allow
    if (availableAfterTransaction < 0) {
      return {
        allowed: true,
        warning: `⚠️ Budget überschritten, aber kleine notwendige Ausgabe (${amount.toFixed(2)}€) erlaubt.`,
      }
    }
  }

  // Check if 3-Tage-Limit is already reached - block larger purchases (like shoes)
  const isLargePurchase = amount > 50 // Consider purchases > 50€ as "large" (e.g., shoes)
  const isThreeDayLimitReached = spentLast3Days >= threeDayLimit

  // Block large purchases if 3-day limit is already reached
  if (isThreeDayLimitReached && isLargePurchase) {
    return {
      allowed: false,
      blockReason: `🚫 3-Tage-Limit erreicht! Du kannst dir keine größeren Sachen mehr kaufen (z.B. Schuhe für ${amount.toFixed(2)}€).`,
    }
  }

  // Check if transaction would exceed 3-day budget
  if (availableAfterTransaction < 0) {
    return {
      allowed: false,
      blockReason: `Diese Ausgabe würde dein 3-Tage-Limit von ${threeDayLimit.toFixed(2)} € um ${Math.abs(availableAfterTransaction).toFixed(2)} € überschreiten.`,
    }
  }

  // Special rules for large purchases (>50€)
  const budgetUsage = ((spentLast3Days + amount) / threeDayLimit) * 100
  
  if (isLargePurchase) {
    // Rule 1: If purchase exceeds 3-day budget, check if we have enough unused budget
    if (availableAfterTransaction < 0) {
      // Calculate how much unused budget we have (from previous days)
      // This allows large purchases if user saved money on previous days
      const excessAmount = Math.abs(availableAfterTransaction)
      
      // Allow if excess is reasonable (e.g., up to 2x daily budget for large purchases)
      // This means: if daily budget is 50€, allow up to 100€ purchase if user saved enough
      const dailyBudget = threeDayLimit / 3 // Calculate daily budget from 3-day limit
      const maxAllowedExcess = dailyBudget * 2 // Can exceed by up to 2x daily budget
      
      if (excessAmount <= maxAllowedExcess) {
        return {
          allowed: true,
          warning: `⚠️ Große Ausgabe (${amount.toFixed(2)}€) überschreitet dein 3-Tage-Limit um ${excessAmount.toFixed(2)}€. Erlaubt, da du genug Budget von früheren Tagen hast.`,
        }
      } else {
        return {
          allowed: false,
          blockReason: `🚫 Große Ausgabe (${amount.toFixed(2)}€) würde dein 3-Tage-Limit um ${excessAmount.toFixed(2)}€ überschreiten. Das ist zu viel, auch mit nicht genutztem Budget.`,
        }
      }
    }
    
    // Rule 2: If purchase uses more than 80% of 3-day budget (but doesn't exceed it)
    if (budgetUsage > 80) {
      return {
        allowed: false,
        blockReason: `🚫 Große Ausgabe (${amount.toFixed(2)}€) würde ${budgetUsage.toFixed(0)}% deines 3-Tage-Limits verbrauchen. Große Käufe sind auf maximal 80% des 3-Tage-Limits beschränkt.`,
      }
    }
    
    // Rule 3: Warning for large purchases that use 50-80% of 3-day budget
    if (budgetUsage > 50 && budgetUsage <= 80) {
      return {
        allowed: true,
        warning: `⚠️ Große Ausgabe (${amount.toFixed(2)}€) erkannt. Dies würde ${budgetUsage.toFixed(0)}% deines 3-Tage-Limits verbrauchen.`,
      }
    }
  }

  // Warning if transaction would exceed 90% of 3-day budget (for smaller purchases)
  if (!isLargePurchase && budgetUsage > 90) {
    return {
      allowed: true,
      warning: `Warnung: Diese Ausgabe würde dein 3-Tage-Limit zu ${budgetUsage.toFixed(0)}% auslasten.`,
    }
  }

  return {
    allowed: true,
  }
}

function checkImpulsePurchase(description: string, amount: number): boolean {
  const impulseKeywords = ['kaffee', 'snack', 'impuls', 'spontan', 'sale', 'rabatt']
  const lowerDescription = description.toLowerCase()
  
  // Check for keywords
  if (impulseKeywords.some(keyword => lowerDescription.includes(keyword))) {
    return true
  }

  // Check for small amounts (potential impulse purchases)
  if (amount < 20 && amount > 0) {
    return true
  }

  return false
}

