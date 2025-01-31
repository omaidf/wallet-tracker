'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Navbar({ isOpen, onToggle }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="text-gray-600 hover:text-gray-900"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -180 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center"
          >
            <span className="text-primary-600 font-medium">TU</span>
          </motion.div>
        </div>
      </div>
    </nav>
  )
}
