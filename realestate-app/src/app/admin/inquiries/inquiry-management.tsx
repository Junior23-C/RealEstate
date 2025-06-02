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
import { ArrowLeft, Mail, Phone, Eye, Trash2 } from "lucide-react"
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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Dështoi fshirja e pyetjes")
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error)
      alert("Dështoi fshirja e pyetjes")
    } finally {
      setDeletingId(null)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Dështoi përditësimi i statusit të pyetjes")
      }
    } catch (error) {
      console.error("Error updating inquiry:", error)
      alert("Dështoi përditësimi i statusit të pyetjes")
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

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/admin" className="flex items-center space-x-2 mr-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Kthehu në Panel</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Mail className="h-6 w-6" />
            <span className="font-bold">Menaxhimi i Pyetjeve</span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Të Gjitha Pyetjet ({inquiries.length})</h1>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
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
                          className="rounded border bg-background px-2 py-1 text-sm"
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
      </div>

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
            <AlertDialogAction onClick={() => deletingId && handleDelete(deletingId)}>
              Fshi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}