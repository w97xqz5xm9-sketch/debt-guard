import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, Bell, Lock, Unlock } from 'lucide-react'
import { budgetApi } from '../services/api'
import type { Account, SpendingBehavior } from '../types'

function UnlockSystem() {
  const [unlocksRemaining, setUnlocksRemaining] = useState<number>(3)
  const [showAccessCodeInput, setShowAccessCodeInput] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
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

  const handleUseUnlock = async () => {
    if (unlocksRemaining === 0) {
      setShowAccessCodeInput(true)
      return
    }

    setLoading(true)
    try {
      const response = await budgetApi.useUnlock()
      setUnlocksRemaining(response.unlocksRemaining)
      if (response.requiresAccessCode) {
        setShowAccessCodeInput(true)
      }
      alert(response.message)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Fehler beim Verwenden der Entsperrung')
      if (error.response?.status === 403) {
        setShowAccessCodeInput(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetUnlocks = async () => {
    setLoading(true)
    try {
      const response = await budgetApi.resetUnlocks(accessCode)
      setUnlocksRemaining(response.unlocksRemaining)
      setShowAccessCodeInput(false)
      setAccessCode('')
      alert(response.message)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ungültiger Zugangscode')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="p-4 bg-gray-100 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {unlocksRemaining > 0 ? (
              <Unlock className="h-5 w-5 text-success-DEFAULT" />
            ) : (
              <Lock className="h-5 w-5 text-danger-DEFAULT" />
            )}
            <span className="font-medium text-white">
              {unlocksRemaining > 0 ? `Noch ${unlocksRemaining} Entsperrungen verfügbar` : 'Keine Entsperrungen mehr verfügbar'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Falls du die Blockierung deaktivieren möchtest, kannst du eine Entsperrung verwenden.
        </p>
        
        {unlocksRemaining > 0 ? (
          <button
            onClick={handleUseUnlock}
            disabled={loading}
            className="btn-secondary w-full"
          >
            {loading ? 'Wird verwendet...' : 'Entsperrung verwenden'}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-danger-DEFAULT font-medium uppercase tracking-wide">
              Du brauchst einen neuen Zugangscode oder musst dir einen neuen kaufen.
            </p>
            {!showAccessCodeInput && (
              <button
                onClick={() => setShowAccessCodeInput(true)}
                className="btn-primary w-full"
              >
                Zugangscode eingeben
              </button>
            )}
          </div>
        )}

        {showAccessCodeInput && (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Zugangscode eingeben"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleResetUnlocks}
                disabled={loading || !accessCode}
                className="flex-1 btn-primary"
              >
                {loading ? 'Wird zurückgesetzt...' : 'Zurücksetzen'}
              </button>
              <button
                onClick={() => {
                  setShowAccessCodeInput(false)
                  setAccessCode('')
                }}
                className="btn-secondary"
              >
                Abbrechen
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Oder <a href="#" className="text-white underline">neuen Zugangscode kaufen</a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Settings() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [behavior, setBehavior] = useState<SpendingBehavior | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [accountsData, behaviorData] = await Promise.all([
        budgetApi.getAccounts(),
        budgetApi.getSpendingBehavior(),
      ])
      setAccounts(accountsData)
      setBehavior(behaviorData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-white">Lade Daten...</div>
  }

  return (
    <div className="space-y-6">
      <div className="card border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Einstellungen</h2>
          <Link
            to="/setup"
            className="btn-secondary flex items-center space-x-2"
          >
            <span>Setup ändern</span>
          </Link>
        </div>

        {/* Accounts */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white uppercase tracking-wide">Konten</h3>
          </div>
          <div className="space-y-3">
            {accounts.length === 0 ? (
              <p className="text-gray-600">Keine Konten konfiguriert</p>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border border-gray-200"
                >
                  <div>
                    <p className="font-medium text-white">{account.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{account.type}</p>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {account.balance.toFixed(2)} €
                  </p>
                </div>
              ))
            )}
          </div>
        </div>


        {/* Spending Behavior */}
        {behavior && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-white" />
              <h3 className="text-lg font-semibold text-white uppercase tracking-wide">Ausgabeverhalten</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Durchschnittliche tägliche Ausgaben</p>
                <p className="text-2xl font-bold text-white">
                  {behavior.averageDailySpending.toFixed(2)} €
                </p>
              </div>
              <div className="p-4 bg-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Impulskäufe (letzter Monat)</p>
                <p className="text-2xl font-bold text-white">
                  {behavior.impulsePurchaseCount}
                </p>
              </div>
              <div className="p-4 bg-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Risikolevel</p>
                <p className={`text-2xl font-bold ${
                  behavior.riskLevel === 'low' ? 'text-success-DEFAULT' :
                  behavior.riskLevel === 'medium' ? 'text-warning-DEFAULT' : 'text-danger-DEFAULT'
                }`}>
                  {behavior.riskLevel === 'low' ? 'Niedrig' :
                   behavior.riskLevel === 'medium' ? 'Mittel' : 'Hoch'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Unlock System */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white uppercase tracking-wide">Zahlungsblockierung</h3>
          </div>
          <UnlockSystem />
        </div>

        {/* Notification Settings */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white uppercase tracking-wide">Benachrichtigungen</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 bg-gray-100 rounded-xl border border-gray-200 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-white" />
              <span className="text-white">Budget-Warnungen aktivieren</span>
            </label>
            <label className="flex items-center space-x-3 p-3 bg-gray-100 rounded-xl border border-gray-200 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-white" />
              <span className="text-white">Tägliche Budget-Zusammenfassung</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

