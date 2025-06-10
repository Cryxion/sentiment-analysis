import { TickerSentiment } from "@/types/article";
import { NewsArticle } from "@/types/news_article";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {

    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get('ticker') || '';

    const newsArticle = new NewsArticle();
    const articles = await newsArticle.fetchAndPopulate(ticker);
    // Check if articles were fetched successfully
    if (!articles || articles.length === 0) {
        return NextResponse.json({ error: 'No articles found' }, { status: 404 });
    }

    // now i want to loop all the articles and log the tickerSentiment into a new TickerSentiment object
    // and then push it into the tickerSentiment array
    // array of TickerSentiment objects
    // Loop through each article and extract tickerSentiment
    
    //intialize an array to hold TickerSentiment objects
    const tickerSentimentArray: TickerSentiment[] = [];
    articles.forEach(article => {
        article.tickerSentiment.forEach(sentiment => {
            console.log(`Ticker: ${sentiment.ticker}, Sentiment: ${sentiment.tickerSentiment}, Relevance Score: ${sentiment.relevanceScore}`);
            // Here you can create a new TickerSentiment object if needed
            // and push it into the tickerSentiment array
            const tickerSentiment = new TickerSentiment(sentiment.ticker, sentiment.relevanceScore, Number(sentiment.tickerSentiment), sentiment.sentimentLabel, article.source, article.title, article.timePublished, article.url);
            tickerSentimentArray.push(tickerSentiment);
        });
    });

    // find only the given ticker in the tickerSentimentArray
    const filteredTickerSentimentArray = tickerSentimentArray.filter(ts => ts.ticker == ticker);

    // with filteredTickerSentimentArray, you can now return the response 
    // with this format
    // AAPL: {
    // overall: {
    //   sentiment: "positive",
    //   score: 0.72,
    //   totalArticles: 156,
    //   positiveCount: 89,
    //   neutralCount: 45,
    //   negativeCount: 22,
    // },
    // news: [
    //   {
    //     id: 1,
    //     headline: "Apple Reports Strong Q4 Earnings, Beats Expectations",
    //     source: "Reuters",
    //     timestamp: "2024-01-15T10:30:00Z",
    //     sentiment: "positive",
    //     score: 0.85,
    //     url: "#",
    //   },
    // ]
    if (filteredTickerSentimentArray.length === 0) {
        return NextResponse.json({ error: 'No sentiment data found for the specified ticker' }, { status: 404 });
    }
    // Group by ticker and calculate overall sentiment
    //score is the average of all tickerSentiment scores for the given ticker
    const tickerSentimentScores = filteredTickerSentimentArray.map(ts => Number(ts.tickerSentiment));
    console.log('Ticker Sentiment Scores:', tickerSentimentScores);
    const averageTickerSentimentScore = tickerSentimentScores.reduce((acc, curr) => acc + curr, 0) / tickerSentimentScores.length;
    console.log(`Average ticker sentiment score for ${ticker}: ${averageTickerSentimentScore}`);

    const overallSentiment = filteredTickerSentimentArray.reduce((acc, curr) => {
        acc[curr.ticker] = {
            sentiment: averageTickerSentimentScore > 0 ? 'positive' : 'negative',
            score: averageTickerSentimentScore,
            totalArticles: filteredTickerSentimentArray.length,
            positiveCount: filteredTickerSentimentArray.filter(ts => ts.tickerSentiment > 0).length,
            neutralCount: filteredTickerSentimentArray.filter(ts => ts.tickerSentiment === 0).length,
            negativeCount: filteredTickerSentimentArray.filter(ts => ts.tickerSentiment < 0).length,
        };
        return acc;
    }, {} as Record<string, {
        id: number;
        sentiment: string;
        score: number;
        totalArticles: number;
        positiveCount: number;
        neutralCount: number;
        negativeCount: number;
    }>);
    // Create the final response structure
    const response = {
        overall: overallSentiment[ticker],
        news: filteredTickerSentimentArray,
    };

    return NextResponse.json(response);
}