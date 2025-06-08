import React from "react";
import type { StockCardProps } from "./StockCard.props";
import "../../App.css";
import { cardSaveButtonStyle, cardStyle } from "../../util/styles/Styles";

export const StockCardSave: React.FC<StockCardProps> = ({
  stockCardInfo,
  handleSaveStock,
}) => {
  const priceChangeColor =
    stockCardInfo.change > 0
      ? "green"
      : stockCardInfo.change < 0
      ? "red"
      : "gray";

  return (
    <div style={cardStyle}>
      <img
        src={stockCardInfo.logo}
        alt={`${stockCardInfo.symbol} logo`}
        style={{ height: "40px", marginBottom: "8px" }}
      />
      <h3>
        {stockCardInfo.companyName} ({stockCardInfo.symbol})
      </h3>
      <p>
        Price: ${stockCardInfo.price.toFixed(2)} {stockCardInfo.currency}
      </p>
      <p style={{ margin: 0, color: priceChangeColor }}>
        1-Day Change: {stockCardInfo.change > 0 ? "+" : ""}
        {stockCardInfo.change.toFixed(2)} (
        {stockCardInfo.percentChange.toFixed(2)}%)
      </p>
      <br />
      <button onClick={handleSaveStock} style={cardSaveButtonStyle}>
        Save
      </button>
    </div>
  );
};
