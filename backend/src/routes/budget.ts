import express from 'express'
import { calculateDailyBudget } from '../services/budgetCalculator'
import { getTransactions } from '../services/dataService'

const router = express.Router()

// Get current budget status
router.get('/current', async (req, res) => {
  try {
    const calculation = await calculateDailyBudget()
    const transactions = await getTransactions()
    
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

    // Calculate remaining days in month
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const remainingDays = daysInMonth - now.getDate() + 1

    const dailyBudget = calculation.dailyAvailable
    const availableToday = dailyBudget - spentToday

    const budget = {
      id: 'current',
      dailyBudget, // Total daily budget
      monthlyBudget: calculation.monthlyAvailable,
      availableToday: Math.max(0, availableToday), // Remaining today
      spentToday,
      remainingToday: Math.max(0, dailyBudget - spentToday), // Explicit remaining amount
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

