// constructor  for this tsx
import { env } from 'process';
// Importing environment variables for Alpha Vantage API key and URL

const ALPHA_VANTAGE_API_KEY: string | false = env.ALPHA_VANTAGE_API_KEY || false
const ALPHA_VANTAGE_API_URL: string | false = env.ALPHA_VANTAGE_API_URL || false

// tickers and limit are optional parameters
// functionParam is require

export function buildAlphaVantageUrl(functionParam: string, ticker: string = "", limit: number = 50): string {
    
    //condition check if not empty then build the URL
    if (ticker == "") {
        return `${ALPHA_VANTAGE_API_URL}?function=${functionParam}&limits=${limit}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    }

    return `${ALPHA_VANTAGE_API_URL}?function=${functionParam}&tickers=${ticker}&limits=${limit}&apikey=${ALPHA_VANTAGE_API_KEY}`;
}