"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, TrendingDown, DollarSign, Building2, Mail,
  Eye, Target, Activity
} from 'lucide-react'

interface AnalyticsData {
  inquiriesTrend: Array<{ date: string; count: number }>
  propertiesByType: Array<{ type: string; count: number; value: number }>
  performanceMetrics: {
    totalViews: number
    conversionRate: number
    averagePrice: number
    responseTime: number
  }
}

interface AnalyticsDashboardProps {
  initialData?: AnalyticsData
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export function AnalyticsDashboard({ initialData }: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [animationKey, setAnimationKey] = useState(0)
  const [data, setData] = useState<AnalyticsData | null>(initialData || null)
  const [, setLoading] = useState(false)

  const fetchAnalytics = async (period: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(selectedPeriod)
    setAnimationKey(prev => prev + 1)
  }, [selectedPeriod])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500 dark:text-slate-400">
          Loading analytics...
        </div>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Shikime Totale',
      value: data.performanceMetrics.totalViews.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'blue'
    },
    {
      title: 'Norma e Konvertimit',
      value: `${data.performanceMetrics.conversionRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Çmimi Mesatar',
      value: `€${data.performanceMetrics.averagePrice.toLocaleString()}`,
      change: '+8.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      title: 'Koha e Përgjigjes',
      value: `${data.performanceMetrics.responseTime}h`,
      change: '-15%',
      trend: 'down',
      icon: Activity,
      color: 'purple'
    }
  ]


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analitika</h2>
        
        {/* Period Selector */}
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={`${metric.title}-${animationKey}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                <metric.icon className={`h-5 w-5 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
              
              <div className={`flex items-center gap-1 text-sm ${
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
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiries Trend */}
        <motion.div
          key={`inquiries-${animationKey}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/20"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Tendenca e Pyetjeve
          </h3>
          
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
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  fillOpacity={1}
                  fill="url(#colorInquiries)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Asnjë të dhënë për pyetjet</p>
                <p className="text-sm mt-1">Të dhënat do të shfaqen kur të ketë pyetje të reja</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Properties by Type */}
        <motion.div
          key={`properties-${animationKey}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/20"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Pronat sipas Llojit
          </h3>
          
          {data.propertiesByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.propertiesByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, count }) => `${type}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.propertiesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} prona`, name]}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none',
                    borderRadius: '8px' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Asnjë të dhënë për pronat</p>
                <p className="text-sm mt-1">Të dhënat do të shfaqen kur të ketë prona të regjistruara</p>
              </div>
            </div>
          )}
        </motion.div>

      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-200/20 dark:border-blue-700/20"
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Përfundime të Shpejta
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">↑ 23%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Rritja e pyetjeve këtë muaj</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">€2.1M</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Vlera totale e pronave aktive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">4.2h</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Koha mesatare e përgjigjes</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}