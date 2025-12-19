import axios from 'axios'
import type { Budget, Transaction, Account, SavingsGoal, BudgetCalculation, SpendingBehavior } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add error interceptor for better error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request)
      error.message = 'Keine Verbindung zum Server. Bitte prüfe, ob das Backend läuft.'
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export const budgetApi = {
  getCurrentBudget: async (simulateDate?: Date): Promise<Budget> => {
    const params = simulateDate ? { simulateDate: simulateDate.toISOString() } : {}
    const response = await api.get<Budget>('/budget/current', { params })
    return response.data
  },

  calculateBudget: async (simulateDate?: Date): Promise<BudgetCalculation> => {
    const params = simulateDate ? { simulateDate: simulateDate.toISOString() } : {}
    const response = await api.get<BudgetCalculation>('/budget/calculate', { params })
    return response.data
  },

  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions')
    return response.data
  },

  addTransaction: async (transaction: Omit<Transaction, 'id' | 'date'> & { useUnlock?: boolean }): Promise<Transaction & { unlockUsed?: boolean; message?: string }> => {
    const response = await api.post<Transaction & { unlockUsed?: boolean; message?: string }>('/transactions', transaction)
    return response.data
  },

  checkTransaction: async (amount: number, description: string): Promise<{ allowed: boolean; warning?: string; blockReason?: string }> => {
    const response = await api.post('/transactions/check', { amount, description })
    return response.data
  },

  getAccounts: async (): Promise<Account[]> => {
    const response = await api.get<Account[]>('/accounts')
    return response.data
  },

  getSavingsGoals: async (): Promise<SavingsGoal[]> => {
    const response = await api.get<SavingsGoal[]>('/savings-goals')
    return response.data
  },

  getSpendingBehavior: async (): Promise<SpendingBehavior> => {
    const response = await api.get<SpendingBehavior>('/behavior')
    return response.data
  },

  getUnlockStatus: async (): Promise<{ unlocksRemaining: number; totalUnlocks: number; requiresAccessCode: boolean }> => {
    const response = await api.get('/unlock')
    return response.data
  },

  useUnlock: async (): Promise<{ success: boolean; unlocksRemaining: number; message: string; requiresAccessCode?: boolean }> => {
    const response = await api.post('/unlock/use')
    return response.data
  },

  resetUnlocks: async (accessCode: string): Promise<{ success: boolean; unlocksRemaining: number; message: string }> => {
    const response = await api.post('/unlock/reset', { accessCode })
    return response.data
  },

  getExplanation: async (): Promise<any> => {
    const response = await api.get('/explanation')
    return response.data
  },

  getSetup: async (): Promise<any> => {
    const response = await api.get('/setup')
    return response.data
  },

  saveSetup: async (setup: any): Promise<any> => {
    const response = await api.post('/setup', setup)
    return response.data
  },

  resetSetup: async (): Promise<void> => {
    await api.delete('/setup')
  },
}

export default api

