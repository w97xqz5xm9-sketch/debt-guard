import express from 'express'
import { getTransactions, getUpcomingTransactions } from '../services/dataService'
import { analyzeFixedCosts } from '../services/fixedCostAnalyzer'

const router = express.Router()

router.get('/', async (_req, res) => {
  try {
    const [transactions, upcoming] = await Promise.all([
      getTransactions(),
      getUpcomingTransactions(),
    ])

    const analysis = analyzeFixedCosts(transactions, upcoming)
    res.json(analysis)
  } catch (error) {
    console.error('Error analyzing fixed costs:', error)
    res.status(500).json({ error: 'Failed to analyze fixed costs' })
  }
})

export default router


