import { useEffect, useState } from "react";
import { getArtworks, deleteArtwork } from "../../services/artworkService";
import { Link } from "react-router-dom";

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
    <div>
      <h2>Artworks</h2>
      <Link to="/ArtworkList">Add Artwork</Link>
      <div className="artwork-grid">
        {artworks.map((art) => (
          <div key={art.id} className="artwork-card">
            <img
              src={`http://localhost:5000${art.pictureUrl}`}
              alt={art.title}
              width="100"
            />
            <h3>{art.title}</h3>
            <p>
              {art.artist} - {art.year}
            </p>
            <Link to={`/edit/${art.id}`}>Edit</Link>
            <button onClick={() => handleDelete(art.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
