import { getAccessToken } from "../auth/AuthUtil";
import type { StockCardInfo } from "../types/UserTypes.types";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/***
 * Function to fetch stock prices for a list of stock symbols.
 * @param symbols - An array of stock symbols to fetch prices for.
 * @returns A promise that resolves to an array of StockCardInfo objects.
 * @throws Error if the API call fails or if the response is not ok.
 */
export const getStockPrices = async (
  symbols: string[]
): Promise<StockCardInfo[]> => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No access token available. User must be signed in.");
  }

  const symbolParam = symbols.join(",");
  const response = await fetch(
    `${API_BASE}/StockPrices?symbols=${encodeURIComponent(symbolParam)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to fetch stock prices: ${response.status} - ${errorBody}`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected response format from price API");
  }

  return data;
};

/***
 * Function to fetch stock information from the IEX API.
 * @param company - The stock symbol to fetch information for.
 * @returns A promise that resolves to the stock information object.
 * @throws Error if the API call fails or if the response is not ok.
 */
export const getStockInfoIEX = async (company: string): Promise<any> => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No access token available. User must be signed in.");
  }

  const response = await fetch(
    `${API_BASE}/StockInfo?symbol=${encodeURIComponent(company)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stock info");
  }

  const data = await response.json();

  if (!data) {
    throw new Error("No data returned");
  }

  return data; // returns the full stock info object
};

/***
 * Function to fetch stock information from the FinancialHub API.
 * @param symbol - The stock symbol to fetch information for.
 * @returns A promise that resolves to the stock information object.
 * @throws Error if the API call fails or if the response is not ok.
 */
export async function getStockInfoFH(symbol: string) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No access token available. User must be signed in.");
  }

  const response = await fetch(
    `${API_BASE}/StockInfoFH?symbol=${encodeURIComponent(symbol)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stock info");
  }

  return response.json(); // returns { symbol, companyName, logo, price, change, percentChange, currency }
}

export async function deleteUserStock(userId: string, symbol: string) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No access token available. User must be signed in.");
  }

  // Ensure both userId and symbol are provided
  if (!userId || !symbol) {
    throw new Error("Both userId and symbol are required to delete a stock.");
  }

  const response = await fetch(
    `${API_BASE}/DeleteUserStock?userId=${encodeURIComponent(
      userId
    )}&stockSymbol=${encodeURIComponent(symbol)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    // You might want to parse the error body from the backend if it provides more detail
    const errorBody = await response.text(); // or response.json() if your backend sends JSON errors
    throw new Error(
      `Failed to delete user stock: ${response.status} - ${errorBody}`
    );
  }

  // Assuming the backend returns a success message or status
  return response.text(); // Backend returns a success message string
}

/***
 * Function to fetch all stocks saved by a user.
 * @param userId - The ID of the user whose stocks are to be fetched.
 * @returns An array of user stocks.
 * @throws Error if userId is not provided or if the API call fails.
 */
export async function getUserStocks(userId: string) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No access token available. User must be signed in.");
  }

  // Ensure userId is provided
  if (!userId) {
    throw new Error("userId is required to fetch user stocks.");
  }

  const response = await fetch(
    `${API_BASE}/UserStocks?userId=${encodeURIComponent(userId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    // You might want to parse the error body from the backend if it provides more detail
    const errorBody = await response.text(); // or response.json() if your backend sends JSON errors
    throw new Error(
      `Failed to fetch user stocks: ${response.status} - ${errorBody}`
    );
  }

  return response.json(); // Returns an array of user stocks
}

/**
 * Function to save a user's stock.
 * @param userId - The ID of the user.
 * @param stock - The stock object to save, which should include properties like symbol, companyName, price, etc.
 * @returns The saved stock object.
 * @throws Error if userId or stock is not provided, or if the API call fails.
 */
export async function saveUserStock(userId: string, stock: StockCardInfo) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No access token available. User must be signed in.");
  }

  // Ensure userId and stock are provided
  if (!userId || !stock) {
    throw new Error("Both userId and stock are required to save a user stock.");
  }

  const response = await fetch(`${API_BASE}/UserStock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      stock,
    }),
  });

  if (!response.ok) {
    // You might want to parse the error body from the backend if it provides more detail
    const errorBody = await response.text(); // or response.json() if your backend sends JSON errors
    throw new Error(
      `Failed to save user stock: ${response.status} - ${errorBody}`
    );
  }

  return response.json(); // Returns the saved stock object
}
