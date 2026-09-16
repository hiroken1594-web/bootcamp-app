// ② 最初の画面：アプリのタイトルとキャッチフレーズ
export default function TitleScreen({ onNext }) {
  return (
    <section className="screen title-screen">
      <h1>うごくみる</h1>
      <p className="catchphrase">毎日の運動を、見えるかたちに。</p>
      <button onClick={onNext}>はじめる</button>
    </section>
  )
}
