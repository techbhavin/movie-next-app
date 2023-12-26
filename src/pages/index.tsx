"use client";
import MovieCard from "@/components/movie-card";
import React, { useCallback, useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Box,
  Button,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "./_app";
import { useRouter } from "next/dist/client/router";

const perPage = 4;

const HomePage = () => {
  const [movielist, setMovieList] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [startAfterDoc, setStartAfterDoc] = useState<any | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.clear();
      router.push("/signin");
    } catch (error: any) {
      console.error("Logout error", error.message);
    }
  };

  const getMovieList = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      const movieRef = collection(db, "users", userId ?? "", "movies");

      const orderedQuery = query(movieRef, orderBy("publishedYear"));
      let paginatedQuery = query(orderedQuery, limit(perPage));

      if (currentPage > 1) {
        // If not on the first page, adjust the startAfter parameter
        if (!startAfterDoc) {
          // If startAfterDoc is not set, calculate it based on the current page
          const previousPageStartIndex = (currentPage - 2) * perPage;
          const previousPageStartDoc = movielist[previousPageStartIndex];
          paginatedQuery = query(
            paginatedQuery,
            startAfter(previousPageStartDoc.publishedYear)
          );
        } else {
          paginatedQuery = query(
            paginatedQuery,
            startAfter(startAfterDoc.publishedYear)
          );
        }
      }

      const querySnapshot = await getDocs(paginatedQuery);
      const movies = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setStartAfterDoc(lastVisible?.data());
      setMovieList(movies);
    } catch (error) {
      console.error("Error fetching movie list:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, movielist, startAfterDoc]);

  useEffect(() => {
    setLoading(true);
    getMovieList();
  }, [currentPage]);

  const handleLoadMore = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const getMovieCount = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      const movieRef = collection(db, "users", userId ?? "", "movies");
      const querySnapshot = await getDocs(movieRef);
      const totalCount = querySnapshot.size;

      setTotalCount(totalCount);
    } catch (error) {
      console.error("Error fetching movie count:", error);
    }
  }, []);

  useEffect(() => {
    getMovieCount();
  }, [getMovieCount]);

  return (
    <>
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
            movielist?.map((item: any) => (
              <Grid item key={item.id} lg={3} xs={12}>
                <MovieCard
                  poster={item.image}
                  name={item.name}
                  year={item.publishedYear}
                  id={item?.id}
                />
              </Grid>
            ))}
        </Grid>
      </div>
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#093545",
        }}
        spacing={2}
        display="flex"
        color="#ffffff"
        justifyContent="center"
      >
        <Pagination
          count={Math.ceil(totalCount / perPage)}
          page={currentPage}
          onChange={handleLoadMore}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </>
  );
};

export default HomePage;
