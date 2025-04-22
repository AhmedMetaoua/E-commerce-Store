import dbConnect from "@/lib/mongoose"
import Product from "@/models/Product"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    const { ids } = req.body

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'Invalid request body' })
    }

    // Get the session
    const session = await getServerSession(req, res, authOptions)

    // Allow access to products even without authentication
    // This is a public endpoint that just fetches product details
    const products = await Product.find({ _id: { $in: ids } })
    return res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 