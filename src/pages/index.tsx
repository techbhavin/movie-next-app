"use client";
import MovieCard from "@/components/movie-card";
import React, { useCallback, useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Grid, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./_app";
import { useRouter } from "next/dist/client/router";

const HomePage = () => {
  const [movielist, setMovieList] = useState<any>([]);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.clear();
      router.push("/registration");
    } catch (error: any) {
      console.error("Logout error", error.message);
    }
  };

  const getMovieList = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      const movieRef = collection(db, "users", userId ?? "", "movies");
      const querySnapshot = await getDocs(movieRef);
      const movies = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovieList(movies);
    } catch {}
  }, []);

  useEffect(() => {
    getMovieList();
  }, [getMovieList]);

  return (
    <div style={{ backgroundColor: "#093545", padding: "40px" }}>
      <Box display="flex" justifyContent="space-between" padding="0 20px">
        <Typography
          display="flex"
          alignItems="center"
          color="#ffffff"
          fontSize="42px"
          gutterBottom
          variant="h3"
          component="div"
        >
          My movies
          <div
            onClick={() => router.push("/movie/create")}
            style={{ cursor: "pointer" }}
          >
            <AddCircleOutlineIcon sx={{ marginLeft: "5px" }} />
          </div>
        </Typography>
        <Button
          sx={{ color: "#FFFFFF", textTransform: "none", fontSize: "20px" }}
          endIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      {movielist?.length === 0 && (
        <Box marginTop="15vw">
          <Typography
            display="flex"
            alignItems="center"
            color="#ffffff"
            fontSize="42px"
            justifyContent="center"
            gutterBottom
            variant="h3"
            component="div"
          >
            Your movie list is empty
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button
              sx={{ backgroundColor: "#2BD17E" }}
              variant="contained"
              onClick={() => router.push("/movie/create")}
            >
              Add a new movie
            </Button>
          </Box>
        </Box>
      )}
      <Grid container spacing={4} marginTop={5}>
        {movielist?.length > 0 &&
          movielist?.map((item: any) => {
            return (
              <>
                <Grid item lg={3} md={3} xs={12}>
                  <MovieCard
                    poster={item.image}
                    name={item.name}
                    year={item.publishedYear}
                    id={item?.id}
                  />
                </Grid>
              </>
            );
          })}
      </Grid>
    </div>
  );
};

export default HomePage;
