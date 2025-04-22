import dbConnect from "@/lib/mongoose";
import User from "@/models/User"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    await dbConnect()

    const { userName, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()

    res.status(201).json(userWithoutPassword)
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ message: "Error creating user" })
  }
} 