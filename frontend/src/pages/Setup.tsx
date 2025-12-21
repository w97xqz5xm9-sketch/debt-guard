import { useState, useEffect } from 'react'
import { Target, TrendingUp, Shield, PiggyBank, Gem, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { budgetApi } from '../services/api'

interface SetupProps {
  onComplete?: () => void
}

type SavingsGoalAmount = 50 | 100 | 200 | 300 | 500 | 1000

const goalOptions: { amount: SavingsGoalAmount; label: string; description: string }[] = [
  { amount: 50, label: '50€ sparen', description: 'Leichter Einstieg ohne Druck' },
  { amount: 100, label: '100€ sparen', description: 'Solide Balance aus Sparen & Budget' },
  { amount: 200, label: '200€ sparen', description: 'Disziplinierter Modus mit mehr Polster' },
  { amount: 300, label: '300€ sparen', description: 'Ambitioniert für klare Ziele' },
  { amount: 500, label: '500€ sparen', description: 'Intensiv sparen für große Pläne' },
  { amount: 1000, label: '1000€ sparen', description: 'Maximaler Fokus auf Vermögensaufbau' },
]

function GoalIcon({ amount }: { amount: SavingsGoalAmount }) {
  const Icon = amount <= 100
    ? Target
    : amount <= 200
      ? TrendingUp
      : amount <= 300
        ? Shield
        : amount <= 500
          ? PiggyBank
          : amount < 1000
            ? Gem
            : Crown

  return <Icon className="h-6 w-6" />
}

export default function Setup({ onComplete }: SetupProps) {
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoalAmount | null>(null)
  const [monthlyIncome, setMonthlyIncome] = useState('3000')
  const [loading, setLoading] = useState(false)
  const [currentSetup, setCurrentSetup] = useState<any>(null)
  const [changeInfo, setChangeInfo] = useState<{ remaining: number; canChange: boolean } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadCurrentSetup()
  }, [])

  const loadCurrentSetup = async () => {
    try {
      const response = await budgetApi.getSetup()
      if (!response.needsSetup && response.setup) {
        setCurrentSetup(response.setup)
        setSavingsGoal(response.setup.savingsGoal)
        setMonthlyIncome(response.setup.monthlyIncome.toString())
        if (response.changeInfo) {
          setChangeInfo(response.changeInfo)
        }
      } else {
        setCurrentSetup(null)
        setChangeInfo(null)
      }
    } catch (error) {
      console.error('Error loading current setup:', error)
      setCurrentSetup(null)
      setChangeInfo(null)
    }
  }

  const handleSubmit = async () => {
    if (!savingsGoal) return

    // Show remaining changes info (if this is a change, not initial setup)
    if (currentSetup && changeInfo) {
      const remaining = changeInfo.remaining
      if (remaining === 2) {
        if (!confirm(`Du hast noch 2 Änderungen diesen Monat möglich.\n\nMöchtest du fortfahren?`)) {
          return
        }
      } else if (remaining === 1) {
        if (!confirm(`Du hast noch 1 Änderung diesen Monat möglich.\n\nMöchtest du fortfahren?`)) {
          return
        }
      }
    }

    setLoading(true)
    try {
      await budgetApi.saveSetup({
        savingsGoal,
        monthlyIncome: parseFloat(monthlyIncome) || 3000,
      })
      
      // Show success message
      if (currentSetup) {
        alert('✅ Setup erfolgreich geändert!')
      } else {
        // Initial setup
        alert('✅ Setup erfolgreich erstellt!')
      }
      
      // Reload setup info to get updated change info
      await loadCurrentSetup()
      
      if (onComplete) {
        await onComplete()
      }
      // Use window.location for initial setup to force full reload
      if (!currentSetup) {
        window.location.href = '/#/'
      } else {
        navigate('/')
      }
    } catch (error: any) {
      console.error('Error creating setup:', error)
      let errorMessage = 'Fehler beim Erstellen des Setups'
      
      if (error.response) {
        errorMessage = error.response.data?.error || `Server-Fehler: ${error.response.status}`
      } else if (error.request) {
        errorMessage = 'Keine Verbindung zum Backend. Bitte prüfe die Backend-URL in den Render-Einstellungen.'
      } else {
        errorMessage = error.message || errorMessage
      }
      
      alert(`${errorMessage}\n\nBitte öffne die Browser-Konsole (F12) für mehr Details.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card border-gray-200 text-center">
          <div className="mb-6">
            <div className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center gradient-iridescent border border-gray-200">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
              {currentSetup ? 'Setup ändern' : 'Monats-Setup'}
            </h1>
            <p className="text-gray-600">
              {currentSetup ? 'Ändere dein Sparziel oder Einkommen' : 'Wähle dein Sparziel für diesen Monat'}
            </p>
            {currentSetup && changeInfo && changeInfo.remaining > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  Noch {changeInfo.remaining} Änderung{changeInfo.remaining !== 1 ? 'en' : ''} diesen Monat möglich
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-6">
            {goalOptions.map(({ amount, label, description }) => (
              <button
                key={amount}
                onClick={() => setSavingsGoal(amount)}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${
                  savingsGoal === amount
                    ? 'border-white bg-gray-100 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className={savingsGoal === amount ? 'text-white' : 'text-gray-600'}>
                    <GoalIcon amount={amount} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-lg ${savingsGoal === amount ? 'text-white' : 'text-white'}`}>{label}</p>
                    <p className={`text-sm ${savingsGoal === amount ? 'text-gray-600' : 'text-gray-600'}`}>{description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2 uppercase tracking-wide">
              Monatliches Einkommen (optional)
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300"
              placeholder="3000"
            />
            <p className="text-xs text-gray-600 mt-1">
              Wird automatisch aus deinen Transaktionen erkannt, falls nicht angegeben
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!savingsGoal || loading}
            className={`w-full py-3 text-lg font-medium rounded-xl transition-all duration-300 uppercase tracking-wide ${
              !savingsGoal || loading
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                : 'btn-primary-accent'
            }`}
          >
            {loading ? 'Wird erstellt...' : currentSetup ? 'Setup ändern' : 'Setup starten'}
          </button>
          
          {!savingsGoal && (
            <p className="text-sm text-danger-DEFAULT mt-2 text-center uppercase tracking-wide">
              Bitte wähle ein Sparziel aus
            </p>
          )}

          <p className="text-xs text-gray-600 mt-4">
            Die App analysiert automatisch deine Fixkosten und berechnet dein 3-Tage-Limit
          </p>
        </div>
      </div>
      
      {/* Debug: Reset button */}
      <div className="mt-4 text-center">
        <button
          onClick={async () => {
            try {
              await budgetApi.resetSetup()
              window.location.reload()
            } catch (error) {
              console.error('Error:', error)
            }
          }}
          className="text-xs text-gray-600 hover:text-white underline transition-colors duration-300"
        >
          Setup zurücksetzen (Debug)
        </button>
      </div>
    </div>
  )
}
