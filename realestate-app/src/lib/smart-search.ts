// Smart Search with Natural Language Processing
export interface SmartSearchParams {
  bedrooms?: number
  bathrooms?: number
  minPrice?: number
  maxPrice?: number
  location?: string
  type?: string
  status?: string
  features?: string[]
}

export function parseNaturalLanguageQuery(query: string): SmartSearchParams {
  const params: SmartSearchParams = {}
  const lowerQuery = query.toLowerCase()

  // Extract bedrooms
  const bedroomPatterns = [
    /(\d+)[- ]*dhomat?,? gjumi/gi,
    /(\d+)[- ]*bedroom/gi,
    /(\d+)[- ]*dhoma/gi,
    /(\d+)\+(\d+)/gi, // 2+1 format
  ]
  
  for (const pattern of bedroomPatterns) {
    const match = pattern.exec(lowerQuery)
    if (match) {
      params.bedrooms = parseInt(match[1])
      break
    }
  }

  // Extract bathrooms
  const bathroomPatterns = [
    /(\d+)[- ]*banjo/gi,
    /(\d+)[- ]*bathroom/gi,
    /(\d+)[- ]*tualet/gi,
  ]
  
  for (const pattern of bathroomPatterns) {
    const match = pattern.exec(lowerQuery)
    if (match) {
      params.bathrooms = parseInt(match[1])
      break
    }
  }

  // Extract price range

  // Handle "under/nën" price
  const underMatch = /(?:under|nën|më pak se|maksimumi)[^\d]*€?(\d+(?:,\d{3})*(?:\.\d{2})?)[k]?/gi.exec(lowerQuery)
  if (underMatch) {
    let price = parseFloat(underMatch[1].replace(/,/g, ''))
    if (lowerQuery.includes('k') && price < 1000) price *= 1000
    params.maxPrice = price
  }

  // Handle "over/mbi" price
  const overMatch = /(?:over|mbi|më shumë se|minimumi)[^\d]*€?(\d+(?:,\d{3})*(?:\.\d{2})?)[k]?/gi.exec(lowerQuery)
  if (overMatch) {
    let price = parseFloat(overMatch[1].replace(/,/g, ''))
    if (lowerQuery.includes('k') && price < 1000) price *= 1000
    params.minPrice = price
  }

  // Handle price range
  const rangeMatch = /€(\d+(?:,\d{3})*(?:\.\d{2})?)[k]?[- ]*(?:to|deri|në)[- ]*€?(\d+(?:,\d{3})*(?:\.\d{2})?)[k]?/gi.exec(lowerQuery)
  if (rangeMatch) {
    let minPrice = parseFloat(rangeMatch[1].replace(/,/g, ''))
    let maxPrice = parseFloat(rangeMatch[2].replace(/,/g, ''))
    if (lowerQuery.includes('k')) {
      if (minPrice < 1000) minPrice *= 1000
      if (maxPrice < 1000) maxPrice *= 1000
    }
    params.minPrice = minPrice
    params.maxPrice = maxPrice
  }

  // Extract property types
  const typeMapping = {
    'apartament': 'APARTMENT',
    'apartment': 'APARTMENT',
    'shtëpi': 'HOUSE',
    'house': 'HOUSE',
    'home': 'HOUSE',
    'vilë': 'VILLA',
    'villa': 'VILLA',
    'tokë': 'LAND',
    'land': 'LAND',
    'komerciale': 'COMMERCIAL',
    'commercial': 'COMMERCIAL',
    'zyrë': 'OFFICE',
    'office': 'OFFICE',
  }

  for (const [keyword, type] of Object.entries(typeMapping)) {
    if (lowerQuery.includes(keyword)) {
      params.type = type
      break
    }
  }

  // Extract status (rent/sale)
  if (lowerQuery.includes('qira') || lowerQuery.includes('rent') || lowerQuery.includes('rental')) {
    params.status = 'FOR_RENT'
  } else if (lowerQuery.includes('shitje') || lowerQuery.includes('sale') || lowerQuery.includes('buy')) {
    params.status = 'FOR_SALE'
  }

  // Extract locations (Albanian cities and areas)
  const locationKeywords = [
    'tirana', 'tiranë', 'durrës', 'durres', 'vlora', 'vlorë', 'shkodra', 'shkodër',
    'elbasan', 'korça', 'korce', 'fier', 'lushnja', 'lushnje', 'kavaja', 'kavajë',
    'berat', 'gjirokastër', 'gjirokaster', 'kukes', 'kukës', 'lezha', 'lezhë',
    'pogradec', 'sarandë', 'saranda', 'peshkopi', 'burrel', 'kruja', 'krujë',
    'blloku', 'block', 'center', 'qendra', 'plazh', 'beach', 'det', 'sea',
    'mal', 'mountain', 'qytet', 'city', 'fshat', 'village'
  ]

  for (const location of locationKeywords) {
    if (lowerQuery.includes(location)) {
      params.location = location
      break
    }
  }

  // Extract features
  const features: string[] = []
  const featureKeywords = [
    { keywords: ['parking', 'garazh'], feature: 'Parking' },
    { keywords: ['garden', 'kopsht'], feature: 'Garden' },
    { keywords: ['balcony', 'ballkon'], feature: 'Balcony' },
    { keywords: ['pool', 'pishina'], feature: 'Swimming Pool' },
    { keywords: ['furnished', 'e mobiluar'], feature: 'Furnished' },
    { keywords: ['elevator', 'ashensor'], feature: 'Elevator' },
    { keywords: ['security', 'siguria'], feature: 'Security' },
    { keywords: ['air conditioning', 'kondicionim'], feature: 'Air Conditioning' },
  ]

  for (const { keywords, feature } of featureKeywords) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      features.push(feature)
    }
  }

  if (features.length > 0) {
    params.features = features
  }

  return params
}

export function buildSearchQuery(params: SmartSearchParams) {
  const conditions: string[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryParams: any = {}

  if (params.bedrooms) {
    conditions.push('bedrooms >= $1')
    queryParams.$1 = params.bedrooms
  }

  if (params.bathrooms) {
    const key = `$${Object.keys(queryParams).length + 1}`
    conditions.push(`bathrooms >= ${key}`)
    queryParams[key] = params.bathrooms
  }

  if (params.minPrice) {
    const key = `$${Object.keys(queryParams).length + 1}`
    conditions.push(`price >= ${key}`)
    queryParams[key] = params.minPrice
  }

  if (params.maxPrice) {
    const key = `$${Object.keys(queryParams).length + 1}`
    conditions.push(`price <= ${key}`)
    queryParams[key] = params.maxPrice
  }

  if (params.type) {
    const key = `$${Object.keys(queryParams).length + 1}`
    conditions.push(`type = ${key}`)
    queryParams[key] = params.type
  }

  if (params.status) {
    const key = `$${Object.keys(queryParams).length + 1}`
    conditions.push(`status = ${key}`)
    queryParams[key] = params.status
  }

  if (params.location) {
    const key = `$${Object.keys(queryParams).length + 1}`
    conditions.push(`(LOWER(city) LIKE ${key} OR LOWER(state) LIKE ${key} OR LOWER(address) LIKE ${key})`)
    queryParams[key] = `%${params.location.toLowerCase()}%`
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    parameters: queryParams
  }
}