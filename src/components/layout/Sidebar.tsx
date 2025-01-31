'use client'

import { ArrowRightOnRectangleIcon, Cog6ToothIcon, HomeIcon, WalletIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  {
    path: '/dashboard',
    name: 'Overview',
    icon: HomeIcon,
    description: "Get a bird's-eye view of your wallets",
  },
  {
    path: '/dashboard/wallets',
    name: 'Wallets',
    icon: WalletIcon,
    description: 'Manage and track your wallets',
  },
  {
    path: '/dashboard/settings',
    name: 'Settings',
    icon: Cog6ToothIcon,
    description: 'Configure your preferences',
  },
]

interface SidebarProps {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="fixed left-0 top-0 z-40 h-screen w-80 bg-white border-r border-gray-100/40 backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-100/40">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg shadow-primary-600/20"
          >
            <span className="text-lg font-bold text-white">W</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <h1 className="text-lg font-semibold text-gray-900">Wallet Tracker</h1>
            <p className="text-xs font-medium text-gray-500">Pro Dashboard</p>
          </motion.div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  whileHover={{ x: 2, backgroundColor: 'rgb(249, 250, 251)' }}
                  whileTap={{ scale: 0.995 }}
                  className={`group relative flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50/60 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                  }`}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : 0.95,
                      color: isActive ? 'rgb(0, 124, 137)' : 'currentColor',
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm border border-gray-100 group-hover:border-gray-200 transition-colors"
                  >
                    <item.icon
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'
                      }`}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="font-medium leading-none mb-1">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.description}</span>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Footer Section */}
        <div className="border-t border-gray-100/40 p-4 mx-3 mb-3">
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: 'rgb(249, 250, 251)' }}
            whileTap={{ scale: 0.99 }}
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-xl p-3 text-gray-600 hover:text-gray-900 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm border border-gray-100 group-hover:border-gray-200 transition-colors">
              <ArrowRightOnRectangleIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium leading-none mb-1">Logout</span>
              <span className="text-xs text-gray-500">Sign out of your account</span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.aside>
  )
}
