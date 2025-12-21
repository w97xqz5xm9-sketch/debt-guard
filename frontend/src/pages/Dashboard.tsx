import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, TrendingDown, Shield, Zap, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { budgetApi } from '../services/api'
import type { Budget, Transaction, BudgetCalculation } from '../types'

export default function Dashboard() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [calculation, setCalculation] = useState<BudgetCalculation | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [simulateDate, setSimulateDate] = useState<Date>(new Date())
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    loadData()
    if (!isSimulating) {
      const interval = setInterval(loadData, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [simulateDate, isSimulating])

  const loadData = async () => {
    try {
      const dateToUse = isSimulating ? simulateDate : undefined
      const [budgetData, calcData, transactions] = await Promise.all([
        budgetApi.getCurrentBudget(dateToUse),
        budgetApi.calculateBudget(dateToUse),
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

  const goToNextDay = () => {
    const nextDay = new Date(simulateDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setSimulateDate(nextDay)
    setIsSimulating(true)
  }

  const goToPreviousDay = () => {
    const prevDay = new Date(simulateDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setSimulateDate(prevDay)
    setIsSimulating(true)
  }

  const resetToToday = () => {
    setSimulateDate(new Date())
    setIsSimulating(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return <div className="text-center py-12 text-white">Lade Daten...</div>
  }

  if (!budget || !calculation) {
    return (
      <div className="text-center py-12">
        <p className="mb-4 text-white">Keine Daten verfügbar</p>
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
      <div className="flex justify-between items-center">
        <Link
          to="/setup"
          className="btn-secondary flex items-center space-x-2"
        >
          <span>Setup ändern</span>
        </Link>
      </div>

      {/* Date Simulation Controls */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="body-text font-medium">
                {isSimulating ? 'Simulation aktiv' : 'Live-Modus'}
              </p>
              <p className="body-text-muted">
                {formatDate(simulateDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousDay}
              className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all duration-200"
              title="Vorheriger Tag"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={goToNextDay}
              className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all duration-200"
              title="Nächster Tag"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
            {isSimulating && (
              <button
                onClick={resetToToday}
                className="btn-secondary text-sm px-3 py-2"
              >
                Zurück zu heute
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section - Premium FinTech */}
      <div className="card-glow gradient-iridescent">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="label-text mb-2">Letzte 3 Tage ausgegeben</p>
            <p className="heading-large mb-1">
              {budget.spentToday.toFixed(2)} €
            </p>
            <p className="body-text-muted">
              von {budget.dailyBudget.toFixed(2)} € verfügbar
            </p>
          </div>
          <div className="bg-gray-200 p-4 rounded-2xl">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-3">
            <span className="label-text">3-Tage-Limit-Verbrauch</span>
            <span className="body-text font-medium">{budgetPercentage.toFixed(0)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${
                isCritical
                  ? 'bg-danger-DEFAULT'
                  : isWarning
                  ? 'bg-warning-DEFAULT'
                  : 'bg-success-DEFAULT'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="heading-medium mb-1">
              {budget.remainingToday.toFixed(2)} €
            </p>
            <p className="body-text-muted">
              noch verfügbar
            </p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {isCritical && (
        <div className="card border-l-2 border-danger-DEFAULT">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-danger-DEFAULT flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="heading-small mb-1">Kritisches Budget-Limit erreicht!</h3>
              <p className="body-text-muted">
                Du hast bereits {budgetPercentage.toFixed(0)}% deines 3-Tage-Budgets verbraucht.
                Weitere Ausgaben werden blockiert.
              </p>
            </div>
          </div>
        </div>
      )}

      {isWarning && !isCritical && (
        <div className="card border-l-2 border-warning-DEFAULT">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-warning-DEFAULT flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="heading-small mb-1">Budget-Warnung</h3>
              <p className="body-text-muted">
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
            <p className="label-text">Fixkosten (automatisch berechnet)</p>
            <TrendingDown className="h-4 w-4 text-danger-DEFAULT" />
          </div>
          <p className="heading-medium mb-1">
            {calculation.upcomingDeductions.toFixed(2)} €
          </p>
          <p className="body-text-muted">
            Automatisch erkannt
          </p>
          {calculation.fixedCostInsights && calculation.fixedCostInsights.length > 0 && (
            <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
              {calculation.fixedCostInsights.slice(0, 3).map((cost) => (
                <div key={cost.id} className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-white">{cost.name}</p>
                    <p className="text-xs text-gray-600">
                      {cost.frequency === 'irregular' ? 'Unregelmäßig' : cost.frequency === 'bi-weekly' ? '14-tägig' : cost.frequency === 'weekly' ? 'Wöchentlich' : 'Monatlich'}
                      {' • '}
                      {cost.source === 'upcoming' ? 'bevorstehend' : cost.source === 'history' ? 'erkannt' : 'geschätzt'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{cost.averageAmount.toFixed(2)} €</p>
                    <p className="text-xs text-gray-600">Konfidenz {(cost.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="label-text">Sparziel</p>
            <Zap className="h-4 w-4 text-white" />
          </div>
          <p className="heading-medium mb-1">
            {calculation.savingsAllocation.toFixed(2)} €
          </p>
          <p className="body-text-muted">
            Diesen Monat
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="heading-small mb-4">Letzte Transaktionen</h2>
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <p className="text-gray-600 text-center py-4">Noch keine Transaktionen</p>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-200 rounded-xl"
              >
                <div className="flex-1">
                  <p className="body-text font-medium">{transaction.description}</p>
                  <p className="body-text-muted">
                    {new Date(transaction.date).toLocaleDateString('de-DE')} • {transaction.category}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`body-text font-semibold ${
                      transaction.type === 'income' ? 'text-success-DEFAULT' : 'text-danger-DEFAULT'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toFixed(2)} €
                  </p>
                  {transaction.blocked && (
                    <p className="label-text text-danger-DEFAULT">Blockiert</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recommendations */}
      {calculation.recommendations.length > 0 && (
        <div className="card gradient-iridescent">
          <h2 className="heading-small mb-4">
            Empfehlungen
          </h2>
          <ul className="space-y-2">
            {calculation.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 body-text">
                <span className="text-white mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

