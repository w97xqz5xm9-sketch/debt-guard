import type { Account, Transaction, SavingsGoal } from '../types'
import { query } from './database'

// In-memory fallback data store (used when DATABASE_URL is not set)
let accounts: Account[] = [
  {
    id: '1',
    name: 'Girokonto',
    balance: 2847.30,
    type: 'checking',
  },
  {
    id: '2',
    name: 'Sparkonto',
    balance: 5200.00,
    type: 'savings',
  },
]

// Helper function to create dates
const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0)
  return date.toISOString()
}

const today = () => {
  const date = new Date()
  date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0)
  return date.toISOString()
}

let transactions: Transaction[] = []

let savingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Notfallfonds',
    targetAmount: 10000,
    currentAmount: 5200,
    deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Urlaub 2024',
    targetAmount: 2000,
    currentAmount: 850,
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Neues Auto',
    targetAmount: 15000,
    currentAmount: 3200,
    deadline: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const upcomingTransactions: Transaction[] = []

// Check if database is available
async function useDatabase(): Promise<boolean> {
  try {
    await query('SELECT 1')
    return true
  } catch {
    return false
  }
}

export async function getAccounts(): Promise<Account[]> {
  if (await useDatabase()) {
    try {
      const result = await query('SELECT * FROM accounts ORDER BY created_at DESC')
      return result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        balance: parseFloat(row.balance),
        type: row.type,
      }))
    } catch (error) {
      console.error('Error fetching accounts from database:', error)
      return accounts
    }
  }
  return accounts
}

export async function getTransactions(): Promise<Transaction[]> {
  if (await useDatabase()) {
    try {
      const result = await query('SELECT * FROM transactions ORDER BY date DESC')
      return result.rows.map((row: any) => ({
        id: row.id,
        amount: parseFloat(row.amount),
        description: row.description,
        category: row.category,
        date: row.date.toISOString(),
        type: row.type,
        blocked: row.blocked || false,
        warningLevel: row.warning_level || undefined,
      }))
    } catch (error) {
      console.error('Error fetching transactions from database:', error)
      return [...transactions].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
    }
  }
  return [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export async function getUpcomingTransactions(): Promise<Transaction[]> {
  // Upcoming transactions are still in-memory for now
  // Could be moved to database if needed
  return upcomingTransactions
}

export async function addTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> {
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  }

  if (await useDatabase()) {
    try {
      await query(
        `INSERT INTO transactions (id, amount, description, category, date, type, blocked, warning_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          newTransaction.id,
          newTransaction.amount,
          newTransaction.description,
          newTransaction.category,
          newTransaction.date,
          newTransaction.type,
          newTransaction.blocked || false,
          newTransaction.warningLevel || null,
        ]
      )

      // Update account balance
      const account = await query('SELECT * FROM accounts WHERE type = $1 LIMIT 1', ['checking'])
      if (account.rows.length > 0) {
        const currentBalance = parseFloat(account.rows[0].balance)
        const newBalance = transaction.type === 'income'
          ? currentBalance + transaction.amount
          : currentBalance - transaction.amount
        
        await query(
          'UPDATE accounts SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [newBalance, account.rows[0].id]
        )
      }
    } catch (error) {
      console.error('Error adding transaction to database:', error)
      // Fallback to in-memory
      transactions.unshift(newTransaction)
      const account = accounts.find(a => a.type === 'checking')
      if (account) {
        if (transaction.type === 'income') {
          account.balance += transaction.amount
        } else {
          account.balance -= transaction.amount
        }
      }
    }
  } else {
    transactions.unshift(newTransaction)
    const account = accounts.find(a => a.type === 'checking')
    if (account) {
      if (transaction.type === 'income') {
        account.balance += transaction.amount
      } else {
        account.balance -= transaction.amount
      }
    }
  }

  return newTransaction
}

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  if (await useDatabase()) {
    try {
      const result = await query('SELECT * FROM savings_goals ORDER BY created_at DESC')
      return result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        targetAmount: parseFloat(row.target_amount),
        currentAmount: parseFloat(row.current_amount),
        deadline: row.deadline ? row.deadline.toISOString() : undefined,
      }))
    } catch (error) {
      console.error('Error fetching savings goals from database:', error)
      return savingsGoals
    }
  }
  return savingsGoals
}

// Delete all transactions from database
export async function deleteAllTransactions(): Promise<void> {
  if (await useDatabase()) {
    try {
      await query('DELETE FROM transactions')
      console.log('✅ All transactions deleted from database')
    } catch (error) {
      console.error('Error deleting transactions from database:', error)
      throw error
    }
  }
  // Clear in-memory transactions
  transactions.length = 0
}
