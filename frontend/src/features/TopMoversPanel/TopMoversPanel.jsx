import React, { useState, useEffect, useCallback } from 'react';
import DataCard from '../../components/DataCard/DataCard';
import DataCardSkeleton from '../../components/DataCard/DataCardSkeleton';
import { fetchTopGainer, fetchTopLoser } from '../../services/apiClient';
import useInterval from '../../hooks/useInterval';

const REFRESH_INTERVAL = 60000;

const TopMoversPanel = () => {
  const [gainer, setGainer] = useState(null);
  const [loser, setLoser] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  console.log("Top gainer", gainer);
  console.log("Top loser", loser);

  // Keep track of errors separately for display
  const [gainerError, setGainerError] = useState(null);
  const [loserError, setLoserError] = useState(null);

  const fetchData = useCallback(async (isInitialLoad = false) => {
    // Clear errors at the start of any fetch attempt
    setGainerError(null);
    setLoserError(null);

    // If it's the initial load, ensure data state starts null
    if (isInitialLoad) {
        setGainer(null);
        setLoser(null);
    }
    // *** NOTE: We DON'T clear gainer/loser state here for background refreshes ***

    // Fetch in parallel
    const gainerPromise = fetchTopGainer().catch(err => {
        console.error("Gainer Fetch Error:", err); // Log background errors
        setGainerError(err); // Set specific error for the card
        return 'FETCH_ERROR'; // Indicate error without stopping Promise.all
    });
    const loserPromise = fetchTopLoser().catch(err => {
        console.error("Loser Fetch Error:", err); // Log background errors
        setLoserError(err); // Set specific error for the card
        return 'FETCH_ERROR'; // Indicate error
    });

    // Wait for both fetches
    const [gainerResult, loserResult] = await Promise.all([gainerPromise, loserPromise]);

    // *** Update state ONLY if the fetch was successful ***
    // This prevents setting state to null or 'FETCH_ERROR'
    if (gainerResult !== 'FETCH_ERROR') {
      setGainer(gainerResult);
    }
    // If fetch failed, gainerError is already set, and gainer state retains old value

    if (loserResult !== 'FETCH_ERROR') {
      setLoser(loserResult);
    }
    // If fetch failed, loserError is already set, and loser state retains old value

    // Turn off initial loading state only once
    if (isInitialLoad) {
      setIsInitialLoading(false);
    }
  }, []); // Empty dependency array: function doesn't depend on state it modifies

  // Initial fetch
  useEffect(() => {
    setIsInitialLoading(true);
    fetchData(true);
  }, [fetchData]); // Run once

  // Set up the interval for background refresh
  useInterval(() => {
    console.log('Refreshing Top Movers...'); // Add log for debugging
    fetchData(false);
  }, REFRESH_INTERVAL);

  return (
    <section aria-labelledby="top-movers-title">
      <h2 id="top-movers-title" className="text-2xl font-semibold mb-4">Top Movers (24h)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Initial Load: Show Skeleton */}
        {isInitialLoading ? (
          <DataCardSkeleton title="Top Gainer" />
        ) : (

          // After Initial Load: Show DataCard, passing current data/error
          <DataCard
            title="Top Gainer"
            // Pass the current gainer state (which holds old data during failed refresh)
            data={gainer}
            // Pass isLoading=false because skeleton handles initial load
            isLoading={false}
            // Pass the specific error state for this card
            error={gainerError}
          />
        )}
        {isInitialLoading ? (
          <DataCardSkeleton title="Top Loser" />
        ) : (
          <DataCard
            title="Top Loser"
            data={loser}
            isLoading={false}
            error={loserError}
          />
        )}
      </div>
    </section>
  );
};

export default TopMoversPanel;