import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  await dbConnect()

  const user = await User.findOne( {email: session.user.email} )
   // console.log('session:' ,session)

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  if (req.method === "GET") {
    return res.json(user.wishlist || [])
  }

  if (req.method === "POST") {
    const { products } = req.body

    user.wishlist = products
    await user.save()

    return res.json(user.wishlist)
  }

  return res.status(405).json({ message: "Method not allowed" })
} 