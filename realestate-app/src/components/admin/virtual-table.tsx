"use client"

import { useMemo, useState, useCallback } from "react"
import { FixedSizeList as List } from "react-window"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"

interface VirtualTableColumn<T> {
  key: string
  title: string
  width: number
  render: (item: T) => React.ReactNode
}

interface VirtualTableProps<T> {
  data: T[]
  columns: VirtualTableColumn<T>[]
  height?: number
  itemHeight?: number
  searchable?: boolean
  searchFields?: (keyof T)[]
}

interface RowProps<T> {
  index: number
  style: React.CSSProperties
  data: {
    items: T[]
    columns: VirtualTableColumn<T>[]
  }
}

// Row component for virtual scrolling
function Row<T>({ index, style, data }: RowProps<T>) {
  const item = data.items[index]
  
  return (
    <div style={style} className="flex border-b hover:bg-muted/50">
      {data.columns.map((column) => (
        <div
          key={column.key}
          className="px-4 py-3 flex items-center"
          style={{ width: column.width }}
        >
          {column.render(item)}
        </div>
      ))}
    </div>
  )
}

export function VirtualTable<T extends Record<string, unknown>>({
  data,
  columns,
  height = 600,
  itemHeight = 60,
  searchable = false,
  searchFields = []
}: VirtualTableProps<T>) {
  const [search, setSearch] = useState("")

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search || !searchable) return data

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        return value && String(value).toLowerCase().includes(search.toLowerCase())
      })
    )
  }, [data, search, searchable, searchFields])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  return (
    <Card>
      <CardContent className="p-0">
        {/* Search Bar */}
        {searchable && (
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kërkoni..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex border-b bg-muted/50">
          {columns.map((column) => (
            <div
              key={column.key}
              className="px-4 py-3 font-medium"
              style={{ width: column.width }}
            >
              {column.title}
            </div>
          ))}
        </div>

        {/* Virtual List */}
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nuk u gjetën të dhëna.
          </div>
        ) : (
          <List
            height={height}
            width="100%"
            itemCount={filteredData.length}
            itemSize={itemHeight}
            itemData={{
              items: filteredData,
              columns: columns
            }}
          >
            {Row as React.ComponentType<RowProps<T>>}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

// Pre-configured virtual table for properties
interface Property extends Record<string, unknown> {
  id: string
  title: string
  price: number
  status: string
  type: string
  city: string
  images: Array<{ url: string; alt: string | null }>
}

export function VirtualPropertyTable({ properties }: { properties: Property[] }) {
  const columns: VirtualTableColumn<Property>[] = [
    {
      key: 'image',
      title: 'Foto',
      width: 80,
      render: (property) => (
        property.images[0] ? (
          <Image
            src={property.images[0].url}
            alt={property.images[0].alt || property.title}
            width={40}
            height={40}
            className="rounded object-cover"
          />
        ) : null
      )
    },
    {
      key: 'title',
      title: 'Prona',
      width: 300,
      render: (property) => (
        <div>
          <div className="font-medium">{property.title}</div>
          <div className="text-sm text-muted-foreground">{property.city}</div>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Çmimi',
      width: 150,
      render: (property) => (
        <div className="font-medium">
          {new Intl.NumberFormat('sq-AL', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
          }).format(property.price)}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Statusi',
      width: 120,
      render: (property) => {
        const statusLabels = {
          "FOR_RENT": "Me Qira",
          "FOR_SALE": "Për Shitje",
          "RENTED": "E Dhënë",
          "SOLD": "E Shitur"
        }
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-muted">
            {statusLabels[property.status as keyof typeof statusLabels] || property.status}
          </span>
        )
      }
    }
  ]

  return (
    <VirtualTable
      data={properties}
      columns={columns}
      height={500}
      itemHeight={60}
      searchable
      searchFields={['title', 'city']}
    />
  )
}