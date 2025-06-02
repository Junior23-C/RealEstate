import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PropertyTableLazy } from "@/components/admin/property-table-lazy"
import { 
  Building2, 
  ArrowLeft, 
  Plus, 
  Eye
} from "lucide-react"

interface PropertyManagementOptimizedProps {
  properties: Array<{
    id: string
    title: string
    city: string
    state: string
    type: string
    status: string
    price: number
    rentedDate?: Date | null
    rentEndDate?: Date | null
    tenantName?: string | null
    tenantEmail?: string | null
    tenantPhone?: string | null
    images: Array<{
      id: string
      url: string
      alt?: string | null
      isPrimary: boolean
      propertyId: string
      createdAt: Date
    }>
    _count: {
      inquiries: number
    }
  }>
}

export function PropertyManagementOptimized({ properties }: PropertyManagementOptimizedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center">
          <Link href="/admin" className="flex items-center space-x-2 mr-6 hover:opacity-70 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg">Property Management</span>
              <p className="text-xs text-muted-foreground">View and manage listings</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              All Properties ({properties.length})
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your property listings and view details
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="https://aliaj-re.com/properties" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                View on Site
              </Link>
            </Button>
            <Button asChild className="shadow-lg">
              <Link href="/admin/properties/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Link>
            </Button>
          </div>
        </div>

        {/* Lazy-loaded table with pagination and search */}
        <PropertyTableLazy properties={properties} />
      </div>
    </div>
  )
}