import { NextResponse } from "next/server"

// Cache exchange rates for 1 hour
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedRates: any = null
let lastFetch = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export async function GET() {
  try {
    const now = Date.now()
    
    // Return cached rates if they're still fresh
    if (cachedRates && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json(cachedRates)
    }

    // Try to fetch from Bank of Albania API or other free APIs
    let exchangeRates
    
    try {
      // Try European Central Bank API first (free)
      const ecbResponse = await fetch('https://api.exchangerate-api.com/v4/latest/EUR', {
        headers: {
          'User-Agent': 'AlbaniRealEstate/1.0'
        }
      })
      
      if (ecbResponse.ok) {
        const ecbData = await ecbResponse.json()
        const eurToLek = ecbData.rates?.ALL || 108.5 // ALL is Albanian Lek code
        
        exchangeRates = {
          eurToLek: eurToLek,
          lekToEur: 1 / eurToLek,
          lastUpdated: new Date().toISOString(),
          trend: 'stable',
          source: 'ECB'
        }
      } else {
        throw new Error('ECB API failed')
      }
    } catch (ecbError) {
      console.warn('ECB API failed, using fallback rates:', ecbError)
      
      // Fallback to approximate Bank of Albania rates
      exchangeRates = {
        eurToLek: 108.5, // Approximate current rate
        lekToEur: 0.0092,
        lastUpdated: new Date().toISOString(),
        trend: 'stable',
        source: 'Fallback'
      }
    }

    // Cache the rates
    cachedRates = exchangeRates
    lastFetch = now

    return NextResponse.json(exchangeRates)
  } catch (error) {
    console.error("Exchange rates API error:", error)
    
    // Return default rates as fallback
    const defaultRates = {
      eurToLek: 108.5,
      lekToEur: 0.0092,
      lastUpdated: new Date().toISOString(),
      trend: 'stable',
      source: 'Default'
    }
    
    return NextResponse.json(defaultRates)
  }
}