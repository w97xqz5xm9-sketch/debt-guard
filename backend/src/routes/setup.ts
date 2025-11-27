import express from 'express'
import { setMonthlySetup, getMonthlySetup, calculateFixedCosts, isNewMonth } from '../services/monthlySetup'
import { getTransactions, getUpcomingTransactions } from '../services/dataService'

const router = express.Router()

// Get current setup
router.get('/', async (req, res) => {
  try {
    const setup = getMonthlySetup()
    if (!setup || isNewMonth()) {
      return res.json({ needsSetup: true })
    }
    res.json({ needsSetup: false, setup })
  } catch (error) {
    console.error('Error getting setup:', error)
    res.status(500).json({ error: 'Failed to get setup' })
  }
})

// Reset setup (for testing)
router.delete('/', async (req, res) => {
  try {
    setMonthlySetup(null as any)
    res.json({ success: true, message: 'Setup zurückgesetzt' })
  } catch (error) {
    console.error('Error resetting setup:', error)
    res.status(500).json({ error: 'Failed to reset setup' })
  }
})

// Create monthly setup
const ALLOWED_SAVINGS_GOALS = [50, 100, 200, 300, 500, 1000] as const

router.post('/', async (req, res) => {
  try {
    const { savingsGoal, monthlyIncome } = req.body

    if (!savingsGoal || !ALLOWED_SAVINGS_GOALS.includes(savingsGoal)) {
      return res.status(400).json({
        error: `Sparziel muss eines der folgenden Beträge sein: ${ALLOWED_SAVINGS_GOALS.join(', ')}`,
      })
    }

    const transactions = await getTransactions()
    const upcoming = await getUpcomingTransactions()
    const fixedCosts = calculateFixedCosts(transactions, upcoming)
    const income = monthlyIncome || 3000

    // Calculate variable budget: Income - Fixed Costs - Savings Goal
    const variableBudget = income - fixedCosts - savingsGoal

    // Calculate daily limit
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const dailyLimit = variableBudget / daysInMonth

    const setup = {
      savingsGoal,
      fixedCosts,
      monthlyIncome: income,
      variableBudget,
      dailyLimit,
      monthStartDate: new Date().toISOString(),
    }

    setMonthlySetup(setup)

    res.json(setup)
  } catch (error: any) {
    console.error('Error creating setup:', error)
    const errorMessage = error?.message || 'Failed to create setup'
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    })
  }
})

export default router

