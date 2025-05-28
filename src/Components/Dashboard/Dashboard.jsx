import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, ShoppingCart } from "lucide-react";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import UserCard from "./UserCard";
import AllUsersCard from "./AllUsersCard";
import useFetchUsers from "@/hooks/useFetchUsers";
import { useFetchOrders } from "@/hooks/useFetchOrders";
import SearchedProduct from "./searchedProduct";

export default function Dashboard() {
  const { users, error: usersError, isLoading: usersLoading } = useFetchUsers();
  const {
    orders,
    error: ordersError,
    isLoading: ordersLoading,
  } = useFetchOrders();
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
                  <p className="text-lg font-semibold">{users.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <ShoppingCart className="text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-lg font-semibold">{orders.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <BarChart3 className="text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-lg font-semibold">$12,300</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Tabs defaultValue="searchuser" className="space-y-4">
            <TabsList className="flex gap-2 bg-muted p-2 rounded-xl shadow-sm">
              <TabsTrigger
                value="searchuser"
                className="px-4 py-2.5 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-400 transition"
              >
                Search User
              </TabsTrigger>
              <TabsTrigger
                value="searchusers"
                className="px-4 py-2.5 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-400 transition"
              >
                All Users
              </TabsTrigger>
            </TabsList>
            <TabsContent value="searchuser" className="space-y-4">
              <UserCard />
            </TabsContent>
            <TabsContent value="searchusers" className="space-y-4">
              <AllUsersCard />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
              <p>Detailed sales statistics will appear here.</p>
            </CardContent>
          </Card>
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
