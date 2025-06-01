import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { supabase } from "@/supabaseClient";
export default function Sales({ orders = [], totalRevenue }) {
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTopProducts() {
    // Get order_items joined with products (only quantity >= 1)
    const { data, error } = await supabase
      .from("order_items")
      .select(
        `
          product_id,
          quantity,
          price,
          discount,
          title

        `
      )
      .gte("quantity", 1);

    if (error) {
      console.error("Error fetching order items", error);
      return;
    }

    // Aggregate sales by product
    const aggregated = (data || []).reduce((acc, item) => {
      const pid = item.product_id;
      const title = item.title || "Unknown Product";
      const netPrice = Number(item.price) - (Number(item.discount) || 0);
      const revenue = netPrice * Number(item.quantity);

      if (!acc[pid]) {
        acc[pid] = {
          product_id: pid,
          product_title: title,
          units_sold: 0,
          revenue: 0,
        };
      }
      acc[pid].units_sold += Number(item.quantity);
      acc[pid].revenue += revenue;
      return acc;
    }, {});

    // Sort by units sold descending
    const sorted = Object.values(aggregated).sort(
      (a, b) => b.units_sold - a.units_sold
    );

    setTopProducts(sorted.slice(0, 5));
  }

  async function fetchRecentOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("id, total_amount, payment_status, created_at, customer")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching recent orders", error);
      return;
    }

    setRecentOrders(data || []);
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([fetchTopProducts(), fetchRecentOrders()]);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Sales Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
          <p className="text-2xl">${totalRevenue.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
          <p className="text-2xl">{orders.length}</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Top Product</h2>
          <p className="text-xl">
            {topProducts[0]?.product_title || "No data available"}
          </p>
        </Card>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Selling Products</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Units Sold</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              topProducts.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>{product.product_title}</TableCell>
                  <TableCell>{product.units_sold}</TableCell>
                  <TableCell>${product.revenue.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No recent orders found
                </TableCell>
              </TableRow>
            ) : (
              recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    ${Number(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>{order.payment_status}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
