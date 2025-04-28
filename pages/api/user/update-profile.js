import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

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
    const { name, email, phone, location } = req.body

    const user = await User.findById(session.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update user fields
    user.name = name || user.name
    user.email = email || user.email
    user.phone = phone || user.phone
    user.location = location || user.location

    await user.save()

    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ message: 'Error updating profile' })
  }
} 