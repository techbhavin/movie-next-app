import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
// ... other imports

export default async function handler(req, res) {
  const { id, name, publishedYear, image } = req.body;

  try {
    // Get the movie document reference
    const movieRef = doc(db, "users", req.body.userId, "movies", id); // Access subcollection

    // Check if the movie exists
    const docSnap = await getDoc(movieRef);
    if (!docSnap.exists()) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    // Update the movie data
    await updateDoc(movieRef, {
      name,
      publishedYear,
      image,
    });

    res.status(200).json({ message: "Movie updated successfully" });
  } catch (error) {
    console.error("Error editing movie:", error);
    res.status(500).json({ error: "Failed to update movie" });
  }
}
