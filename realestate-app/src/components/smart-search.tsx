"use client"

import { useState } from "react"
import { Search, Mic, MicOff } from "lucide-react"
import { parseNaturalLanguageQuery, SmartSearchParams } from "@/lib/smart-search"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SmartSearchProps {
  onSearch: (params: SmartSearchParams) => void
  placeholder?: string
}

export function SmartSearch({ onSearch, placeholder = "Kërko me fjalë... p.sh. '2 dhoma gjumi pranë detit nën €100k'" }: SmartSearchProps) {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [parsedParams, setParsedParams] = useState<SmartSearchParams>({})

  const handleSearch = () => {
    const params = parseNaturalLanguageQuery(query)
    setParsedParams(params)
    onSearch(params)
  }

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Kërkim me zë nuk është i disponueshëm në këtë browser')
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'sq-AL' // Albanian
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
      const params = parseNaturalLanguageQuery(transcript)
      setParsedParams(params)
      onSearch(params)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
      alert('Gabim në kërkimin me zë. Provoni përsëri.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const clearSearch = () => {
    setQuery("")
    setParsedParams({})
    onSearch({})
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleVoiceSearch}
              disabled={isListening}
              className={`p-2 ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4"
            >
              Kërko
            </Button>
          </div>
        </div>
      </div>

      {/* Parsed Parameters Display */}
      {Object.keys(parsedParams).length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400">Filtrat e zbatuar:</span>
          
          {parsedParams.bedrooms && (
            <Badge variant="secondary">
              {parsedParams.bedrooms} dhoma gjumi
            </Badge>
          )}
          
          {parsedParams.bathrooms && (
            <Badge variant="secondary">
              {parsedParams.bathrooms} banjo
            </Badge>
          )}
          
          {parsedParams.minPrice && (
            <Badge variant="secondary">
              Minimumi €{parsedParams.minPrice.toLocaleString()}
            </Badge>
          )}
          
          {parsedParams.maxPrice && (
            <Badge variant="secondary">
              Maksimumi €{parsedParams.maxPrice.toLocaleString()}
            </Badge>
          )}
          
          {parsedParams.type && (
            <Badge variant="secondary">
              {parsedParams.type === 'APARTMENT' ? 'Apartament' :
               parsedParams.type === 'HOUSE' ? 'Shtëpi' :
               parsedParams.type === 'VILLA' ? 'Vilë' :
               parsedParams.type === 'LAND' ? 'Tokë' :
               parsedParams.type === 'COMMERCIAL' ? 'Komerciale' :
               parsedParams.type === 'OFFICE' ? 'Zyrë' : parsedParams.type}
            </Badge>
          )}
          
          {parsedParams.status && (
            <Badge variant="secondary">
              {parsedParams.status === 'FOR_RENT' ? 'Për Qira' : 'Për Shitje'}
            </Badge>
          )}
          
          {parsedParams.location && (
            <Badge variant="secondary">
              📍 {parsedParams.location}
            </Badge>
          )}
          
          {parsedParams.features && parsedParams.features.map((feature) => (
            <Badge key={feature} variant="secondary">
              ✓ {feature}
            </Badge>
          ))}
          
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={clearSearch}
            className="text-slate-500 hover:text-slate-700"
          >
            Pastro
          </Button>
        </div>
      )}

      {/* Voice Search Status */}
      {isListening && (
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
            <MicOff className="h-5 w-5 animate-pulse" />
            <span>Duke dëgjuar... Flisni tani!</span>
          </div>
        </div>
      )}

      {/* Search Examples */}
      <div className="text-xs text-slate-500 dark:text-slate-400">
        <details>
          <summary className="cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
            Shembuj kërkimi të mençur
          </summary>
          <div className="mt-2 space-y-1 pl-4">
            <div>• &quot;2 dhoma gjumi në Tiranë nën €80,000&quot;</div>
            <div>• &quot;Apartament për qira pranë detit&quot;</div>
            <div>• &quot;Shtëpi me kopsht në Durrës&quot;</div>
            <div>• &quot;Vilë me pishina mbi €200k&quot;</div>
            <div>• &quot;Tokë komerciale në qendër&quot;</div>
          </div>
        </details>
      </div>
    </div>
  )
}