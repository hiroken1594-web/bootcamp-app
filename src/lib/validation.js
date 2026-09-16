// 妥当な入力レンジ。実在しうる値の上限より少し余裕を持たせ、
// 「想定の10倍」のような極端な値は弾けるようにしている。
export const LIMITS = {
  name: { maxLength: 30 },
  weight: { min: 1, max: 300 }, // kg
  height: { min: 30, max: 250 }, // cm
  age: { min: 1, max: 120 }, // 歳
  minutes: { min: 1, max: 600 }, // 分/回
}

const EMPTY_ERROR = '入力してください'
const INVALID_ERROR = '適正な値を入力してください'

// name や運動の種類などの文字列入力用。制御文字やタグに使われがちな
// 記号を弾くことで、悪意のある文字列を簡易的にブロックする。
const SUSPICIOUS_CHARS = /[<>{}$`;]/

export function validateText(value, { maxLength } = LIMITS.name) {
  if (value === undefined || value === null || value.trim() === '') {
    return { valid: false, error: EMPTY_ERROR }
  }
  const trimmed = value.trim()
  if (trimmed.length > maxLength || SUSPICIOUS_CHARS.test(trimmed)) {
    return { valid: false, error: INVALID_ERROR }
  }
  return { valid: true, error: null, value: trimmed }
}

export function validateNumber(value, { min, max }) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return { valid: false, error: EMPTY_ERROR }
  }
  const num = Number(value)
  if (!Number.isFinite(num)) {
    return { valid: false, error: INVALID_ERROR }
  }
  if (num < min || num > max) {
    return { valid: false, error: INVALID_ERROR }
  }
  return { valid: true, error: null, value: num }
}
