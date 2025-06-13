import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/supabaseClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BanIcon, CheckCircle, Circle, Info, Trash2 } from "lucide-react";
import Spinner from "../Loader/Spinner";
import { toast } from "react-toastify";
import { DeleteConfirmPopUp } from "../DeleteConfirmPopUp";
import { BanConfirmPopUp } from "../BanConfirmPopUp";
import Fallback from "../Loader/Fallback";
import { useUtils } from "@/hooks/useUtils";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { UserOrdersTable } from "./UserOrdersTable";
import { FaUser } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import SearchBox from "./SearchBox";

export default function AllUsersCard() {
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm();
  const { CalculateLocalDate } = useUtils();
  const {
    data: users,
    error: userError,
    loading: userLoading,
  } = useSupabaseQuery({ table: "users" });
  const [banLoadingId, setBanLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [banPopUp, setBanPopUp] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [banErrorMessage, setBanErrorMessage] = useState("");
  const [deleteInputValue, setDeleteInputValue] = useState("");
  const [banInputValue, setBanInputValue] = useState("");
  const [selectedDeleteUser, setSelectedDeleteUser] = useState({
    id: null,
    name: "",
  });
  const [selectedBanUser, setSelectedBanUser] = useState({
    id: null,
    name: "",
    currentStatus: null,
  });
  // const searchedEmailInput = watch("email");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [searchedUser, setSearchedUser] = useState(null);

  // const FindUser = () => {
  //   const found = users?.find((user) => user.email === searchedEmailInput);
  //   if (found) {
  //     setSearchedUser(found);
  //   } else {
  //     setSearchedUser(null);
  //   }
  // };

  const onViewOrders = (userId) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  const confirmBtn = async () => {
    const matchingText = selectedBanUser.currentStatus
      ? "Confirm Ban"
      : "Confirm Unban";
    if (banInputValue === matchingText) {
      try {
        setBanLoadingId(selectedBanUser.id);
        const { error } = await supabase
          .from("users")
          .update({ is_active: !selectedBanUser.currentStatus })
          .eq("id", selectedBanUser.id);
        if (error) {
          toast.error("Failed to update user status");
          console.error("Error updating user status:", error.message);
          setBanErrorMessage("Error updating user status.");
          return;
        }
        setBanPopUp(false);
        setBanInputValue("");
        setBanErrorMessage("");
        setSelectedBanUser({ id: null, name: "", currentStatus: null });
        await refetch();
        toast.success(
          `User ${selectedBanUser.name} ${
            selectedBanUser.currentStatus ? "banned" : "unbanned"
          } successfully!`
        );
      } catch (error) {
        toast.error("Unexpected error occurred");
        console.error("Unexpected error:", error.message);
        setBanErrorMessage("An unexpected error occurred. Please try again.");
      } finally {
        setBanLoadingId(null);
      }
    } else {
      setBanErrorMessage(`You must type '${matchingText}' exactly to proceed.`);
    }
  };

  const confirmDelete = async () => {
    if (deleteInputValue === "Confirm Delete") {
      try {
        setDeleteLoadingId(selectedDeleteUser.id);
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", selectedDeleteUser.id);
        if (error) {
          toast.error("Failed to delete user");
          console.error("Error deleting user:", error.message);
          setDeleteErrorMessage("Failed to delete user. Please try again.");
          return;
        }
        setDeletePopUp(false);
        setDeleteInputValue("");
        setDeleteErrorMessage("");
        setSelectedDeleteUser({ id: null, name: "" });
        await refetch();
        toast.success(`User ${selectedDeleteUser.name} deleted successfully!`);
      } catch (error) {
        toast.error("Unexpected error occurred");
        console.error("Unexpected error:", error.message);
        setDeleteErrorMessage(
          "An unexpected error occurred. Please try again."
        );
      } finally {
        setDeleteLoadingId(null);
      }
    } else {
      setDeleteErrorMessage(
        "You must type 'Confirm Delete' exactly to proceed."
      );
    }
  };

  const cancelBtn = () => {
    setBanPopUp(false);
    setBanInputValue("");
    setBanErrorMessage("");
    setSelectedBanUser({ id: null, name: "", currentStatus: null });
  };

  const cancelDelete = () => {
    setDeletePopUp(false);
    setDeleteInputValue("");
    setDeleteErrorMessage("");
    setSelectedDeleteUser({ id: null, name: "" });
  };

  if (userLoading)
    return (
      <div className="flex justify-center">
        <Fallback />
      </div>
    );
  if (userError)
    return (
      <Card className="p-4 text-center text-red-500">
        Error loading users: {userError.message}
      </Card>
    );

  return (
    <section className="space-y-4">
      <SearchBox
        inputType="email"
        data={users}
        setSearchedData={setSearchedUser}
        loading={userLoading}
      />
      {/* <Card>
        <CardContent className="sm:w-xl max-w-xl mx-auto p-5">
          <h2 className="text-2xl font-bold mb-4">User Search</h2>
          <form
            onSubmit={handleSubmit(FindUser)}
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
                {...register("email", { required: "Email is required" })}
                className="w-full"
              />
              {errors.email && (
                <p className="text-destructive text-[13px] mt-1">
                  {errors.email.message}
                </p>
              )}
              <p className="text-muted-foreground flex items-center gap-1 text-[13px] mt-1">
                <Info size={13} />
                NOTE: User email address is required to get the user
                information.
              </p>
            </div>
            <Button
              type="submit"
              disabled={!searchedEmailInput || userLoading}
              className="hover:bg-green-400 cursor-pointer"
            >
              Search User
            </Button>
          </form>
        </CardContent>
      </Card> */}
      <Card>
        <Table>
          <TableCaption>
            {searchedUser
              ? "Showing searched user"
              : users?.length > 0
              ? "A list of all users."
              : "No users found."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Joined At</TableHead>
              <TableHead className="text-center">Phone</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchedUser ? (
              <React.Fragment key={searchedUser.id}>
                <TableRow className="text-center">
                  <TableCell className="text-center w-70">
                    <div className="font-medium text-center flex items-center justify-between">
                      <Avatar className="hidden lg:block">
                        <AvatarImage
                          src={
                            searchedUser.image ||
                            "/Images/default-avatar-icon-of-social-media-user-vector.jpg"
                          }
                          alt={`${searchedUser.firstname} ${searchedUser.lastname}`}
                        />
                        <AvatarFallback>
                          {searchedUser.firstname?.[0]}
                          {searchedUser.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {searchedUser.firstname} {searchedUser.lastname}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{searchedUser.email}</TableCell>
                  <TableCell>
                    {CalculateLocalDate(searchedUser.created_at)}
                  </TableCell>
                  <TableCell>{searchedUser.phone || "Not Provided"}</TableCell>
                  <TableCell>{searchedUser.role || "User"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={searchedUser.is_active ? "success" : "secondary"}
                      className="ml-auto"
                    >
                      <Circle
                        className={`w-3 h-3 ${
                          searchedUser.is_active
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                        fill={searchedUser.is_active ? "#22c55e" : "#ef4444"}
                      />
                      {searchedUser.is_active ? "Active" : "Banned"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center space-x-3 justify-center">
                    <Button
                      aria-label={
                        searchedUser.is_active ? "Ban user" : "Unban user"
                      }
                      variant={
                        searchedUser.is_active ? "outline" : "destructive"
                      }
                      onClick={() => {
                        setSelectedBanUser({
                          id: searchedUser.id,
                          name: `${searchedUser.firstname} ${searchedUser.lastname}`,
                          currentStatus: searchedUser.is_active,
                        });
                        setBanPopUp(true);
                      }}
                      disabled={banLoadingId === searchedUser.id}
                      className="cursor-pointer hover:shadow-md"
                    >
                      {banLoadingId === searchedUser.id ? (
                        <Spinner />
                      ) : searchedUser.is_active ? (
                        <CheckCircle />
                      ) : (
                        <BanIcon />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => onViewOrders(searchedUser.id)}
                      className="hover:shadow-md cursor-pointer hover:text-primary"
                    >
                      Orders
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => onViewProfile(searchedUser.id)}
                      className="hover:shadow-md cursor-pointer hover:text-primary"
                    >
                      <FaUser />
                    </Button>
                    <Button
                      aria-label={`Delete user ${searchedUser.firstname} ${searchedUser.lastname}`}
                      variant="ghost"
                      className="text-gray cursor-pointer hover:text-destructive hover:bg-none hover:shadow-md"
                      onClick={() => {
                        setSelectedDeleteUser({
                          id: searchedUser.id,
                          name: `${searchedUser.firstname} ${searchedUser.lastname}`,
                        });
                        setDeletePopUp(true);
                      }}
                    >
                      {deleteLoadingId === searchedUser.id ? (
                        <Spinner />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedUserId === searchedUser.id && (
                  <TableRow className="hover:bg-white">
                    <TableCell colSpan={8}>
                      <UserOrdersTable userId={searchedUser.id} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ) : users?.length > 0 ? (
              users.map((user) => (
                <React.Fragment key={user.id}>
                  <TableRow className="text-center">
                    <TableCell className="text-center w-70">
                      <div className="font-medium text-center flex items-center justify-between">
                        <Avatar className="hidden lg:block">
                          <AvatarImage
                            src={
                              user.image ||
                              "/Images/default-avatar-icon-of-social-media-user-vector.jpg"
                            }
                            alt={`${user.firstname} ${user.lastname}`}
                          />
                          <AvatarFallback>
                            {user.firstname?.[0]}
                            {user.lastname?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {user.firstname} {user.lastname}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{CalculateLocalDate(user.created_at)}</TableCell>
                    <TableCell>{user.phone || "Not Provided"}</TableCell>
                    <TableCell>{user.role || "User"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_active ? "success" : "secondary"}
                        className="ml-auto"
                      >
                        <Circle
                          className={`w-3 h-3 ${
                            user.is_active ? "text-green-500" : "text-red-500"
                          }`}
                          fill={user.is_active ? "#22c55e" : "#ef4444"}
                        />
                        {user.is_active ? "Active" : "Banned"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center space-x-3 justify-center">
                      <Button
                        aria-label={user.is_active ? "Ban user" : "Unban user"}
                        variant={user.is_active ? "outline" : "destructive"}
                        onClick={() => {
                          setSelectedBanUser({
                            id: user.id,
                            name: `${user.firstname} ${user.lastname}`,
                            currentStatus: user.is_active,
                          });
                          setBanPopUp(true);
                        }}
                        disabled={banLoadingId === user.id}
                        className="cursor-pointer hover:shadow-md"
                      >
                        {banLoadingId === user.id ? (
                          <Spinner />
                        ) : user.is_active ? (
                          <CheckCircle />
                        ) : (
                          <BanIcon />
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => onViewOrders(user.id)}
                        className="hover:shadow-md cursor-pointer hover:text-primary"
                      >
                        Orders
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => onViewProfile(user.id)}
                        className="hover:shadow-md cursor-pointer hover:text-primary"
                      >
                        <FaUser />
                      </Button>
                      <Button
                        aria-label={`Delete user ${user.firstname} ${user.lastname}`}
                        variant="ghost"
                        className="text-gray cursor-pointer hover:text-destructive hover:bg-none hover:shadow-md"
                        onClick={() => {
                          setSelectedDeleteUser({
                            id: user.id,
                            name: `${user.firstname} ${user.lastname}`,
                          });
                          setDeletePopUp(true);
                        }}
                      >
                        {deleteLoadingId === user.id ? <Spinner /> : <Trash2 />}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedUserId === user.id && (
                    <TableRow className="hover:bg-white">
                      <TableCell colSpan={8}>
                        <UserOrdersTable userId={user.id} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No user found for the provided email.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {deletePopUp && (
        <DeleteConfirmPopUp
          deletePopUp={deletePopUp}
          cancelDelete={cancelDelete}
          confirmDelete={confirmDelete}
          inputValue={deleteInputValue}
          setInputValue={setDeleteInputValue}
          errorMessage={deleteErrorMessage}
        />
      )}
      {banPopUp && (
        <BanConfirmPopUp
          banPopUp={banPopUp}
          cancelBtn={cancelBtn}
          confirmBtn={confirmBtn}
          inputValue={banInputValue}
          setInputValue={setBanInputValue}
          errorMessage={banErrorMessage}
          currentStatus={selectedBanUser.currentStatus}
        />
      )}
    </section>
  );
}
