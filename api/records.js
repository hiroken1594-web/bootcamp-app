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
    const records = await prisma.exerciseRecord.findMany({
      where: { profileId: profile.id },
      orderBy: { date: 'asc' },
    })
    return res.status(200).json(records)
  }

  if (req.method === 'POST') {
    const { name, type, minutes } = req.body ?? {}

    const nameResult = validateText(name, LIMITS.name)
    const typeResult = validateText(type, { maxLength: 20 })
    const minutesResult = validateNumber(minutes, LIMITS.minutes)

    const firstError = [nameResult, typeResult, minutesResult].find((r) => !r.valid)
    if (firstError) {
      return res.status(400).json({ error: firstError.error })
    }

    const profile = await prisma.profile.findUnique({ where: { name: nameResult.value } })
    if (!profile) {
      return res.status(404).json({ error: 'プロフィールが見つかりません' })
    }

    const record = await prisma.exerciseRecord.create({
      data: {
        profileId: profile.id,
        type: typeResult.value,
        minutes: minutesResult.value,
      },
    })
    return res.status(201).json(record)
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method Not Allowed' })
}
