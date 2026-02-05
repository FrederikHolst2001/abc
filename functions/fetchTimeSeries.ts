import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { pair, interval = '15min', outputsize = 100 } = await req.json();
    
    const apiKey = Deno.env.get('TWELVE_DATA_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'TWELVE_DATA_API_KEY not configured' }, { status: 500 });
    }

    if (!pair) {
      return Response.json({ error: 'Currency pair is required' }, { status: 400 });
    }

    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${pair}&interval=${interval}&outputsize=${outputsize}&apikey=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.code === 429) {
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    
    if (!data.values || data.values.length === 0) {
      return Response.json({ error: 'No data available' }, { status: 404 });
    }

    // Format the data for charting
    const formattedData = data.values.reverse().map(item => ({
      time: item.datetime,
      price: parseFloat(item.close),
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      volume: parseInt(item.volume || 0)
    }));

    return Response.json({ 
      pair: data.meta?.symbol || pair,
      interval: data.meta?.interval || interval,
      data: formattedData
    });
    
  } catch (error) {
    console.error('Error in fetchTimeSeries:', error);
    return Response.json({ 
      error: error.message
    }, { status: 500 });
  }
});