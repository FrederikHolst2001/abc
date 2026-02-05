import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const apiKey = Deno.env.get('TWELVE_DATA_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'TWELVE_DATA_API_KEY not configured' }, { status: 500 });
    }

    const pairs = [
      'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 
      'AUD/USD', 'USD/CAD', 'NZD/USD', 'EUR/GBP', 
      'EUR/JPY', 'GBP/JPY'
    ];

    const results = await Promise.all(
      pairs.map(async (pair) => {
        try {
          const response = await fetch(
            `https://api.twelvedata.com/quote?symbol=${pair}&apikey=${apiKey}`
          );
          const data = await response.json();
          
          if (data.code === 429) {
            throw new Error('Rate limit exceeded');
          }
          
          if (!data.close) {
            return null;
          }

          const price = parseFloat(data.close);
          const change = parseFloat(data.percent_change || 0);
          
          return {
            pair: pair,
            price: price,
            change: change,
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
            high: parseFloat(data.high || price),
            low: parseFloat(data.low || price),
            volume: data.volume || 'N/A'
          };
        } catch (error) {
          console.error(`Error fetching ${pair}:`, error);
          return null;
        }
      })
    );

    const validResults = results.filter(r => r !== null);

    if (validResults.length === 0) {
      return Response.json({ 
        error: 'No data available',
        pairs: [] 
      }, { status: 200 });
    }

    return Response.json({ pairs: validResults });
    
  } catch (error) {
    console.error('Error in fetchForexData:', error);
    return Response.json({ 
      error: error.message,
      pairs: []
    }, { status: 500 });
  }
});