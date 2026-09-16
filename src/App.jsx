import { useState } from 'react'
import EntryScreen from './components/EntryScreen.jsx'
import TitleScreen from './components/TitleScreen.jsx'
import InputScreen from './components/InputScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import TableScreen from './components/TableScreen.jsx'
import { fetchRecords } from './lib/api.js'
import './App.css'

export default function App() {
  const [step, setStep] = useState('entry')
  const [profile, setProfile] = useState(null)
  const [latestRecord, setLatestRecord] = useState(null)
  const [records, setRecords] = useState([])

  function handleSaved({ profile: savedProfile, record }) {
    setProfile(savedProfile)
    setLatestRecord(record)
    setStep('result')
  }

  async function handleShowTable() {
    try {
      const data = await fetchRecords(profile.name)
      setRecords(data)
    } catch {
      setRecords(latestRecord ? [latestRecord] : [])
    }
    setStep('table')
  }

  return (
    <main className="app">
      {step === 'entry' && <EntryScreen onNext={() => setStep('title')} />}
      {step === 'title' && <TitleScreen onNext={() => setStep('input')} />}
      {step === 'input' && <InputScreen onSaved={handleSaved} />}
      {step === 'result' && profile && latestRecord && (
        <ResultScreen profile={profile} latestRecord={latestRecord} onNext={handleShowTable} />
      )}
      {step === 'table' && (
        <TableScreen records={records} onAddAnother={() => setStep('input')} />
      )}
    </main>
  )
}
