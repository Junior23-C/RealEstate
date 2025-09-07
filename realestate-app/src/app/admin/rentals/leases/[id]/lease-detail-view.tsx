"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  ArrowLeft,
  Home,
  User,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Edit,
  CheckCircle,
  Clock,
  FileText,
  Upload,
  Download,
  Trash2,
  Eye
} from "lucide-react"
import { toast } from "sonner"

interface LeaseDetailViewProps {
  lease: {
    id: string
    startDate: Date
    endDate: Date
    monthlyRent: number
    securityDeposit: number
    status: string
    property: {
      id: string
      title: string
      address: string
      city: string
      state: string
      zipCode: string
      bedrooms: number
      bathrooms: number
      squareFeet: number
      images: Array<{
        id: string
        url: string
        alt?: string | null
        isPrimary: boolean
      }>
    }
    tenant: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
    }
    payments: Array<{
      id: string
      amount: number
      dueDate: Date
      paidDate: Date | null
      status: string
      type: string
      paymentMethod?: string | null
      notes?: string | null
    }>
    leaseDocuments: Array<{
      id: string
      filename: string
      originalName: string
      fileSize: number
      mimeType: string
      url: string
      type: string
      description?: string | null
      uploadedBy: string
      createdAt: Date
      updatedAt: Date
    }>
  }
}

