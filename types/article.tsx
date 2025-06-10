// i want

export class TickerSentiment {
  ticker: string;
  relevanceScore: number;
  tickerSentiment: number;
  sentimentLabel: string;
  source: string ;
  headline: string;
  timestamp: string;
  url: string;

  // Constructor for TickerSentiment class
  constructor(ticker: string = "", relevanceScore: number = 0, tickerSentiment: number = 0,sentimentLabel: string = "", source: string = "", headline: string = "", timestamp: string = "", url: string = "") {
    this.ticker = ticker;
    this.relevanceScore = relevanceScore;
    this.tickerSentiment = tickerSentiment;
    this.sentimentLabel = sentimentLabel;
    this.source = source;
    this.headline = headline;
    this.timestamp = timestamp;
    this.url = url;
  }
}

export class Article {
  title: string;
  url: string;
  timePublished: string;
  authors: string[];
  summary: string;
  bannerImage: string | null;
  source: string = "Benzinga";
  categoryWithinSource: string;
  tickerSentiment: TickerSentiment[];

  constructor(
    title: string = "",
    url: string = "",
    timePublished: string = "",
    authors: string[] = [],
    summary: string = "",
    bannerImage: string | null = null,
    source: string = "Benzinga",
    categoryWithinSource: string = "",
    tickerSentiment: TickerSentiment[] = []
  ) {
    this.title = title;
    this.url = url;
    this.timePublished = timePublished;
    this.authors = authors;
    this.summary = summary;
    this.bannerImage = bannerImage;
    this.source = source;
    this.categoryWithinSource = categoryWithinSource;
    this.tickerSentiment = tickerSentiment;
  }

  analyzeSentiment(): void {
    console.log(`Analyzing sentiment for ${this.title} from ${this.source}`);
  }
}
