import React from "react";
import type { StockCardProps } from "./StockCard.props";
import "../../App.css";
import { cardStyle } from "../../util/styles/Styles";

const StockCard: React.FC<StockCardProps> = ({ stockCardInfo }) => {
  const { companyName, symbol, price, change, percentChange, logo, currency } =
    stockCardInfo;
  const priceChangeColor = change > 0 ? "green" : change < 0 ? "red" : "gray";

  return (
    <div style={cardStyle}>
      {logo && (
        <img
          src={logo}
          alt={`${symbol} logo`}
          style={{ height: "40px", marginBottom: "8px" }}
        />
      )}
      <h3 style={{ margin: "8px 0" }}>
        {companyName} ({symbol})
      </h3>
      <p style={{ margin: "4px 0", fontWeight: "bold" }}>
        Price: ${price.toFixed(2)} {currency}
      </p>
      <p style={{ margin: 0, color: priceChangeColor }}>
        Change: {change >= 0 ? "+" : ""}
        {change.toFixed(2)} ({percentChange.toFixed(2)}%)
      </p>
    </div>
  );
};

export default StockCard;
