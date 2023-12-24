"use client";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import React from "react";

const MovieCard = ({ poster, name, year, id }: any) => {
  const router = useRouter();
  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: "10px",
        flexShrink: 0,
        background: "#092C39",
        color: "#ffffff",
        padding: "10px",
      }}
      onClick={() => router.push(`/movie/${id}`)}
      style={{ cursor: "pointer" }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CardMedia
          sx={{
            height: 400,
            width: 266,
            display: "flex",
            justifyContent: "center",
            borderRadius: "10px",
          }}
          image={poster}
          title="green iguana"
        />
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2">{year}</Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
