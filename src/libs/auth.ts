import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma-client'

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === 'update' && session.points) {
        token.points = session.points
        console.log('Updated token with points', token.points)
      }
      return token
    },
    async session({ session }) {
      return session
    }
  }
})
