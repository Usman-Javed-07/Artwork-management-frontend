import { useEffect, useState } from "react";
import { getArtworks, deleteArtwork } from "../../services/artworkService";
import { Link } from "react-router-dom";
import styles from "../Home/Home.module.css";

const Home = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    const data = await getArtworks();
    setArtworks(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this artwork?")) {
      await deleteArtwork(id);
      loadArtworks();
    }
  };

  return (
    <div className={styles.homeContainer}>
      <nav className={styles.navArt}>
      <Link to="/ArtworkList">Add Artwork</Link>
      </nav>

      
      <div className={styles.artworkGrid}>
        {artworks.map((art) => (
          <div key={art.id} className={styles.artworkCard}>
            <img
              src={`http://localhost:5000${art.pictureUrl}`}
              alt={art.title}
            />
            <div className={styles.artworkInfo}>
            <p>{art.title}</p>
            <p>
              {art.artist} - {art.year}
            </p>
            <Link to={`/edit/${art.id}`}>Edit</Link>
            <button onClick={() => handleDelete(art.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
