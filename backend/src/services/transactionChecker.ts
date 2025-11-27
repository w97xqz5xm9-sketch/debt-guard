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
  
  // Calculate spent today
  const spentToday = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      transactionDate.setHours(0, 0, 0, 0)
      return transactionDate.getTime() === today.getTime() && t.type === 'expense'
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const availableAfterTransaction = budget.dailyAvailable - spentToday - amount

  // Check if Tageslimit is already reached - block larger purchases (like shoes)
  const isLargePurchase = amount > 50 // Consider purchases > 50€ as "large" (e.g., shoes)
  const isTageslimitReached = spentToday >= budget.dailyAvailable

  if (isTageslimitReached && isLargePurchase) {
    return {
      allowed: false,
      blockReason: `🚫 Tageslimit erreicht! Du kannst dir keine größeren Sachen mehr kaufen (z.B. Schuhe für ${amount.toFixed(2)}€).`,
    }
  }

  // Check if transaction would exceed daily budget
  if (availableAfterTransaction < 0) {
    return {
      allowed: false,
      blockReason: `Diese Ausgabe würde dein Tageslimit von ${budget.dailyAvailable.toFixed(2)} € um ${Math.abs(availableAfterTransaction).toFixed(2)} € überschreiten.`,
    }
  }

  // Check if transaction would exceed 90% of daily budget (warning)
  const budgetUsage = ((spentToday + amount) / budget.dailyAvailable) * 100
  if (budgetUsage > 90) {
    return {
      allowed: true,
      warning: `Warnung: Diese Ausgabe würde dein Tageslimit zu ${budgetUsage.toFixed(0)}% auslasten.`,
    }
  }

  // Check for large purchases when close to limit
  if (isLargePurchase && budgetUsage > 70) {
    return {
      allowed: true,
      warning: `Vorsicht: Größere Ausgabe (${amount.toFixed(2)}€) erkannt. Du näherst dich deinem Tageslimit.`,
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

