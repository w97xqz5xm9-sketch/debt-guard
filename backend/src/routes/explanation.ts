import express from 'express'
import { calculateDailyLimit } from '../services/limitCalculator'
import { getMonthlySetup } from '../services/monthlySetup'
import { getTransactions } from '../services/dataService'

const router = express.Router()

// Get limit calculation explanation
router.get('/', async (req, res) => {
  try {
    const setup = getMonthlySetup()
    if (!setup) {
      return res.json({
        error: 'Kein Setup vorhanden',
        explanation: 'Bitte zuerst das Monats-Setup durchführen',
      })
    }

    const transactions = await getTransactions()
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const dayOfMonth = now.getDate()

    // Calculate total spent this month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const spentThisMonth = transactions
      .filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= monthStart && t.type === 'expense'
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyBudget = setup.variableBudget
    const result = calculateDailyLimit(
      monthlyBudget,
      daysInMonth,
      dayOfMonth,
      spentThisMonth
    )

    // Calculate planned spend
    const plannedSpend = monthlyBudget * (dayOfMonth / daysInMonth)
    const delta = spentThisMonth - plannedSpend
    const deltaRel = (delta / monthlyBudget) * 100

    res.json({
      monthlyBudget,
      daysInMonth,
      currentDay: dayOfMonth,
      spentThisMonth,
      plannedSpend,
      delta,
      deltaRel,
      remainingDays: daysInMonth - dayOfMonth,
      result,
      explanation: generateExplanation(result, deltaRel, monthlyBudget, spentThisMonth),
    })
  } catch (error) {
    console.error('Error getting explanation:', error)
    res.status(500).json({ error: 'Failed to get explanation' })
  }
})

function generateExplanation(
  result: any,
  deltaRel: number,
  monthlyBudget: number,
  spentThisMonth: number
): string {
  if (result.status === 'red') {
    return `Du hast bereits ${Math.abs(deltaRel).toFixed(1)}% über deinem geplanten Budget ausgegeben. Das Tageslimit wird auf 0€ gesetzt und Zahlungen werden blockiert.`
  }
  
  if (result.status === 'yellow') {
    return `Du liegst ${deltaRel.toFixed(1)}% über deinem geplanten Budget. Das Tageslimit wird um 20% reduziert, um wieder ins Gleichgewicht zu kommen.`
  }
  
  if (deltaRel < -5) {
    return `Du liegst ${Math.abs(deltaRel).toFixed(1)}% unter deinem geplanten Budget. Das Tageslimit wird leicht erhöht (+10%), da du gut haushaltest.`
  }
  
  return `Du liegst im Rahmen deines geplanten Budgets. Das Tageslimit wird normal berechnet: Restbudget geteilt durch verbleibende Tage.`
}

export default router

