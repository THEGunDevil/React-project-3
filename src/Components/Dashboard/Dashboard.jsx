import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, ShoppingCart } from "lucide-react";
import AddProduct from "./AddProduct";
export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 mt-14 md:mt-20">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="addProduct">Add Product</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <Users className="text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Users</p>
                  <p className="text-lg font-semibold">1,240</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <ShoppingCart className="text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-lg font-semibold">320</p>
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
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">User Search</h2>
              <Input placeholder="Search users..." />
              <Button className="mt-4">Search</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
              <p>Detailed sales statistics will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="addProduct">
          <Card>
            <CardContent className="p-6">
              <AddProduct />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
