'use client';

import { useState, useEffect } from 'react';

// Simple in-memory cache
const cache = new Map();

export default function useFetch(url, options = {}) {
  const { revalidate = 300000 } = options; // 5 minutes default cache time
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        console.log('useFetch: Starting fetch for URL:', url);
        
        // Check cache first
        const cachedData = cache.get(url);
        if (cachedData && Date.now() - cachedData.timestamp < revalidate) {
          console.log('useFetch: Using cached data for:', url);
          if (mounted) {
            setData(cachedData.data);
            setLoading(false);
            setError(null);
          }
          return;
        }

        if (mounted) {
          setLoading(true);
          setError(null);
        }
        
        console.log('useFetch: Making fetch request to:', url);
        const response = await fetch(url);
        
        console.log('useFetch: Response status:', response.status, 'for URL:', url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const result = await response.json();
        
        console.log('useFetch: Data received for:', url, 'Data:', result);
        
        // Cache the result
        cache.set(url, {
          data: result,
          timestamp: Date.now()
        });
        
        if (mounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        console.log('useFetch: Error for URL:', url, 'Error:', err.message);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [url, revalidate]);

  return { data, loading, error };
}
