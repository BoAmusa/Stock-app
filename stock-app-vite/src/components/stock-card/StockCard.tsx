import React, { useState } from "react";
import type { StockCardProps } from "./StockCard.props";
import "../../App.css";
import {
  removeButtonCardStyle,
  removeButtonStyle,
} from "../../util/styles/Styles";

export const StockCard: React.FC<StockCardProps> = ({
  stockCardInfo,
  handleRemoveStock,
}) => {
  const { companyName, symbol, price, change, percentChange, logo, currency } =
    stockCardInfo;

  const priceChangeColor =
    change != null
      ? change > 0
        ? "green"
        : change < 0
        ? "red"
        : "gray"
      : "gray";

  const [hover, setHover] = useState(false);

  return (
    <div style={removeButtonCardStyle}>
      <button
        onClick={() => handleRemoveStock?.(symbol)}
        style={removeButtonStyle}
        aria-label="Remove stock"
        title="Remove stock"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          stroke={hover ? "#f00" : "#888"}
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

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
        {price != null
          ? `Price: $${price.toFixed(2)} ${currency}`
          : "Price: N/A"}
      </p>

      <p style={{ margin: 0, color: priceChangeColor }}>
        {change != null && percentChange != null
          ? `1-Day Change: ${change >= 0 ? "+" : ""}${change.toFixed(
              2
            )} (${percentChange.toFixed(2)}%)`
          : "1-Day Change: N/A"}
      </p>
    </div>
  );
};

export default StockCard;
