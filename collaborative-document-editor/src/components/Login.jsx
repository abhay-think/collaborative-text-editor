import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  useMediaQuery,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import axios from "axios";
import axiosInstance, { setForceLoadingState } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginFailure, loginSuccess } from "../slice/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { email, password } = formData;
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email, "Pass::", password);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      console.log("response", response);
      dispatch(
        loginSuccess({ user: response.data.user, token: response.data.token })
      );

      if (response?.status == 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      dispatch(loginFailure(error.response.data.message));
    }
  };

  const handleNavigate = () => {
    setForceLoadingState(true);
    setTimeout(() => {
      setForceLoadingState(false);
      navigate("/signup");
    }, 1000);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          gutterBottom
        >
          Login
        </Typography>
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
        >
          Login
        </Button>
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, cursor: "pointer", color: "primary.main" }}
          onClick={handleNavigate}
        >
          Don’t have an account? Sign Up
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
