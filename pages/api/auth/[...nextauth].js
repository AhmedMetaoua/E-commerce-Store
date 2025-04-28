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
          console.log('user: ', user._id.toString())
          return {
            id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            location: user.location
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
      if (user) {
        token.id = user.id || user._id.toString();
        token.phone = user.phone;
        token.location = user.location;
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.location = token.location;
      }
      return session
    }
  },
}

export default NextAuth(authOptions)