// 直近の運動記録を棒グラフで表示する（外部ライブラリなしのシンプルなSVG）
export default function ExerciseChart({ records, recommendedMinutes }) {
  if (records.length === 0) {
    return <p>まだ記録がありません。</p>
  }

  const width = 480
  const height = 220
  const padding = 32
  const barGap = 12
  const chartW = width - padding * 2
  const chartH = height - padding * 2

  const maxValue = Math.max(recommendedMinutes, ...records.map((r) => r.minutes)) * 1.1
  const barWidth = (chartW - barGap * (records.length - 1)) / records.length

  const yFor = (v) => chartH - (v / maxValue) * chartH

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="日々の運動記録グラフ"
      className="exercise-chart"
    >
      <g transform={`translate(${padding}, ${padding})`}>
        <line
          x1={0}
          y1={yFor(recommendedMinutes)}
          x2={chartW}
          y2={yFor(recommendedMinutes)}
          stroke="#e07a5f"
          strokeDasharray="6 4"
        />
        <text x={chartW} y={yFor(recommendedMinutes) - 6} textAnchor="end" fontSize="11" fill="#e07a5f">
          推奨 {recommendedMinutes}分
        </text>
        {records.map((r, i) => {
          const x = i * (barWidth + barGap)
          const barHeight = chartH - yFor(r.minutes)
          return (
            <g key={r.id ?? i}>
              <rect
                x={x}
                y={yFor(r.minutes)}
                width={barWidth}
                height={barHeight}
                fill="#3d5a80"
                rx={3}
              />
              <text x={x + barWidth / 2} y={chartH + 16} textAnchor="middle" fontSize="10" fill="#333">
                {new Date(r.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
              </text>
              <text x={x + barWidth / 2} y={yFor(r.minutes) - 4} textAnchor="middle" fontSize="10" fill="#333">
                {r.minutes}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
