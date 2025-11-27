import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import budgetRoutes from './routes/budget'
import transactionRoutes from './routes/transactions'
import accountRoutes from './routes/accounts'
import savingsRoutes from './routes/savings'
import behaviorRoutes from './routes/behavior'
import setupRoutes from './routes/setup'
import unlockRoutes from './routes/unlock'
import explanationRoutes from './routes/explanation'
import fixedCostRoutes from './routes/fixedCosts'

dotenv.config()

const app = express()
const PORT = parseInt(process.env.PORT || '5001', 10)

// CORS configuration
// For public access, allow all origins (change in production!)
const allowPublicAccess = process.env.ALLOW_PUBLIC_ACCESS === 'true' || false

app.use(cors({
  origin: allowPublicAccess ? '*' : 'http://localhost:3000',
  credentials: !allowPublicAccess, // credentials must be false when origin is '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes
app.use('/api/setup', setupRoutes)
app.use('/api/budget', budgetRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/accounts', accountRoutes)
app.use('/api/savings-goals', savingsRoutes)
app.use('/api/behavior', behaviorRoutes)
app.use('/api/unlock', unlockRoutes)
app.use('/api/explanation', explanationRoutes)
app.use('/api/fixed-costs', fixedCostRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Debt Guard API is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Debt Guard Backend running on http://localhost:${PORT}`)
})

