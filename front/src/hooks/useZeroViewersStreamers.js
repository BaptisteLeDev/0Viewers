import { useState, useEffect } from 'react';
import { getZeroViewersStreamers } from '../services/api';

export const useZeroViewersStreamers = () => {
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStreamers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getZeroViewersStreamers();
      
      setStreamers(data.data || []);
      setLastUpdated(new Date(data.timestamp));
      
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des streamers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreamers();
  }, []);

  const refresh = () => {
    fetchStreamers();
  };

  return {
    streamers,
    loading,
    error,
    lastUpdated,
    refresh,
    count: streamers.length
  };
};