import express from 'express'
import { getAccounts } from '../services/dataService'

const router = express.Router()

// Get all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await getAccounts()
    res.json(accounts)
  } catch (error) {
    console.error('Error getting accounts:', error)
    res.status(500).json({ error: 'Failed to get accounts' })
  }
})

export default router

