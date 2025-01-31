'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isOpen} />

      {/* Main Content */}
      <div className={`${isOpen ? 'lg:ml-80' : 'lg:ml-0'} transition-all duration-300 ease-in-out min-h-screen`}>
        <Navbar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

        {/* Page Content */}
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
