"use client";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import router from "next/router";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../_app";

const EditMovie: React.FC = () => {
  const [base64Image, setBase64Image] = useState<any>("");
  const [movie, setMovie] = useState<any>({});

  const onHandleChange = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // The result property contains the Base64 encoded string
        const base64String = reader.result;
        setBase64Image(base64String);
      };

      // Read the file as a Data URL
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      const { movieId } = router.query;
      const userId =
        typeof window !== undefined && localStorage.getItem("userId");
      if (movieId) {
        const movieRef = doc(
          db,
          "users",
          (userId as string) ?? "",
          "movies",
          (movieId as string) ?? ""
        );
        const docSnap = await getDoc(movieRef);
        if (docSnap.exists()) {
          setMovie(docSnap.data());
        } else {
          router.push("/");
        }
      } else {
        router.push("/");
      }
    };

    fetchMovie();
  }, []);

  const formik = useFormik({
    initialValues: { ...movie },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const userId =
          typeof window !== undefined && localStorage.getItem("userId");
        const { movieId } = router.query;

        const response = await fetch("/api/editMovie", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            image: base64Image,
            id: movieId,
            userId: userId,
          }),
        });

        if (response.ok) {
          toast("Movie edited successfully!");
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          const errorData = await response.json();
          toast(errorData?.error ?? "Please try again!");
        }
      } catch (error) {
        toast("Something went wrong. Please try again");
      }
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (!values.publishedYear) {
        errors.publishedYear = "Publishing year is required";
      }
      return errors;
    },
  });

  return (
    <>
      <div style={{ padding: "40px 100px" }}>
        <Typography
          display="flex"
          alignItems="center"
          color="#ffffff"
          fontSize="42px"
          gutterBottom
          variant="h3"
          component="div"
        >
          Edit
        </Typography>
      </div>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          top: "10vw",
          background: "#093545",
        }}
        component="main"
        maxWidth="md"
      >
        <Grid container spacing={20}>
          <Grid item lg={6} xs={12}>
            <div>
              <label htmlFor="file-upload" className="">
                <div className="dottedBorder">Drag & Upload</div>
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={onHandleChange}
                className="hidden"
              />
            </div>
          </Grid>
          <Grid item lg={6} xs={12}>
            <div className="formContainer">
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name ?? ""}
                  defaultValue={movie?.name ?? ""}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{
                    style: {
                      color: "white",
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  type="number"
                  id="publishedYear"
                  label="Publishing Year"
                  name="publishedYear"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.publishedYear &&
                    Boolean(formik.errors.publishedYear)
                  }
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{
                    style: {
                      color: "white",
                    },
                  }}
                />
                <div style={{ display: "flex" }}>
                  <Button
                    type="button"
                    onClick={() => router.push("/")}
                    variant="outlined"
                    sx={{
                      borderRadius: "10px",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{
                      marginLeft: "20px",
                      borderRadius: "10px",
                      backgroundColor: "#2BD17E",
                    }}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default EditMovie;
