// Optimized Server-Side Admin Dashboard (No Client-Side JS)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"

interface OptimizedAdminDashboardProps {
  stats: {
    totalProperties: number
    totalInquiries: number
    forRent: number
    forSale: number
  }
  recentInquiries: Array<{
    id: string
    name: string
    email: string
    createdAt: Date
    property: {
      id: string
      title: string
    } | null
  }>
}

// Pure server component - no client-side JavaScript
export function OptimizedAdminDashboard({ stats, recentInquiries }: OptimizedAdminDashboardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sq-AL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const dashboardCards = [
    {
      title: "Totali i Pronave",
      value: stats.totalProperties,
      icon: Building2,
      description: `${stats.forRent} me qira, ${stats.forSale} për shitje`,
      href: "/admin/properties",
      color: "text-blue-600"
    },
    {
      title: "Pyetjet",
      value: stats.totalInquiries,
      icon: MessageSquare,
      description: "Pyetje të reja nga klientët",
      href: "/admin/inquiries",
      color: "text-green-600"
    },
    {
      title: "Qiratë Aktive",
      value: stats.forRent,
      icon: Users,
      description: "Prona që jepen me qira",
      href: "/admin/properties?status=FOR_RENT",
      color: "text-orange-600"
    },
    {
      title: "Performanca",
      value: "98%",
      icon: TrendingUp,
      description: "Shpejtësia e sistemit",
      href: "/admin/settings",
      color: "text-purple-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Paneli i Adminit</h1>
        <p className="text-muted-foreground">
          Mirë se vini në panelin e administrimit të Aliaj Real Estate
        </p>
      </div>

      {/* Stats Grid - Optimized for SSR */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <Link key={index} href={card.href}>
            <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries - Server Rendered */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pyetjet e Fundit</CardTitle>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nuk ka pyetje të reja
              </p>
            ) : (
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {inquiry.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.email}
                      </p>
                      {inquiry.property && (
                        <p className="text-xs text-muted-foreground">
                          Prona: {inquiry.property.title}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(inquiry.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - Server Rendered */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Veprime të Shpejta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link 
              href="/admin/properties/new"
              className="block w-full p-3 text-left rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition-colors"
            >
              <div className="font-medium">Shto Pronë të Re</div>
              <div className="text-sm text-muted-foreground">
                Krijoni një listim të ri prone
              </div>
            </Link>
            
            <Link 
              href="/admin/inquiries"
              className="block w-full p-3 text-left rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition-colors"
            >
              <div className="font-medium">Shiko Pyetjet</div>
              <div className="text-sm text-muted-foreground">
                Menaxhoni pyetjet e klientëve
              </div>
            </Link>

            <Link 
              href="/admin/settings"
              className="block w-full p-3 text-left rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition-colors"
            >
              <div className="font-medium">Cilësimet</div>
              <div className="text-sm text-muted-foreground">
                Konfiguroni aplikacionin
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System Status - Server Rendered */}
      <Card>
        <CardHeader>
          <CardTitle>Statusi i Sistemit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Sistemi funksionon normalisht</span>
            </div>
            <Badge variant="secondary">Online</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}