import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArtworkById, updateArtwork } from "../../services/artworkService";
import styles from "../EditArtwork/EditArtwork.module.css";
import { Link } from "react-router-dom";

const EditArtwork = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState({
    artist: "",
    title: "",
    year: "",
    dimensions: "",
    technique: "",
    medium: "",
    numberOfEditions: "",
    editionNumber: "",
    provenance: "",
    literatureList: "",
    exhibitionList: "",
    extraInformation: "",
    pictureUrl: "",
  });

  useEffect(() => {
    fetchArtwork();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchArtwork = async () => {
    const data = await getArtworkById(id);
    setArtwork(data);
  };

  const handleChange = (e) => {
    setArtwork({ ...artwork, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateArtwork(id, artwork);
    navigate("/Home"); 
  };

  return (
    <div>
      <nav className={styles.artworkList}>
        <Link to="/Home" className={styles.goHome}>
          Home
        </Link>
      </nav>
      <h2 className={styles.artworkHeading}>Edit Artwork</h2>

      <form onSubmit={handleSubmit} className={styles.artworkListForm}  id="editArtwork" >
        <div className={styles.artworkFormGroup}>
          <label>Artist:</label>
          <input
            className={styles.ArtworkFormInput}
            type="text"
            name="artist"
            value={artwork.artist}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.artworkFormGroup}>
          <label>Title:</label>
          <input
            className={styles.ArtworkFormInput}
            type="text"
            name="title"
            value={artwork.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.artworkFormGroup}>
          <label>Year:</label>
          <input
            className={styles.ArtworkFormInput}
            type="number"
            name="year"
            value={artwork.year}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.artworkFormGroup}>
          <label>Dimensions:</label>
          <input
            className={styles.ArtworkFormInput}
            type="text"
            name="dimensions"
            value={artwork.dimensions}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.artworkFormGroup}>
          <label>Technique:</label>
          <input
            className={styles.ArtworkFormInput}
            type="text"
            name="technique"
            value={artwork.technique}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.artworkFormGroup}>
          <label>Medium:</label>
          <input
            className={styles.ArtworkFormInput}
            type="text"
            name="medium"
            value={artwork.medium}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.artworkSubmitBtn}>
      <button className={styles.submitButton} type="submit"  form="editArtwork">
          Update Artwork
        </button>
      </div>
      </form>
      
      
    </div>
  );
};

export default EditArtwork;
