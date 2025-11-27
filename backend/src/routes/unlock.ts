import express, { Request, Response } from 'express'
import { getUnlockStatus, useUnlock, resetUnlocks } from '../services/unlockService'

const router = express.Router()

// Get unlock status
router.get('/', async (req: Request, res: Response) => {
  try {
    const status = getUnlockStatus()
    res.json(status)
  } catch (error) {
    console.error('Error getting unlock status:', error)
    res.status(500).json({ error: 'Failed to get unlock status' })
  }
})

// Use an unlock
router.post('/use', async (req: Request, res: Response) => {
  try {
    const result = useUnlock()
    if (result.success) {
      res.json({
        success: true,
        unlocksRemaining: result.unlocksRemaining,
        requiresAccessCode: result.requiresAccessCode,
        message: result.requiresAccessCode
          ? 'Keine Entsperrungen mehr verfügbar. Bitte Zugangscode eingeben oder neuen kaufen.'
          : `Entsperrung verwendet. Noch ${result.unlocksRemaining} Entsperrungen verfügbar.`,
      })
    } else {
      res.status(403).json({
        success: false,
        message: 'Keine Entsperrungen mehr verfügbar. Bitte Zugangscode eingeben oder neuen kaufen.',
      })
    }
  } catch (error) {
    console.error('Error using unlock:', error)
    res.status(500).json({ error: 'Failed to use unlock' })
  }
})

// Reset unlocks with access code
router.post('/reset', async (req: Request, res: Response) => {
  try {
    const { accessCode } = req.body
    const success = resetUnlocks(accessCode)
    
    if (success) {
      res.json({
        success: true,
        message: 'Entsperrungen zurückgesetzt',
        unlocksRemaining: 3,
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Ungültiger Zugangscode',
      })
    }
  } catch (error) {
    console.error('Error resetting unlocks:', error)
    res.status(500).json({ error: 'Failed to reset unlocks' })
  }
})

export default router

