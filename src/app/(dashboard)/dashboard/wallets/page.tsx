'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  createWallet,
  deleteAllWallets,
  deleteWallet,
  fetchWallets,
  uploadWallets,
  updateWalletStatus,
} from '@/lib/api'
import { downloadSampleCSV } from '@/lib/csv'
import { cn } from '@/lib/utils'
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  WalletIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Loader2Icon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Wallet {
  id: string
  address: string
  name: string
  balance: number
  network: string
  status: string
  active: boolean
  createdAt: Date
}

function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index} className="animate-in fade-in-50">
          <TableCell>
            <Skeleton className="h-6 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[180px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[100px] rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[80px] rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function UploadAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative h-16 w-16">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <ArrowUpTrayIcon className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">Processing your CSV file...</p>
    </div>
  )
}

export default function WalletsPage() {
  const [isAddingWallet, setIsAddingWallet] = useState(false)
  const [newWallet, setNewWallet] = useState({ name: '', address: '' })
  const queryClient = useQueryClient()
  const [isUploadingCSV, setIsUploadingCSV] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [deletingWallet, setDeletingWallet] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isDeletingAll, setIsDeletingAll] = useState(false)

  useEffect(() => {
    document.title = 'Wallets - Solana Tracker'
  }, [])

  // Fetch wallets
  const { data: wallets = [], isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: fetchWallets,
  })

  // Create wallet mutation
  const createWalletMutation = useMutation({
    mutationFn: createWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      setIsAddingWallet(false)
      setNewWallet({ name: '', address: '' })
      toast.success('Wallet added successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to add wallet')
      console.error('Error adding wallet:', error)
    },
  })

  // Upload wallets mutation
  const uploadWalletsMutation = useMutation({
    mutationFn: uploadWallets,
    onSuccess: () => {
      setIsUploadingCSV(false)
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success('Wallets uploaded successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to upload wallets')
      console.error('Error uploading wallets:', error)
    },
  })

  // Add delete mutation
  const deleteWalletMutation = useMutation({
    mutationFn: deleteWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success('Wallet deleted successfully')
      setDeletingWallet(null)
    },
    onError: (error) => {
      toast.error('Failed to delete wallet')
      console.error('Error deleting wallet:', error)
      setDeletingWallet(null)
    },
  })

  // Add delete all mutation
  const deleteAllWalletsMutation = useMutation({
    mutationFn: deleteAllWallets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      setIsDeletingAll(false)
      setCurrentPage(1) // Reset to first page
    },
  })

  // Add status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => updateWalletStatus(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  // Pagination logic
  const totalPages = Math.ceil((wallets?.length || 0) / itemsPerPage)
  const paginatedWallets = wallets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUploadCSV = async () => {
    if (!selectedFile) return
    uploadWalletsMutation.mutate(selectedFile)
    setSelectedFile(null)
  }

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    createWalletMutation.mutate(newWallet)
  }

  const PaginationControls = () => {
    if (wallets.length <= itemsPerPage) return null

    const renderPageButtons = () => {
      const pages = []

      // Always show first page
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentPage(1)}
          className={cn('h-8 w-8 p-0', currentPage === 1 && 'pointer-events-none')}
        >
          1
        </Button>,
      )

      // Calculate range of pages to show
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 text-gray-500">
            ...
          </span>,
        )
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentPage(i)}
            className={cn('h-8 w-8 p-0', currentPage === i && 'pointer-events-none')}
          >
            {i}
          </Button>,
        )
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 text-gray-500">
            ...
          </span>,
        )
      }

      // Always show last page if there is more than one page
      if (totalPages > 1) {
        pages.push(
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            className={cn('h-8 w-8 p-0', currentPage === totalPages && 'pointer-events-none')}
          >
            {totalPages}
          </Button>,
        )
      }

      return pages
    }

    return (
      <div className="flex items-center justify-between px-2 py-3 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, wallets.length)} of{' '}
            {wallets.length} wallets
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          {renderPageButtons()}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Wallets</h1>
            <p className="text-sm text-gray-500">Manage and track your wallet addresses</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input placeholder="Search wallets..." className="pl-9 w-[250px]" />
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setIsAddingWallet(true)}>
            <PlusIcon className="h-4 w-4" />
            Add Wallet
          </Button>
          <Button variant="default" className="gap-2" onClick={() => setIsUploadingCSV(true)}>
            <ArrowUpTrayIcon className="h-4 w-4" />
            Upload CSV
          </Button>
          {wallets.length > 0 && (
            <Button
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setIsDeletingAll(true)}
            >
              <TrashIcon className="h-4 w-4" />
              Delete All
            </Button>
          )}
        </div>
      </div>

      {/* Add Wallet Dialog */}
      <Dialog open={isAddingWallet} onOpenChange={setIsAddingWallet}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Wallet</DialogTitle>
            <DialogDescription>Add a new wallet to track its balance and transactions.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWallet}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Wallet Name
                </label>
                <Input
                  id="name"
                  value={newWallet.name}
                  onChange={(e) => setNewWallet((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Main Wallet"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Wallet Address
                </label>
                <Input
                  id="address"
                  value={newWallet.address}
                  onChange={(e) => setNewWallet((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter Solana wallet address"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddingWallet(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createWalletMutation.isPending}>
                {createWalletMutation.isPending ? 'Adding...' : 'Add Wallet'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CSV Upload Dialog */}
      <Dialog open={isUploadingCSV} onOpenChange={setIsUploadingCSV}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Wallets CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file containing wallet addresses and names. Download the sample CSV for the correct format.
            </DialogDescription>
          </DialogHeader>

          {uploadWalletsMutation.isPending ? (
            <UploadAnimation />
          ) : (
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="gap-2" onClick={downloadSampleCSV}>
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download Sample
                </Button>
                <div className="text-sm text-muted-foreground">Contains example data format</div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Select CSV File</label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept=".csv" onChange={handleFileSelect} className="flex-1" />
                </div>
                {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
              </div>

              <div className="flex flex-col gap-2 rounded-lg border border-dashed p-4">
                <h4 className="text-sm font-semibold">CSV Format Requirements:</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>First row must contain headers: address,name</li>
                  <li>Address must be a valid Solana wallet address</li>
                  <li>Name should be a descriptive label for the wallet</li>
                </ul>
              </div>
            </div>
          )}

          {!uploadWalletsMutation.isPending && (
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null)
                  setIsUploadingCSV(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUploadCSV} disabled={!selectedFile} className="gap-2">
                <ArrowUpTrayIcon className="h-4 w-4" />
                Upload
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Delete All Confirmation Dialog */}
      <AlertDialog open={isDeletingAll} onOpenChange={setIsDeletingAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all wallets?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all {wallets.length} wallets from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeletingAll(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.promise(deleteAllWalletsMutation.mutateAsync(), {
                  loading: 'Deleting all wallets...',
                  success: 'All wallets deleted successfully',
                  error: 'Failed to delete wallets',
                })
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteAllWalletsMutation.isPending ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete All'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Alert Dialog for Delete Confirmation */}
      <AlertDialog open={!!deletingWallet} onOpenChange={() => setDeletingWallet(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the wallet from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingWallet(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingWallet && deleteWalletMutation.mutate(deletingWallet)}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteWalletMutation.isPending ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Wallet'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Address</TableHead>
              <TableHead className="font-medium">Network</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Added</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : wallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <WalletIcon className="h-8 w-8 text-gray-400" />
                    <p>No wallets found. Add your first wallet to get started.</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsAddingWallet(true)}>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Wallet
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedWallets.map((wallet: Wallet) => (
                <TableRow
                  key={wallet.id}
                  className="animate-in fade-in-50 slide-in-from-left-5 group hover:bg-gray-50/50"
                >
                  <TableCell className="font-medium">{wallet.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                        {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(wallet.address)
                          toast.success('Copied successfully.')
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ClipboardIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      {wallet.network.slice(0, 1).toUpperCase() + wallet.network.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'gap-2 font-normal',
                            wallet.active ? 'text-green-600 hover:text-green-700' : 'text-gray-600 hover:text-gray-700',
                          )}
                        >
                          <span
                            className={cn('h-2 w-2 rounded-full', wallet.active ? 'bg-green-500' : 'bg-gray-400')}
                          />
                          {wallet.active ? 'Active' : 'Inactive'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => {
                            toast.promise(
                              updateStatusMutation.mutateAsync({
                                id: wallet.id,
                                active: true,
                              }),
                              {
                                loading: 'Activating wallet...',
                                success: 'Wallet activated',
                                error: 'Failed to activate wallet',
                              },
                            )
                          }}
                          disabled={wallet.active}
                          className="text-green-600"
                        >
                          <CheckCircleIcon className="mr-2 h-4 w-4" />
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            toast.promise(
                              updateStatusMutation.mutateAsync({
                                id: wallet.id,
                                active: false,
                              }),
                              {
                                loading: 'Deactivating wallet...',
                                success: 'Wallet deactivated',
                                error: 'Failed to deactivate wallet',
                              },
                            )
                          }}
                          disabled={!wallet.active}
                          className="text-gray-600"
                        >
                          <ExclamationCircleIcon className="mr-2 h-4 w-4" />
                          Inactive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-gray-500">{format(new Date(wallet.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDeletingWallet(wallet.id)}
                        disabled={deleteWalletMutation.isPending}
                      >
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <PaginationControls />
      </motion.div>
    </div>
  )
}

// Temporary data for demonstration
const wallets: Wallet[] = [
  {
    id: '1',
    name: 'Main Wallet',
    address: '8xyt4JxS6zE1GRvHCAQeRqm2e9Hk9X3CzrUH8ARGnGH3',
    balance: 12.5,
    network: 'solana',
    status: 'active',
    active: true,
    createdAt: new Date('2024-01-15'),
  },
  // Add more sample wallets as needed
]
