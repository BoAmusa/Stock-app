import type { StockCardInfo } from "../../types/UserTypes.types";

export type StockCardProps = {
  stockCardInfo: StockCardInfo;
  handleSaveStock?: () => void;
  handleRemoveStock?: (symbol: string) => void;
};
