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
