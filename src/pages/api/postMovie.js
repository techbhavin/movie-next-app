import { collection, addDoc, getFirestore } from "firebase/firestore";
import { db } from "../../../firebase"; // Assuming Firebase Admin is initialized here

export default async function handler(req, res) {
  // Sanitize and validate request data (replace with your logic)
  const { name, publishedYear, image } = req.body;

  try {
    const movieRef = collection(db, "users", req.body.userId, "movies");
    const docRef = await addDoc(movieRef, {
      name,
      publishedYear,
      image,
    });

    res.status(201).json({ message: "Movie added successfully" });
  } catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ error: "Failed to add movie" });
  }
}
