export async function fetchWallets() {
  const response = await fetch('/api/wallets')
  if (!response.ok) throw new Error('Failed to fetch wallets')
  return response.json()
}

export async function createWallet(data: { name: string; address: string }) {
  const response = await fetch('/api/wallets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create wallet')
  return response.json()
}

export async function uploadWallets(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/wallets/upload', {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) throw new Error('Failed to upload wallets')
  return response.json()
}

export async function deleteWallet(id: string) {
  const response = await fetch(`/api/wallets/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete wallet')
  return response.json()
}

export async function deleteAllWallets() {
  const response = await fetch('/api/wallets', {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete all wallets')
  return response.json()
}

export async function updateWalletStatus(id: string, active: boolean) {
  const response = await fetch(`/api/wallets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active }),
  })
  if (!response.ok) throw new Error('Failed to update wallet status')
  return response.json()
}
