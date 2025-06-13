import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, ShoppingCart } from "lucide-react";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import AllUsersCard from "./AllUsersCard";
import SearchedProduct from "./searchedProduct";
import Orders from "./Orders";
import Sales from "./Sales";
import { useEffect, useState } from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
export default function Dashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);

  const {
    data: users = [],
    error: usersError,
    loading: usersLoading,
  } = useSupabaseQuery({ table: "users" });
  if (usersError) {
    console.error(usersError);
    return (
      <h1 className="text-center text-destructive text-xl font-bold font-primary">
        There was an error fetching data.
      </h1>
    );
  }
  const {
    data: orders = [],
    error: ordersError,
    isLoading: ordersLoading,
  } = useSupabaseQuery({ table: "orders" });
  if (ordersError) {
    console.error("There was an error fetching orders data.");
    return (
      <h1 className="text-center text-destructive text-xl font-bold font-primary">
        There was an error fetching data.
      </h1>
    );
  }
  useEffect(() => {
    if (!ordersLoading && Array.isArray(orders)) {
      const revenue = orders
        .filter((order) => order.payment_status === "Pending")
        .reduce((sum, order) => sum + Number(order.total_amount), 0);
      setTotalRevenue(revenue);
    }
  }, [orders, ordersLoading]);

  return (
    <div className="p-6 space-y-6 mt-14 md:mt-20 font-primary">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex gap-2 bg-muted p-2 rounded-xl shadow-sm">
          <TabsTrigger
            value="overview"
            className="px-4 py-2.5 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-400 transition"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="px-4 py-2.5 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-400 transition"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="px-4 py-2.5 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-400 transition"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="px-4 py-2.5 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-400 transition"
          >
            Sales
          </TabsTrigger>
          <TabsTrigger
            value="product"
            className="px-4 py-2.5 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-400 transition"
          >
            Product
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <Users className="text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Users</p>
                  <p className="text-lg font-semibold">
                    {usersLoading
                      ? "Loading.."
                      : users?.length > 0
                      ? users.length
                      : "No Users"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <ShoppingCart className="text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-lg font-semibold">
                    {ordersLoading
                      ? "Loading..."
                      : orders?.length > 0
                      ? orders.length
                      : "NO ORDERS"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <BarChart3 className="text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-lg font-semibold">${totalRevenue}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div></div>
        </TabsContent>

        <TabsContent value="users">
          <AllUsersCard />
        </TabsContent>
        <TabsContent value="orders">
          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : (
            <Orders orders={orders} />
          )}{" "}
        </TabsContent>
        <TabsContent value="sales">
          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : (
            <Sales orders={orders} totalRevenue={totalRevenue} />
          )}
        </TabsContent>
        <TabsContent value="product">
          <Tabs defaultValue="searchproduct" className="space-y-4">
            <TabsList className="flex gap-2 bg-muted p-2 rounded-xl shadow-sm">
              <TabsTrigger
                value="searchproduct"
                className="px-4 py-2.5 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-400 transition"
              >
                Search Product
              </TabsTrigger>
              <TabsTrigger
                value="addproduct"
                className="px-4 py-2.5 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-400 transition"
              >
                Add Product
              </TabsTrigger>
              <TabsTrigger
                value="updateproduct"
                className="px-4 py-2.5 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-400 transition"
              >
                Update Product
              </TabsTrigger>
            </TabsList>
            <TabsContent value="searchproduct">
              <SearchedProduct />
            </TabsContent>
            <TabsContent value="addproduct">
              <Card>
                <CardContent className="p-6">
                  <AddProduct />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="updateproduct">
              <Card>
                <CardContent className="p-6">
                  <UpdateProduct />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
