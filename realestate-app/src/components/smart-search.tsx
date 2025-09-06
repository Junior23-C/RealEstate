"use client"

import { useState } from "react"
import { Search, Mic, MicOff, SlidersHorizontal } from "lucide-react"
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
        <div className="relative flex items-center group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="w-full pl-12 pr-24 py-4 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md text-base placeholder:text-slate-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleVoiceSearch}
              disabled={isListening}
              className={`p-2 rounded-full transition-all duration-200 ${isListening ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
              title={isListening ? 'Duke dëgjuar...' : 'Kërkim me zë'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium"
            >
              Kërko
            </Button>
          </div>
        </div>
      </div>

      {/* Parsed Parameters Display */}
      {Object.keys(parsedParams).length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              Filtrat e zbatuar:
            </span>
          
            {parsedParams.bedrooms && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border-blue-200 dark:border-blue-700 shadow-sm">
                🛏️ {parsedParams.bedrooms} dhoma gjumi
              </Badge>
            )}
            
            {parsedParams.bathrooms && (
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 border-emerald-200 dark:border-emerald-700 shadow-sm">
                🚿 {parsedParams.bathrooms} banjo
              </Badge>
            )}
            
            {parsedParams.minPrice && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 border-green-200 dark:border-green-700 shadow-sm">
                💰 Min €{parsedParams.minPrice.toLocaleString()}
              </Badge>
            )}
            
            {parsedParams.maxPrice && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 border-red-200 dark:border-red-700 shadow-sm">
                🏷️ Max €{parsedParams.maxPrice.toLocaleString()}
              </Badge>
            )}
            
            {parsedParams.type && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 border-purple-200 dark:border-purple-700 shadow-sm">
                🏠 {parsedParams.type === 'APARTMENT' ? 'Apartament' :
                   parsedParams.type === 'HOUSE' ? 'Shtëpi' :
                   parsedParams.type === 'VILLA' ? 'Vilë' :
                   parsedParams.type === 'LAND' ? 'Tokë' :
                   parsedParams.type === 'COMMERCIAL' ? 'Komerciale' :
                   parsedParams.type === 'OFFICE' ? 'Zyrë' : parsedParams.type}
              </Badge>
            )}
            
            {parsedParams.status && (
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100 border-orange-200 dark:border-orange-700 shadow-sm">
                {parsedParams.status === 'FOR_RENT' ? '🏘️ Për Qira' : '🏡 Për Shitje'}
              </Badge>
            )}
            
            {parsedParams.location && (
              <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 border-indigo-200 dark:border-indigo-700 shadow-sm">
                📍 {parsedParams.location}
              </Badge>
            )}
            
            {parsedParams.features && parsedParams.features.map((feature) => (
              <Badge key={feature} className="bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100 border-teal-200 dark:border-teal-700 shadow-sm">
                ✨ {feature}
              </Badge>
            ))}
          
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={clearSearch}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full px-3 transition-all duration-200"
            >
              ✕ Pastro
            </Button>
          </div>
        </div>
      )}

      {/* Voice Search Status */}
      {isListening && (
        <div className="text-center p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-red-200 dark:border-red-700 shadow-lg animate-pulse">
          <div className="flex items-center justify-center gap-3 text-red-600 dark:text-red-400">
            <div className="relative">
              <MicOff className="h-6 w-6" />
              <div className="absolute -inset-2 bg-red-400/20 rounded-full animate-ping"></div>
            </div>
            <span className="text-lg font-medium">Duke dëgjuar... Flisni tani! 🎤</span>
          </div>
        </div>
      )}

      {/* Search Examples */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
            <span>💡 Shembuj kërkimi të mençur</span>
            <span className="text-xs opacity-50 group-open:rotate-180 transition-transform duration-200">▼</span>
          </summary>
          <div className="mt-4 space-y-2 pl-2">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setQuery('2 dhoma gjumi në Tiranë nën €80,000')}>
              <span className="text-blue-400">🔍</span> &quot;2 dhoma gjumi në Tiranë nën €80,000&quot;
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setQuery('Apartament për qira pranë detit')}>
              <span className="text-blue-400">🔍</span> &quot;Apartament për qira pranë detit&quot;
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setQuery('Shtëpi me kopsht në Durrës')}>
              <span className="text-blue-400">🔍</span> &quot;Shtëpi me kopsht në Durrës&quot;
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setQuery('Vilë me pishina mbi €200k')}>
              <span className="text-blue-400">🔍</span> &quot;Vilë me pishina mbi €200k&quot;
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setQuery('Tokë komerciale në qendër')}>
              <span className="text-blue-400">🔍</span> &quot;Tokë komerciale në qendër&quot;
            </div>
          </div>
        </details>
      </div>
    </div>
  )
}