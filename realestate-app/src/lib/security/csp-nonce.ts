import crypto from 'crypto'

export function generateNonce(): string {
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