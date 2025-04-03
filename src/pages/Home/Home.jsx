import { useEffect, useState } from "react";
import { getArtworks, deleteArtwork } from "../../services/artworkService";
import { Link } from "react-router-dom";
import styles from "../Home/Home.module.css";
import { toast } from 'react-toastify';

const Home = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    const data = await getArtworks();
    setArtworks(data);
  };

  const handleDelete = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this artwork?</p>
        <button onClick={() => confirmDelete(id)} style={{ marginRight: "10px" }}>
          Yes
        </button>
        <button onClick={cancelDelete}>No</button>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };
  
  const confirmDelete = async (id) => {
    if (!id) return; 
    await deleteArtwork(id); 
    toast.dismiss();
    toast.success("Artwork deleted successfully!");
    loadArtworks();
  };
  
  const cancelDelete = () => {
    toast.dismiss();
  };
  

  return (
    <div className={styles.homeContainer}>
      <nav className={styles.navArt}>
      <Link className={styles.addArtwork} to="/ArtworkList">Add New Artwork</Link>
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
            <div className={styles.artworkBtn}>
            <Link className={styles.editBtn} to={`/edit/${art.id}`}>Edit</Link>
            <button className={styles.deleteBtn} onClick={() => handleDelete(art.id)}>Delete</button>
            </div>
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
