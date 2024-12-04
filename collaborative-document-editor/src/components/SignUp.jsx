import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  useMediaQuery,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { loginFailure } from "../slice/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { name, email, password } = formData;
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      if (response?.status == 201) {
        navigate("/login");
      }
    } catch (error) {
      dispatch(loginFailure(error.response.data.message));
    }
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
          Sign Up
        </Typography>
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
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
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
