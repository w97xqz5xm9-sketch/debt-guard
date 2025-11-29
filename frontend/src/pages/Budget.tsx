import { useEffect, useState } from 'react'
import { Plus, CheckCircle, XCircle, Unlock } from 'lucide-react'
import { budgetApi } from '../services/api'
import type { BudgetCalculation } from '../types'

export default function Budget() {
  const [calculation, setCalculation] = useState<BudgetCalculation | null>(null)
  const [newTransaction, setNewTransaction] = useState({ amount: '', description: '', category: 'Sonstiges' })
  const [checkResult, setCheckResult] = useState<{ allowed: boolean; warning?: string; blockReason?: string; canUnlock?: boolean } | null>(null)
  const [loading, setLoading] = useState(true)
  const [unlocksRemaining, setUnlocksRemaining] = useState<number>(3)

  useEffect(() => {
    loadData()
    loadUnlockStatus()
  }, [])

  const loadUnlockStatus = async () => {
    try {
      const response = await budgetApi.getUnlockStatus()
      setUnlocksRemaining(response.unlocksRemaining)
    } catch (error) {
      console.error('Error loading unlock status:', error)
    }
  }

  const loadData = async () => {
    try {
      const calcData = await budgetApi.calculateBudget()
      setCalculation(calcData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.description) return

    const amount = parseFloat(newTransaction.amount)
    if (isNaN(amount) || amount <= 0) return

    try {
      const result = await budgetApi.checkTransaction(amount, newTransaction.description)
      setCheckResult(result)
    } catch (error) {
      console.error('Error checking transaction:', error)
    }
  }

  const handleAddTransaction = async (useUnlock?: boolean) => {
    if (!newTransaction.amount || !newTransaction.description) return

    const amount = parseFloat(newTransaction.amount)
    if (isNaN(amount) || amount <= 0) return

    try {
      const response = await budgetApi.addTransaction({
        amount,
        description: newTransaction.description,
        category: newTransaction.category,
        type: 'expense',
        useUnlock,
      })
      
      if (response.unlockUsed) {
        alert(`✅ Transaktion mit Entsperrung durchgeführt!\n${response.message}\nNoch ${unlocksRemaining - 1} Entsperrungen verfügbar.`)
        loadUnlockStatus()
      }
      
      setNewTransaction({ amount: '', description: '', category: 'Sonstiges' })
      setCheckResult(null)
      loadData()
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert(error.response?.data?.error || 'Keine Entsperrungen mehr verfügbar. Bitte Zugangscode eingeben oder neuen kaufen.')
        if (error.response?.data?.requiresAccessCode) {
          window.location.href = '/settings'
        }
      } else {
        console.error('Error adding transaction:', error)
        alert('Fehler beim Hinzufügen der Transaktion')
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12">Lade Daten...</div>
  }

  if (!calculation) {
    return <div className="text-center py-12">Keine Daten verfügbar</div>
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Budget-Übersicht</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-primary-50 p-4 rounded-lg">
            <p className="text-sm text-primary-700 mb-1">Täglich verfügbar</p>
            <p className="text-3xl font-bold text-primary-900">
              {calculation.dailyAvailable.toFixed(2)} €
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-1">Monatlich verfügbar</p>
            <p className="text-3xl font-bold text-gray-900">
              {calculation.monthlyAvailable.toFixed(2)} €
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Bevorstehende Abbuchungen</span>
            <span className="font-semibold text-gray-900">
              {calculation.upcomingDeductions.toFixed(2)} €
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Sparallokation</span>
            <span className="font-semibold text-gray-900">
              {calculation.savingsAllocation.toFixed(2)} €
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Risikofaktor</span>
            <span className={`font-semibold ${
              calculation.riskFactor < 0.3 ? 'text-success-600' :
              calculation.riskFactor < 0.6 ? 'text-yellow-600' : 'text-danger-600'
            }`}>
              {(calculation.riskFactor * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {calculation.fixedCostInsights.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fixkosten-Analyse</h3>
            <div className="space-y-3">
              {calculation.fixedCostInsights.map((cost) => (
                <div key={cost.id} className="p-3 rounded-lg border border-gray-100 bg-white flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{cost.name}</p>
                    <p className="text-xs text-gray-500">
                      {cost.frequency === 'monthly'
                        ? 'Monatlich'
                        : cost.frequency === 'bi-weekly'
                        ? '14-tägig'
                        : cost.frequency === 'weekly'
                        ? 'Wöchentlich'
                        : 'Unregelmäßig'}
                      {' • '}
                      {cost.source === 'upcoming'
                        ? 'Bevorstehend'
                        : cost.source === 'history'
                        ? 'Historisch erkannt'
                        : 'geschätzt'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{cost.averageAmount.toFixed(2)} €</p>
                    <p className="text-xs text-gray-500">Konfidenz {(cost.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Checker */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Kauf prüfen</h2>
        <p className="text-sm text-gray-600 mb-4">
          Prüfe, ob ein Kauf erlaubt ist. Größere Käufe (z.B. Schuhe) werden blockiert, wenn dein Tageslimit erreicht ist.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Betrag (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={newTransaction.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschreibung
            </label>
            <input
              type="text"
              value={newTransaction.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="z.B. Schuhe, Kaffee, Lebensmittel, ..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategorie
            </label>
            <select
              value={newTransaction.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option>Lebensmittel</option>
              <option>Transport</option>
              <option>Unterhaltung</option>
              <option>Einkaufen</option>
              <option>Rechnungen</option>
              <option>Sonstiges</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                setNewTransaction({ amount: '120', description: 'Schuhe', category: 'Einkaufen' })
              }}
              className="btn-secondary text-sm"
            >
              Beispiel: Schuhe
            </button>
            <button
              onClick={handleCheckTransaction}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Kauf prüfen</span>
            </button>
          </div>

          {checkResult && (
            <div className={`p-4 rounded-lg border-l-4 ${
              checkResult.allowed
                ? 'bg-success-50 border-success-500'
                : 'bg-danger-50 border-danger-500'
            }`}>
              <div className="flex items-start space-x-3">
                {checkResult.allowed ? (
                  <CheckCircle className="h-6 w-6 text-success-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-danger-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  {checkResult.allowed ? (
                    <>
                      <h3 className="font-semibold text-success-900 mb-1">
                        Transaktion erlaubt
                      </h3>
                      {checkResult.warning && (
                        <p className="text-sm text-success-700">{checkResult.warning}</p>
                      )}
                      <button
                        onClick={() => handleAddTransaction(false)}
                        className="mt-3 btn-primary text-sm"
                      >
                        Transaktion hinzufügen
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-danger-900 mb-1">
                        Transaktion blockiert
                      </h3>
                      <p className="text-sm text-danger-700 mb-3">
                        {checkResult.blockReason || 'Diese Ausgabe würde dein Tagesbudget überschreiten.'}
                      </p>
                      {checkResult.canUnlock && unlocksRemaining > 0 && (
                        <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                          <p className="text-sm text-primary-900 mb-2">
                            💡 Du kannst eine Entsperrung verwenden, um diese Transaktion trotzdem durchzuführen.
                          </p>
                          <p className="text-xs text-primary-700 mb-3">
                            Noch {unlocksRemaining} Entsperrung{unlocksRemaining !== 1 ? 'en' : ''} verfügbar
                          </p>
                          <button
                            onClick={() => handleAddTransaction(true)}
                            className="w-full btn-primary flex items-center justify-center space-x-2"
                          >
                            <Unlock className="h-4 w-4" />
                            <span>Mit Entsperrung kaufen</span>
                          </button>
                        </div>
                      )}
                      {(!checkResult.canUnlock || unlocksRemaining === 0) && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-900">
                            ⚠️ Keine Entsperrungen mehr verfügbar. Du brauchst einen neuen Zugangscode oder musst dir einen neuen kaufen.
                          </p>
                          <a
                            href="/settings"
                            className="mt-2 inline-block text-sm text-primary-600 hover:underline"
                          >
                            Zu den Einstellungen →
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

