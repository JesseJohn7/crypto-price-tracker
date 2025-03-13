"use client"

import { useState, useEffect } from "react"
import { Search, RefreshCw, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CryptoCard from "@/components/crypto-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"

export default function CryptoPriceTracker() {
  const [cryptoData, setCryptoData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currency, setCurrency] = useState("usd")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [error, setError] = useState(null)

  const currencies = [
    { value: "usd", label: "USD" },
    { value: "eur", label: "EUR" },
    { value: "gbp", label: "GBP" },
    { value: "jpy", label: "JPY" },
    { value: "ngn", label: "NGN" },
  ]

  const fetchCryptoData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h,7d`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }

      const data = await response.json()
      setCryptoData(data)
      setFilteredData(data)
      setLastUpdated(new Date())
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching crypto data:", err)
      setError("Failed to load cryptocurrency data. Please try again later.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptoData()
  }, [currency])

  useEffect(() => {
    if (searchTerm) {
      const filtered = cryptoData.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredData(filtered)
    } else {
      setFilteredData(cryptoData)
    }
  }, [searchTerm, cryptoData])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleRefresh = () => {
    fetchCryptoData()
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value)
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-background text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cryptocurrency Price Tracker</h1>
        <ThemeToggle />
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((curr) => (
              <SelectItem key={curr.value} value={curr.value}>
                {curr.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleRefresh} className="flex items-center gap-2">
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      <div className="text-sm text-gray-500 mb-6">Last updated: {lastUpdated.toLocaleTimeString()}</div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Cryptocurrencies</TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp size={16} className="mr-2" />
            Top Gainers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-4 w-[100px]" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </Card>
                  ))
              : filteredData.map((crypto) => (
                  <CryptoCard key={crypto.id} crypto={crypto} formatCurrency={formatCurrency} />
                ))}
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-4 w-[100px]" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </Card>
                  ))
              : filteredData
                  .filter((crypto) => crypto.price_change_percentage_24h > 0)
                  .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                  .slice(0, 6)
                  .map((crypto) => <CryptoCard key={crypto.id} crypto={crypto} formatCurrency={formatCurrency} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

