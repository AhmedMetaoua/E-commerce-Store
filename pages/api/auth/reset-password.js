import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { token, password } = req.body
  await dbConnect()

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  })

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' })

  const hashedPassword = await bcrypt.hash(password, 8)
  user.password = hashedPassword
  user.resetToken = undefined
  user.resetTokenExpiry = undefined
  await user.save()

  res.status(200).json({ message: 'Password reset successfully' })
} 