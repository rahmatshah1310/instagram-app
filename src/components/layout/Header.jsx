import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@constants";
import { ICONS } from "@assets/icons"; // Assuming these are correctly pathed
import { InstagramText } from "@/assets/icons";
import SearchComponent from "@/components/common/SearchComponent";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black z-50 flex items-center justify-between px-4 md:px-6 border-b border-gray-700">
      {/* Combined Instagram Text and Search Input - Centered Group */}
      <div className="flex-1 flex justify-center items-center min-w-0 pr-4">
        {" "}
        {/* min-w-0 to allow shrinking, pr-4 for spacing from notification icon if screen is too small */}
        <div className="flex items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg gap-3">
          <InstagramText className="text-white" />
          <SearchComponent className="bg-gray-800 w-100vw " />
        </div>
      </div>

      {/* Right: Notification Icon */}
      <div className="flex-shrink-0">
        <button
          className="text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          aria-label="Notifications"
        >
          {ICONS.ciHeart ? (
            React.cloneElement(ICONS.ciHeart, { className: "w-6 h-6" })
          ) : (
            <span className="w-6 h-6 inline-block">N</span>
          )}{" "}
          {/* Fallback if icon is complex */}
        </button>
      </div>
    </header>
  );
};

export default Header;
