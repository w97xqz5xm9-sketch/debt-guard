import express from 'express'
import { setMonthlySetup, getMonthlySetup, calculateFixedCosts, isNewMonth, canChangeSetup, incrementChangeCount } from '../services/monthlySetup'
import { getTransactions, getUpcomingTransactions } from '../services/dataService'

const router = express.Router()

// Get current setup
router.get('/', async (req, res) => {
  try {
    const setup = getMonthlySetup()
    if (!setup || isNewMonth()) {
      return res.json({ needsSetup: true })
    }
    const changeInfo = canChangeSetup()
    res.json({ 
      needsSetup: false, 
      setup,
      changeInfo: {
        remaining: changeInfo.remaining,
        canChange: changeInfo.allowed
      }
    })
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

    // Check if setup already exists (this is a change, not initial setup)
    const existingSetup = getMonthlySetup()
    if (existingSetup && !isNewMonth()) {
      // Check if user can change setup (max 3 times per month)
      const changeCheck = canChangeSetup()
      if (!changeCheck.allowed) {
        return res.status(403).json({
          error: changeCheck.error || 'Du hast bereits 3 Mal dein Sparziel diesen Monat geändert.',
          remaining: changeCheck.remaining
        })
      }
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

    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    
    // Determine change count
    let changeCount = 0
    let changeMonth = currentMonth
    
    if (existingSetup && !isNewMonth()) {
      // This is a change, increment counter
      incrementChangeCount()
      changeCount = (existingSetup.changeCount || 0) + 1
      changeMonth = existingSetup.changeMonth || currentMonth
    } else {
      // This is initial setup or new month
      changeCount = 1
    }

    const setup = {
      savingsGoal,
      fixedCosts,
      monthlyIncome: income,
      variableBudget,
      dailyLimit,
      monthStartDate: existingSetup && !isNewMonth() ? existingSetup.monthStartDate : new Date().toISOString(),
      changeCount,
      changeMonth,
    }

    setMonthlySetup(setup)

    const changeInfo = canChangeSetup()
    res.json({
      ...setup,
      changeInfo: {
        remaining: changeInfo.remaining,
        canChange: changeInfo.allowed
      }
    })
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

