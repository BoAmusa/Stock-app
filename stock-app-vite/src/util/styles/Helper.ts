import type {
  StockCardInfo,
  UserStockDocument,
} from "../../types/UserTypes.types";

export const extractStocksFromUserDocs = (
  userStocks: UserStockDocument[]
): StockCardInfo[] => {
  return userStocks.map((item) => {
    const stock = item.stock;
    return {
      ...stock,
      priceChangeColor:
        stock.change > 0 ? "green" : stock.change < 0 ? "red" : "gray",
    };
  });
};

export const mergeStockCardsFromUserDocs = (
  currentStocks: StockCardInfo[],
  userStocks: UserStockDocument[]
): StockCardInfo[] => {
  if (!Array.isArray(userStocks)) {
    console.warn("Expected array in userStocks but got:", userStocks);
    return currentStocks;
  }

  const newStocks: StockCardInfo[] = userStocks.map((item) => {
    const stock = item.stock;
    return {
      ...stock,
      priceChangeColor:
        stock.change > 0 ? "green" : stock.change < 0 ? "red" : "gray",
    };
  });

  // Avoid duplicates by symbol
  const existingSymbols = new Set(currentStocks.map((s) => s.symbol));
  const filteredNewStocks = newStocks.filter(
    (s) => !existingSymbols.has(s.symbol)
  );

  return [...currentStocks, ...filteredNewStocks];
};
