// components/UserCard.js
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Fallback from "../Loader/Fallback";
import { useState } from "react";
import { useFetchSnglUser } from "@/hooks/useFetchsnglUser";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
export default function UserCard() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const searchedEmail = watch("email")
  const [searchedUser, setSearchedUser] = useState(null);

  const { user, error: userError, isLoading } = useFetchSnglUser(searchedEmail);

  const fetchUser = (e) => {
    if (user) {
      setSearchedUser(user);
      console.log("Fetched user:", user);
    }
    if (userError) {
      console.error(userError);
    }
  };
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">User Search</h2>
          <form
            onSubmit={handleSubmit(fetchUser)}
            className="md:space-y-5 space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary text-lg">
User Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter user email"
                {...register("email")}
              />
              {errors.id && (
                <p className="text-destructive text-[13px] mt-1">
                  {errors.id.message}
                </p>
              )}
              <p className="text-muted-foreground flex items-center gap-1 text-[13px] mt-1">
                <Info size={13} />
                NOTE: User email address is required to get the user information.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !searchedEmail}
              className="hover:bg-green-400 cursor-pointer"
            >
              Search User
            </Button>
          </form>
          {userError && (
            <p className="mt-2 text-destructive">
              There was an error fetching the user
            </p>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <Fallback />
      ) : searchedUser ? (
        <Card className="w-full">
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={searchedUser.imageUrl}
                alt={searchedUser.name}
              />
              <AvatarFallback>{searchedUser.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold">{searchedUser.name}</h2>
              <p className="text-sm text-muted-foreground">
                {searchedUser.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchedUser.role || "User"}
              </p>
            </div>
            <Button variant="outline">View Profile</Button>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
