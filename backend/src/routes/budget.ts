import express from 'express'
import { calculateDailyBudget } from '../services/budgetCalculator'
import { getTransactions } from '../services/dataService'

const router = express.Router()

// Get current budget status
router.get('/current', async (req, res) => {
  try {
    const calculation = await calculateDailyBudget()
    const transactions = await getTransactions()
    
    // Calculate spent in last 3 days (rolling window: today, yesterday, day before yesterday)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
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

    // Calculate remaining days in month
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const remainingDays = daysInMonth - now.getDate() + 1

    // calculation.dailyAvailable now represents the 3-day limit
    const threeDayLimit = calculation.dailyAvailable
    const availableIn3Days = threeDayLimit - spentLast3Days

    const budget = {
      id: 'current',
      dailyBudget: threeDayLimit, // 3-day limit (kept as dailyBudget for compatibility)
      monthlyBudget: calculation.monthlyAvailable,
      availableToday: Math.max(0, availableIn3Days), // Remaining in 3-day window
      spentToday: spentLast3Days, // Spent in last 3 days (kept as spentToday for compatibility)
      remainingToday: Math.max(0, threeDayLimit - spentLast3Days), // Explicit remaining amount in 3-day window
      remainingDays,
      lastUpdated: new Date().toISOString(),
    }

    res.json(budget)
  } catch (error) {
    console.error('Error getting current budget:', error)
    res.status(500).json({ error: 'Failed to get current budget' })
  }
})

// Calculate budget
router.get('/calculate', async (req, res) => {
  try {
    const calculation = await calculateDailyBudget()
    res.json(calculation)
  } catch (error) {
    console.error('Error calculating budget:', error)
    res.status(500).json({ error: 'Failed to calculate budget' })
  }
})

export default router

