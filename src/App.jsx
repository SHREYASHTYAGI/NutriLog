import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./Supabase";
import Auth from "./Auth";
import MainApp from "./MainApp";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={session ? <MainApp /> : <Navigate to="/auth" />}
      />
      <Route
        path="/auth"
        element={!session ? <Auth /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
