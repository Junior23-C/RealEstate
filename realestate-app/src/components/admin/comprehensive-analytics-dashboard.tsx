"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar
} from 'recharts'
import { 
  TrendingUp, TrendingDown, DollarSign, Building2, Mail, Eye, Target, Activity,
  Clock, MapPin, Search, Download, Calendar,
  Globe, FileText, CreditCard, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ComprehensiveAnalyticsData {
  inquiriesTrend: Array<{ date: string; count: number }>
  propertiesByType: Array<{ type: string; count: number; value: number }>
  performanceMetrics: {
    totalViews: number
    conversionRate: number
    averagePrice: number
    responseTime: number
  }
  advancedMetrics: {
    uniqueVisitors: number
    totalPropertyViews: number
    averageSessionDuration: number
    bounceRate: number
    totalRevenue: number
    monthlyRecurringRevenue: number
  }
  growthMetrics: {
    inquiryGrowth: number
    revenueGrowth: number
    visitorGrowth: number
    conversionGrowth: number
  }
  locationData: Array<{ location: string; visits: number }>
  topSearches: Array<{ query: string; count: number }>
  topProperties: Array<{ propertyId: string; _count: number }>
  trafficSources: Array<{ source: string; visits: number }>
  recentActivity: Array<{ type: string; action: string; timestamp: Date; property?: string }>
  financialSummary: {
    totalRevenue: number
    overduePayments: number
    monthlyRecurringRevenue: number
    averageRentPrice: number
  }
}

interface ComprehensiveAnalyticsDashboardProps {
  initialData?: ComprehensiveAnalyticsData
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16']

export function ComprehensiveAnalyticsDashboard({ initialData }: ComprehensiveAnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [data, setData] = useState<ComprehensiveAnalyticsData | null>(initialData || null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchAnalytics = async (period: string) => {
    console.log('Fetching analytics for period:', period)
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`)
      console.log('Analytics API response status:', response.status)
      
      if (response.ok) {
        const analyticsData = await response.json()
        console.log('Analytics data received:', analyticsData ? 'Yes' : 'No', analyticsData ? Object.keys(analyticsData).length + ' properties' : 'null/undefined')
        setData(analyticsData)
      } else if (response.status === 401) {
        console.error('Authentication failed - redirecting to login')
        window.location.href = '/admin/login'
      } else {
        console.error('Failed to fetch analytics:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('Error response:', errorText)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(selectedPeriod)
  }, [selectedPeriod])

  // Initial data fetch on component mount
  useEffect(() => {
    if (!data) {
      fetchAnalytics(selectedPeriod)
    }
  }, [])

  const exportData = async (format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(`/api/admin/analytics/export?format=${format}&period=${selectedPeriod}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${selectedPeriod}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500 dark:text-slate-400">
          {loading ? 'Loading analytics...' : 'No data available'}
        </div>
      </div>
    )
  }

  // Prepare comprehensive metrics
  const coreMetrics = [
    {
      title: 'Shikime Totale',
      value: data.performanceMetrics.totalViews.toLocaleString(),
      change: `${data.growthMetrics.visitorGrowth > 0 ? '+' : ''}${data.growthMetrics.visitorGrowth}%`,
      trend: data.growthMetrics.visitorGrowth >= 0 ? 'up' : 'down',
      icon: Eye,
      color: 'blue',
      description: `${data.advancedMetrics.uniqueVisitors} vizitorë unikë`
    },
    {
      title: 'Norma e Konvertimit',
      value: `${data.performanceMetrics.conversionRate}%`,
      change: `${data.growthMetrics.conversionGrowth > 0 ? '+' : ''}${data.growthMetrics.conversionGrowth}%`,
      trend: data.growthMetrics.conversionGrowth >= 0 ? 'up' : 'down',
      icon: Target,
      color: 'green',
      description: `${data.advancedMetrics.totalPropertyViews} shikime pronash`
    },
    {
      title: 'Të Ardhurat Mujore',
      value: `€${data.financialSummary.monthlyRecurringRevenue.toLocaleString()}`,
      change: `${data.growthMetrics.revenueGrowth > 0 ? '+' : ''}${data.growthMetrics.revenueGrowth}%`,
      trend: data.growthMetrics.revenueGrowth >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'yellow',
      description: `€${Math.round(data.financialSummary.averageRentPrice).toLocaleString()} mesatar`
    },
    {
      title: 'Koha e Përgjigjes',
      value: `${data.performanceMetrics.responseTime}h`,
      change: data.performanceMetrics.responseTime < 4 ? '-15%' : '+8%',
      trend: data.performanceMetrics.responseTime < 4 ? 'down' : 'up',
      icon: Activity,
      color: 'purple',
      description: 'Përgjigje mesatare'
    }
  ]

  const advancedMetrics = [
    {
      title: 'Kohëzgjatja e Sesionit',
      value: `${Math.floor(data.advancedMetrics.averageSessionDuration / 60)}m ${data.advancedMetrics.averageSessionDuration % 60}s`,
      icon: Clock,
      color: 'indigo'
    },
    {
      title: 'Shkalla e Largimit',
      value: `${data.advancedMetrics.bounceRate}%`,
      icon: TrendingDown,
      color: 'red'
    },
    {
      title: 'Pagesa të Vonuara',
      value: data.financialSummary.overduePayments.toString(),
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      title: 'Të Ardhurat Totale',
      value: `€${data.financialSummary.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: 'green'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Analitika e Përparuar
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Raport i plotë i performancës dhe analizave
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {['7d', '30d', '90d', '1y'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                disabled={loading}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  selectedPeriod === period
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Export Buttons */}
          <Button variant="outline" size="sm" onClick={() => exportData('csv')} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportData('pdf')} disabled={loading}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Core Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coreMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-600 opacity-5 rounded-full -translate-y-16 translate-x-16`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 bg-opacity-10`}>
                  <metric.icon className={`h-6 w-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                </div>
                
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {metric.change}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {metric.title}
                </h3>
                <p className="text-2xl font-bold mb-1">{metric.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {metric.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {advancedMetrics.map((metric) => (
          <Card key={metric.title} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                  <metric.icon className={`h-4 w-4 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{metric.title}</p>
                  <p className="font-semibold">{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-fit">
          <TabsTrigger value="overview">Përmbledhje</TabsTrigger>
          <TabsTrigger value="traffic">Trafiku</TabsTrigger>
          <TabsTrigger value="properties">Pronat</TabsTrigger>
          <TabsTrigger value="financial">Financat</TabsTrigger>
          <TabsTrigger value="realtime">Kohë Reale</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inquiries Trend Chart */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Tendenca e Pyetjeve
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.inquiriesTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.inquiriesTrend}>
                      <defs>
                        <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3B82F6" 
                        fillOpacity={1}
                        fill="url(#colorInquiries)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Asnjë të dhënë për pyetjet</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Properties Distribution */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Shpërndarja e Pronave
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.propertiesByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.propertiesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, count }) => `${type}: ${count}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {data.propertiesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Asnjë të dhënë për pronat</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Burimet e Trafikut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.trafficSources.slice(0, 5).map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${COLORS[index % COLORS.length]}`} />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <span className="text-slate-600">{source.visits} vizita</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Kërkesat më të Populluara
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topSearches.slice(0, 8).map((search, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{search.query}</span>
                      <Badge variant="secondary">{search.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shpërndarja Gjeografike
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.locationData.slice(0, 8).map((location, index) => (
                  <div key={index} className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="font-semibold text-lg">{location.visits}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{location.location}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Performance Tab */}
        <TabsContent value="properties" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Pronat më të Shikuara</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topProperties.map((property, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                          #{index + 1}
                        </div>
                        <span>Prona {property.propertyId.slice(-8)}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{property._count} shikime</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Property Value Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Vlerat e Pronave</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.propertiesByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Të Ardhurat Totale</h3>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      €{data.financialSummary.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">MRR</h3>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      €{data.financialSummary.monthlyRecurringRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-700 dark:text-red-300">Pagesa të Vonuara</h3>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {data.financialSummary.overduePayments}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Aktiviteti i Fundit
                <Badge variant="secondary">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.action}</span>
                        {activity.property && (
                          <span className="text-slate-600 dark:text-slate-400"> - {activity.property}</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}