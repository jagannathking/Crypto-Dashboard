// src/hooks/useInterval.js
import { useEffect, useRef } from 'react';

/**
 * Custom hook for setting up an interval that calls a callback function.
 * Handles cleanup automatically.
 * @param {function} callback - The function to call on each interval tick.
 * @param {number | null} delay - The interval delay in milliseconds. Pass null to pause.
 */
function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            // Clear interval on cleanup
            return () => clearInterval(id);
        }
        // If delay is null, do nothing (interval is paused)
    }, [delay]);
}

export default useInterval;