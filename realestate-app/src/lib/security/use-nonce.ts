import { headers } from 'next/headers'

export async function getCSPNonce(): Promise<string | null> {
  try {
    const headersList = await headers()
    return headersList.get('X-CSP-Nonce')
  } catch (error) {
    console.error('Failed to get CSP nonce:', error)
    return null
  }
}

// Client-side hook (for use in components)
export function useCSPNonce(): string | null {
  if (typeof window === 'undefined') {
    // Server-side: get from meta tag
    return null
  }
  
  // Client-side: get from meta tag
  const metaNonce = document.querySelector('meta[name="csp-nonce"]')
  return metaNonce?.getAttribute('content') || null
}