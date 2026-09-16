// WHOの身体活動ガイドライン（成人:週150〜300分の中強度運動、
// 子ども・青少年:1日60分）を根拠に、1日あたりの推奨運動量を概算する。
export function recommendedMinutesPerDay(age) {
  if (age < 18) return 60
  return 30
}
