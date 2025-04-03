import { useState, useEffect } from "react";
import { createArtwork, updateArtwork, getArtworkById } from "../../services/artworkService";
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
      <Link to="/Home" className={styles.goHome}>Home</Link>
      </nav>
      
      
      <h2>{id ? "Edit Artwork" : "Add New Artwork"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="artist" value={form.artist} onChange={handleChange} placeholder="Artist" required />
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input type="number" name="year" value={form.year} onChange={handleChange} placeholder="Year" required />
        <input type="text" name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="Dimensions" required />
        <input type="text" name="technique" value={form.technique} onChange={handleChange} placeholder="Technique" required />
        <input type="text" name="medium" value={form.medium} onChange={handleChange} placeholder="Medium" required />
        <input type="number" name="numberOfEditions" value={form.numberOfEditions} onChange={handleChange} placeholder="Number of Editions" />
        <input type="number" name="editionNumber" value={form.editionNumber} onChange={handleChange} placeholder="Edition Number" />
        <textarea name="provenance" value={form.provenance} onChange={handleChange} placeholder="Provenance"></textarea>
        <textarea name="literatureList" value={form.literatureList} onChange={handleChange} placeholder="Literature List"></textarea>
        <textarea name="exhibitionList" value={form.exhibitionList} onChange={handleChange} placeholder="Exhibition List"></textarea>
        <textarea name="extraInformation" value={form.extraInformation} onChange={handleChange} placeholder="Extra Information"></textarea>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">{id ? "Update" : "Submit"}</button>
      </form>
    </div>
  );
};

export default ArtworkForm;
