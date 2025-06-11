"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, TrendingDown, Minus, ExternalLink, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Component() {
  const [ticker, setTicker] = useState("")
  const [searchedTicker, setSearchedTicker] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!ticker.trim()) return

    setLoading(true)
    setSearchedTicker(ticker.toUpperCase())

    // get from api/sentiment
    // This is where you would normally call your API to fetch the data use that api, non-mock
    const response = await fetch(`/api/sentiment?ticker=${ticker.toUpperCase()}`);
    const result = await response.json();
    //check if the result is empty
    console.log(result.error)
    console.log(result.error !== "undefined")
    console.log(result.error != "")
    if(result.length === 0 || (result.error !== undefined && result.error !== "")) {
      // prompt friendly error to user with proper UI
      alert(`No data found for ticker. May have went pass the API limit or ticker is invalid. Please try again later or use a different ticker.`);
      // reset the state 
      setTicker("");
      setLoading(false);
      setData(null);

      return
    }
    setData(result);
    setLoading(false);
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish":
      case "Somewhat-Bullish":
      case "positive":
        return "text-green-600 bg-green-50"
      case "Bearish":
      case "Somewhat-Bearish":
      case "negative":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish":
      case "Somewhat-Bullish":
      case "positive":
        return <TrendingUp className="w-4 h-4" />
      case "Bearish":
      case "Somewhat-Bearish":
      case "negative":
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "N/A";
  // "20250611T150043" → "2025-06-11T15:00:43"
  const iso = `${timestamp.slice(0,4)}-${timestamp.slice(4,6)}-${timestamp.slice(6,8)}T${timestamp.slice(9,11)}:${timestamp.slice(11,13)}:${timestamp.slice(13,15)}`;
  const date = new Date(iso);
    
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">News Sentiment Analysis</h1>
          <p className="text-gray-600">Enter a stock ticker to analyze news sentiment</p>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Enter ticker (e.g., AAPL) ..."
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {/* Results */}
        {data && (
          <div className="space-y-6">
            {/* Overall Sentiment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Overall Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(data.overall.sentiment)}
                    <span className={`text-2xl font-bold ${getSentimentColor(data.overall.sentiment).split(" ")[0]}`}>
                      {data.overall.sentiment.charAt(0).toUpperCase() + data.overall.sentiment.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Score: {data.overall.score.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{data.overall.totalArticles}</div>
                  <p className="text-sm text-gray-500">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Positive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{data.overall.positiveCount}</div>
                  <p className="text-sm text-gray-500">
                    {Math.round((data.overall.positiveCount / data.overall.totalArticles) * 100)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Negative</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{data.overall.negativeCount}</div>
                  <p className="text-sm text-gray-500">
                    {Math.round((data.overall.negativeCount / data.overall.totalArticles) * 100)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* News List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent News for {searchedTicker}</CardTitle>
                <CardDescription>Latest news articles with sentiment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Headline</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.news.map((article: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          <div className="line-clamp-2">{article.headline}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{article.source}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[120px]">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatDate(article.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSentimentColor(article.sentimentLabel)}>
                            <div className="flex items-center gap-1">
                              {getSentimentIcon(article.sentimentLabel)}
                              {article.sentiment}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${
                              article.tickerSentiment > 0
                                ? "text-green-600"
                                : article.tickerSentiment < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {article.tickerSentiment > 0 ? "+" : ""}
                            {article.tickerSentiment.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Results */}
        {searchedTicker && !data && !loading && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No data found for "{searchedTicker}". Try a different ticker or topic.</p>
            </CardContent>
          </Card>
        )}

        {/* Sample Data Notice */}
        {!searchedTicker && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-2">Try searching for "AAPL" to see data</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
