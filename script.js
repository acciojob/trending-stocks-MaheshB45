 
async function trendingStocks(n) {
  try {
    // Fetch symbols data
    const symbolsResponse = await fetch('https://api.frontendexpert.io/api/fe/stock-symbols');
    const symbolsData = await symbolsResponse.json();

    // Take the top n symbols
    const topNSymbols = symbolsData.slice(0, n);

    // Fetch prices data
    const symbolsQueryParam = JSON.stringify(topNSymbols.map(stock => stock.symbol));
    const pricesResponse = await fetch(`https://api.frontendexpert.io/api/fe/stock-prices?symbols=${symbolsQueryParam}`);
    const pricesData = await pricesResponse.json();

    // Fetch market caps data
    const marketCapsResponse = await fetch('https://api.frontendexpert.io/api/fe/stock-market-caps');
    const marketCapsData = await marketCapsResponse.json();

    // Merge data based on the symbol
    const mergedData = topNSymbols.map(symbolData => {
      const priceData = pricesData.find(stock => stock.symbol === symbolData.symbol);
      const marketCapData = marketCapsData.find(stock => stock.symbol === symbolData.symbol);

      return {
        name: symbolData.name,
        symbol: symbolData.symbol,
        price: priceData ? priceData.price : null,
        '52-week-high': priceData ? priceData['52-week-high'] : null,
        '52-week-low': priceData ? priceData['52-week-low'] : null,
        'market-cap': marketCapData ? marketCapData['market-cap'] : null,
      };
    });

    return mergedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

module.exports = trendingStocks;
