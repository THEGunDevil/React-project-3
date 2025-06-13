import { supabase } from "@/supabaseClient";
import { useCallback, useEffect, useState } from "react";
export const useSupabaseQuery = ({
  table,
  select = "*",
  filters = [],
  orderBy = null,
  limit = null,
  offset = null,
  single = false, // <-- add this
  enabled = true,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(select);

      // Apply filters
      filters.forEach(({ column, operator, value }) => {
        if (query[operator]) {
          query = query[operator](column, value);
        } else {
          console.warn(`Unsupported operator: ${operator}`);
        }
      });

      // Order
      if (orderBy?.column) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? true,
        });
      }

      // Limit and offset (skip if single is true, since .single() handles it)
      if (!single) {
        if (limit !== null) query = query.limit(limit);
        if (offset !== null && limit !== null)
          query = query.range(offset, offset + limit - 1);
      }

      // If single is true, use .single()
      if (single) {
        const { data, error } = await query.single();
        if (error) {
          setError(error.message);
          setData(null);
        } else {
          setData(data);
        }
      } else {
        const { data, error } = await query;
        if (error) {
          setError(error.message);
          setData(null);
        } else {
          setData(data);
        }
      }
    } catch (err) {
      setError("Unexpected error: " + err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [table, select, filters, orderBy, limit, offset, single]);

  useEffect(() => {
    if (enabled) fetchData();
  }, [enabled]);

  return { data, loading, error, refetch: fetchData };
};
