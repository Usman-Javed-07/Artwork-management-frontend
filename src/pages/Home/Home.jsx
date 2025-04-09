import { useEffect, useState } from "react";
import { getArtworks } from "../../services/artworkService";
import { Link } from "react-router-dom";
import styles from "../Home/Home.module.css";
import { toast } from "react-toastify";
import { useAuth } from "../../components/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const ITEMS_PER_PAGE = 8;

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [advancedFilters, setAdvancedFilters] = useState({
    title: "",
    artist: "",
    year: "",
    technique: "",
    dimensions: "",
    medium: "",
  });

  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  useEffect(() => {
    loadArtworks();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, advancedFilters]);

  const loadArtworks = async () => {
    const data = await getArtworks();
    setArtworks(data);
  };

  const totalPages = Math.ceil(artworks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // Filter artworks based on search query
  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.year.toString().includes(searchQuery)
  );

  // Apply advanced filter logic
  const applyAdvancedFilters = (artwork) => {
    return (
      artwork.title
        .toLowerCase()
        .includes(advancedFilters.title.toLowerCase()) &&
      artwork.artist
        .toLowerCase()
        .includes(advancedFilters.artist.toLowerCase()) &&
      artwork.year.toString().includes(advancedFilters.year) &&
      artwork.technique
        ?.toLowerCase()
        .includes(advancedFilters.technique.toLowerCase()) &&
      artwork.dimensions
        ?.toLowerCase()
        .includes(advancedFilters.dimensions.toLowerCase()) &&
        artwork.medium
        ?.toLowerCase()
        .includes(advancedFilters.medium.toLowerCase())
    );
  };

  const currentArtworks = filteredArtworks
    .filter(applyAdvancedFilters)
    .slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
          className={`${styles.pageBtn} ${
            currentPage === page ? styles.activePage : ""
          }`}
        >
          {page}
        </button>
      );
    });
  };

  const toggleAdvancedSearch = () => {
    setIsAdvancedSearchVisible(!isAdvancedSearchVisible);
  };

  return (
    <>
      <div className={styles.homeContainer}>
        <nav className={styles.navArt}>
          <Link className={styles.addArtwork} to="/ArtworkList">
            Add New Artwork
          </Link>
          <div>
            <a href="#" onClick={handleLogout} className={styles.addArtwork}>
              Logout
            </a>
          </div>
        </nav>

        {/* Search Input */}
        <div className={styles.searchArtwork}>
        <div className={styles.searchContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>

        {/* Advanced Search Toggle */}
        <button
          onClick={toggleAdvancedSearch}
          className={styles.advancedSearchToggle}
        >
          {isAdvancedSearchVisible
            ? "Hide Filter Search - "
            : "Show Filter Search + "}
        </button>
        </div>

        {/* New Advanced Search Filters */}
        <div
          className={`${styles.advancedSearchContainer} ${
            isAdvancedSearchVisible ? styles.visible : ""
          }`}
        >
          <div>
            <label>Title:</label>
            <input
              className={styles.ArtworkFormInput}
              type="text"
              value={advancedFilters.title}
              onChange={(e) =>
                setAdvancedFilters({
                  ...advancedFilters,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label>Artist:</label>
            <input
              className={styles.ArtworkFormInput}
              type="text"
              value={advancedFilters.artist}
              onChange={(e) =>
                setAdvancedFilters({
                  ...advancedFilters,
                  artist: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label>Year:</label>
            <input
              className={styles.ArtworkFormInput}
              type="number"
              value={advancedFilters.year}
              onChange={(e) =>
                setAdvancedFilters({ ...advancedFilters, year: e.target.value })
              }
            />
          </div>
          <div>
            <label>Technique:</label>
            <input
              className={styles.ArtworkFormInput}
              type="text"
              value={advancedFilters.technique}
              onChange={(e) =>
                setAdvancedFilters({
                  ...advancedFilters,
                  technique: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label>Dimensions:</label>
            <input
              className={styles.ArtworkFormInput}
              type="text"
              value={advancedFilters.dimensions}
              onChange={(e) =>
                setAdvancedFilters({
                  ...advancedFilters,
                  dimensions: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label>Medium:</label>
            <input
              className={styles.ArtworkFormInput}
              type="text"
              value={advancedFilters.medium}
              onChange={(e) =>
                setAdvancedFilters({
                  ...advancedFilters,
                  medium: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Display Artworks */}
        <div className={styles.artworkGrid}>
          {currentArtworks.map((art) => (
            <Link
              to={`/ArtworkDetail/${art.id}`}
              className={styles.goToDetailPage}
              key={art.id}
            >
              <div className={styles.artworkCard}>
                <img
                  src={`http://localhost:5000${art.pictureUrl}`}
                  alt={art.title}
                />
                <div className={styles.artworkInfo}>
                  <p>{art.title}</p>
                  <p>
                    {art.artist} - {art.year}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
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
