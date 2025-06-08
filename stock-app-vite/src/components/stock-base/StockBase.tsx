import * as React from "react";
import { useState } from "react";
import "../../App.css";
import {
  deleteUserStock,
  getStockInfoFH,
  saveUserStock,
} from "../../api/StockService.async";
import type { StockCardInfo } from "../../types/UserTypes.types";
import {
  searchButtonStyle,
  searchInputStyle,
  signOutButtonStyle,
} from "../../util/styles/Styles";
import StockCard from "../stock-card/StockCard";
import { StockCardSave } from "../stock-card/StockCardSave";
import { useNavigate } from "react-router-dom";
import { useFetchUserStocksOnce } from "../../hooks/useFetchUserStocksOnce";
import { useMsal } from "@azure/msal-react";

const StockBase: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME;
  const appDescription = import.meta.env.VITE_APP_DESCRIPTION;
  const [searchStock, setSearchStock] = useState("");
  const [stockInfo, setStockInfo] = useState<StockCardInfo | null>(null);
  const { savedStocks, setSavedStocks, isLoading, error } =
    useFetchUserStocksOnce();
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const { accounts } = useMsal();
  const userEmail = accounts[0]?.username; // Get user email from MSAL account

  // const fetcthUserStocks = async () => {
  //   // This function can be used to fetch user-specific stocks if needed.
  //   const { accounts } = useMsal();
  //     const userEmail = accounts[0]?.username;
  //     try {
  //       const userStocks = await getUserStocks(userEmail);
  //       if (userStocks && userStocks.length > 0) {
  //         setSavedStocks(userStocks);
  //          console.log("User stocks: ", userStocks);
  //       } else {
  //         console.log("No stocks found for the user.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user stocks: ", error);
  //     }
  //   }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStock(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchStock) {
      // Check if the stock is already saved to avoid duplicate API calls
      const existingStock = savedStocks.find(
        (stock) => stock?.symbol?.toLowerCase() === searchStock.toLowerCase()
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

  const handleSaveStock = async () => {
    if (stockInfo) {
      if (!userEmail) {
        console.error("User not logged in. Cannot save stock.");
        // Consider displaying a user-friendly message, e.g., a toast notification
        return;
      }

      const alreadyExists = savedStocks.some(
        (s) => s.symbol === stockInfo.symbol
      );
      const isAtLimit = savedStocks.length >= 5;

      if (alreadyExists) {
        console.warn(
          "Stock already exists in your saved list. Not saving again."
        );
        // Provide user feedback that stock is already saved
        return;
      }
      if (isAtLimit) {
        console.warn(
          "You have reached the maximum limit of 5 saved stocks. Cannot add more."
        );
        // Provide user feedback about the limit
        return;
      }

      try {
        // Call the saveUserStock API function
        const savedDoc = await saveUserStock(userEmail, stockInfo); // stockInfo directly maps to StockCardInfo
        console.log("Stock successfully saved to Cosmos DB:", savedDoc);

        // Update local state: add the newly saved stock from the backend response.
        // Assuming `savedDoc` contains the full document returned by Cosmos DB,
        // which includes the `id` you generate on the backend.
        setSavedStocks((prev) => [...prev, savedDoc.data]); // Access the `data` property from the backend response
      } catch (err) {
        console.error("Error saving stock:", err);
        // Display an error message to the user
      }
    }
  };

  const handleRemoveStock = async (symbol: string) => {
    if (!userEmail) {
      console.error("User not logged in. Cannot remove stock.");
      return;
    }

    // Find the full stock object to get its `id` if needed for deletion
    // Your backend's DeleteUserStock expects `stockId` and `userId`.
    // The `id` generated on POST is `${body.stock.symbol}-${Date.now()}`.
    // So, if your `symbol` is actually the full `id`, use `symbol`.
    // If your `symbol` is just like "MSFT" and the `id` is "MSFT-12345678",
    // you need to pass the full `id` to the backend delete function.
    // For now, assuming `symbol` IS the `stockId` or part of it, and your backend handles it.
    // If not, you'd need to find the `id` from `savedStocks` first:
    // const stockToDelete = savedStocks.find(s => s.symbol === symbol);
    // if (!stockToDelete || !stockToDelete.id) {
    //   console.error("Could not find stock to delete or its ID.");
    //   return;
    // }
    // await deleteUserStock(userEmail, stockToDelete.id);

    try {
      // Call the deleteUserStock API function
      await deleteUserStock(userEmail, symbol); // Assuming symbol acts as stockId for deletion
      console.log(`Stock '${symbol}' successfully deleted from Cosmos DB.`);

      // Update local state after successful backend deletion
      setSavedStocks((prev) => prev.filter((stock) => stock.symbol !== symbol));
    } catch (err) {
      console.error(`Error deleting stock '${symbol}':`, err);
      // Display an error message to the user
    }
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
