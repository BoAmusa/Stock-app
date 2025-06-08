export type UserStockDocument = {
  id: string;
  userId: string;
  stock: StockCardInfo;
};

export type StockCardInfo = {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  percentChange: number;
  currency: string;
  logo?: string;
  priceChangeColor?: string;
};
