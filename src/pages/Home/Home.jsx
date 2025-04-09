import { useEffect, useState } from "react";
// import { getArtworks, deleteArtwork } from "../../services/artworkService";
import { getArtworks} from "../../services/artworkService";
import { Link } from "react-router-dom";
import styles from "../Home/Home.module.css";
import { toast } from 'react-toastify';
import { useAuth } from "../../components/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"; 

const ITEMS_PER_PAGE = 8;

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    toast.success("Logged out successfully!");
    navigate("/"); 
  };

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    const data = await getArtworks();
    setArtworks(data);
  };

  // const handleDelete = (id) => {
  //   toast.info(
  //     <div>
  //       <p>Are you sure you want to delete this artwork?</p>
  //       <button onClick={() => confirmDelete(id)} style={{ marginRight: "10px" }}>
  //         Yes
  //       </button>
  //       <button onClick={cancelDelete}>No</button>
  //     </div>,
  //     { autoClose: false, closeOnClick: false }
  //   );
  // };

  // const confirmDelete = async (id) => {
  //   if (!id) return;
  //   await deleteArtwork(id);
  //   toast.dismiss();
  //   toast.success("Artwork deleted successfully!");
  //   loadArtworks();
  // };

  // const cancelDelete = () => {
  //   toast.dismiss();
  // };

  const totalPages = Math.ceil(artworks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArtworks = artworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate dynamic pagination buttons
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
  
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
  
      if (currentPage > maxVisiblePages) {
        pages.push("...");
      }
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
  
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
  
      if (currentPage < totalPages - maxVisiblePages + 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
  
    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            ...
          </span>
        );
      }
      return (

        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ""}`}
        >
          {page}
        </button>
      );
    });
  };
  
  return (
   <>
    <div className={styles.homeContainer}>
      <nav className={styles.navArt}>
        <Link className={styles.addArtwork} to="/ArtworkList">Add New Artwork</Link>
        <div>
        <a href="#" onClick={handleLogout} className={styles.addArtwork}>Logout</a>
       </div>
      </nav>

      <div className={styles.artworkGrid}>
        {currentArtworks.map((art) => (
          <Link to={`/ArtworkDetail/${art.id}`} className={styles.goToDetailPage}>
          <div key={art.id} className={styles.artworkCard}>
              <img src={`http://localhost:5000${art.pictureUrl}`} alt={art.title} />
            
            <div className={styles.artworkInfo}>
              <p>{art.title}</p>
              <p>{art.artist} - {art.year}</p>
              
              {/* <div className={styles.artworkBtn}>
                <Link className={styles.editBtn} to={`/edit/${art.id}`}>Edit</Link>
                <button className={styles.deleteBtn} onClick={() => handleDelete(art.id)}>Delete</button>
              </div> */}

            </div>
          </div>
          </Link>
        ))}
      </div>

      {/* Modern Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.arrowBtn}
        >
          <FaAngleLeft />
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.arrowBtn}
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
    </>
  );
};

export default Home;
