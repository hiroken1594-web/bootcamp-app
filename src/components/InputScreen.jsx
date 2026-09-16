import { useEffect, useState } from 'react'
import { validateNumber, validateText, LIMITS } from '../lib/validation.js'
import { saveProfile, saveRecord } from '../lib/api.js'

const DRAFT_FLAG_KEY = 'ug_draftInProgress'
const REGISTERED_NAME_KEY = 'ug_registeredName'

const initialForm = {
  name: '',
  weight: '',
  height: '',
  age: '',
  exerciseType: '',
  minutes: '',
}

// ③ 主要アクション：日々の運動の記録とグラフ化、また体重・身長・年齢を
//    入力して推奨運動量との比較を出す
export default function InputScreen({ onSaved }) {
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [interrupted, setInterrupted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(DRAFT_FLAG_KEY)) {
      setInterrupted(true)
      localStorage.removeItem(DRAFT_FLAG_KEY)
    }
  }, [])

  function markDraftInProgress() {
    if (!localStorage.getItem(DRAFT_FLAG_KEY)) {
      localStorage.setItem(DRAFT_FLAG_KEY, String(Date.now()))
    }
  }

  function handleChange(field) {
    return (e) => {
      markDraftInProgress()
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function validateAll() {
    const results = {
      name: validateText(form.name, LIMITS.name),
      weight: validateNumber(form.weight, LIMITS.weight),
      height: validateNumber(form.height, LIMITS.height),
      age: validateNumber(form.age, LIMITS.age),
      exerciseType: validateText(form.exerciseType, { maxLength: 20 }),
      minutes: validateNumber(form.minutes, LIMITS.minutes),
    }
    const errors = {}
    for (const [field, result] of Object.entries(results)) {
      if (!result.valid) errors[field] = result.error
    }
    return { errors, results }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    const { errors, results } = validateAll()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})

    const name = results.name.value
    const registeredName = localStorage.getItem(REGISTERED_NAME_KEY)
    if (registeredName && registeredName !== name) {
      setFormError('本人が入力してください')
      return
    }

    setSubmitting(true)
    try {
      const profile = await saveProfile({
        name,
        weight: results.weight.value,
        height: results.height.value,
        age: results.age.value,
      })
      const record = await saveRecord({
        name,
        type: results.exerciseType.value,
        minutes: results.minutes.value,
      })

      if (!registeredName) {
        localStorage.setItem(REGISTERED_NAME_KEY, name)
      }
      localStorage.removeItem(DRAFT_FLAG_KEY)
      setForm(initialForm)
      onSaved({ profile, record })
    } catch (err) {
      setFormError(err.message || '保存に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="screen input-screen">
      <h2>今日の記録を入力</h2>

      {interrupted && (
        <p className="notice notice-warn">中断されました。もう一度入力してください。</p>
      )}
      {formError && <p className="notice notice-error">{formError}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend>プロフィール</legend>

          <label>
            お名前
            <input type="text" value={form.name} onChange={handleChange('name')} />
          </label>
          {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}

          <label>
            体重 (kg)
            <input type="number" value={form.weight} onChange={handleChange('weight')} />
          </label>
          {fieldErrors.weight && <p className="field-error">{fieldErrors.weight}</p>}

          <label>
            身長 (cm)
            <input type="number" value={form.height} onChange={handleChange('height')} />
          </label>
          {fieldErrors.height && <p className="field-error">{fieldErrors.height}</p>}

          <label>
            年齢
            <input type="number" value={form.age} onChange={handleChange('age')} />
          </label>
          {fieldErrors.age && <p className="field-error">{fieldErrors.age}</p>}
        </fieldset>

        <fieldset>
          <legend>今日の運動</legend>

          <label>
            種目（例：ウォーキング）
            <input type="text" value={form.exerciseType} onChange={handleChange('exerciseType')} />
          </label>
          {fieldErrors.exerciseType && <p className="field-error">{fieldErrors.exerciseType}</p>}

          <label>
            時間 (分)
            <input type="number" value={form.minutes} onChange={handleChange('minutes')} />
          </label>
          {fieldErrors.minutes && <p className="field-error">{fieldErrors.minutes}</p>}
        </fieldset>

        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : '記録する'}
        </button>
      </form>
    </section>
  )
}
