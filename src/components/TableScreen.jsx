// ⑤ 次の行動／出口：表を出す
export default function TableScreen({ records, onAddAnother }) {
  return (
    <section className="screen table-screen">
      <h2>記録一覧</h2>

      {records.length === 0 ? (
        <p>まだ記録がありません。</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>日付</th>
              <th>種目</th>
              <th>時間 (分)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.date).toLocaleDateString('ja-JP')}</td>
                <td>{r.type}</td>
                <td>{r.minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={onAddAnother}>また記録する</button>
    </section>
  )
}
