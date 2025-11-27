import express from 'express'
import { getTransactions } from '../services/dataService'

const router = express.Router()

// Get spending behavior analysis
router.get('/', async (req, res) => {
  try {
    const transactions = await getTransactions()
    
    // Calculate average daily spending (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentExpenses = transactions.filter(
      t => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo
    )
    
    const totalSpending = recentExpenses.reduce((sum, t) => sum + t.amount, 0)
    const averageDailySpending = totalSpending / 30

    // Count impulse purchases (simplified heuristic)
    const impulseKeywords = ['kaffee', 'snack', 'impuls', 'spontan']
    const impulsePurchaseCount = recentExpenses.filter(t => {
      const lowerDesc = t.description.toLowerCase()
      return impulseKeywords.some(keyword => lowerDesc.includes(keyword)) || t.amount < 20
    }).length

    // Calculate category breakdown
    const categoryBreakdown: Record<string, number> = {}
    recentExpenses.forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount
    })

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (averageDailySpending > 50) {
      riskLevel = 'high'
    } else if (averageDailySpending > 30) {
      riskLevel = 'medium'
    }

    const behavior = {
      averageDailySpending,
      impulsePurchaseCount,
      categoryBreakdown,
      riskLevel,
    }

    res.json(behavior)
  } catch (error) {
    console.error('Error getting spending behavior:', error)
    res.status(500).json({ error: 'Failed to get spending behavior' })
  }
})

export default router

