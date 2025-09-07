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
  Clock
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

interface GlobalSearchProps {
  className?: string
}

export function GlobalSearch({ className = "" }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
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
  const containerRef = useRef<HTMLDivElement>(null)
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Open search with Ctrl+K or Cmd+K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
        return
      }

      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
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
            setIsOpen(false)
            setQuery('')
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, allResults, router])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
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
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Kërko pronat, qiramarrësit... (Ctrl+K)"
          className="pl-10 pr-4 py-2 w-80 lg:w-96 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl z-50 max-h-[70vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
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
                <div className="text-xs text-slate-400">
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">ESC</kbd> për të mbyllur
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="overflow-y-auto max-h-96">
              {results.totalResults > 0 ? (
                <div className="p-2">
                  {/* Properties */}
                  {results.properties.length > 0 && (
                    <div className="mb-4">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Building2 className="h-3 w-3" />
                        Pronat ({results.properties.length})
                      </div>
                      {results.properties.map((property, index) => {
                        const resultIndex = index
                        const Icon = getResultIcon(property.type)
                        return (
                          <Link
                            key={property.id}
                            href={property.href}
                            onClick={() => setIsOpen(false)}
                            className={`block p-3 rounded-lg transition-colors ${
                              selectedIndex === resultIndex 
                                ? 'bg-blue-50 dark:bg-blue-900/20' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {property.images?.[0] ? (
                                <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-slate-100">
                                  <Image
                                    src={property.images[0].url}
                                    alt={property.images[0].alt || property.title || ''}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-12 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                  <Icon className="h-6 w-6 text-slate-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                  {property.title}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{property.address}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={getStatusColor(property.status || '')}>
                                    {property.status}
                                  </Badge>
                                  <span className="text-sm font-medium text-green-600">
                                    {formatCurrency(property.price || 0)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}

                  {/* Tenants */}
                  {results.tenants.length > 0 && (
                    <div className="mb-4">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        Qiramarrësit ({results.tenants.length})
                      </div>
                      {results.tenants.map((tenant, index) => {
                        const resultIndex = results.properties.length + index
                        return (
                          <Link
                            key={tenant.id}
                            href={tenant.href}
                            onClick={() => setIsOpen(false)}
                            className={`block p-3 rounded-lg transition-colors ${
                              selectedIndex === resultIndex 
                                ? 'bg-blue-50 dark:bg-blue-900/20' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                                {tenant.firstName?.charAt(0)}{tenant.lastName?.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                  {tenant.firstName} {tenant.lastName}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                  {tenant.email}
                                </p>
                                {tenant.leases && tenant.leases.length > 0 && (
                                  <p className="text-xs text-slate-400 mt-1">
                                    Aktual: {tenant.leases[0].property?.title}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}

                  {/* Inquiries */}
                  {results.inquiries.length > 0 && (
                    <div className="mb-4">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" />
                        Pyetjet ({results.inquiries.length})
                      </div>
                      {results.inquiries.map((inquiry, index) => {
                        const resultIndex = results.properties.length + results.tenants.length + index
                        return (
                          <Link
                            key={inquiry.id}
                            href={inquiry.href}
                            onClick={() => setIsOpen(false)}
                            className={`block p-3 rounded-lg transition-colors ${
                              selectedIndex === resultIndex 
                                ? 'bg-blue-50 dark:bg-blue-900/20' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                  {inquiry.name}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                  Për: {inquiry.property?.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={getStatusColor(inquiry.status || '')}>
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
                  )}

                  {/* Leases */}
                  {results.leases.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        Qiratë ({results.leases.length})
                      </div>
                      {results.leases.map((lease, index) => {
                        const resultIndex = results.properties.length + results.tenants.length + results.inquiries.length + index
                        return (
                          <Link
                            key={lease.id}
                            href={lease.href}
                            onClick={() => setIsOpen(false)}
                            className={`block p-3 rounded-lg transition-colors ${
                              selectedIndex === resultIndex 
                                ? 'bg-blue-50 dark:bg-blue-900/20' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                  {lease.leaseNumber}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {lease.tenant?.firstName} {lease.tenant?.lastName}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={getStatusColor(lease.status || '')}>
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
                  )}
                </div>
              ) : query && !isLoading ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Asnjë rezultat për &quot;{query}&quot;</p>
                  <p className="text-xs mt-1">Provoni me fjalë kyçe të ndryshme</p>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Filloni të shkruani për të kërkuar</p>
                  <div className="flex items-center justify-center gap-2 mt-2 text-xs">
                    <span>Përdorni</span>
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">Ctrl+K</kbd>
                    <span>për hapje të shpejtë</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {results.totalResults > 0 && (
              <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-400 text-center">
                Përdorni ↑↓ për të naviguar • Enter për të hapur • ESC për të mbyllur
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}