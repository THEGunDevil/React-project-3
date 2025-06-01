import React, { useContext, useState, useMemo } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
// import { supabase } from "@/supabaseClient";
import LogoSvg from "@/Components/LogoSvg";
import { UserContext } from "@/Contexts/UserContext";
import Fallback from "../Loader/Fallback";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useContext(UserContext);
  
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
        { title: "Register", path: "/register", icon: FaUserPlus }
      );
    }

    if (!loading && user?.role === "admin") {
      baseItems.push({
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      });
    }

    return baseItems;
  }, [user, loading]);

  return (
    <nav className="bg-white font-primary w-full flex items-center fixed top-0 left-0 z-50 md:h-20 h-14" aria-label="Main navigation">
      <div className="items-center px-6 flex justify-between w-screen mx-auto md:flex py-3 md:py-5">
        <Link to="/" aria-label="Home page">
          <LogoSvg />
        </Link>

        {/* Search bar */}
        <div className="w-[180px] md:w-[300px] h-[28px] md:h-[32px] px-2 border flex items-center">
          <Input
            type="search"
            className="text-xs border-none px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Search site"
            aria-label="Search"
          />
          <button
            type="button"
            className="text-xs border-l px-1 py-0.5 md:py-1 cursor-pointer bg-transparent"
            aria-label="Submit search"
          >
            Search
          </button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" aria-describedby="mobile-nav-description">
            <VisuallyHidden asChild>
              <DialogTitle id="mobile-nav-description">Navigation Menu</DialogTitle>
            </VisuallyHidden>
            <nav className="flex flex-col gap-2 py-15">
              {loading ? (
                <Skeleton className="h-8 w-full" />
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
                    aria-current={item.isActive ? "page" : undefined}
                  >
                    <item.icon size={17} aria-hidden="true" />
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
              <Fallback className="h-8 w-32" />
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
                    aria-current={item.isActive ? "page" : undefined}
                  >
                    <div className="flex gap-1.5 items-center text-md">
                      <item.icon size={17} aria-hidden="true" />
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