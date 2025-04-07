import { useState, useEffect } from "react";
import {
  createArtwork,
  updateArtwork,
  getArtworkById,
} from "../../services/artworkService";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "../ArtworkList/ArtworkList.module.css";

const ArtworkForm = () => {
  const [form, setForm] = useState({
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
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getArtworkById(id).then((data) => setForm(data));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (file) formData.append("picture", file);

    if (id) {
      await updateArtwork(id, form);
    } else {
      await createArtwork(formData);
    }
    navigate("/Home");
  };

  return (
    <div>
      <nav className={styles.artworkList}>
        <Link to="/Home" className={styles.goHome}>
          Home
        </Link>
      </nav>

      <h2 className={styles.artworkHeading}>{id ? "Edit Artwork" : "Add New Artwork"}</h2>
      
    <div className={styles.artwrokForm}>

    <form
  onSubmit={handleSubmit}
  className={styles.artworkListForm}
  id="artworkForm"
>
  <label>
    Artist
    <input
      className={styles.ArtworkFormInput}
      type="text"
      name="artist"
      value={form.artist}
      onChange={handleChange}
      placeholder="Artist"
      required
    />
  </label>

  <label>
    Title
    <input
      className={styles.ArtworkFormInput}
      type="text"
      name="title"
      value={form.title}
      onChange={handleChange}
      placeholder="Title"
      required
    />
  </label>

  <label>
    Year
    <input
      className={styles.ArtworkFormInput}
      type="number"
      name="year"
      value={form.year}
      onChange={handleChange}
      placeholder="Year"
      required
    />
  </label>

  <label>
    Dimensions
    <input
      className={styles.ArtworkFormInput}
      type="text"
      name="dimensions"
      value={form.dimensions}
      onChange={handleChange}
      placeholder="Dimensions"
      required
    />
  </label>

  <label>
    Technique
    <input
      className={styles.ArtworkFormInput}
      type="text"
      name="technique"
      value={form.technique}
      onChange={handleChange}
      placeholder="Technique"
      required
    />
  </label>

  <label>
    Medium
    <input
      className={styles.ArtworkFormInput}
      type="text"
      name="medium"
      value={form.medium}
      onChange={handleChange}
      placeholder="Medium"
      required
    />
  </label>

  <label>
    Number of Editions
    <input
      className={styles.ArtworkFormInput}
      type="number"
      name="numberOfEditions"
      value={form.numberOfEditions}
      onChange={handleChange}
      placeholder="Number of Editions"
    />
  </label>

  <label>
    Edition Number
    <input
      className={styles.ArtworkFormInput}
      type="number"
      name="editionNumber"
      value={form.editionNumber}
      onChange={handleChange}
      placeholder="Edition Number"
    />
  </label>

  <label>
    Provenance
    <textarea
      className={styles.ArtworkFormInput}
      name="provenance"
      value={form.provenance}
      onChange={handleChange}
      placeholder="Provenance"
    ></textarea>
  </label>

  <label>
    Literature List
    <textarea
      className={styles.ArtworkFormInput}
      name="literatureList"
      value={form.literatureList}
      onChange={handleChange}
      placeholder="Literature List"
    ></textarea>
  </label>

  <label>
    Exhibition List
    <textarea
      className={styles.ArtworkFormInput}
      name="exhibitionList"
      value={form.exhibitionList}
      onChange={handleChange}
      placeholder="Exhibition List"
    ></textarea>
  </label>

  <label>
    Extra Information
    <textarea
      className={styles.ArtworkFormInput}
      name="extraInformation"
      value={form.extraInformation}
      onChange={handleChange}
      placeholder="Extra Information"
    ></textarea>
  </label>

  <label>
    Upload Image
    <input
      className={styles.ArtworkFormInput}
      type="file"
      onChange={handleFileChange}
    />
  </label>
</form>
      <div className={styles.artworkSubmitBtn}>
      <button className={styles.submitButton} type="submit" form="artworkForm">
        {id ? "Update" : "Submit"}
      </button>
      </div>
      
    </div>


     
    </div>
  );
};

export default ArtworkForm;
