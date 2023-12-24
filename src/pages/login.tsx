"use client";
import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CssBaseline,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/dist/client/router";
import { ToastContainer, toast } from "react-toastify";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

const Sigin = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async ({ email, password }) => {
      try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        localStorage.setItem("userId", user?.uid);
        router.push("/");
      } catch (error) {
        toast("Please check email / passwrord.");
      }
    },
  });

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        top: "15vw",
      }}
    >
      <ToastContainer />

      <CssBaseline />
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        textAlign="center"
        color="white"
      >
        Sign in
      </Typography>
      <form
        style={{
          width: "100%",
          maxWidth: "400px",
          marginTop: "1rem",
        }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email Address"
          variant="outlined"
          margin="normal"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{
            style: {
              color: "white",
            },
          }}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          autoComplete="new-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          InputLabelProps={{ style: { color: "white" } }}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            style: {
              color: "white",
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{
            margin: "1.5rem 0",
            backgroundColor: "#2BD17E",
            borderRadius: "10px",
          }}
        >
          Login
        </Button>
      </form>
      <Typography
        variant="h6"
        component="div"
        gutterBottom
        textAlign="center"
        color="white"
        onClick={() => router.push("/registration")}
        style={{ cursor: "pointer", textDecoration: "underline" }}
      >
        new User, Create an Account
      </Typography>
    </Container>
  );
};

export default Sigin;
