import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { generateToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/mailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body
  await dbConnect()

  const user = await User.findOne({ email })
  if (!user) return res.status(200).json({ message: 'If user exists, email was sent' })

  const token = generateToken()
  user.resetToken = token
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 10 // 10 min
  await user.save()

  await sendPasswordResetEmail(email, token)
  res.status(200).json({ message: 'Email sent' })
} 