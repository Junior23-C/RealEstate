export function generateNonce(): string {
  // Use Web Crypto API for Edge Runtime compatibility
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    const array = new Uint8Array(16)
    globalThis.crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  }
  
  // Fallback for Node.js environment
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require('crypto')
  return crypto.randomBytes(16).toString('base64')
}

export function getCSPWithNonce(nonce: string): string {
  return `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'nonce-${nonce}' https://vercel.live;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://images.unsplash.com https://*.vercel-insights.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
}