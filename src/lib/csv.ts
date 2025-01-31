export const sampleWallets = [
  { address: '8xyt4JxS6zE1GRvHCAQeRqm2e9Hk9X3CzrUH8ARGnGH3', name: 'Main Wallet' },
  { address: '2ZjTR1vkfKnHgAqrHm2CfdHdtzCuYXQgkDHyqNnVPiGF', name: 'Trading Wallet' },
]

export function downloadSampleCSV() {
  const headers = ['address', 'name']
  const csvContent = [headers.join(','), ...sampleWallets.map((wallet) => `${wallet.address},${wallet.name}`)].join(
    '\n',
  )

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', 'sample_wallets.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
