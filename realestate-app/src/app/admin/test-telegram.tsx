"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TestTelegram() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const testTelegram = async () => {
    setTesting(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-notifications', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResult('✅ Sukses! Kontrolloni Telegram-in tuaj për mesazhin e testit.')
      } else {
        setResult('❌ Gabim: ' + data.error)
      }
    } catch (error) {
      setResult('❌ Gabim në dërgimin e testit: ' + error)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🤖 Testo Njoftimet e Telegram</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Klikoni butonin më poshtë për të testuar nëse njoftimet e Telegram funksionojnë.
        </p>
        
        <Button 
          onClick={testTelegram} 
          disabled={testing}
          className="w-full"
        >
          {testing ? 'Duke dërguar...' : '📱 Dërgo Test në Telegram'}
        </Button>
        
        {result && (
          <div className={`p-3 rounded-md text-sm ${
            result.includes('✅') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {result}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Nëse nuk funksionon:</strong></p>
          <p>1. Kontrolloni që të keni dërguar një mesazh në bot</p>
          <p>2. Verifikoni Bot Token dhe Chat ID në Vercel</p>
          <p>3. Sigurohuni që projekti është ri-deployuar</p>
        </div>
      </CardContent>
    </Card>
  )
}