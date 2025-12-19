import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, TrendingDown, Shield, Zap } from 'lucide-react'
import { budgetApi } from '../services/api'
import type { Budget, Transaction, BudgetCalculation } from '../types'

export default function Dashboard() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [calculation, setCalculation] = useState<BudgetCalculation | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [budgetData, calcData, transactions] = await Promise.all([
        budgetApi.getCurrentBudget(),
        budgetApi.calculateBudget(),
        budgetApi.getTransactions(),
      ])
      setBudget(budgetData)
      setCalculation(calcData)
      setRecentTransactions(transactions.slice(0, 5))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Lade Daten...</div>
  }

  if (!budget || !calculation) {
    return (
      <div className="text-center py-12">
        <p className="mb-4">Keine Daten verfügbar</p>
        <button
          onClick={async () => {
            try {
              await budgetApi.resetSetup()
              window.location.reload()
            } catch (error) {
              console.error('Error resetting setup:', error)
            }
          }}
          className="btn-primary"
        >
          Setup zurücksetzen
        </button>
      </div>
    )
  }

  const budgetPercentage = (budget.spentToday / budget.dailyBudget) * 100
  const isWarning = budgetPercentage > 70
  const isCritical = budgetPercentage > 90

  return (
    <div className="space-y-6">
      {/* Quick Action */}
      <div className="flex justify-end">
        <Link
          to="/setup"
          className="btn-secondary flex items-center space-x-2"
        >
          <span>Setup ändern</span>
        </Link>
      </div>

      {/* Hero Section - Simplified */}
      <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Letzte 3 Tage ausgegeben</h2>
            <p className="text-4xl font-bold mb-1">
              {budget.spentToday.toFixed(2)} €
            </p>
            <p className="text-primary-100 text-sm">
              von {budget.dailyBudget.toFixed(2)} € verfügbar
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <Shield className="h-12 w-12" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>3-Tage-Limit-Verbrauch</span>
            <span>{budgetPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                isCritical
                  ? 'bg-danger-500'
                  : isWarning
                  ? 'bg-yellow-500'
                  : 'bg-success-500'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-2xl font-bold mb-1">
              {budget.remainingToday.toFixed(2)} €
            </p>
            <p className="text-primary-100 text-sm">
              noch verfügbar
            </p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {isCritical && (
        <div className="card border-l-4 border-danger-500 bg-danger-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-danger-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-danger-900">Kritisches Budget-Limit erreicht!</h3>
              <p className="text-sm text-danger-700 mt-1">
                Du hast bereits {budgetPercentage.toFixed(0)}% deines 3-Tage-Budgets verbraucht.
                Weitere Ausgaben werden blockiert.
              </p>
            </div>
          </div>
        </div>
      )}

      {isWarning && !isCritical && (
        <div className="card border-l-4 border-yellow-500 bg-yellow-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Budget-Warnung</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Du näherst dich deinem 3-Tage-Limit. Sei vorsichtig mit weiteren Ausgaben.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Fixkosten (automatisch berechnet)</h3>
            <TrendingDown className="h-5 w-5 text-danger-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {calculation.upcomingDeductions.toFixed(2)} €
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Automatisch erkannt
          </p>
          {calculation.fixedCostInsights && calculation.fixedCostInsights.length > 0 && (
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
              {calculation.fixedCostInsights.slice(0, 3).map((cost) => (
                <div key={cost.id} className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{cost.name}</p>
                    <p className="text-xs text-gray-500">
                      {cost.frequency === 'irregular' ? 'Unregelmäßig' : cost.frequency === 'bi-weekly' ? '14-tägig' : cost.frequency === 'weekly' ? 'Wöchentlich' : 'Monatlich'}
                      {' • '}
                      {cost.source === 'upcoming' ? 'bevorstehend' : cost.source === 'history' ? 'erkannt' : 'geschätzt'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{cost.averageAmount.toFixed(2)} €</p>
                    <p className="text-xs text-gray-500">Konfidenz {(cost.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Sparziel</h3>
            <Zap className="h-5 w-5 text-primary-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {calculation.savingsAllocation.toFixed(2)} €
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Diesen Monat
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Letzte Transaktionen</h2>
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Noch keine Transaktionen</p>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('de-DE')} • {transaction.category}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toFixed(2)} €
                  </p>
                  {transaction.blocked && (
                    <p className="text-xs text-danger-600 font-medium">Blockiert</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recommendations */}
      {calculation.recommendations.length > 0 && (
        <div className="card bg-primary-50 border-primary-200">
          <h2 className="text-lg font-semibold mb-4 text-primary-900">
            Empfehlungen
          </h2>
          <ul className="space-y-2">
            {calculation.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 text-primary-800">
                <span className="text-primary-600 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

