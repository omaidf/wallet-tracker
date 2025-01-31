'use client'

import React from 'react'
import { useEffect } from 'react'

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard - Solana Tracker'
  }, [])

  return <div>Dashboard</div>
}
