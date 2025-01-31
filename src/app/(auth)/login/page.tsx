'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const rememberMe = formData.get('remember-me') === 'on'
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
        remember: rememberMe,
      })

      if (result?.error) {
        setError('Invalid credentials')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md px-8 py-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] border border-white/20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="mb-10 text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
              className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20"
            >
              <span className="text-2xl font-bold text-white">W</span>
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <motion.div whileTap={{ scale: 0.995 }}>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 ease-in-out placeholder:text-gray-400"
                  placeholder="name@example.com"
                />
              </motion.div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <motion.div whileTap={{ scale: 0.995 }}>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 ease-in-out placeholder:text-gray-400"
                  placeholder="••••••••"
                />
              </motion.div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.div whileTap={{ scale: 0.9 }}>
                <motion.input
                  whileHover={{ scale: 1.1 }}
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
              </motion.div>
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <motion.a
              whileHover={{ scale: 1.02 }}
              href="#"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              {/* Forgot password? */}
            </motion.a>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 text-sm text-red-500 bg-red-50 rounded-xl text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: '#006d7a' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-lg shadow-primary-600/20"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </motion.button>

          <div className="mt-6 text-center text-sm text-gray-500">
            {/* Don't have an account?{' '}
            <motion.a
              whileHover={{ scale: 1.02 }}
              href="#"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Sign up
            </motion.a> */}
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}
