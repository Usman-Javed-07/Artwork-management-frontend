import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../ArtworkDetailPage/ArtworkDetailPage.module.css";

const ArtworkDetails = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/artworks/${id}`)
      .then((res) => setArtwork(res.data))
      .catch((err) => console.error("Error fetching artwork:", err));
  }, [id]);

  if (!artwork) return <p>Loading...</p>;

  return (
    <div className={styles.detailsPage}>
      <div className={styles.artworkDetailImg}>
        <img
          src={`http://localhost:5000${artwork.pictureUrl}`}
          alt={artwork.title}
        />
      </div>
      <div className={styles.artworkDetailList}>
        <h2>{artwork.title}</h2>
        <p>
          <strong>Artist:</strong> {artwork.artist}
        </p>
        <p>
          <strong>Year:</strong> {artwork.year}
        </p>
      </div>
    </div>
  );
};

export default ArtworkDetails;
