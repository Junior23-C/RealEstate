"use client"

import { memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Building2, Edit, Trash2, Eye } from "lucide-react"

interface PropertyCardProps {
  property: {
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
    images: Array<{
      id: string
      url: string
      alt?: string | null
      isPrimary: boolean
    }>
    _count: {
      inquiries: number
    }
  }
  onDelete: (id: string) => void
}

// Memoized property card component
export const PropertyCard = memo(function PropertyCard({ property, onDelete }: PropertyCardProps) {
  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0]
  
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
      FOR_RENT: { label: 'Për Qira', color: 'bg-blue-100 text-blue-700' },
      FOR_SALE: { label: 'Për Shitje', color: 'bg-green-100 text-green-700' },
      RENTED: { label: 'E Dhënë me Qira', color: 'bg-purple-100 text-purple-700' },
      SOLD: { label: 'E Shitur', color: 'bg-orange-100 text-orange-700' }
    }
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-100 text-gray-700' }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    )
  }

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 overflow-hidden hover:shadow-xl transition-all">
      {/* Property Image - Optimized */}
      <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || property.title}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {property._count.inquiries}
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{property.title}</h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 truncate">
          {property.city}, {property.state}
        </p>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(property.price)}
            {property.status === 'FOR_RENT' && <span className="text-sm font-normal">/muaj</span>}
          </p>
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
            onClick={() => onDelete(property.id)}
            className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
})