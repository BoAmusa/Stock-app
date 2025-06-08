import * as React from "react";
import { useState } from "react";
import "../../App.css";
import { getStockInfoFH } from "../../api/StockService.async";
import type { StockCardInfo } from "../../components/stock-card/StockCard.types";

const StockBase: React.FC = () => {
  const [title] = useState("Stock App");
  const [subtitle] = useState("A simple stock market app");
  const [searchStock, setSearchStock] = useState("");
  const [stockInfo, setStockInfo] = useState<StockCardInfo | null>(null);
  const [savedStocks, setSavedStocks] = useState<StockCardInfo[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStock(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchStock) {
      getStockInfoFH(searchStock)
        .then((info) => {
          if (info && info.price) {
            setStockInfo(info);
          } else {
            setStockInfo(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching stock info:", error);
          setStockInfo(null);
        });
    } else {
      setStockInfo(null);
    }
  };

  const handleSaveStock = () => {
    if (stockInfo) {
      setSavedStocks((prev) => [...prev, stockInfo]);
    }
  };

  return (
    <>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>

      <div
        style={{ position: "relative", width: "250px", marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="Search for a stock..."
          value={searchStock}
          onChange={handleSearchChange}
          style={{
            width: "100%",
            padding: "8px 40px 8px 8px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleSearchClick}
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            height: "24px",
            width: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Search"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
        </button>
      </div>

      {stockInfo ? (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
            maxWidth: "300px",
          }}
        >
          <img
            src={stockInfo.logo}
            alt={`${stockInfo.symbol} logo`}
            style={{ height: "40px", marginBottom: "8px" }}
          />
          <h3>
            {stockInfo.companyName} ({stockInfo.symbol})
          </h3>
          <p>
            Price: ${stockInfo.price.toFixed(2)} {stockInfo.currency}
          </p>
          <p>
            Change: {stockInfo.change > 0 ? "+" : ""}
            {stockInfo.change.toFixed(2)} ({stockInfo.percentChange.toFixed(2)}
            %)
          </p>
          <button
            onClick={handleSaveStock}
            style={{
              marginTop: "10px",
              padding: "6px 12px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      ) : searchStock !== "" ? (
        <div>
          <h3>No stock info available</h3>
        </div>
      ) : null}

      {savedStocks.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>Saved Stocks</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "10px",
            }}
          >
            {savedStocks.map((stock, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  width: "250px",
                  minWidth: "250px",
                  flex: "0 0 auto",
                  background: "#fff",
                }}
              >
                <img
                  src={stock.logo}
                  alt={`${stock.symbol} logo`}
                  style={{ height: "30px" }}
                />
                <h4>
                  {stock.companyName} ({stock.symbol})
                </h4>
                <p>
                  Price: ${stock.price.toFixed(2)} {stock.currency}
                </p>
                <p>
                  Change: {stock.change.toFixed(2)} (
                  {stock.percentChange.toFixed(2)}%)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default StockBase;
