'use client'

import React from 'react'
import { useEffect } from 'react'

export default function SettingsPage() {
  useEffect(() => {
    document.title = 'Settings - Solana Tracker'
  }, [])

  return <div>Settings</div>
}
