import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useFetchUsers from "@/hooks/useFetchUsers";
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
import { BanIcon, CheckCircle, Circle, Trash2 } from "lucide-react";
import Spinner from "../Loader/Spinner";
import { toast } from "react-toastify";
import { DeleteConfirmPopUp } from "../DeleteConfirmPopUp";
import { BanConfirmPopUp } from "../BanConfirmPopUp";
import Fallback from "../Loader/Fallback";
export default function AllUsersCard() {
  const { users, error, isLoading, refetch } = useFetchUsers();
  const [banLoadingId, setBanLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [banPopUp, setBanPopUp] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [banErrorMessage, setBanErrorMessage] = useState("");
  const [deleteInputValue, setDeleteInputValue] = useState("");
  const [banInputValue, setBanInputValue] = useState("");
  const [selectedDeleteUserId, setSelectedDeleteUserId] = useState(null);
  const [selectedDeleteUserName, setSelectedDeleteUserName] = useState("");
  const [selectedBanUserId, setSelectedBanUserId] = useState(null);
  const [selectedBanUserName, setSelectedBanUserName] = useState("");
  const [selectedBanUserCurntStatus, setSelectedBanUserCurntStatus] =
    useState(null);
  const confirmBtn = async () => {
    const matchingText = selectedBanUserCurntStatus
      ? "Confirm Ban"
      : "Confirm Unban";
    if (banInputValue === matchingText) {
    // const { data:userdata } = await supabase
    //   .from("users")
    //   .select("*")
    //   .eq("id", selectedBanUserId);
    // console.log(userdata);
    
    try {
      setBanLoadingId(selectedBanUserId);
      const data = await supabase
        .from("users")
        .update({ is_active: !selectedBanUserCurntStatus })
        .eq("id", selectedBanUserId);
      console.log(
        "Ban toggle clicked for:",
        selectedBanUserCurntStatus,
        "active:",
        selectedBanUserCurntStatus
      );
      console.log(data, selectedBanUserId);

      if (data.error) {
        toast.error("Failed to update user status");
        console.error("Error updating user status:", error.message);
        setBanErrorMessage("Error updating user status.");
        return;
      } else {
        console.log("User Ban successfully!");
        setBanPopUp(false);
        setBanInputValue(""); // clear input after deletion
        setBanErrorMessage("");
      }

      await refetch();
      toast.success(
        `User ${
          selectedBanUserCurntStatus ? "banned" : "unbanned"
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
      setBanErrorMessage("You must type 'Confirm Ban' exactly to proceed.");
    }
  };
  const onViewOrders = (userId) => {
    console.log("View orders for", userId);
  };

  const confirmDelete = async () => {
    if (deleteInputValue === "Confirm Delete") {
      try {
        setDeleteLoadingId(selectedDeleteUserId);
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", selectedDeleteUserId);

        if (error) {
          toast.error("Failed to delete user");
          console.error("Error deleting user:", error.message);
          setDeleteErrorMessage("Failed to delete user. Please try again.");
          return;
        } else {
          console.log("User deleted successfully!");
          setDeletePopUp(false);
          setDeleteInputValue(""); // clear input after deletion
          setDeleteErrorMessage("");
        }
        await refetch();
        toast.success(`User ${selectedDeleteUserName} deleted successfully!`);
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
    setBanInputValue(""); // clear input on cancel
    setBanErrorMessage("");
  };
  const cancelDelete = () => {
    setDeletePopUp(false);
    setDeleteInputValue(""); // clear input on cancel
    setDeleteErrorMessage("");
  };
  if (isLoading)
    return (
      <div className="flex justify-center">
        <Fallback />
      </div>
    );
  if (error)
    return (
      <Card className="p-4 text-center text-red-500">
        Error loading users: {error.message}
      </Card>
    );
  return (
    <>
      <Card>
        <Table>
          <TableCaption>A list of all users.</TableCaption>
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
            {users?.map((user) => {
              return (
                <TableRow key={user.id} className="text-center">
                  <TableCell className="text-center w-70 ">
                    <div className="font-medium  text-center flex items-center justify-between">
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
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
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
                        setSelectedBanUserId(user.id);
                        setSelectedBanUserName(
                          `${user.firstname} ${user.lastname}`
                        );
                        setBanPopUp(true);
                        setSelectedBanUserCurntStatus(user.is_active);
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
                      aria-label={`Delete user ${user.firstname} ${user.lastname}`}
                      variant="ghost"
                      className="text-gray cursor-pointer hover:text-destructive hover:bg-none hover:shadow-md"
                      onClick={() => {
                        setSelectedDeleteUserId(user.id);
                        setSelectedDeleteUserName(
                          `${user.firstname} ${user.lastname}`
                        );
                        setDeletePopUp(true);
                      }}
                    >
                      {deleteLoadingId === user.id ? <Spinner /> : <Trash2 />}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
      {deletePopUp && (
        <DeleteConfirmPopUp
          deletePopUp={deletePopUp}
          cancelDelete={cancelDelete}
          confirmDelete={confirmDelete} // now called on final confirm button inside popup
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
          currentStatus={selectedBanUserCurntStatus}
        />
      )}
    </>
  );
}
