import type { Account, Transaction, SavingsGoal } from '../types'

// In-memory data store (in production, this would be a database)
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

let transactions: Transaction[] = [
  // Today's transactions
  {
    id: '1',
    amount: 45.50,
    description: 'Lebensmittel Einkauf',
    category: 'Lebensmittel',
    date: today(),
    type: 'expense',
  },
  {
    id: '2',
    amount: 12.90,
    description: 'Kaffee & Brötchen',
    category: 'Lebensmittel',
    date: today(),
    type: 'expense',
  },
  {
    id: '3',
    amount: 8.50,
    description: 'ÖPNV Ticket',
    category: 'Transport',
    date: today(),
    type: 'expense',
  },
  // Yesterday
  {
    id: '4',
    amount: 89.99,
    description: 'Online Shopping - Kleidung',
    category: 'Einkaufen',
    date: daysAgo(1),
    type: 'expense',
  },
  {
    id: '5',
    amount: 15.20,
    description: 'Mittagessen',
    category: 'Lebensmittel',
    date: daysAgo(1),
    type: 'expense',
  },
  {
    id: '6',
    amount: 4.50,
    description: 'Kaffee to go',
    category: 'Lebensmittel',
    date: daysAgo(1),
    type: 'expense',
  },
  // 2 days ago
  {
    id: '7',
    amount: 32.00,
    description: 'Tankstelle',
    category: 'Transport',
    date: daysAgo(2),
    type: 'expense',
  },
  {
    id: '8',
    amount: 25.00,
    description: 'Netflix Abo',
    category: 'Unterhaltung',
    date: daysAgo(2),
    type: 'expense',
  },
  // 3 days ago
  {
    id: '9',
    amount: 120.00,
    description: 'Friseur',
    category: 'Sonstiges',
    date: daysAgo(3),
    type: 'expense',
  },
  {
    id: '10',
    amount: 67.80,
    description: 'Supermarkt Einkauf',
    category: 'Lebensmittel',
    date: daysAgo(3),
    type: 'expense',
  },
  // 4 days ago
  {
    id: '11',
    amount: 45.00,
    description: 'Restaurant',
    category: 'Lebensmittel',
    date: daysAgo(4),
    type: 'expense',
  },
  // 5 days ago - Income
  {
    id: '12',
    amount: 3000.00,
    description: 'Gehalt',
    category: 'Einkommen',
    date: daysAgo(5),
    type: 'income',
  },
  // Last week
  {
    id: '13',
    amount: 199.99,
    description: 'Elektronik - Kopfhörer',
    category: 'Einkaufen',
    date: daysAgo(7),
    type: 'expense',
  },
  {
    id: '14',
    amount: 9.99,
    description: 'Spotify Premium',
    category: 'Unterhaltung',
    date: daysAgo(7),
    type: 'expense',
  },
  {
    id: '15',
    amount: 85.00,
    description: 'Fitnessstudio',
    category: 'Sonstiges',
    date: daysAgo(8),
    type: 'expense',
  },
  // Blocked transaction example
  {
    id: '16',
    amount: 250.00,
    description: 'Impulskauf - Blockiert',
    category: 'Einkaufen',
    date: daysAgo(2),
    type: 'expense',
    blocked: true,
    warningLevel: 'critical',
  },
]

let savingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Notfallfonds',
    targetAmount: 10000,
    currentAmount: 5200,
    deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
  },
  {
    id: '2',
    name: 'Urlaub 2024',
    targetAmount: 2000,
    currentAmount: 850,
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
  },
  {
    id: '3',
    name: 'Neues Auto',
    targetAmount: 15000,
    currentAmount: 3200,
    deadline: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(), // 2 years from now
  },
]

// Upcoming transactions (recurring bills, etc.)
const upcomingTransactions: Transaction[] = [
  {
    id: 'upcoming-1',
    amount: 800,
    description: 'Miete',
    category: 'Rechnungen',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    type: 'expense',
  },
  {
    id: 'upcoming-2',
    amount: 120,
    description: 'Strom & Gas',
    category: 'Rechnungen',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    type: 'expense',
  },
  {
    id: 'upcoming-3',
    amount: 45,
    description: 'Internet & Telefon',
    category: 'Rechnungen',
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    type: 'expense',
  },
  {
    id: 'upcoming-4',
    amount: 180,
    description: 'Versicherung',
    category: 'Rechnungen',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    type: 'expense',
  },
]

export async function getAccounts(): Promise<Account[]> {
  return accounts
}

export async function getTransactions(): Promise<Transaction[]> {
  // Sort by date, newest first
  return [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export async function getUpcomingTransactions(): Promise<Transaction[]> {
  return upcomingTransactions
}

export async function addTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> {
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  }
  transactions.unshift(newTransaction) // Add to beginning
  
  // Update account balance
  const account = accounts.find(a => a.type === 'checking')
  if (account) {
    if (transaction.type === 'income') {
      account.balance += transaction.amount
    } else {
      account.balance -= transaction.amount
    }
  }
  
  return newTransaction
}

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  return savingsGoals
}

