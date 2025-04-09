import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../ArtworkDetailPage/ArtworkDetailPage.module.css";
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from "react-router-dom";
import html2pdf from 'html2pdf.js';
import { AiOutlinePrinter } from 'react-icons/ai';
import { toast } from 'react-toastify';

const ArtworkDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/artworks/${id}`)
      .then((res) => setArtwork(res.data))
      .catch((err) => console.error("Error fetching artwork:", err));
  }, [id]);

  if (!artwork) return <p>Loading...</p>;

  const handleGoBack = () => {
    navigate("/home");
  };

  const handlePrintAndDownload = () => {
    const element = document.getElementById('printable-area');
    html2pdf().from(element).save('page-data.pdf');
    window.print();
  };

  // Handle Artwork Edit
  const handleEdit = () => {
    navigate(`/edit/${artwork.id}`);
  };

  // Handle Artwork Delete
  const handleDelete = () => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this artwork?</p>
        <button onClick={confirmDelete} style={{ marginRight: "10px" }}>
          Yes
        </button>
        <button onClick={cancelDelete}>No</button>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const confirmDelete = async () => {
    await axios.delete(`http://localhost:5000/api/artworks/${artwork.id}`);
    toast.dismiss();
    toast.success("Artwork deleted successfully!");
    navigate("/home"); // Redirect to home after deleting
  };

  const cancelDelete = () => {
    toast.dismiss();
  };

  return (
    <>
      <nav className={styles.artworkList}>
        <Link to="/Home" className={styles.goHome}>
          Home
        </Link>
      </nav>
      <div className={styles.backArrow}>
        <FaArrowLeft className={styles.arrowLeft} onClick={handleGoBack} />
      </div>
      <div id="printable-area">
        <div className={styles.detailForm}>
          <div className={styles.detailsPage}>
            <div className={styles.artworkDetailImg}>
              <img
                src={`http://localhost:5000${artwork.pictureUrl}`}
                alt={artwork.title}
                // style={{ width: '600px', height: '400px' }}
              />
            </div>
            <div className={styles.artworkDetailList}>
              <AiOutlinePrinter className={styles.printBtn} onClick={handlePrintAndDownload} />

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

              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={handleEdit}>Edit</button>
                <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtworkDetails;
