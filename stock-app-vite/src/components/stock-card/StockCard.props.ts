import type { StockCardInfo } from "./StockCard.types";

export type StockCardProps = {
  stockCardInfo: StockCardInfo;
  handleSaveStock?: () => void;
  handleRemoveStock?: (symbol: string) => void;
};
