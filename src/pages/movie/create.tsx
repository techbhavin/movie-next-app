import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Container, Grid, TextField } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/dist/client/router";

const theme = createTheme();

const Home: React.FC = () => {
  const [base64Image, setBase64Image] = useState<any>("");
  const router = useRouter();

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

  const formik = useFormik({
    initialValues: {
      name: "",
      publishedYear: "",
    },
    onSubmit: async ({ publishedYear, name }) => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await fetch("/api/postMovie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            publishedYear,
            image: base64Image,
            userId,
          }),
        });

        if (res.ok) {
          toast("Movie created");
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          const errorData = await res.json();
          toast(errorData?.error ?? "Please try again!");
        }
      } catch (error) {
        toast("Something went wrong. Please try again");
      }
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.name) {
        errors.title = "Title is required";
      }
      if (!values.publishedYear) {
        errors.publishingYear = "Publishing year is required";
      }
      return errors;
    },
  });

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
        top: "10vw",
      }}
      component="main"
      maxWidth="md"
    >
      <ToastContainer />
      <Grid container spacing={20}>
        <Grid item lg={6} xs={12}>
          {base64Image?.length === 0 ? (
            <div>
              <label htmlFor="file-upload" className="">
                <div className="dottedBorder">Drag & Upload</div>
              </label>

              <input
                id="file-upload"
                type="file"
                defaultValue={base64Image}
                src={base64Image ?? ""}
                onChange={onHandleChange}
                className="hidden"
              />
            </div>
          ) : (
            <div>
              <img src={base64Image ?? ""} height={"400px"} width={"266px"} />
            </div>
          )}
        </Grid>
        <Grid item lg={6} xs={12}>
          <div className="formContainer">
            <form onSubmit={formik.handleSubmit}>
              <TextField
                margin="normal"
                fullWidth
                id="title"
                label="Title"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  style: {
                    color: "white",
                  },
                }}
              />
              <TextField
                sx={{ backgroundColor: "#224957" }}
                margin="normal"
                fullWidth
                type="number"
                id="publishingYear"
                label="Publishing Year"
                name="publishedYear"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.publishedYear}
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
                helperText={
                  formik.touched.publishedYear && formik.errors.publishedYear
                }
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
  );
};

export default Home;
