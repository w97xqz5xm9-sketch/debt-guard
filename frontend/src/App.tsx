import { Routes, Route, HashRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard'
import Budget from './pages/Budget'
import Settings from './pages/Settings'
import Setup from './pages/Setup'
import Explanation from './pages/Explanation'
import Layout from './components/Layout'
import { budgetApi } from './services/api'

function App() {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null)

  useEffect(() => {
    checkSetup()
  }, [])

  const checkSetup = async () => {
    try {
      const response = await budgetApi.getSetup()
      // needsSetup should only be true if no setup exists, not if limit is reached
      // If setup exists (even if limit is reached), needsSetup should be false
      setNeedsSetup(response.needsSetup === true)
    } catch (error) {
      console.error('Error checking setup:', error)
      // On error, check if it's a network error or a real "no setup" error
      // If we can't connect, assume setup exists to allow app access
      setNeedsSetup(false) // Allow app access even on error
    }
  }


  if (needsSetup === null) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Lade...</div>
  }

  // Use HashRouter for Render.com static site compatibility
  const RouterComponent = HashRouter

  if (needsSetup) {
    return (
      <RouterComponent>
        <Routes>
          <Route path="*" element={<Setup onComplete={() => checkSetup()} />} />
        </Routes>
      </RouterComponent>
    )
  }

  return (
    <RouterComponent>
      <Routes>
        <Route path="/setup" element={<Setup onComplete={() => checkSetup()} />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/budget" element={<Layout><Budget /></Layout>} />
        <Route path="/explanation" element={<Layout><Explanation /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
      </Routes>
    </RouterComponent>
  )
}

export default App

