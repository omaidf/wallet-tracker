import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        remember: { label: 'Remember Me', type: 'boolean' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'signIn' && account?.type === 'credentials') {
        // @ts-ignore
        token.remember = account.remember
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        maxAge: !token.remember ? 24 * 60 * 60 : undefined, // 1 day if not remembered
      }
    },
  },
  pages: {
    signIn: '/login',
  },
}
