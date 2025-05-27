import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import 'nprogress/nprogress.css';
import "./index.css";
import "./App.css"
import "./style.css";
import App from "./App.jsx";
import { PostProvider } from "@features/context/PostContext.jsx";
import { Provider } from "react-redux";
import { AuthProvider } from "@features/context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./features/context/FollowerContext.jsx";
import { ChatProvider } from "./features/context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PostProvider>
          <UserProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </UserProvider>
        </PostProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
