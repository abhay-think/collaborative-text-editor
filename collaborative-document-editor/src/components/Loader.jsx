import React, { useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { getLoadingState } from "../api/axiosInstance";

const GlobalLoader = () => {
  const [loading, setLoading] = useState(getLoadingState());

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(getLoadingState());
    }, 100); // Poll the loading state every 100ms

    return () => clearInterval(interval);
  }, []);

  return (
    <Backdrop
      open={loading}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default GlobalLoader;
