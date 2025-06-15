"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Eye, Trash2, CheckSquare2 } from "lucide-react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface InquiryManagementProps {
  inquiries: Array<{
    id: string
    name: string
    email: string
    phone?: string | null
    message: string
    status: string
    createdAt: Date
    property: {
      id: string
      title: string
      city: string
      state: string
    }
  }>
}

export function InquiryManagement({ inquiries }: InquiryManagementProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryManagementProps['inquiries'][0] | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Pyetja u fshi me sukses")
        router.refresh()
      } else {
        const errorData = await response.text()
        toast.error(`Dështoi fshirja e pyetjes: ${errorData}`)
      }
    } catch {
      toast.error("Ndodhi një gabim gjatë fshirjes së pyetjes")
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast.success("Statusi u përditësua me sukses")
        router.refresh()
      } else {
        const errorData = await response.text()
        toast.error(`Dështoi përditësimi i statusit: ${errorData}`)
      }
    } catch {
      toast.error("Ndodhi një gabim gjatë përditësimit të statusit")
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "default"
      case "CONTACTED":
        return "secondary"
      case "CLOSED":
        return "outline"
      default:
        return "default"
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(inquiries.map(i => i.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkDelete = async () => {
    setIsBulkUpdating(true)
    try {
      const response = await fetch('/api/inquiries/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      })

      if (response.ok) {
        toast.success(`${selectedIds.size} pyetje u fshinë me sukses`)
        setSelectedIds(new Set())
        router.refresh()
      } else {
        const errorData = await response.text()
        toast.error(`Dështoi fshirja e pyetjeve: ${errorData}`)
      }
    } catch {
      toast.error("Ndodhi një gabim gjatë fshirjes së pyetjeve")
    } finally {
      setIsBulkUpdating(false)
      setShowBulkDeleteDialog(false)
    }
  }

  const handleBulkStatusUpdate = async (status: string) => {
    setIsBulkUpdating(true)
    try {
      const response = await fetch('/api/inquiries/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: Array.from(selectedIds), status })
      })

      if (response.ok) {
        toast.success(`Statusi u përditësua për ${selectedIds.size} pyetje`)
        setSelectedIds(new Set())
        router.refresh()
      } else {
        const errorData = await response.text()
        toast.error(`Dështoi përditësimi i statusit: ${errorData}`)
      }
    } catch {
      toast.error("Ndodhi një gabim gjatë përditësimit të statusit")
    } finally {
      setIsBulkUpdating(false)
    }
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Të Gjitha Pyetjet ({inquiries.length})</h1>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare2 className="h-5 w-5 text-primary" />
              <span className="font-medium">{selectedIds.size} pyetje të zgjedhura</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusUpdate(e.target.value)
                  }
                }}
                disabled={isBulkUpdating}
                className="rounded border bg-background px-3 py-1.5 text-sm disabled:opacity-50"
                defaultValue=""
              >
                <option value="">Ndrysho statusin...</option>
                <option value="PENDING">Në Pritje</option>
                <option value="CONTACTED">Kontaktuar</option>
                <option value="CLOSED">Mbyllur</option>
              </select>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowBulkDeleteDialog(true)}
                disabled={isBulkUpdating}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Fshi të zgjedhurat
              </Button>
            </div>
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.size === inquiries.length && inquiries.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Emri</TableHead>
                    <TableHead>Kontakti</TableHead>
                    <TableHead>Prona</TableHead>
                    <TableHead>Mesazhi</TableHead>
                    <TableHead>Statusi</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Veprime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(inquiry.id)}
                          onCheckedChange={(checked) => handleSelectOne(inquiry.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {inquiry.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="text-sm">{inquiry.email}</span>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span className="text-sm">{inquiry.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link 
                          href={`https://aliaj-re.com/properties/${inquiry.property.id}`}
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          {inquiry.property.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          {inquiry.property.city}, {inquiry.property.state}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">
                          {inquiry.message}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="h-auto p-0 text-primary"
                        >
                          Lexo më shumë
                        </Button>
                      </TableCell>
                      <TableCell>
                        <select
                          value={inquiry.status}
                          onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                          disabled={isUpdating}
                          className="rounded border bg-background px-2 py-1 text-sm disabled:opacity-50"
                        >
                          <option value="PENDING">Në Pritje</option>
                          <option value="CONTACTED">Kontaktuar</option>
                          <option value="CLOSED">Mbyllur</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedInquiry(inquiry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingId(inquiry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detajet e Pyetjes</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Informacioni i Kontaktit</h4>
                  <p>{selectedInquiry.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedInquiry.email}</p>
                  {selectedInquiry.phone && (
                    <p className="text-sm text-muted-foreground">{selectedInquiry.phone}</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Prona</h4>
                  <Link 
                    href={`https://aliaj-re.com/properties/${selectedInquiry.property.id}`}
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    {selectedInquiry.property.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {selectedInquiry.property.city}, {selectedInquiry.property.state}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Mesazhi</h4>
                <p className="text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
              <div>
                <h4 className="font-medium">Statusi & Data</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(selectedInquiry.status)}>
                    {selectedInquiry.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Jeni të sigurt?</AlertDialogTitle>
            <AlertDialogDescription>
              Ky veprim nuk mund të zhbëhet. Kjo do të fshijë përgjithmonë pyetjen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anullo</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingId && handleDelete(deletingId)}
              disabled={isDeleting}
            >
              {isDeleting ? "Duke fshirë..." : "Fshi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmo fshirjen në grup</AlertDialogTitle>
            <AlertDialogDescription>
              Jeni gati të fshini {selectedIds.size} pyetje? Ky veprim nuk mund të zhbëhet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anullo</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              disabled={isBulkUpdating}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isBulkUpdating ? "Duke fshirë..." : `Fshi ${selectedIds.size} pyetje`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}