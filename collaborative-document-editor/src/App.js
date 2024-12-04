import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import GlobalLoader from "./components/Loader";
import { useSelector } from "react-redux";
import Dashboard from "./components/Dashboard";
// import Dashboard from "./components/Dashboard";

const App = () => {
  const token = useSelector((state) => state.auth.token);
  console.log("token::", token);

  return (
    <Router>
      <GlobalLoader />
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
