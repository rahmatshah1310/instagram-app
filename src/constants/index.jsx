import { ICONS } from "@icons";

export const ROUTES = {
  login: "/login",
  signup: "/signup",
  home: "/home",
  messages: "/messages",
  notifications: "/notifications",
  profile: (username) => `/${username}`,
  explore: "/explore",
  metaai: "/metai",
  threads: "/threads",
  not_available: "/not_available",
  forgotPassword: "/forgot-password",
};

export const links = [
  { name: "Home", icon: ICONS.goHome, route: ROUTES.home },
  { name: "Search", icon: ICONS.cgSearch, section: "search" },
  { name: "Explore", icon: ICONS.mdExplore, route: ROUTES.explore },
  { name: "Messages", icon: ICONS.shareIcon, route: ROUTES.messages },
  { name: "Notifications", icon: ICONS.ciHeart, section: "notifications" },
  { name: "Create", icon: ICONS.cgAddR, onclick: () => null },
  { name: "Profile", icon: ICONS.fiUser, route: ROUTES.profile },
  { name: "Meta AI", icon: ICONS.fiUser, route: ROUTES.metaai },
  { name: "Threads", icon: ICONS.fiUser, route: ROUTES.threads },
  { name: "More", icon: ICONS.fiUser },
];

export const tabs = [
  {
    id: "posts",
    label: "POSTS",
    icon: ICONS.mdGridOn,
  },
  {
    id: "saved",
    label: "SAVED",
    icon: ICONS.bookMark,
  },
  {
    id: "tagged",
    label: "TAGGED",
    icon: ICONS.userSquare,
  },
];

export const COLOR = {
  primaryColor: "#1877F2",
};

export const MORE_MENU_ITEMS = [
  "Settings",
  "Your activity",
  "Saved",
  "Switch appearance",
  "Report a problem",
  "Switch accounts",
];

export const PANEL_SECTIONS = ["search", "notifications", "messages"];

// Note: The following types don't exist in plain JS
// If needed for runtime checks, you can add utility logic like this:

export const isValidPanelSection = (section) =>
  PANEL_SECTIONS.includes(section);

export const isValidActiveSection = (section) =>
  [...PANEL_SECTIONS, "create", "more", null].includes(section);
