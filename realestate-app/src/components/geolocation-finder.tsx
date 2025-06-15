"use client"

import { useState } from "react"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertyForGeolocation } from "@/types/property"

interface GeolocationFinderProps {
  onPropertiesFound: (properties: PropertyForGeolocation[]) => void
  maxDistance?: number // in kilometers
}

export function GeolocationFinder({ onPropertiesFound, maxDistance = 10 }: GeolocationFinderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [nearbyProperties, setNearbyProperties] = useState<PropertyForGeolocation[]>([])

  const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation nuk është i mbështetur nga browseri juaj'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        }
      )
    })
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const searchNearbyProperties = async () => {
    setIsLoading(true)
    setLocationError(null)

    try {
      // Get user location
      const position = await getUserLocation()
      const userLat = position.coords.latitude
      const userLng = position.coords.longitude
      
      setUserLocation({ lat: userLat, lng: userLng })

      // Fetch properties near the user's location
      const response = await fetch('/api/properties/nearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: userLat,
          longitude: userLng,
          maxDistance: maxDistance
        })
      })

      if (!response.ok) {
        throw new Error('Dështoi në marrjen e pronave të afërta')
      }

      const data = await response.json()
      
      // Calculate distances and sort by proximity
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const propertiesWithDistance = data.properties.map((property: any) => ({
        ...property,
        distance: property.latitude && property.longitude 
          ? calculateDistance(userLat, userLng, property.latitude, property.longitude)
          : null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })).filter((property: any) => property.distance !== null && property.distance <= maxDistance)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => a.distance - b.distance)

      setNearbyProperties(propertiesWithDistance)
      onPropertiesFound(propertiesWithDistance)

    } catch (error: unknown) {
      console.error('Geolocation error:', error)
      
      // Type guard to check if error has code property
      const geolocationError = error as GeolocationPositionError
      
      if (geolocationError.code === 1) {
        setLocationError('Ju keni refuzuar qasjen në vendndodhje. Ju lutemi aktivizoni vendndodhjen dhe provoni përsëri.')
      } else if (geolocationError.code === 2) {
        setLocationError('Nuk mund të përcaktojmë vendndodhjen tuaj. Ju lutemi kontrolloni lidhjen me internetin.')
      } else if (geolocationError.code === 3) {
        setLocationError('Koha e pritjes për vendndodhjen skadoi. Ju lutemi provoni përsëri.')
      } else {
        setLocationError('Gabim në gjetjen e pronave të afërta. Ju lutemi provoni përsëri.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const openInMaps = (property: PropertyForGeolocation) => {
    if (property.latitude && property.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`
      window.open(url, '_blank')
    } else {
      const address = `${property.title}, ${property.city}, ${property.state}, Albania`
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Button
          onClick={searchNearbyProperties}
          disabled={isLoading}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          {isLoading ? 'Duke kërkuar...' : 'Gjej pronat pranë meje'}
        </Button>
        
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Rreze kërkimi: {maxDistance} km
        </span>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 dark:text-red-400 font-medium">Gabim në vendndodhje</p>
              <p className="text-red-600 dark:text-red-300 text-sm mt-1">{locationError}</p>
            </div>
          </div>
        </div>
      )}

      {/* User Location Display */}
      {userLocation && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400">
              Vendndodhja juaj: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {/* Nearby Properties Count */}
      {nearbyProperties.length > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {nearbyProperties.length} prona të afërta
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (userLocation) {
                const url = `https://www.google.com/maps/search/Real+Estate/@${userLocation.lat},${userLocation.lng},14z`
                window.open(url, '_blank')
              }
            }}
            className="text-xs"
          >
            Shiko në hartë
          </Button>
        </div>
      )}

      {/* Quick Property List */}
      {nearbyProperties.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <h4 className="font-medium text-sm">Pronat më të afërta:</h4>
          {nearbyProperties.slice(0, 5).map((property) => (
            <div key={property.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{property.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {property.city} • {property.distance?.toFixed(1)} km largësi
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600">
                  €{property.price.toLocaleString()}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openInMaps(property)}
                  className="p-1"
                >
                  <MapPin className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Properties Found */}
      {!isLoading && nearbyProperties.length === 0 && userLocation && (
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <MapPin className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Nuk u gjetën prona brenda {maxDistance} km nga vendndodhja juaj.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newMaxDistance = maxDistance * 2
              // You could implement expanding the search radius here
              console.log(`Expanding search to ${newMaxDistance} km`)
            }}
            className="mt-2"
          >
            Zgjero kërkimin në {maxDistance * 2} km
          </Button>
        </div>
      )}
    </div>
  )
}