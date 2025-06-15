"use client"

import { useState, useEffect } from "react"
import { ArrowRightLeft, Calculator, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CurrencyCalculatorProps {
  initialAmount?: number
  propertyPrice?: number
  showPropertyCalculation?: boolean
}

interface ExchangeRates {
  eurToLek: number
  lekToEur: number
  lastUpdated: string
  trend?: 'up' | 'down' | 'stable'
}

export function CurrencyCalculator({ 
  initialAmount = 0, 
  propertyPrice,
  showPropertyCalculation = false 
}: CurrencyCalculatorProps) {
  const [amount, setAmount] = useState(initialAmount)
  const [fromCurrency, setFromCurrency] = useState<'EUR' | 'LEK'>('EUR')
  const [toCurrency, setToCurrency] = useState<'EUR' | 'LEK'>('LEK')
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    eurToLek: 108.5, // Default rate - will be updated from API
    lekToEur: 0.0092,
    lastUpdated: new Date().toISOString(),
    trend: 'stable'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [convertedAmount, setConvertedAmount] = useState(0)

  // Fetch live exchange rates
  useEffect(() => {
    fetchExchangeRates()
  }, [])

  // Calculate converted amount when inputs change
  useEffect(() => {
    if (amount && exchangeRates) {
      const rate = fromCurrency === 'EUR' ? exchangeRates.eurToLek : exchangeRates.lekToEur
      setConvertedAmount(amount * rate)
    } else {
      setConvertedAmount(0)
    }
  }, [amount, fromCurrency, exchangeRates])

  const fetchExchangeRates = async () => {
    setIsLoading(true)
    try {
      // Try to fetch live rates from a free API
      const response = await fetch('/api/exchange-rates')
      if (response.ok) {
        const data = await response.json()
        setExchangeRates(data)
      } else {
        // Fallback to Bank of Albania approximate rates
        setExchangeRates({
          eurToLek: 108.5,
          lekToEur: 0.0092,
          lastUpdated: new Date().toISOString(),
          trend: 'stable'
        })
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
      // Use default rates
    } finally {
      setIsLoading(false)
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const formatCurrency = (amount: number, currency: 'EUR' | 'LEK') => {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('sq-AL', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    } else {
      return new Intl.NumberFormat('sq-AL', {
        style: 'currency',
        currency: 'ALL', // Albanian Lek
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
  }

  const calculatePropertyBreakdown = () => {
    if (!propertyPrice) return null

    const propertyInLek = propertyPrice * exchangeRates.eurToLek
    const monthlyRent = propertyPrice * 0.006 // Estimate 0.6% of value per month
    const monthlyRentLek = monthlyRent * exchangeRates.eurToLek

    return {
      propertyPrice,
      propertyPriceLek: propertyInLek,
      monthlyRent,
      monthlyRentLek,
      downPayment: propertyPrice * 0.2, // 20% down payment
      downPaymentLek: propertyInLek * 0.2
    }
  }

  const breakdown = showPropertyCalculation && propertyPrice ? calculatePropertyBreakdown() : null

  return (
    <div className="space-y-6">
      {/* Exchange Rate Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
        <div className="flex items-center gap-3">
          <Calculator className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Kalkulator Valutash</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              1 EUR = {exchangeRates.eurToLek.toFixed(2)} LEK
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {exchangeRates.trend && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {exchangeRates.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
              {exchangeRates.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
              {exchangeRates.trend}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchExchangeRates}
            disabled={isLoading}
            className="text-xs"
          >
            {isLoading ? 'Duke përditësuar...' : 'Përditëso'}
          </Button>
        </div>
      </div>

      {/* Currency Converter */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="space-y-4">
          {/* From Currency */}
          <div>
            <label className="block text-sm font-medium mb-2">Nga</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Shtyp shumën"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as 'EUR' | 'LEK')}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="EUR">EUR (€)</option>
                <option value="LEK">LEK (L)</option>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={swapCurrencies}
              className="p-2"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium mb-2">Në</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={convertedAmount.toLocaleString('sq-AL', { 
                    minimumFractionDigits: toCurrency === 'EUR' ? 2 : 0,
                    maximumFractionDigits: toCurrency === 'EUR' ? 2 : 0
                  })}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg font-semibold"
                />
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as 'EUR' | 'LEK')}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="LEK">LEK (L)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Property Price Breakdown */}
      {breakdown && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50 p-6">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Llogaritje për pronën
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">Çmimi i pronës:</span>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(breakdown.propertyPrice, 'EUR')}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {formatCurrency(breakdown.propertyPriceLek, 'LEK')}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">Kaparja (20%):</span>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(breakdown.downPayment, 'EUR')}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {formatCurrency(breakdown.downPaymentLek, 'LEK')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">Qira mujore (est.):</span>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(breakdown.monthlyRent, 'EUR')}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {formatCurrency(breakdown.monthlyRentLek, 'LEK')}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">Kthim vjetor (est.):</span>
                <div className="text-right">
                  <div className="font-semibold">7.2%</div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {formatCurrency(breakdown.monthlyRent * 12, 'EUR')}/vit
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
            <p className="text-xs text-green-600 dark:text-green-400">
              * Llogaritjet janë të përafërta dhe bazohen në normat e tregut. Kursi i këmbimit: 1 EUR = {exchangeRates.eurToLek.toFixed(2)} LEK
            </p>
          </div>
        </div>
      )}

      {/* Quick Conversion Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[50000, 100000, 200000, 500000].map((value) => (
          <Button
            key={value}
            variant="outline"
            size="sm"
            onClick={() => {
              setAmount(value)
              setFromCurrency('EUR')
              setToCurrency('LEK')
            }}
            className="text-xs"
          >
            €{(value / 1000)}k
          </Button>
        ))}
      </div>

      {/* Exchange Rate Info */}
      <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
        Kursi i fundit përditësim: {new Date(exchangeRates.lastUpdated).toLocaleString('sq-AL')}
        <br />
        Burimi: Banka e Shqipërisë • Kurset mund të ndryshojnë
      </div>
    </div>
  )
}