export function LeaseDetailView({ lease }: LeaseDetailViewProps) {
  const router = useRouter()
  const [markingPayment, setMarkingPayment] = useState<string | null>(null)
  const [isUploadingDocument, setIsUploadingDocument] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [documentDescription, setDocumentDescription] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB')
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'LATE':
        return 'destructive'
      case 'PARTIAL':
        return 'secondary'
      case 'CANCELLED':
        return 'outline'
      default:
        return 'outline'
    }
  }


  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const isOverdue = (payment: { dueDate: Date, status: string }) => {
    return payment.status === 'PENDING' && getDaysUntilDue(payment.dueDate) < 0
  }

  const markPaymentAsPaid = async (paymentId: string) => {
    setMarkingPayment(paymentId)
    try {
      const response = await fetch(`/api/rentals/payments/${paymentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "PAID",
          paidDate: new Date().toISOString(),
          paymentMethod: "CASH"
        })
      })

      if (response.ok) {
        toast.success("Pagesa u shënua si e paguar me sukses")
        router.refresh()
      } else {
        const errorData = await response.text()
        toast.error(`Dështoi shënimi i pagesës si e paguar: ${errorData}`)
      }
    } catch {
      toast.error("Ndodhi një gabim gjatë shënimit të pagesës")
    } finally {
      setMarkingPayment(null)
    }
  }

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!selectedDocumentType) {
      toast.error("Ju lutemi zgjidhni llojin e dokumentit")
      return
    }

    setIsUploadingDocument(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', selectedDocumentType)
      formData.append('description', documentDescription)
      formData.append('leaseId', lease.id)

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        toast.success("Dokumenti u ngarkua me sukses")
        setDocumentDescription('')
        setSelectedDocumentType('')
        router.refresh()
      } else {
        const errorData = await response.text()
        toast.error(`Dështoi ngarkimi i dokumentit: ${errorData}`)
      }
    } catch {
      toast.error("Ndodhi një gabim gjatë ngarkimit të dokumentit")
    } finally {
      setIsUploadingDocument(false)
      // Reset the file input
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const handleDocumentDelete = async (documentId: string, filename: string) => {
    if (!confirm(`A jeni të sigurt që doni të fshini dokumentin "${filename}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success("Dokumenti u fshi me sukses")
        router.refresh()
      } else {
        const errorData = await response.text()
        toast.error(`Dështoi fshirja e dokumentit: ${errorData}`)
      }
    } catch {
      toast.error("Ndodhi një gabim gjatë fshirjes së dokumentit")
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'LEASE_AGREEMENT': 'Kontrata e Qirasë',
      'TENANT_ID': 'ID e Qiramarrësit',
      'INCOME_PROOF': 'Dëshmi Të Ardhurash',
      'REFERENCE_LETTER': 'Letër Rekomandimi',
      'INVENTORY_CHECKLIST': 'Lista e Inventarit',
      'INSPECTION_REPORT': 'Raporti i Inspektimit',
      'INSURANCE_DOCUMENT': 'Dokument Sigurie',
      'UTILITY_BILL': 'Fatura Utilities',
      'BANK_STATEMENT': 'Deklarata Bankare',
      'MAINTENANCE_RECORD': 'Regjistri i Mirëmbajtjes',
      'RENEWAL_DOCUMENT': 'Dokument Rinovimi',
      'TERMINATION_NOTICE': 'Njoftim Përfundimi',
      'OTHER': 'Tjetër'
    }
    return labels[type] || type
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const primaryImage = lease.property.images.find(img => img.isPrimary) || lease.property.images[0]
  const daysUntilExpiry = Math.ceil((new Date(lease.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detajet e Kontratës</h1>
            <p className="text-muted-foreground">
              Kontrata për {lease.property.title}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/rentals/leases/${lease.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Ndrysho
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qiraja Mujore</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(lease.monthlyRent)}</div>
            <p className="text-xs text-muted-foreground">
              Depozita: {formatCurrency(lease.securityDeposit)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Periudha e Kontratës</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.ceil((new Date(lease.endDate).getTime() - new Date(lease.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} muaj
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditë të Mbetura</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${daysUntilExpiry <= 30 ? 'text-orange-600' : ''}`}>
              {daysUntilExpiry > 0 ? daysUntilExpiry : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {daysUntilExpiry <= 0 ? 'Kontrata ka skaduar' : 'ditë deri në skadim'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statusi</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={lease.status === 'ACTIVE' ? 'default' : 'secondary'}>
                {lease.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Statusi i kontratës
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Detajet e Pronës
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {primaryImage && (
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src={primaryImage.url}
                  alt={lease.property.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{lease.property.title}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{lease.property.address}, {lease.property.city}, {lease.property.state} {lease.property.zipCode}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold">{lease.property.bedrooms}</p>
                <p className="text-sm text-muted-foreground">Dhoma</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{lease.property.bathrooms}</p>
                <p className="text-sm text-muted-foreground">Banjo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{lease.property.squareFeet}</p>
                <p className="text-sm text-muted-foreground">m²</p>
              </div>
            </div>
            <hr className="my-4" />
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/admin/properties/${lease.property.id}/edit`}>
                Shiko Pronën
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Tenant Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Detajet e Qiramarrësit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {lease.tenant.firstName} {lease.tenant.lastName}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${lease.tenant.email}`} className="text-blue-600 hover:underline">
                  {lease.tenant.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${lease.tenant.phone}`} className="text-blue-600 hover:underline">
                  {lease.tenant.phone}
                </a>
              </div>
            </div>
            <hr className="my-4" />
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/admin/rentals/tenants/${lease.tenant.id}`}>
                Shiko Qiramarrësin
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historiku i Pagesave</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shuma</TableHead>
                  <TableHead>Data e Skadimit</TableHead>
                  <TableHead>Data e Pagesës</TableHead>
                  <TableHead>Statusi</TableHead>
                  <TableHead>Lloji</TableHead>
                  <TableHead>Metoda</TableHead>
                  <TableHead>Veprime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lease.payments.map((payment) => {
                  const daysUntil = getDaysUntilDue(payment.dueDate)
                  const overdue = isOverdue(payment)
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{formatDate(payment.dueDate)}</p>
                          {payment.status === 'PENDING' && (
                            <p className={`text-sm ${
                              overdue ? 'text-red-600' : 
                              daysUntil <= 3 ? 'text-orange-600' : 'text-muted-foreground'
                            }`}>
                              {daysUntil === 0 ? 'Skadon sot' : 
                               daysUntil === 1 ? 'Skadon nesër' :
                               daysUntil > 0 ? `${daysUntil} ditë` :
                               `${Math.abs(daysUntil)} ditë vonuar`}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.paidDate ? formatDate(payment.paidDate) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={overdue ? 'destructive' : getPaymentStatusColor(payment.status)}>
                          {overdue ? 'LATE' : payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell>{payment.paymentMethod || '-'}</TableCell>
                      <TableCell>
                        {(payment.status === 'PENDING' || overdue) ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markPaymentAsPaid(payment.id)}
                            disabled={markingPayment === payment.id}
                          >
                            {markingPayment === payment.id ? "Duke shënuar..." : "Shëno si Paguar"}
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Paguar</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {lease.payments.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                Asnjë pagesë nuk u gjet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dokumentet e Kontratës
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Lloji i Dokumentit</Label>
                  <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zgjidhni llojin e dokumentit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEASE_AGREEMENT">Kontrata e Qirasë</SelectItem>
                      <SelectItem value="TENANT_ID">ID e Qiramarrësit</SelectItem>
                      <SelectItem value="INCOME_PROOF">Dëshmi Të Ardhurash</SelectItem>
                      <SelectItem value="REFERENCE_LETTER">Letër Rekomandimi</SelectItem>
                      <SelectItem value="INVENTORY_CHECKLIST">Lista e Inventarit</SelectItem>
                      <SelectItem value="INSPECTION_REPORT">Raporti i Inspektimit</SelectItem>
                      <SelectItem value="INSURANCE_DOCUMENT">Dokument Sigurie</SelectItem>
                      <SelectItem value="UTILITY_BILL">Fatura Utilities</SelectItem>
                      <SelectItem value="BANK_STATEMENT">Deklarata Bankare</SelectItem>
                      <SelectItem value="MAINTENANCE_RECORD">Regjistri i Mirëmbajtjes</SelectItem>
                      <SelectItem value="RENEWAL_DOCUMENT">Dokument Rinovimi</SelectItem>
                      <SelectItem value="TERMINATION_NOTICE">Njoftim Përfundimi</SelectItem>
                      <SelectItem value="OTHER">Tjetër</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentFile">Zgjidhni Dokumentin</Label>
                  <Input
                    id="documentFile"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.txt,.xls,.xlsx"
                    onChange={handleDocumentUpload}
                    disabled={isUploadingDocument || !selectedDocumentType}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentDescription">Përshkrimi (Opsional)</Label>
                <Textarea
                  id="documentDescription"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="Përshkruani dokumentin..."
                  rows={2}
                />
              </div>

              {isUploadingDocument && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4 animate-pulse" />
                    Duke ngarkuar dokumentin...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents List */}
          {lease.leaseDocuments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dokumenti</TableHead>
                    <TableHead>Lloji</TableHead>
                    <TableHead>Madhësia</TableHead>
                    <TableHead>Data e Ngarkimit</TableHead>
                    <TableHead>Përshkrimi</TableHead>
                    <TableHead>Veprime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lease.leaseDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{document.originalName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getDocumentTypeLabel(document.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatFileSize(document.fileSize)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(document.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {document.description || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={document.url} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={document.url} download={document.originalName}>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDocumentDelete(document.id, document.originalName)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Asnjë dokument nuk është ngarkuar për këtë kontratë</p>
              <p className="text-sm">Zgjidhni llojin e dokumentit dhe ngarkoni dokumentin tuaj</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}