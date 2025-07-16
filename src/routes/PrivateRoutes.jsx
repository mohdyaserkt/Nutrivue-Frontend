import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Spinner } from "../components/Spinner/Spinner";

export const PrivateRoutes = () => {
  // local state for “are we still waiting on Firebase?”
  const [initializing, setInitializing] = useState(true);
  // local state for “are we signed in?”
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    // subscribe to auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSignedIn(!!user);
      setInitializing(false);
    });
    // cleanup
    return unsubscribe;
  }, []);

  if (initializing) {
    return <Spinner size="large" />;
  }

  // If signed in, render child routes; otherwise redirect to /login
  return signedIn ? <Outlet /> : <Navigate to="/login" replace />;
};
