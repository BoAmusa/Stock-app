/**
 * Function to fetch the stock price of a given company.
 * @param company 
 * @returns 
 */
export const getStockPrice = async (company: string): Promise<number> => {
  const response = await fetch(`/api/GetStockPrice?symbol=${encodeURIComponent(company)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch stock price");
  }

  const data = await response.json();

  if (!data.price) {
    throw new Error("No price returned");
  }

  return parseFloat(data.price); // ensures numeric value
}

export const getStockInfoIEX = async (company: string): Promise<any> => {
  const response = await fetch(`/api/GetStockInfo?symbol=${encodeURIComponent(company)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch stock info");
  }

  const data = await response.json();

  if (!data) {
    throw new Error("No data returned");
  }

  return data; // returns the full stock info object
}

export async function getStockInfoFH(symbol: string) {
  const response = await fetch(`/api/GetStockInfoFH?symbol=${encodeURIComponent(symbol)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch stock info");
  }

  return response.json(); // returns { symbol, companyName, logo, price, change, percentChange, currency }
}


