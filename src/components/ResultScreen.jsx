import { useEffect, useState } from 'react'
import ExerciseChart from './ExerciseChart.jsx'
import { fetchRecords } from '../lib/api.js'
import { recommendedMinutesPerDay } from '../lib/recommend.js'

// ④ 結果の表示：グラフと比較
export default function ResultScreen({ profile, latestRecord, onNext }) {
  const [records, setRecords] = useState([latestRecord])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchRecords(profile.name)
      .then((data) => {
        if (!cancelled) setRecords(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [profile.name])

  const recommended = recommendedMinutesPerDay(profile.age)
  const diff = latestRecord.minutes - recommended
  const comparisonText =
    diff >= 0
      ? `推奨運動量を ${diff}分 上回っています！`
      : `推奨運動量まであと ${Math.abs(diff)}分 です。`

  return (
    <section className="screen result-screen">
      <h2>結果</h2>

      <div className="comparison-card">
        <p>
          {profile.name}さん（{profile.age}歳・{profile.height}cm・{profile.weight}kg）の推奨運動量は
          <strong> 1日{recommended}分</strong>
        </p>
        <p>
          今日の記録：<strong>{latestRecord.type} {latestRecord.minutes}分</strong>
        </p>
        <p className={diff >= 0 ? 'positive' : 'negative'}>{comparisonText}</p>
      </div>

      {loading && <p>グラフを読み込み中...</p>}
      {error && <p className="notice notice-error">{error}</p>}
      {!loading && !error && <ExerciseChart records={records} recommendedMinutes={recommended} />}

      <button onClick={onNext}>記録一覧を見る</button>
    </section>
  )
}
