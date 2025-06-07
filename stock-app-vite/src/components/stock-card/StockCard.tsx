import React from "react";
import type { StockCardProps } from "./StockCard.props";

const StockCard: React.FC<StockCardProps> = ({ stockCardInfo }) => {
  const { companyName, symbol, price, change, percentChange, logo, currency } =
    stockCardInfo;
  const priceChangeColor = change > 0 ? "green" : change < 0 ? "red" : "gray";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        maxWidth: 320,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt={`${companyName} logo`}
          style={{ width: 64, height: 64, objectFit: "contain" }}
        />
      ) : (
        <div
          style={{
            width: 64,
            height: 64,
            backgroundColor: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#999",
            borderRadius: 8,
          }}
        >
          ?
        </div>
      )}

      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
          {companyName} ({symbol})
        </h2>
        <p style={{ margin: "4px 0", fontWeight: "bold", fontSize: "1.1rem" }}>
          {currency} {price.toFixed(2)}
        </p>
        <p
          style={{
            margin: 0,
            color: priceChangeColor,
            fontWeight: "bold",
          }}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)} ({percentChange.toFixed(2)}%)
        </p>
      </div>
    </div>
  );
};

export default StockCard;
