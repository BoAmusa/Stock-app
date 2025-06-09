import * as React from "react";
import { useState } from "react";
import "../../App.css";
import {
  deleteUserStock,
  getStockInfoFH,
  saveUserStock,
} from "../../api/StockService.async";
import type {
  StockCardInfo,
  UserStockDocument,
} from "../../types/UserTypes.types";
import {
  searchButtonStyle,
  searchInputStyle,
  signOutButtonStyle,
} from "../../util/styles/Styles";
import StockCard from "../stock-card/StockCard";
import { StockCardSave } from "../stock-card/StockCardSave";
import { useNavigate } from "react-router-dom";
import { useFetchUserStocks } from "../../hooks/useFetchUserStocks";
import { useMsal } from "@azure/msal-react";
import { mergeStockCardsFromUserDocs } from "../../util/styles/Helper";
import { toast } from "react-toastify";

const StockBase: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME;
  const appDescription = import.meta.env.VITE_APP_DESCRIPTION;
  const [searchStock, setSearchStock] = useState("");
  const [stockInfo, setStockInfo] = useState<StockCardInfo | null>(null);
  const { savedStocks, setSavedStocks, isLoading, error } =
    useFetchUserStocks();
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const { accounts } = useMsal();
  const userEmail = accounts[0]?.username;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStock(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchStock) {
      const existingStock = savedStocks.find(
        (stock) => stock?.symbol?.toLowerCase() === searchStock.toLowerCase()
      );

      if (existingStock) {
        setStockInfo(existingStock);
        setShowError(false);
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
        .catch((_error) => {
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

  const handleSaveStock = async () => {
    if (stockInfo) {
      if (!userEmail) {
        console.error("User not logged in.");
        return;
      }

      const alreadyExists = savedStocks.some(
        (s) => s.symbol === stockInfo.symbol
      );
      const isAtLimit = savedStocks.length >= 5;
      // Check if the user has reached the limit of saved stocks
      if (isAtLimit && alreadyExists) {
        toast.info("Sorry you can only save up to 5 stocks.");
        return;
      } else if (alreadyExists) {
        toast.info("Stock already exists in your saved list.");
        return;
      } else if (isAtLimit) {
        toast.error("You can only save up to 5 stocks.");
        return;
      }

      try {
        const savedDoc = await saveUserStock(userEmail, stockInfo);
        const userStockDoc = savedDoc?.data as UserStockDocument;

        if (!userStockDoc?.stock) {
          console.error("Invalid stock document received");
          return;
        }

        // Merge the new stock with existing stocks
        const extractedStocks = mergeStockCardsFromUserDocs(savedStocks, [
          userStockDoc,
        ]);
        setSavedStocks(extractedStocks);
      } catch (err) {
        toast.error("Error saving stock:");
        console.error(`Error saving stock '${stockInfo.symbol}':`, err);
      }
    }
  };

  const handleRemoveStock = async (symbol: string) => {
    if (!userEmail) {
      console.error("User not logged in.");
      return;
    }

    try {
      await deleteUserStock(userEmail, symbol);
      setSavedStocks((prev) => prev.filter((stock) => stock.symbol !== symbol));
    } catch (err) {
      toast.error("Error deleting stock");
      console.error(`Error deleting stock '${symbol}':`, err);
    }
  };

  const handleSignOut = () => {
    navigate("/");
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
                width="20"
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

        {/* Conditional rendering with loading, error, stocks */}
        {isLoading ? (
          <div className="spinner" />
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
            Failed to load saved stocks. Please try again later.
          </div>
        ) : savedStocks.length > 0 ? (
          <div
            style={{
              width: "100%",
              padding: "0 20px",
              boxSizing: "border-box",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Saved Stocks</h2>
            <p style={{ textAlign: "center" }}>Save up to 5 maximum</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                overflowX: "auto",
                paddingBottom: "1rem",
                justifyContent: "center",
              }}
              aria-label="Saved Stocks List"
            >
              {savedStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  style={{
                    flex: "0 0 auto", // prevents shrinking in horizontal scroll
                    minWidth: "250px", // good base size for cards
                    maxWidth: "300px",
                  }}
                >
                  <StockCard
                    stockCardInfo={stock}
                    handleRemoveStock={handleRemoveStock}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>
            You have no saved stocks yet. Search and save some!
          </p>
        )}
      </div>
    </>
  );
};

export default StockBase;
