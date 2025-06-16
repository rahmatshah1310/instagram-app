import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, firestore } from "@/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { signUp } from "@/services/authService";
import { ROUTES } from "@constants";

const AuthContext = createContext({});

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user profile from Firestore
  const getUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(firestore, "users", userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (err) {
      console.error("Error getting user profile:", err);
      throw err;
    }
  };

  // Login User
  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const response = await signInWithEmailAndPassword(auth, email, password);

      const userData = await getUserProfile(response.user.uid);
      if (userData) {
        const fullProfile = {
          uid: response.user.uid,
          email: response.user.email,
          ...userData,
        };
        setUser(fullProfile);
        toast.success("Login successful! 🎉");
        navigate(`/${userData.username}`, { replace: true });
      }
      return response;
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        toast.error("User not found. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else if (err.code === "auth/too-many-requests") {
        toast.error("Too many login attempts. Please try again later.");
      } else {
        toast.error(`Login failed: ${err.message}`);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Signup User
  const signupUser = async (email, password, fullName, username) => {
    try {
      setLoading(true);
      const response = await signUp(email, password, username, fullName);
      await sendEmailVerification(response.user);
      await signOut(auth); // Enforce email verification
      toast.success(
        "Account created! Please verify your email before logging in."
      );
      navigate(ROUTES.login);
      return response;
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout User
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully!");
      navigate(ROUTES.login);
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getUserProfile(firebaseUser.uid);
          if (userData) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData,
            });
          }
        } catch (err) {
          console.error("Failed to set user on auth change:", err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); 

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setUser,
        loginUser,
        signupUser,
        logout,
        getUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
