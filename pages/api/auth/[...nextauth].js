import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect()
          
          const user = await User.findOne({ email: credentials.email })
          
          if (!user) {
            throw new Error("No user found with this email")
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValid) {
            throw new Error("Invalid password")
          }
          
          return {
            id: user._id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          throw new Error(error.message)
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) {
        token.id = user._id.toString();
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id
      }
      return session
    }
  },
}

export default NextAuth(authOptions)