import axios from 'axios'; // Import axios
import { Article } from './article';
import { buildAlphaVantageUrl } from '../utils/alphavantageurl';


//fetchAndPopulate should populate the NewsArticle instance with data from the Alpha Vantage API
// The NewsArticle class extends the
// Article class and adds a method to fetch and populate its properties from the API.
// The fetchAndPopulate method should handle the API call and populate the instance properties accordingly.
//but i am require to enter all the properties in the constructor?
// i dont want to do that
// I want to fetch the data from the API and populate the properties



export class NewsArticle extends Article {

    async fetchAndPopulate(ticker: string) {
        try {
        const response = await axios.get<any>(buildAlphaVantageUrl('NEWS_SENTIMENT', ticker)); // Replace with your API endpoint
        const feed = response.data["feed"];
        if (!Array.isArray(feed)) return [];

        return feed.map((item: any) => {
                const article = new NewsArticle();
                article.title = item.title;
                article.url = item.url;
                article.timePublished = item.time_published;
                article.authors = item.authors.join(",");
                article.summary = item.summary;
                article.bannerImage = item.banner_image;
                article.source = item.source;
                article.categoryWithinSource = item.category_within_source;
                article.tickerSentiment = Array.isArray(item.ticker_sentiment)
                ? item.ticker_sentiment.map((sentiment: any) => ({
                    ticker: sentiment.ticker,
                    tickerSentiment: sentiment.ticker_sentiment_score,
                    relevanceScore: sentiment.relevance_score,
                    sentimentLabel: sentiment.ticker_sentiment_label,
                }))
                : [];
                return article;
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
  }
}