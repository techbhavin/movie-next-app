"use client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";

const firebaseConfig = {
  apiKey: "AIzaSyBquLXrd_FMLRQNInXjc2RPruiyudcFTxY",
  authDomain: "movie-test-29a0f.firebaseapp.com",
  projectId: "movie-test-29a0f",
  storageBucket: "movie-test-29a0f.appspot.com",
  messagingSenderId: "195435343954",
  appId: "1:195435343954:web:271a4b921e025b91b16f8b",
};

let app;
if (!app) {
  app = initializeApp(firebaseConfig);
}

export const auth = getAuth(app);
export const db = getFirestore(app); // Use getFirestore for clarity

function MyApp({ Component, pageProps }: any) {
  const router = useRouter();
  useEffect(() => {
    const isLoggedInUser = localStorage.getItem("userId");
    if (isLoggedInUser === null) {
      router.push("/login");
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="global-background">
        <Component {...pageProps} />
        <div>
          <img
            src="/assets/Vectors.png"
            alt="image-issue"
            className="bottom-image "
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
