"use client"

import Link from "next/link"
import { 
  Building2, Home, Plus, Mail, DollarSign, 
  TrendingUp, Clock, MapPin, BarChart3,
  ArrowUpRight, Activity
} from "lucide-react"
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
  const statsData = [
    { 
      label: 'Prona Gjithsej', 
      value: stats.totalProperties, 
      change: '+12%', 
      icon: Building2, 
      color: 'from-blue-500 to-cyan-500',
      description: `${stats.forRent} për qira • ${stats.forSale} për shitje`
    },
    { 
      label: 'Pyetje të Reja', 
      value: stats.totalInquiries, 
      change: '+8%', 
      icon: Mail, 
      color: 'from-purple-500 to-pink-500',
      description: 'Nga klientët e interesuar'
    },
    { 
      label: 'Të Hyrat Mujore', 
      value: '€45,280', 
      change: '+23%', 
      icon: DollarSign, 
      color: 'from-green-500 to-emerald-500',
      description: 'Rritje nga muaji i kaluar'
    },
    { 
      label: 'Norma e Zënies', 
      value: '92%', 
      change: '+5%', 
      icon: Activity, 
      color: 'from-orange-500 to-red-500',
      description: 'Pronat e zëna'
    }
  ]

  const quickActions = [
    { label: 'Shto Pronë', icon: Plus, href: '/admin/properties/new', color: 'blue' },
    { label: 'Shiko Pyetjet', icon: Mail, href: '/admin/inquiries', color: 'purple' },
    { label: 'Menaxho Qiratë', icon: DollarSign, href: '/admin/rentals', color: 'green' },
    { label: 'Raporte', icon: BarChart3, href: '/admin/rentals', color: 'orange' }
  ]

  return (
    <div>
      {/* Page Header */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
          Mirë se vini përsëri!
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Ja një përmbledhje e aktivitetit tuaj të fundit
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6 shadow-lg"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-16 translate-x-16`} />
            
            <div className="relative">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-4">
                {stat.label}
              </h3>
              
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stat.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Veprime të Shpejta</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={action.href}>
                <div className={`p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 hover:shadow-xl transition-all cursor-pointer`}>
                  <div className={`inline-flex p-3 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 mb-3`}>
                    <action.icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                  </div>
                  <p className="font-medium text-sm">{action.label}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <div className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Aktiviteti i Pronave</h2>
            <Link href="/admin/properties" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Shiko të gjitha
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Vila Bregdetare</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Durrës, Plazh
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">€1,200/muaj</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  E Zënë
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Apartament 2+1</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Tiranë, Blloku
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">€85,000</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  Për Shitje
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6">
          <h2 className="text-lg font-semibold mb-6">Aktiviteti i Fundit</h2>
          
          <div className="space-y-4">
            {recentInquiries.length > 0 ? (
              recentInquiries.slice(0, 5).map((inquiry, index) => (
                <motion.div
                  key={inquiry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium">{inquiry.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Për: {inquiry.property.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {new Date(inquiry.createdAt).toLocaleDateString('sq-AL')}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Asnjë aktivitet ende</p>
              </div>
            )}
          </div>

          {recentInquiries.length > 0 && (
            <Link href="/admin/inquiries" className="block w-full mt-6 py-2 text-sm font-medium text-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              Shiko të Gjitha Pyetjet
            </Link>
          )}
        </div>
      </div>

      {/* Test Telegram Component */}
      <div className="mt-8">
        <TestTelegram />
      </div>

    </div>
  )
}