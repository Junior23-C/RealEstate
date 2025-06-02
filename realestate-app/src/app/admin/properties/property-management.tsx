"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Building2, Plus, Edit, Trash2, Eye, Mail, MapPin, 
  BedDouble, Bath, Square, Search, Grid, List
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PropertyManagementProps {
  properties: Array<{
    id: string
    title: string
    city: string
    state: string
    type: string
    status: string
    price: number
    bedrooms?: number
    bathrooms?: number
    squareFeet?: number
    createdAt: Date
    images: Array<{
      id: string
      url: string
      alt?: string | null
      isPrimary: boolean
    }>
    _count: {
      inquiries: number
    }
  }>
}

export function PropertyManagement({ properties }: PropertyManagementProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Dështoi fshirja e pronës")
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      alert("Dështoi fshirja e pronës")
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sq-AL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      FOR_RENT: { label: 'Për Qira', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      FOR_SALE: { label: 'Për Shitje', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      RENTED: { label: 'E Dhënë me Qira', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
      SOLD: { label: 'E Shitur', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' }
    }
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-100 text-gray-700' }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    )
  }

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      APARTMENT: 'Apartament',
      HOUSE: 'Shtëpi',
      VILLA: 'Vilë',
      LAND: 'Tokë',
      COMMERCIAL: 'Komerciale',
      OFFICE: 'Zyrë'
    }
    return typeMap[type] || type
  }

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: properties.length,
    forRent: properties.filter(p => p.status === 'FOR_RENT').length,
    forSale: properties.filter(p => p.status === 'FOR_SALE').length,
    rented: properties.filter(p => p.status === 'RENTED').length,
    sold: properties.filter(p => p.status === 'SOLD').length,
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Menaxhimi i Pronave</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Menaxhoni dhe përditësoni pronat e listuara
          </p>
        </div>
        
        <Link href="/admin/properties/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25"
          >
            <Plus className="h-4 w-4" />
            Shto Pronë të Re
          </motion.button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-4"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-blue-50 dark:bg-blue-900/20 backdrop-blur-xl rounded-xl border border-blue-200/20 dark:border-blue-700/20 p-4"
        >
          <p className="text-sm text-blue-600 dark:text-blue-400">Për Qira</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{stats.forRent}</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-green-50 dark:bg-green-900/20 backdrop-blur-xl rounded-xl border border-green-200/20 dark:border-green-700/20 p-4"
        >
          <p className="text-sm text-green-600 dark:text-green-400">Për Shitje</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">{stats.forSale}</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-purple-50 dark:bg-purple-900/20 backdrop-blur-xl rounded-xl border border-purple-200/20 dark:border-purple-700/20 p-4"
        >
          <p className="text-sm text-purple-600 dark:text-purple-400">Të Dhëna</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">{stats.rented}</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-orange-50 dark:bg-orange-900/20 backdrop-blur-xl rounded-xl border border-orange-200/20 dark:border-orange-700/20 p-4"
        >
          <p className="text-sm text-orange-600 dark:text-orange-400">Të Shitura</p>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-1">{stats.sold}</p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Kërko sipas emrit ose qytetit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Të Gjitha Statuset</option>
            <option value="FOR_RENT">Për Qira</option>
            <option value="FOR_SALE">Për Shitje</option>
            <option value="RENTED">E Dhënë me Qira</option>
            <option value="SOLD">E Shitur</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => {
            const primaryImage = property.images.find(img => img.isPrimary) || property.images[0]
            
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt || property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Building2 className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(property.status)}
                  </div>
                  
                  {/* Inquiry Count */}
                  {property._count.inquiries > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {property._count.inquiries}
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-3">
                    <MapPin className="h-3 w-3" />
                    {property.city}, {property.state}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(property.price)}
                      {property.status === 'FOR_RENT' && <span className="text-sm font-normal">/muaj</span>}
                    </p>
                    
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                      {getTypeLabel(property.type)}
                    </span>
                  </div>

                  {/* Property Features */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        {property.bedrooms}
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {property.bathrooms}
                      </div>
                    )}
                    {property.squareFeet && (
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        {property.squareFeet}m²
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/properties/${property.id}`} className="flex-1">
                      <button className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                        <Eye className="h-4 w-4" />
                        Shiko
                      </button>
                    </Link>
                    
                    <Link href={`/admin/properties/${property.id}/edit`} className="flex-1">
                      <button className="w-full px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                        <Edit className="h-4 w-4" />
                        Ndrysho
                      </button>
                    </Link>
                    
                    <button
                      onClick={() => setDeletingId(property.id)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Pronë</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Vendndodhja</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Tipi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Çmimi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Statusi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Pyetje</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-700 dark:text-slate-300">Veprime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                          {property.images[0] ? (
                            <Image
                              src={property.images[0].url}
                              alt={property.title}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Building2 className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{property.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {property.city}, {property.state}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getTypeLabel(property.type)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(property.price)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="px-4 py-3">
                      {property._count.inquiries > 0 && (
                        <span className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                          <Mail className="h-4 w-4" />
                          {property._count.inquiries}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/properties/${property.id}`}>
                          <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/admin/properties/${property.id}/edit`}>
                          <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-blue-600 dark:text-blue-400">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeletingId(property.id)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">Asnjë pronë nuk u gjet</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Jeni të sigurt?</AlertDialogTitle>
            <AlertDialogDescription>
              Ky veprim nuk mund të kthehet mbrapsht. Kjo do të fshijë përgjithmonë pronën 
              dhe të gjitha të dhënat e lidhura me të.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulo</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Fshi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}