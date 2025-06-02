"use client"

import { useMemo, useState, useCallback } from "react"
import { FixedSizeList as List } from "react-window"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface VirtualTableProps<T> {
  data: T[]
  columns: Array<{
    key: string
    header: string
    render: (item: T) => React.ReactNode
    width?: number
  }>
  rowHeight?: number
  height?: number
  searchFields?: string[]
  itemKey: (item: T) => string
}

interface RowProps<T> {
  index: number
  style: React.CSSProperties
  data: {
    items: T[]
    columns: Array<{
      key: string
      header: string
      render: (item: T) => React.ReactNode
      width?: number
    }>
  }
}

function Row<T>({ index, style, data }: RowProps<T>) {
  const item = data.items[index]
  
  return (
    <div style={style} className="flex border-b">
      {data.columns.map((column) => (
        <div
          key={column.key}
          className="flex-1 px-4 py-2 flex items-center"
          style={{ width: column.width || 'auto', minWidth: column.width || 150 }}
        >
          {column.render(item)}
        </div>
      ))}
    </div>
  )
}

export function VirtualTable<T>({
  data,
  columns,
  rowHeight = 60,
  height = 600,
  searchFields = [],
  itemKey
}: VirtualTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data
    
    const searchLower = searchTerm.toLowerCase()
    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = (item as any)[field]
        return value && value.toString().toLowerCase().includes(searchLower)
      })
    })
  }, [data, searchTerm, searchFields])

  // Memoized row data
  const rowData = useMemo(() => ({
    items: filteredData,
    columns
  }), [filteredData, columns])

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchFields.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      )}

      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="border-b bg-muted/50">
            <div className="flex">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex-1 px-4 py-3 font-semibold text-left"
                  style={{ width: column.width || 'auto', minWidth: column.width || 150 }}
                >
                  {column.header}
                </div>
              ))}
            </div>
          </div>

          {/* Virtual Table Body */}
          {filteredData.length > 0 ? (
            <List
              height={height}
              itemCount={filteredData.length}
              itemSize={rowHeight}
              itemData={rowData}
              itemKey={(index) => itemKey(filteredData[index])}
            >
              {Row}
            </List>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? "No items found matching your search" : "No data available"}
            </div>
          )}

          {/* Footer with count */}
          {filteredData.length > 0 && (
            <div className="border-t px-4 py-2 text-sm text-muted-foreground">
              Showing {filteredData.length} of {data.length} items
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Specialized virtual table for properties
export function VirtualPropertyTable({ properties }: { properties: any[] }) {
  const columns = useMemo(() => [
    {
      key: 'title',
      header: 'Property',
      width: 250,
      render: (property: any) => (
        <div className="flex items-center gap-3">
          {property.images?.[0] ? (
            <div className="relative h-12 w-16 rounded overflow-hidden flex-shrink-0">
              <img
                src={property.images[0].url}
                alt={property.title}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="h-12 w-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
              <div className="h-4 w-4 bg-muted-foreground/30 rounded" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{property.title}</p>
            <p className="text-sm text-muted-foreground truncate">
              {property.city}, {property.state}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      width: 120,
      render: (property: any) => property.type
    },
    {
      key: 'status',
      header: 'Status',
      width: 120,
      render: (property: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          property.status === 'FOR_RENT' ? 'bg-blue-100 text-blue-800' :
          property.status === 'FOR_SALE' ? 'bg-green-100 text-green-800' :
          property.status === 'RENTED' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {property.status.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'price',
      header: 'Price',
      width: 120,
      render: (property: any) => (
        <div>
          <p className="font-medium">
            ${property.price.toLocaleString()}
          </p>
          {property.status === 'FOR_RENT' && (
            <p className="text-xs text-muted-foreground">/month</p>
          )}
        </div>
      )
    },
    {
      key: 'inquiries',
      header: 'Inquiries',
      width: 100,
      render: (property: any) => property._count?.inquiries || 0
    }
  ], [])

  return (
    <VirtualTable
      data={properties}
      columns={columns}
      searchFields={['title', 'city', 'state', 'type']}
      itemKey={(property) => property.id}
      height={500}
    />
  )
}

// Specialized virtual table for tenants
export function VirtualTenantTable({ tenants }: { tenants: any[] }) {
  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'Tenant',
      width: 200,
      render: (tenant: any) => (
        <div>
          <p className="font-medium">
            {tenant.firstName} {tenant.lastName}
          </p>
          {tenant.employer && (
            <p className="text-sm text-muted-foreground">{tenant.employer}</p>
          )}
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      width: 200,
      render: (tenant: any) => (
        <div className="space-y-1">
          <p className="text-sm">{tenant.email}</p>
          <p className="text-sm text-muted-foreground">{tenant.phone}</p>
        </div>
      )
    },
    {
      key: 'property',
      header: 'Current Property',
      width: 200,
      render: (tenant: any) => {
        const activeLease = tenant.leases?.find((lease: any) => lease.status === 'ACTIVE')
        return activeLease?.property ? (
          <div>
            <p className="font-medium">{activeLease.property.title}</p>
            <p className="text-sm text-muted-foreground">
              {activeLease.property.city}, {activeLease.property.state}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground">No active lease</span>
        )
      }
    },
    {
      key: 'rent',
      header: 'Monthly Rent',
      width: 120,
      render: (tenant: any) => {
        const activeLease = tenant.leases?.find((lease: any) => lease.status === 'ACTIVE')
        return activeLease?.monthlyRent ? (
          <p className="font-medium">${activeLease.monthlyRent.toLocaleString()}</p>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      }
    }
  ], [])

  return (
    <VirtualTable
      data={tenants}
      columns={columns}
      searchFields={['firstName', 'lastName', 'email', 'phone']}
      itemKey={(tenant) => tenant.id}
      height={500}
    />
  )
}