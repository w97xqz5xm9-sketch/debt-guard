import express from 'express'
import { getTransactions, addTransaction } from '../services/dataService'
import { checkTransaction } from '../services/transactionChecker'
import { canUnlock, useUnlock } from '../services/unlockService'

const router = express.Router()

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await getTransactions()
    res.json(transactions)
  } catch (error) {
    console.error('Error getting transactions:', error)
    res.status(500).json({ error: 'Failed to get transactions' })
  }
})

// Add new transaction
router.post('/', async (req, res) => {
  try {
    const { amount, description, category, type, useUnlock } = req.body

    if (!amount || !description || !category || !type) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if transaction is allowed
    if (type === 'expense') {
      const checkResult = await checkTransaction(amount, description)
      if (!checkResult.allowed) {
        // If user wants to use unlock, check if available
        if (useUnlock) {
          if (canUnlock()) {
            // Use unlock and allow transaction
            const unlockResult = useUnlock()
            
            const transaction = await addTransaction({
              amount,
              description,
              category,
              type,
            })
            return res.status(201).json({
              ...transaction,
              unlockUsed: true,
              unlocksRemaining: unlockResult.unlocksRemaining,
              message: 'Transaktion mit Entsperrung durchgeführt',
            })
          } else {
            return res.status(403).json({
              error: 'Keine Entsperrungen mehr verfügbar',
              requiresAccessCode: true,
            })
          }
        }
        
        // Block transaction
        const transaction = await addTransaction({
          amount,
          description,
          category,
          type,
          blocked: true,
        })
        return res.status(403).json({
          ...transaction,
          blockReason: checkResult.blockReason,
          canUnlock: canUnlock(),
        })
      }
    }

    const transaction = await addTransaction({
      amount,
      description,
      category,
      type,
    })

    res.status(201).json(transaction)
  } catch (error) {
    console.error('Error adding transaction:', error)
    res.status(500).json({ error: 'Failed to add transaction' })
  }
})

// Check transaction before making it
router.post('/check', async (req, res) => {
  try {
    const { amount, description } = req.body

    if (!amount || !description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = await checkTransaction(amount, description)
    // Add unlock availability info
    const unlockAvailable = canUnlock()
    res.json({
      ...result,
      canUnlock: unlockAvailable,
    })
  } catch (error) {
    console.error('Error checking transaction:', error)
    res.status(500).json({ error: 'Failed to check transaction' })
  }
})

export default router

