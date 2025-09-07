'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react"

export default function SeedDataClient() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const seedAnalyticsData = async () => {
    setIsSeeding(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/admin/seed-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to seed data')
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message)
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Seed Analytics Data</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Populate your database with sample analytics data for testing the analytics dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Analytics Data Seeding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This will create sample data including inquiries, page views, property views, user sessions, 
            search queries, and analytics events to populate your analytics dashboard.
          </p>

          <Button 
            onClick={seedAnalyticsData}
            disabled={isSeeding}
            className="w-full"
          >
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Data...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Seed Analytics Data
              </>
            )}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Success!</span>
              </div>
              <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                {result.message}
              </p>
              <div className="text-sm text-green-600 dark:text-green-400 space-y-1">
                <div>📧 Inquiries: {result.results?.inquiries || 0}</div>
                <div>📄 Page Views: {result.results?.pageViews || 0}</div>
                <div>🏠 Property Views: {result.results?.propertyViews || 0}</div>
                <div>👥 User Sessions: {result.results?.userSessions || 0}</div>
                <div>🔍 Search Queries: {result.results?.searchQueries || 0}</div>
                <div>📊 Analytics Events: {result.results?.analyticsEvents || 0}</div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                You can now visit the Analytics page to see the data.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm">
                {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}