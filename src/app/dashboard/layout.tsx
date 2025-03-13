"use client";
import NavBar from "@/components/Navbar";
import { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { GlobalContext } from "@/context";
import {
  adminNavLinks,
  MaintenanceLinks,
  residentNavLinks,
  securityNavLinks,
} from "@/utils/lib";

interface NavlinkType {
  label: string;
  url: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setAuthUser, user, role } = useContext(GlobalContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navLink, setNavLink] = useState<NavlinkType[]>([]);
  const router = useRouter();
  useEffect(() => {
    if (role === "Admin") {
      setNavLink(adminNavLinks);
    } else if (role === "Resident") {
      setNavLink(residentNavLinks);
    } else if (role === "Security") {
      setNavLink(securityNavLinks);
    } else if (role === "Maintenance") {
      setNavLink(MaintenanceLinks);
    }
  }, [user, role]);
  // const navLink = adminNavLinks;
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 w-full h-12 bg-gray-800 text-white flex items-center px-4 z-20  justify-between">
        <button
          className="lg:hidden mr-4 focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        {/* change the name to show the name of the application at the top of the page */}
        <h1 className="text-sm md:text-lg font-bold ">
          Smart Community Management System
        </h1>

        <Button
          onClick={() => {
            setAuthUser(false);
            localStorage.clear();
            Cookies.remove("token");
            router.push("/auth/login");
          }}
        >
          {" "}
          Logout
        </Button>
      </header>

      <div className="flex flex-grow mt-12">
        {/* Sidebar */}
        <aside
          className={`fixed top-12 left-0 h-[calc(100vh-3rem)] w-64 bg-gray-700 text-white overflow-y-auto z-10 transition-transform duration-300 lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:block`}
        >
          <div className="p-4">
            {/* <h2 className="text-lg font-bold"></h2> */}
            <NavBar links={navLink} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-900 p-8 text-white overflow-y-auto lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
