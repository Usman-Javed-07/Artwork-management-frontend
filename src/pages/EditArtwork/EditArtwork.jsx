import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArtworkById, updateArtwork } from "../../services/artworkService";

const EditArtwork = () => {
  const { id } = useParams(); // Get artwork ID from the URL
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
    navigate("/Home"); // Redirect back to home after updating
  };

  return (
    <div>
      <h2>Edit Artwork</h2>
      <form onSubmit={handleSubmit}>
        <label>Artist:</label>
        <input type="text" name="artist" value={artwork.artist} onChange={handleChange} required />

        <label>Title:</label>
        <input type="text" name="title" value={artwork.title} onChange={handleChange} required />

        <label>Year:</label>
        <input type="number" name="year" value={artwork.year} onChange={handleChange} required />

        <label>Dimensions:</label>
        <input type="text" name="dimensions" value={artwork.dimensions} onChange={handleChange} required />

        <label>Technique:</label>
        <input type="text" name="technique" value={artwork.technique} onChange={handleChange} required />

        <label>Medium:</label>
        <input type="text" name="medium" value={artwork.medium} onChange={handleChange} required />

        <button type="submit">Update Artwork</button>
      </form>
    </div>
  );
};

export default EditArtwork;
