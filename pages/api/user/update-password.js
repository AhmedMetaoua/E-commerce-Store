import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    await dbConnect()
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(session.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 8)
    user.password = hashedPassword
    await user.save()

    res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Password update error:', error)
    res.status(500).json({ message: 'Error updating password' })
  }
} 