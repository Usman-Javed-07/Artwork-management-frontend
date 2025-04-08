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
          style={{ width: '600px', height: '400px' }}
        />
      </div>
      <div className={styles.artworkDetailList}>
        <h1>{artwork.title}</h1>     
          <h2>{artwork.artist}</h2>
        <strong>{artwork.year}</strong>
        <p>{artwork.technique}</p>
        <p>{artwork.subTechnique}</p>
        <p>{artwork.medium}</p>
        <p>{artwork.numberOfEditions}</p>
        <p>{artwork.editionNumber}</p>
        <p>{artwork.provenance}</p>
        <p>{artwork.literatureList}</p>
        <p>{artwork.exhibitionList}</p>
        <p>{artwork.extraInformation}</p>
        
      </div>
    </div>
  );
};

export default ArtworkDetails;
