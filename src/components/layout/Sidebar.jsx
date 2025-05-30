import React, { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { ROUTES } from "@/constants";
import { ICONS, InstagramText } from "@/assets/icons";
import { useAuth } from "@/features/context/AuthContext";
import CreatePost from "@/pages/Create";
import ShadcnPopover from "@/components/common/ShadcnPopover";
import Button from "@/components/common/Button";
import SearchComponent from "@/components/common/SearchComponent";
import Messages from "@/pages/messages/Messages";
import SidebarHeader from "../chatsidebar/SidebarHeader";

// Helper component for individual navigation links - kept concise
const NavLink = React.memo(
  ({
    link,
    isBottomBar,
    isMdSidebar,
    isCollapsed,
    activeSection,
    onLinkClick,
    userProfilePic,
  }) => {
    // Determine base classes
    let classes =
      "flex items-center text-white rounded-lg hover:bg-gray-700 cursor-pointer transition-colors";
    if (isBottomBar) classes += " flex-col justify-center p-2 text-xs w-1/5";
    if (isMdSidebar)
      classes += ` gap-4 text-lg py-2 px-4 ${
        activeSection === (link.section || link.name.toLowerCase())
          ? link.name === "Messages" 
            ? "bg-gray-600 opacity-50 hover:bg-gray-600 cursor-default"
            : "bg-gray-600"
          : ""
      }`;

    // Determine content to display (icon or profile pic, and text if applicable)
    const displayContent = (
      <>
        {link.name === "Profile" && userProfilePic ? (
          <img
            src={userProfilePic}
            alt="Profile"
            className="rounded-full object-cover border-2 border-white w-7 h-7 md:ml-[-5px] min-w-[1.75rem] min-h-[1.75rem]"
          />
        ) : (
          link.icon
        )}
        {(isBottomBar || (isMdSidebar && !isCollapsed)) && (
          <span className={isBottomBar ? "mt-1" : ""}>{link.name}</span>
        )}
      </>
    );

    // Handle clicks, preventing default for non-route links with onClick
    const handleClick = (e) => {
      if (link.onClick && !link.route) e.preventDefault();
      onLinkClick(link.section || link.name.toLowerCase());
    };

    // Render logic for different link types
    if (link.route) {
      return (
        <Link to={link.route} className={classes} onClick={handleClick}>
          {displayContent}
        </Link>
      );
    }

    if (link.name === "More") {
      return (
        <ShadcnPopover
          side="top"
          triggerContent={
            <button className={classes} onClick={handleClick}>
              {displayContent}
            </button>
          }
        >
          <div className="space-y-1 text-sm text-white w-48 p-1">
            {[
              "Settings",
              "Your activity",
              "Saved",
              "Switch appearance",
              "Report a problem",
              "Switch accounts",
            ].map((item) => (
              <Button
                key={item}
                className="w-full text-left hover:bg-gray-800 p-3 rounded"
              >
                {item}
              </Button>
            ))}
            <Button
              onClick={link.onLogout}
              className="w-full text-left hover:bg-gray-800 p-3 rounded"
            >
              Log out
            </Button>
          </div>
        </ShadcnPopover>
      );
    }

    return (
      <button className={classes} onClick={handleClick}>
        {displayContent}
      </button>
    );
  }
);

// Main Sidebar component
const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  activeSection,
  setActiveSection,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isMdOrLg = useMediaQuery({ minWidth: 768, maxWidth: 1279 });

  // Memoized navigation links
  const navigationLinks = useMemo(() => {
    const profileIcon = user?.profilePic ? (
      <img
        src={user.profilePic}
        alt="Profile"
        className="rounded-full object-cover border-2 border-white w-7 h-7 md:ml-[-5px] min-w-[1rem] min-h-[1rem]"
      />
    ) : (
      ICONS.fiUser
    );

    return [
      { name: "Home", icon: ICONS.goHome, route: ROUTES.home },
      { name: "Search", icon: ICONS.cgSearch, section: "search" },
      { name: "Explore", icon: ICONS.mdExplore, route: ROUTES.explore },
      { name: "Messages", icon: ICONS.shareIcon, route: ROUTES.messages, section: "messages" },
      { name: "Notifications", icon: ICONS.ciHeart, section: "notifications" },
      {
        name: "Create",
        icon: ICONS.cgAddR,
        onClick: () => setIsCreateModalOpen(true),
        section: "create",
      },
      { name: "Profile", icon: profileIcon, route: `/${user?.username}` },
      { name: "Meta AI", icon: ICONS.metaIcon, route: ROUTES.metaai },
      { name: "Threads", icon: ICONS.threadsLogo, route: ROUTES.threads },
      { name: "More", icon: ICONS.moreIcon, onLogout: logout, section: "more" },
    ];
  }, [user, logout]);

  // Map links for quick lookup
  const linkProperties = useMemo(
    () =>
      navigationLinks.reduce((acc, link) => {
        acc[link.name.toLowerCase()] = link;
        if (link.section) acc[link.section] = link;
        return acc;
      }, {}),
    [navigationLinks]
  );

  // Define links for bottom bar and desktop sidebar sections
  const bottomBarLinks = useMemo(
    () =>
      [
        linkProperties.home,
        linkProperties.explore,
        linkProperties.create,
        linkProperties.messages,
        linkProperties.profile,
      ].filter(Boolean),
    [linkProperties]
  );
  const mainLinksMd = useMemo(
    () => navigationLinks.slice(0, 7),
    [navigationLinks]
  );
  const bottomLinksMd = useMemo(
    () => navigationLinks.slice(7),
    [navigationLinks]
  );

  // Unified handler for all navigation actions
  const handleNavAction = useCallback(
    (sectionName) => {
      const linkConfig = linkProperties[sectionName];
      if (!linkConfig) return;

      // If messages is already active, don't do anything
      if (sectionName === "messages" && activeSection === "messages") {
        return;
      }

      if (isMobile) {
        linkConfig.onClick?.();
        setActiveSection(null);
        return;
      }

      const isPanelSection =
        sectionName === "search" || sectionName === "notifications" || sectionName === "messages";
      
      if (isPanelSection) {
        setActiveSection((prev) => (prev === sectionName ? null : sectionName));
        setIsCollapsed(activeSection !== sectionName);
        
        // For messages, use React Router navigation instead of window.location
        if (sectionName === "messages" && linkConfig.route) {
          navigate(linkConfig.route);
        }
      } else {
        setActiveSection(null);
        linkConfig.onClick?.();
        setIsCollapsed(isMdOrLg);
      }
    },
    [
      isMobile,
      isMdOrLg,
      activeSection,
      setActiveSection,
      setIsCollapsed,
      linkProperties,
      navigate,
    ]
  );

  // Determine the actual width class for the fixed main sidebar
  const fixedSidebarWidthClass =
    activeSection === "search" || activeSection === "notifications" || activeSection === "messages"
      ? "w-16"
      : isCollapsed
      ? "w-84"
      : "w-84";

  // Helper for panel common classes
  const getPanelClasses = (sectionName) => {
    const isActive = activeSection === sectionName;
    const sidebarOffset = fixedSidebarWidthClass === "w-16" ? "left-16" : "left-84";
  
    return `
      fixed top-0 h-full z-40 w-96 text-white border-r border-gray-700 bg-black
      overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out transform
      ${sidebarOffset}
      ${isActive ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}
    `;
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black z-40 flex items-center justify-around border-t border-gray-700">
        {bottomBarLinks.map((link, index) => (
          <NavLink
            key={`bottom-bar-${link.name}-${index}`}
            link={link}
            isBottomBar
            onLinkClick={handleNavAction}
            userProfilePic={user?.profilePic}
          />
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block fixed top-0 left-0 h-full">
        {/* Sidebar and Panels Container */}
        <div className="relative h-full flex">
          {/* Fixed Main Sidebar */}
          <div
            className={`h-full bg-black text-white flex flex-col justify-between py-6 px-2 space-y-4 border-r border-gray-700 transition-all duration-300 ease-in-out ${fixedSidebarWidthClass}`}
          >
            {/* Instagram Logo/Text */}
            <h1 className="text-2xl font-bold mb-4 pl-3 py-2 text-white">
              {activeSection === "search" || activeSection === "notifications" ? (
                ICONS.instagramIcon
              ) : isCollapsed ? (
                ICONS.instagramIcon
              ) : (
                <InstagramText />
              )}
            </h1>
            {/* Main Nav Links */}
            <nav className="flex flex-col space-y-3">
              {mainLinksMd.map((link, index) => (
                <NavLink
                  key={`md-main-${link.name}-${index}`}
                  link={link}
                  isMdSidebar
                  isCollapsed={
                    activeSection === "search" ||
                    activeSection === "notifications" ||
                    isCollapsed
                  }
                  activeSection={activeSection}
                  onLinkClick={handleNavAction}
                  userProfilePic={user?.profilePic}
                />
              ))}
            </nav>
            {/* Bottom Nav Links */}
            <div className="flex flex-col space-y-3 mt-auto">
              {bottomLinksMd.map((link, index) => (
                <NavLink
                  key={`md-bottom-${link.name}-${index}`}
                  link={link}
                  isMdSidebar
                  isCollapsed={
                    activeSection === "search" ||
                    activeSection === "notifications" ||
                    isCollapsed
                  }
                  activeSection={activeSection}
                  onLinkClick={handleNavAction}
                  userProfilePic={user?.profilePic}
                />
              ))}
            </div>
          </div>

          {/* Sliding Panels */}
          {/* Search Panel */}
          <div className={`${getPanelClasses("search")} bg-black`}>
            {activeSection === "search" && (
              <div className="h-full p-3">
                <SearchComponent />
              </div>
            )}
          </div>

          {/* Notifications Panel */}
          <div className={`${getPanelClasses("notifications")} bg-gray-700`}>
            {activeSection === "notifications" && (
              <div className="h-full">
                <h2 className="text-xl font-bold mb-4">Notifications</h2>
                <p className="text-gray-400">
                  Notifications functionality goes here...
                </p>
              </div>
            )}
          </div>

          {/* Messages Panel */}
          <div className={`${getPanelClasses("messages")} bg-black`}>
            {activeSection === "messages" && (
              <div className="h-full">
                <SidebarHeader/>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePost
        isOpen={isCreateModalOpen}
        title="Create Post"
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
