// ① 入口：広告からはいる
export default function EntryScreen({ onNext }) {
  return (
    <section className="screen entry-screen">
      <p className="ad-badge">広告</p>
      <h2>配信で忙しくても、運動不足を見える化。</h2>
      <p>毎日の運動をグラフで記録できるアプリ「うごくみる」</p>
      <button onClick={onNext}>詳しく見る</button>
    </section>
  )
}
