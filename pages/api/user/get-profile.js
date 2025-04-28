import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    console.log('user id: ',session.user)
    // Return user data directly from session
    res.status(200).json({
      user: {
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone || '',
        location: session.user.location || ''
      }
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ message: 'Error fetching profile' })
  }
} 