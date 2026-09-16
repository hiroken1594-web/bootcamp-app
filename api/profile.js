import { prisma } from '../lib/prisma.js'
import { validateText, validateNumber, LIMITS } from '../src/lib/validation.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const name = validateText(req.query.name, LIMITS.name)
    if (!name.valid) {
      return res.status(400).json({ error: name.error })
    }
    const profile = await prisma.profile.findUnique({ where: { name: name.value } })
    if (!profile) {
      return res.status(404).json({ error: 'プロフィールが見つかりません' })
    }
    return res.status(200).json(profile)
  }

  if (req.method === 'POST') {
    const { name, weight, height, age } = req.body ?? {}

    const nameResult = validateText(name, LIMITS.name)
    const weightResult = validateNumber(weight, LIMITS.weight)
    const heightResult = validateNumber(height, LIMITS.height)
    const ageResult = validateNumber(age, LIMITS.age)

    const firstError = [nameResult, weightResult, heightResult, ageResult].find((r) => !r.valid)
    if (firstError) {
      return res.status(400).json({ error: firstError.error })
    }

    const profile = await prisma.profile.upsert({
      where: { name: nameResult.value },
      update: { weight: weightResult.value, height: heightResult.value, age: ageResult.value },
      create: {
        name: nameResult.value,
        weight: weightResult.value,
        height: heightResult.value,
        age: ageResult.value,
      },
    })
    return res.status(200).json(profile)
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method Not Allowed' })
}
