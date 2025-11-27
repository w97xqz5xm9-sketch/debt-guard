import { useEffect, useState } from 'react'
import { Info, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'
import { budgetApi } from '../services/api'

interface ExplanationData {
  error?: string
  monthlyBudget: number
  daysInMonth: number
  currentDay: number
  spentThisMonth: number
  plannedSpend: number
  delta: number
  deltaRel: number
  remainingDays: number
  result: {
    newDailyLimit: number
    status: 'green' | 'yellow' | 'red'
    block: boolean
  }
  explanation: string
}

export default function Explanation() {
  const [data, setData] = useState<ExplanationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExplanation()
  }, [])

  const loadExplanation = async () => {
    try {
      const data = await budgetApi.getExplanation()
      setData(data)
    } catch (error) {
      console.error('Error loading explanation:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Lade Daten...</div>
  }

  if (!data || data.error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{data?.explanation || 'Keine Daten verfügbar'}</p>
      </div>
    )
  }

  const statusColors = {
    green: 'bg-success-50 border-success-500 text-success-900',
    yellow: 'bg-yellow-50 border-yellow-500 text-yellow-900',
    red: 'bg-danger-50 border-danger-500 text-danger-900',
  }

  const statusIcons = {
    green: CheckCircle,
    yellow: AlertCircle,
    red: AlertCircle,
  }

  const StatusIcon = statusIcons[data.result.status]

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-primary-600 p-3 rounded-lg">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wie wird das Limit berechnet?</h1>
            <p className="text-gray-600">Dynamische Limit-Berechnung basierend auf deinem Ausgabeverhalten</p>
          </div>
        </div>

        {/* Current Status */}
        <div className={`p-6 rounded-lg border-l-4 mb-6 ${statusColors[data.result.status]}`}>
          <div className="flex items-start space-x-3">
            <StatusIcon className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">
                Aktueller Status: {data.result.status === 'green' ? '🟢 Im Rahmen' : 
                                  data.result.status === 'yellow' ? '🟡 Warnung' : '🔴 Blockiert'}
              </h3>
              <p className="text-sm mb-3">{data.explanation}</p>
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Neues Tageslimit ab morgen:</p>
                <p className="text-2xl font-bold">
                  {data.result.newDailyLimit.toFixed(2)} €
                </p>
                {data.result.block && (
                  <p className="text-sm mt-2 font-medium">⚠️ Zahlungen werden blockiert</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Berechnungsdetails</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Monatsbudget (B)</p>
              <p className="text-2xl font-bold text-gray-900">{data.monthlyBudget.toFixed(2)} €</p>
              <p className="text-xs text-gray-500 mt-1">Gesamtes variables Budget</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tage im Monat (N)</p>
              <p className="text-2xl font-bold text-gray-900">{data.daysInMonth}</p>
              <p className="text-xs text-gray-500 mt-1">Gesamte Tage</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Aktueller Tag (t)</p>
              <p className="text-2xl font-bold text-gray-900">{data.currentDay}</p>
              <p className="text-xs text-gray-500 mt-1">Tag {data.currentDay} von {data.daysInMonth}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Bereits ausgegeben (S_ist)</p>
              <p className="text-2xl font-bold text-gray-900">{data.spentThisMonth.toFixed(2)} €</p>
              <p className="text-xs text-gray-500 mt-1">Kumuliert diesen Monat</p>
            </div>
          </div>

          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <h3 className="font-semibold text-primary-900 mb-3">Berechnungsschritte</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <span className="font-mono text-primary-600">1.</span>
                <div>
                  <p className="font-medium text-primary-900">Geplante Ausgaben bis heute:</p>
                  <p className="text-primary-700">S_plan = B × (t / N) = {data.monthlyBudget.toFixed(2)} × ({data.currentDay} / {data.daysInMonth})</p>
                  <p className="text-primary-800 font-semibold mt-1">= {data.plannedSpend.toFixed(2)} €</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="font-mono text-primary-600">2.</span>
                <div>
                  <p className="font-medium text-primary-900">Abweichung:</p>
                  <p className="text-primary-700">Delta = S_ist - S_plan = {data.spentThisMonth.toFixed(2)} - {data.plannedSpend.toFixed(2)}</p>
                  <p className={`font-semibold mt-1 ${data.delta >= 0 ? 'text-danger-600' : 'text-success-600'}`}>
                    = {data.delta >= 0 ? '+' : ''}{data.delta.toFixed(2)} € ({data.deltaRel >= 0 ? '+' : ''}{data.deltaRel.toFixed(1)}%)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="font-mono text-primary-600">3.</span>
                <div>
                  <p className="font-medium text-primary-900">Basislimit für restliche Tage:</p>
                  <p className="text-primary-700">BaseLimit = (B - S_ist) / Resttage</p>
                  <p className="text-primary-700">= ({data.monthlyBudget.toFixed(2)} - {data.spentThisMonth.toFixed(2)}) / {data.remainingDays}</p>
                  <p className="text-primary-800 font-semibold mt-1">
                    = {((data.monthlyBudget - data.spentThisMonth) / data.remainingDays).toFixed(2)} €
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Zones Explanation */}
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Zonenlogik</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-success-50 border-l-4 border-success-500 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-success-600" />
                  <h4 className="font-semibold text-success-900">🟢 Grün (≤ 5% Abweichung)</h4>
                </div>
                <p className="text-sm text-success-800">
                  Alles im Rahmen. Das Tageslimit wird normal berechnet: Restbudget geteilt durch verbleibende Tage.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-900">🟡 Gelb (5% - 15% über Plan)</h4>
                </div>
                <p className="text-sm text-yellow-800">
                  Du liegst über dem Plan. Das Limit wird um 20% reduziert, um wieder ins Gleichgewicht zu kommen.
                </p>
              </div>

              <div className="p-4 bg-danger-50 border-l-4 border-danger-500 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-danger-600" />
                  <h4 className="font-semibold text-danger-900">🔴 Rot (&gt; 15% über Plan)</h4>
                </div>
                <p className="text-sm text-danger-800">
                  Deutlich über Plan. Das Tageslimit wird auf 0€ gesetzt und Zahlungen werden blockiert.
                </p>
              </div>

              <div className="p-4 bg-success-50 border-l-4 border-success-500 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-success-600" />
                  <h4 className="font-semibold text-success-900">Bonus (deutlich unter Plan)</h4>
                </div>
                <p className="text-sm text-success-800">
                  Wenn du deutlich unter Plan liegst, wird das Limit um 10% erhöht als Belohnung für gutes Haushalten.
                </p>
              </div>
            </div>
          </div>

          {/* Formula */}
          <div className="p-6 bg-primary-50 rounded-lg border border-primary-200">
            <h3 className="font-semibold text-primary-900 mb-3">Formel im Detail</h3>
            <div className="space-y-2 text-sm font-mono text-primary-800 bg-white p-4 rounded">
              <p>S_plan = B × (t / N)</p>
              <p>Delta = S_ist - S_plan</p>
              <p>DeltaRel = Delta / B</p>
              <p>BaseLimit = (B - S_ist) / (N - t)</p>
              <p className="mt-3 text-xs text-primary-600">
                B = Monatsbudget, N = Tage im Monat, t = aktueller Tag, S_ist = bereits ausgegeben
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

