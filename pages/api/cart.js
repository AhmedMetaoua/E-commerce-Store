import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import Product from "@/models/Product"

export default async function handler(req, res) {

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  
  await dbConnect()

  const user = await User.findOne( {email : session?.user?.email} )
  // console.log('session:' ,session)
  // console.log('use:' ,user)

  if (!user || !session) {
    return res.status(404).json({ message: "User not found" })
  }

  if (req.method === "GET") {
    return res.json(user.cart || [])
  }

  if (req.method === "POST") {
    const { products, ids } = req.body;
    console.log('body in api card',req.body)

    if (products) {
      // Save cart to DB
      user.cart = products;
      await user.save();
      return res.json(user.cart);
      
    }
  
    if (ids) {
      // Get full product info from ids
      const productsData = await Product.find({ _id: { $in: ids } }); // assuming Product model exists
      return res.json(productsData);
    }
  
    return res.status(400).json({ message: "Invalid POST body" });
  }

  return res.status(405).json({ message: "Method not allowed" })
} 