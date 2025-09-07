'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Users, 
  Building2, 
  MessageSquare, 
  FileText,
  Loader2,
  DollarSign,
  MapPin,
  X,
  Clock,
  ArrowLeft
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'

interface SearchResult {
  id: string
  type: 'property' | 'tenant' | 'inquiry' | 'lease'
  href: string
  title?: string
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  address?: string
  city?: string
  state?: string
  price?: number
  status?: string
  leaseNumber?: string
  monthlyRent?: number
  message?: string
  createdAt?: string
  images?: Array<{ url: string; alt?: string }>
  property?: { title: string; address?: string }
  tenant?: { firstName: string; lastName: string }
  leases?: Array<{ 
    id: string;
    property?: { title: string; address?: string }
  }>
}

interface SearchResults {
  properties: SearchResult[]
  tenants: SearchResult[]
  inquiries: SearchResult[]
  leases: SearchResult[]
  totalResults: number
}

interface MobileSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({
    properties: [],
    tenants: [],
    inquiries: [],
    leases: [],
    totalResults: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const debouncedQuery = useDebounce(query, 300)

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults({ properties: [], tenants: [], inquiries: [], leases: [], totalResults: 0 })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Kërkimi dështoi')
      }
      
      const data = await response.json()
      setResults(data)
      setSelectedIndex(0)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Kërkimi dështoi. Provoni përsëri.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Effect for debounced search
  useEffect(() => {
    if (isOpen) {
      performSearch(debouncedQuery)
    }
  }, [debouncedQuery, isOpen, performSearch])

  // Get all results in a flat array for keyboard navigation
  const allResults = useMemo(() => [
    ...results.properties,
    ...results.tenants, 
    ...results.inquiries,
    ...results.leases
  ], [results])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          onClose()
          setQuery('')
          break
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1))
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          event.preventDefault()
          if (allResults[selectedIndex]) {
            router.push(allResults[selectedIndex].href)
            onClose()
            setQuery('')
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, allResults, router, onClose])

  // Reset when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults({ properties: [], tenants: [], inquiries: [], leases: [], totalResults: 0 })
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sq-AL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get result icon
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'property': return Building2
      case 'tenant': return Users
      case 'inquiry': return MessageSquare
      case 'lease': return FileText
      default: return Search
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': case 'paid': case 'for_rent': case 'for_sale':
        return 'default'
      case 'pending': case 'contacted':
        return 'secondary'
      case 'expired': case 'terminated': case 'closed': case 'late':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Mobile Search Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-4 top-4 bottom-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center p-4 border-b border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mr-3"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Kërko pronat, qiramarrësit..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-base"
                  autoComplete="off"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery('')
                      setResults({ properties: [], tenants: [], inquiries: [], leases: [], totalResults: 0 })
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Status */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              ) : (
                <Search className="h-4 w-4 text-slate-400" />
              )}
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {query ? (
                  results.totalResults > 0 ? 
                    `${results.totalResults} rezultate për &quot;${query}&quot;` :
                    `Asnjë rezultat për &quot;${query}&quot;`
                ) : 'Shkruani për të kërkuar...'}
              </span>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              {results.totalResults > 0 ? (
                <div className="p-4 space-y-6">
                  {/* Properties */}
                  {results.properties.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Pronat ({results.properties.length})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {results.properties.map((property, index) => {
                          const resultIndex = index
                          const Icon = getResultIcon(property.type)
                          return (
                            <Link
                              key={property.id}
                              href={property.href}
                              onClick={onClose}
                              className={`block p-4 rounded-xl transition-all ${
                                selectedIndex === resultIndex 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20' 
                                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                              } border border-slate-200 dark:border-slate-700`}
                            >
                              <div className="flex gap-3">
                                {property.images?.[0] ? (
                                  <div className="relative h-16 w-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                    <Image
                                      src={property.images[0].url}
                                      alt={property.images[0].alt || property.title || ''}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-16 w-20 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                    <Icon className="h-6 w-6 text-slate-400" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-900 dark:text-slate-100 truncate mb-1">
                                    {property.title}
                                  </p>
                                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-2">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{property.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={getStatusColor(property.status || '')} className="text-xs">
                                      {property.status}
                                    </Badge>
                                    <span className="text-sm font-semibold text-green-600">
                                      {formatCurrency(property.price || 0)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tenants */}
                  {results.tenants.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Qiramarrësit ({results.tenants.length})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {results.tenants.map((tenant, index) => {
                          const resultIndex = results.properties.length + index
                          return (
                            <Link
                              key={tenant.id}
                              href={tenant.href}
                              onClick={onClose}
                              className={`block p-4 rounded-xl transition-all ${
                                selectedIndex === resultIndex 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20' 
                                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                              } border border-slate-200 dark:border-slate-700`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                  {tenant.firstName?.charAt(0)}{tenant.lastName?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                                    {tenant.firstName} {tenant.lastName}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-1">
                                    {tenant.email}
                                  </p>
                                  {tenant.leases && tenant.leases.length > 0 && (
                                    <p className="text-xs text-slate-400">
                                      Aktual: {tenant.leases[0].property?.title}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Inquiries */}
                  {results.inquiries.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Pyetjet ({results.inquiries.length})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {results.inquiries.map((inquiry, index) => {
                          const resultIndex = results.properties.length + results.tenants.length + index
                          return (
                            <Link
                              key={inquiry.id}
                              href={inquiry.href}
                              onClick={onClose}
                              className={`block p-4 rounded-xl transition-all ${
                                selectedIndex === resultIndex 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20' 
                                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                              } border border-slate-200 dark:border-slate-700`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                  <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                                    {inquiry.name}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-2">
                                    Për: {inquiry.property?.title}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={getStatusColor(inquiry.status || '')} className="text-xs">
                                      {inquiry.status}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                      <Clock className="h-3 w-3" />
                                      {inquiry.createdAt && new Date(inquiry.createdAt).toLocaleDateString('sq-AL')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Leases */}
                  {results.leases.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Qiratë ({results.leases.length})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {results.leases.map((lease, index) => {
                          const resultIndex = results.properties.length + results.tenants.length + results.inquiries.length + index
                          return (
                            <Link
                              key={lease.id}
                              href={lease.href}
                              onClick={onClose}
                              className={`block p-4 rounded-xl transition-all ${
                                selectedIndex === resultIndex 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20' 
                                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                              } border border-slate-200 dark:border-slate-700`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                                    {lease.leaseNumber}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                    {lease.tenant?.firstName} {lease.tenant?.lastName}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={getStatusColor(lease.status || '')} className="text-xs">
                                      {lease.status}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-green-600">
                                      <DollarSign className="h-3 w-3" />
                                      {formatCurrency(lease.monthlyRent || 0)}/muaj
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : query && !isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Search className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-2">Asnjë rezultat për &quot;{query}&quot;</p>
                  <p className="text-sm text-slate-400">Provoni me fjalë kyçe të ndryshme</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Search className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-2">Filloni të shkruani për të kërkuar</p>
                  <p className="text-sm text-slate-400">Kërkoni në prona, qiramarrës, pyetje dhe qira</p>
                </div>
              )}
            </div>

            {/* Mobile Footer Help */}
            <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
              <p className="text-xs text-center text-slate-400">
                Përdorni ↑↓ për të naviguar • Enter për të hapur • ESC për të mbyllur
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}