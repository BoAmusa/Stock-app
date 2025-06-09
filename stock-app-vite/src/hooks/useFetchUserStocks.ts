import { useMsal } from "@azure/msal-react";
import type { StockCardInfo } from "../types/UserTypes.types";
import * as React from "react";
import { useState } from "react";
import { getStockPrices, getUserStocks } from "../api/StockService.async";
import { extractStocksFromUserDocs } from "../util/styles/Helper";

export const useFetchUserStocks = () => {
  const { accounts, inProgress } = useMsal(); // Get 'inProgress' to know if MSAL is busy
  const [savedStocks, setSavedStocks] = useState<StockCardInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // useRef to keep track if the fetch has already occurred in this session
  // This value persists across re-renders but doesn't trigger them.
  const hasFetchedOnce = React.useRef<boolean>(false);

  React.useEffect(() => {
    // Only proceed if MSAL is not currently in progress (e.g., login, acquireToken)
    // and if we haven't fetched stocks yet in this session.
    if (inProgress === "none" && !hasFetchedOnce.current) {
      const fetchStocks = async () => {
        setIsLoading(true);
        setError(null); // Clear previous errors

        const userEmail = accounts[0]?.username;

        if (!userEmail) {
          // If no user is logged in, or email isn't available yet,
          // we set loading to false but don't treat it as an error for now,
          // as the user might not be logged in or the account isn't ready.
          console.log("No user logged in or user email not available yet.");
          setIsLoading(false);
          return;
        }

        try {
          console.log("Attempting to fetch user stocks for:", userEmail);
          const userStocks = await getUserStocks(userEmail);

          if (userStocks && userStocks.length > 0) {
            const extractedStocks: StockCardInfo[] =
              extractStocksFromUserDocs(userStocks);
            const symbols = extractedStocks.map((s: any) => s.symbol);
            if (symbols.length > 0) {
              const latestPrices = await getStockPrices(symbols);

              // Merge latest prices into the extracted stocks
              const mergedStocks = extractedStocks.map((stock) => {
                const latest = latestPrices.find(
                  (p) => p.symbol === stock.symbol
                );
                return latest
                  ? {
                      ...stock,
                      price: latest.price,
                      change: latest.change,
                      percentChange: latest.percentChange,
                      currency: latest.currency,
                      priceChangeColor:
                        latest.change > 0
                          ? "green"
                          : latest.change < 0
                          ? "red"
                          : "gray",
                    }
                  : stock; // fallback to original
              });

              setSavedStocks(mergedStocks);
            } else {
              setSavedStocks(extractedStocks); // No symbols to update, show original
            }
          } else {
            setSavedStocks([]); // Ensure state is empty if no stocks found
          }
          //hasFetchedOnce.current = true; // Mark as fetched for this session
        } catch (err: any) {
          console.error("Error fetching user stocks:", err);
          setError(err);
          setSavedStocks([]); // Clear stocks on error
        } finally {
          setIsLoading(false);
        }
      };

      fetchStocks();
    }
  }, [accounts, inProgress]); // Depend on accounts and inProgress to trigger when user is logged in

  return { savedStocks, setSavedStocks, isLoading, error };
};
