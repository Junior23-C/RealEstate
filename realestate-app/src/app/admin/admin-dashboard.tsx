"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Home, LogOut, Plus, Eye, Mail, DollarSign, User } from "lucide-react"
import { motion } from "framer-motion"
import { TestTelegram } from "./test-telegram"

interface AdminDashboardProps {
  stats: {
    totalProperties: number
    totalInquiries: number
    forRent: number
    forSale: number
  }
  recentInquiries: Array<{
    id: string
    name: string
    createdAt: Date
    property: {
      title: string
    }
  }>
}

export function AdminDashboard({ stats, recentInquiries }: AdminDashboardProps) {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg">Paneli Administrativ</span>
              <p className="text-xs text-muted-foreground">Menaxhimi i Pronave</p>
            </div>
            <span className="font-bold sm:hidden">Admin</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-semibold">
                  {(session?.user?.name || session?.user?.email || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{session?.user?.name || 'Administrator'}</p>
                <p className="text-muted-foreground text-xs">{session?.user?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="hover:bg-destructive hover:text-destructive-foreground">
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Dil</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Përmbledhje e Panelit
              </h1>
              <p className="text-muted-foreground mt-1">
                Menaxhoni portofolin tuaj të pasurive të paluajtshme
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="https://aliaj-re.com" target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Shiko Faqen</span>
                  <span className="sm:hidden">Faqja</span>
                </Link>
              </Button>
              <Button asChild className="shadow-lg">
                <Link href="/admin/properties/new">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Shto Pronë</span>
                  <span className="sm:hidden">Shto</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Prona Gjithsej</CardTitle>
                <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg">
                  <Home className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalProperties}</div>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  {stats.forRent} për qira • {stats.forSale} për shitje
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Pyetje Gjithsej</CardTitle>
                <div className="p-2 bg-green-200 dark:bg-green-800 rounded-lg">
                  <Mail className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.totalInquiries}</div>
                <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                  Nga klientët e interesuar
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Për Qira</CardTitle>
                <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-lg">
                  <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.forRent}</div>
                <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                  Qira të disponueshme
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">Për Shitje</CardTitle>
                <div className="p-2 bg-orange-200 dark:bg-orange-800 rounded-lg">
                  <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.forSale}</div>
                <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                  Prona për shitje
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Menaxhimi i Pronave</CardTitle>
                    <CardDescription>Menaxhoni listën tuaj të pronave</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
                  <Link href="/admin/properties">
                    <Eye className="h-4 w-4 mr-2" />
                    Shiko të Gjitha Pronat
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/properties/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Shto Pronë të Re
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Menaxhimi i Qirave</CardTitle>
                    <CardDescription>Ndiqni kontratat, pagesat dhe qiramarrësit</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
                  <Link href="/admin/rentals">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Paneli i Qirave
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/rentals/tenants">
                    <Eye className="h-4 w-4 mr-2" />
                    Menaxho Qiramarrësit
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                    <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Pyetjet e Fundit</CardTitle>
                    <CardDescription>Mesazhet më të fundit nga klientët potencialë</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {recentInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="p-3 bg-muted/50 rounded-lg border">
                        <div className="font-medium text-sm">{inquiry.name}</div>
                        <div className="text-muted-foreground text-xs mt-1">
                          Për: {inquiry.property.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link href="/admin/inquiries">Shiko të Gjitha Pyetjet</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Asnjë pyetje ende</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <TestTelegram />
          </div>

          {/* Navigation Links */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-xl">Navigim i Shpejtë</CardTitle>
              <CardDescription>Aksesoni të gjitha funksionet administrative</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950">
                  <Link href="https://aliaj-re.com" target="_blank">
                    <Eye className="h-5 w-5" />
                    <span className="text-xs">Shiko Faqen</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950">
                  <Link href="/admin/properties">
                    <Building2 className="h-5 w-5" />
                    <span className="text-xs">Pronat</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950">
                  <Link href="/admin/rentals">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-xs">Qiratë</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-950">
                  <Link href="/admin/inquiries">
                    <Mail className="h-5 w-5" />
                    <span className="text-xs">Pyetjet</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-slate-50 hover:border-slate-200 dark:hover:bg-slate-800">
                  <Link href="/admin/settings">
                    <User className="h-5 w-5" />
                    <span className="text-xs">Cilësimet</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}