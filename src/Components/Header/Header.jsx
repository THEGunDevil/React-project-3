import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaSignInAlt,
  FaUserPlus,
  FaCog,
  FaCartArrowDown,
} from "react-icons/fa";
import { Input } from "../ui/input";
import { DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { supabase } from "@/supabaseClient";
import LogoSvg from "@/LogoSvg";
import { UserContext } from "@/Contexts/UserContext";
export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, setUser, userRole, setUserRole } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  // Fetch user and role
  useEffect(() => {
    async function fetchUserData() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedRole = localStorage.getItem("role");

        if (storedUser && storedRole) {
          setUser(storedUser);
          setUserRole(storedRole);
        } else {
          const {
            data: { user: supaUser },
            error: authError,
          } = await supabase.auth.getUser();

          if (authError || !supaUser) {
            setUser(null);
            setUserRole(null);
            return;
          }

          setUser(supaUser);
          localStorage.setItem("user", JSON.stringify(supaUser));

          const { data, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", supaUser.id)
            .single();

          if (error) {
            console.error("Error fetching role:", error);
            setUserRole(null);
          } else {
            setUserRole(data.role);
            localStorage.setItem("role", data.role);
            setUser((prev) => ({ ...prev, role: data.role }));
          }
        }
      } catch (err) {
        console.error("Error in fetchUserData:", err);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [setUser, setUserRole]);

  const menuItems = useMemo(() => {
    const baseItems = [
      { title: "Home", path: "/", icon: FaHome },
      { title: "Profile", path: "/profile", icon: FaInfoCircle },
      { title: "Contact", path: "/contact", icon: FaPhoneAlt },
      { title: "Setting", path: "/setting", icon: FaCog },
      { title: "Cart", path: "/cart", icon: FaCartArrowDown },
    ];

    if (!user) {
      baseItems.push(
        { title: "Sign In", path: "/signin", icon: FaSignInAlt },
        {
          title: "Register",
          path: "/register",
          icon: FaUserPlus,
        }
      );
    }

    if (!loading && userRole === "admin") {
      baseItems.push({
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      });
    }

    return baseItems;
  }, [user, userRole, loading]);

  return (
    <nav className="bg-white font-primary w-full flex items-center fixed top-0 left-0 z-50 md:h-20 h-14">
      <div className="items-center px-6 flex justify-between w-screen mx-auto md:flex py-3 md:py-5">
        <Link to="/">
          <LogoSvg />
        </Link>

        {/* Search bar */}
        <div className="w-[180px] md:w-[300px] h-[28px] md:h-[32px] px-2 border flex items-center">
          <Input
            type="search"
            className="text-xs border-none px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Type"
          />
          <button
            type="button"
            className="text-xs border-l px-1 py-0.5 md:py-1 cursor-pointer bg-transparent"
          >
            Search
          </button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <VisuallyHidden asChild>
              <DialogTitle>Navigation Menu</DialogTitle>
            </VisuallyHidden>
            <nav className="flex flex-col gap-2 py-15">
              {loading ? (
                <p>Loading menu...</p>
              ) : (
                menuItems.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex w-full gap-1.5 items-center p-3 hover:text-primary text-[15px] hover:bg-gray-200 duration-150 transition-colors font-medium ${
                        isActive ? "text-primary" : ""
                      }`
                    }
                  >
                    <item.icon size={17} />
                    {item.title}
                  </NavLink>
                ))
              )}
            </nav>
          </SheetContent>
        </Sheet>
        {/* Desktop Menu */}
        <NavigationMenu className="hidden lg:block">
          <NavigationMenuList>
            {loading ? (
              <p>Loading menu...</p>
            ) : (
              menuItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `${navigationMenuTriggerStyle()} ${
                        isActive ? "text-primary" : ""
                      } hover:text-primary`
                    }
                  >
                    <div className="flex gap-1.5 items-center text-md">
                      <item.icon size={17} />
                      {item.title}
                    </div>
                  </NavLink>
                </NavigationMenuItem>
              ))
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
