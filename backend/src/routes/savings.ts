import express from 'express'
import { getSavingsGoals } from '../services/dataService'

const router = express.Router()

// Get all savings goals
router.get('/', async (req, res) => {
  try {
    const goals = await getSavingsGoals()
    res.json(goals)
  } catch (error) {
    console.error('Error getting savings goals:', error)
    res.status(500).json({ error: 'Failed to get savings goals' })
  }
})

export default router

