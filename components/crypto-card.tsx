import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface CryptoCardProps {
  crypto: {
    id: string
    name: string
    symbol: string
    image: string
    current_price: number
    price_change_percentage_24h: number
    market_cap: number
    market_cap_rank: number
  }
  formatCurrency: (value: number) => string
}

export default function CryptoCard({ crypto, formatCurrency }: CryptoCardProps) {
  const priceChangeColor = crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"

  const priceChangeIcon =
    crypto.price_change_percentage_24h >= 0 ? (
      <ArrowUpRight className="inline" size={16} />
    ) : (
      <ArrowDownRight className="inline" size={16} />
    )

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-8 h-8" />
          <div>
            <h3 className="font-bold">{crypto.name}</h3>
            <p className="text-sm text-gray-500 uppercase">{crypto.symbol}</p>
          </div>
        </div>
        <Badge variant="outline">Rank #{crypto.market_cap_rank}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xl font-bold">{formatCurrency(crypto.current_price)}</p>
          <p className={`flex items-center gap-1 ${priceChangeColor}`}>
            {priceChangeIcon}
            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
          </p>
        </div>
        <p className="text-sm text-gray-500">Market Cap: {formatCurrency(crypto.market_cap)}</p>
      </CardContent>
    </Card>
  )
}

