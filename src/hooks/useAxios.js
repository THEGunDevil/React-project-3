import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAxios(baseUrl, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = null,
    params = {},
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios({
          url: baseUrl,
          method,
          data: body,
          headers,
          params,
        });
        setData(response.data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl, method, JSON.stringify(body), JSON.stringify(headers), JSON.stringify(params)]);

  return { data, error, loading };
}
