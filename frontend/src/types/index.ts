export interface Budget {
  id: string
  dailyBudget: number
  monthlyBudget: number
  availableToday: number
  spentToday: number
  remainingToday: number
  remainingDays: number
  lastUpdated: string
}

export interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  date: string
  type: 'income' | 'expense'
  blocked?: boolean
  warningLevel?: 'low' | 'medium' | 'high' | 'critical'
}

export interface Account {
  id: string
  balance: number
  name: string
  type: 'checking' | 'savings'
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

export interface SpendingBehavior {
  averageDailySpending: number
  impulsePurchaseCount: number
  categoryBreakdown: Record<string, number>
  riskLevel: 'low' | 'medium' | 'high'
}

export interface BudgetCalculation {
  dailyAvailable: number
  monthlyAvailable: number
  upcomingDeductions: number
  savingsAllocation: number
  riskFactor: number
  recommendations: string[]
  fixedCostInsights: FixedCostInsight[]
}

export interface FixedCostInsight {
  id: string
  name: string
  category: string
  averageAmount: number
  lastAmount: number
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'irregular'
  confidence: number
  lastOccurrence: string
  nextDueDate?: string
  source: 'history' | 'upcoming' | 'ai'
}

