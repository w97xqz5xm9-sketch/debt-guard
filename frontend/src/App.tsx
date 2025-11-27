import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard'
import Budget from './pages/Budget'
import Settings from './pages/Settings'
import Setup from './pages/Setup'
import Explanation from './pages/Explanation'
import Layout from './components/Layout'
import axios from 'axios'

function App() {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null)

  useEffect(() => {
    checkSetup()
  }, [])

  const checkSetup = async () => {
    try {
      const response = await axios.get('/api/setup')
      setNeedsSetup(response.data.needsSetup)
    } catch (error) {
      console.error('Error checking setup:', error)
      setNeedsSetup(true)
    }
  }


  if (needsSetup === null) {
    return <div className="min-h-screen flex items-center justify-center">Lade...</div>
  }

  if (needsSetup) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Setup />} />
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/setup" element={<Setup onComplete={() => checkSetup()} />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/budget" element={<Layout><Budget /></Layout>} />
        <Route path="/explanation" element={<Layout><Explanation /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App

