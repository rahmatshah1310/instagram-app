import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { ROUTES } from "@constants";
import Sidebar from "@components/layout/Sidebar";
import Navbar from "@components/layout/Navbar";
import Spinner from "./Spinner";
import { useAuth } from "@features/context/AuthContext";

const AppLayout = () => {
  const { user, loading } = useAuth();

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isMdOrLg = useMediaQuery({ minWidth: 768, maxWidth: 1279 });
  const isXlOrLarger = useMediaQuery({ minWidth: 1280 });

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768 && window.innerWidth < 1280;
    }
    return false;
  });
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (!activeSection) { 
      if (isMdOrLg) {
        setIsCollapsed(true); // Collapse on medium/large desktops
      } else if (isXlOrLarger) {
        setIsCollapsed(false); // Expand on extra-large desktops
      }
    }
   
  }, [isMdOrLg, isXlOrLarger, activeSection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-900">
        <Spinner type="sync" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  // Calculate dynamic left margin for the main content area
  const getMainContentMarginLeft = () => {
    if (isMobile) {
      return "0px"; // No margin on mobile
    }

    if (activeSection === "search" || activeSection === "notifications") {
      return "448px"; // 64 + 384 = 448px
    } else if (isCollapsed) {
      return "64px";
    } else {
      return "336px";
    }
  };


  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-white">
      {/* Mobile-only Navbar */}
      {isMobile && <Navbar />}

      <div className={`flex flex-1 overflow-hidden ${isMobile ? "pt-16" : "pt-0"}`}>
        {/* Sidebar for Desktop/Tablet views - It's always positioned on the left */}
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Main content area */}
        <div
          className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out
                      ${isMobile ? "pb-16" : "pb-0"}
                     `}
          style={{ marginLeft: getMainContentMarginLeft() }}
        >
          <main className="px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;