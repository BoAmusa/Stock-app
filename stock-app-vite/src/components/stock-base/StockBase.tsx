import * as React from "react";
import { useState } from "react";
import "../../App.css";
import { getStockInfoFH } from "../../api/StockService.async";
import type { StockCardInfo } from "../../components/stock-card/StockCard.types";
import {
  searchButtonStyle,
  searchInputStyle,
  signOutButtonStyle,
} from "../../util/styles/Styles";
import StockCard from "../stock-card/StockCard";
import { StockCardSave } from "../stock-card/StockCardSave";
import { useNavigate } from "react-router-dom";

const StockBase: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME;
  const appDescription = import.meta.env.VITE_APP_DESCRIPTION;
  const [searchStock, setSearchStock] = useState("");
  const [stockInfo, setStockInfo] = useState<StockCardInfo | null>(null);
  const [savedStocks, setSavedStocks] = useState<StockCardInfo[]>([]);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStock(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchStock) {
      // Check if the stock is already saved to avoid duplicate API calls
      const existingStock = savedStocks.find(
        (stock) => stock.symbol.toLowerCase() === searchStock.toLowerCase()
      );

      if (existingStock) {
        setStockInfo(existingStock);
        setShowError(false);
        console.log("Stock already saved, using existing data.");
        return;
      }

      getStockInfoFH(searchStock)
        .then((info) => {
          if (info && info.price) {
            setStockInfo(info);
            setShowError(false);
          } else {
            setStockInfo(null);
            setShowError(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching stock info:", error);
          setStockInfo(null);
          setShowError(true);
        });
    } else {
      setStockInfo(null);
      setShowError(true);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSaveStock = () => {
    if (stockInfo) {
      setSavedStocks((prev) => {
        const alreadyExists = prev.some((s) => s.symbol === stockInfo.symbol);
        const isAtLimit = prev.length >= 5;

        if (alreadyExists || isAtLimit) return prev;

        return [...prev, stockInfo];
      });
    }
  };

  const handleRemoveStock = (symbol: string) => {
    setSavedStocks((prev) => prev.filter((stock) => stock.symbol !== symbol));
  };

  const handleSignOut = () => {
    navigate("/"); // redirect to landing page
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button onClick={handleSignOut} style={signOutButtonStyle}>
          Sign Out
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          justifyContent: "flex-start",
          paddingTop: "40px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <h1>{appName}</h1>
          <h2>{appDescription}</h2>

          <div
            style={{
              position: "relative",
              width: "250px",
              marginBottom: "20px",
            }}
            aria-label="Stock Search Input Group"
          >
            <input
              type="text"
              placeholder="Search for a stock..."
              value={searchStock}
              onChange={handleSearchChange}
              onKeyDown={handleInputKeyDown}
              style={searchInputStyle}
            />
            <button
              onClick={handleSearchClick}
              style={searchButtonStyle}
              aria-label="Search for stock"
            >
              <svg
                width="20" // slightly larger
                height="20"
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

          {searchStock !== "" && (
            <>
              {stockInfo ? (
                <StockCardSave
                  stockCardInfo={stockInfo}
                  handleSaveStock={handleSaveStock}
                />
              ) : (
                showError && (
                  <div>
                    <h3 className="error-text">
                      Please enter valid stock ticker symbol
                    </h3>
                  </div>
                )
              )}
            </>
          )}
        </div>

        {savedStocks.length > 0 && (
          <div style={{ width: "100%", padding: "0 20px" }}>
            <h2 style={{ textAlign: "center" }}>Saved Stocks</h2>
            <p>Save up to 5 maximum</p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                overflowX: "auto",
                paddingBottom: "1px",
              }}
              aria-label="Saved Stocks List"
            >
              {savedStocks.map((stock) => (
                <div key={stock.symbol}>
                  <StockCard
                    stockCardInfo={stock}
                    handleRemoveStock={handleRemoveStock}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StockBase;
