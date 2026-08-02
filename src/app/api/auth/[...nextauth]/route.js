import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import getSupabase from '@/lib/supabase'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'admin@example.com'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required')
          }

          const supabase = getSupabase()

          // Find admin by email
          const { data: admin } = await supabase
            .from('admins')
            .select('*')
            .eq('email', credentials.email.toLowerCase())
            .eq('is_active', true)
            .maybeSingle()

          if (!admin) {
            throw new Error('Invalid credentials')
          }

          // Check password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            admin.password
          )

          if (!isValidPassword) {
            throw new Error('Invalid credentials')
          }

          // Update last login
          await supabase
            .from('admins')
            .update({ last_login: new Date().toISOString() })
            .eq('id', admin.id)

          return {
            id: admin.id,
            email: admin.email,
            username: admin.username,
            role: admin.role
          }
        } catch (error) {
          console.error('Authentication error:', error)
          throw new Error('Authentication failed')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub
      session.user.role = token.role
      session.user.username = token.username
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
