import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../ArtworkList/ArtworkList.module.css";

const ArtworkForm = () => {
  const [form, setForm] = useState({
    artist: "",
    title: "",
    year: "",
    dimensions: "",
    technique: "",
    subTechnique: "",
    medium: "",
    numberOfEditions: "",
    editionNumber: "",
    provenance: "",
    literatureList: "",
    exhibitionList: "",
    extraInformation: "",
    invoice: null,
  });

  const [file, setFile] = useState(null);
  const [techniques, setTechniques] = useState(() => {
    const storedTechniques = JSON.parse(localStorage.getItem("techniques"));
    return storedTechniques || {
      painting: ["oil", "tempera", "gouache"],
      sculpture: ["marble", "bronze"],
    };
  });

  const [mediums, setMediums] = useState(() => {
    const stored = localStorage.getItem("mediums");
    return stored ? JSON.parse(stored) : [];
  });

  const [newMedium, setNewMedium] = useState("");
  const [newTechnique, setNewTechnique] = useState(""); 
  const [newSubTechnique, setNewSubTechnique] = useState(""); 
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // getArtworkById(id).then((data) => setForm(data));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSelectChange = (e) => {
    const selectedTechnique = e.target.value;
    setForm({ ...form, technique: selectedTechnique, subTechnique: "" });
    if (selectedTechnique !== "addNew") {
      setNewTechnique(""); 
    }
  };
  const handleNewTechniqueChange = (e) => {
    setNewTechnique(e.target.value); 
  };

  const handleAddNewTechnique = () => {
    const trimmedTechnique = newTechnique.trim();
    if (trimmedTechnique && !techniques.hasOwnProperty.call(techniques, trimmedTechnique)) {
      setTechniques((prevTechniques) => {
        const updatedTechniques = {
          ...prevTechniques,
          [trimmedTechnique]: [],
        };
        localStorage.setItem("techniques", JSON.stringify(updatedTechniques)); 
        return updatedTechniques;
      });
      setForm({ ...form, technique: trimmedTechnique, subTechnique: "" });
      setNewTechnique("");
    } else {
      alert("Please enter a valid new technique name");
    }
  };

  const handleNewSubTechniqueChange = (e) => {
    setNewSubTechnique(e.target.value);
  };

  const handleAddSubTechnique = () => {
    const trimmedSubTechnique = newSubTechnique.trim();
    if (trimmedSubTechnique && form.technique) {
      const updatedTechniques = { ...techniques };
      updatedTechniques[form.technique].push(trimmedSubTechnique);
  
      setTechniques(updatedTechniques);
      localStorage.setItem("techniques", JSON.stringify(updatedTechniques)); 
      setNewSubTechnique(""); 
    } else {
      alert("Please enter a valid sub-technique name and select a technique.");
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (file) formData.append("picture", file);
  
    try {
      const response = await axios.post("http://localhost:5000/api/artworks", formData);
      console.log("Artwork submitted:", response.data);
      navigate("/Home");
    } catch (error) {
      console.error("Error submitting artwork:", error);
    }
    if (!mediums.includes(form.medium)) {
      const updated = [...mediums, form.medium];
      setMediums(updated);
      localStorage.setItem("mediums", JSON.stringify(updated));
    }
    
  };

  return (
    <div>
      <nav className={styles.artworkList}>
        <Link to="/Home" className={styles.goHome}>
          Home
        </Link>
      </nav>

      <h2 className={styles.artworkHeading}>
        {id ? "Edit Artwork" : "Add New Artwork"}
      </h2>

      <div className={styles.artwrokForm}>
        <form
          onSubmit={handleSubmit}
          className={styles.artworkListForm}
          id="artworkForm"
        >
          {/* Artist Field */}
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

          {/* Title Field */}
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

          {/* Year Field */}
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

          {/* Dimensions Field */}
          <label>
            Dimensions (select between cm or mm)
            <select
              className={styles.ArtworkFormInput}
              name="dimensions"
              value={form.dimensions}
              onChange={handleChange}
              required
            >
              <option value="">Select unit</option>
              <option value="cm">Centimeters (cm)</option>
              <option value="mm">Millimeters (mm)</option>
            </select>
          </label>

          {/* Technique Field */}
          <label>
            Technique
            <select
              className={styles.ArtworkFormInput}
              name="technique"
              value={form.technique}
              onChange={handleSelectChange}
              required
            >
              <option value="">Select Technique</option>
              {Object.keys(techniques).map((technique, index) => (
                <option key={index} value={technique}>
                  {technique}
                </option>
              ))}
              <option value="addNew">Add new technique...</option>
            </select>
          </label>

          {/* Add New Technique */}
          {form.technique === "addNew" && (
            <div>
              <label>
                New Technique Name:
                <input
                  className={styles.ArtworkFormInput}
                  type="text"
                  value={newTechnique} 
                  onChange={handleNewTechniqueChange} 
                  placeholder="New technique name"
                  required
                />
                <button type="button" onClick={handleAddNewTechnique} className={styles.addNewTechnique}>
                  Add New Technique
                </button>
              </label>
            </div>
          )}

          {/* Sub Technique Field */}
          {form.technique && (
            <div>
              <label>
                Sub Technique
                <input
                  className={styles.ArtworkFormInput}
                  type="text"
                  value={newSubTechnique}
                  onChange={handleNewSubTechniqueChange}
                  placeholder="New sub-technique name"
                />
                <button type="button" onClick={handleAddSubTechnique} className={styles.addSubTechnique}>
                  Add Sub Technique
                </button>
              </label>
            </div>
          )}

          {/* Sub Technique Dropdown */}
          {form.technique && (
            <label>
              Sub Technique
              <select
                className={styles.ArtworkFormInput}
                name="subTechnique"
                value={form.subTechnique}
                onChange={handleChange}
              >
                <option value="">Select Sub Technique</option>
                {techniques[form.technique]?.map((subTechnique, index) => (
                  <option key={index} value={subTechnique}>
                    {subTechnique}
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* Medium Field */}
          {form.medium === "addNew" && (
  <label>
    New Medium Name
    <input
      className={styles.ArtworkFormInput}
      type="text"
      value={newMedium}
      onChange={(e) => setNewMedium(e.target.value)}
      placeholder="Enter new medium"
      required
    />
    <button
      type="button"
      onClick={() => {
        const trimmed = newMedium.trim();
        if (trimmed && !mediums.includes(trimmed)) {
          const updated = [...mediums, trimmed];
          setMediums(updated);
          localStorage.setItem("mediums", JSON.stringify(updated));
          setForm({ ...form, medium: trimmed });
          setNewMedium("");
        } else {
          alert("Please enter a unique and valid medium name");
        }
      }}
      className={styles.addSubTechnique}
    >
      Add New Medium
    </button>
  </label>
)}

          <label>
  Medium
  <select
    className={styles.ArtworkFormInput}
    name="medium"
    value={form.medium}
    onChange={(e) => {
      const selected = e.target.value;
      setForm({ ...form, medium: selected });
      if (selected !== "addNew") {
        setNewMedium("");
      }
    }}
    required
  >
    <option value="">Select Medium</option>
    {mediums.map((medium, index) => (
      <option key={index} value={medium}>
        {medium}
      </option>
    ))}
    <option value="addNew">Add new medium...</option>
  </select>
</label>


          {/* Other Fields */}
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

          {/* Edition Number Field */}
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

          {/* Provenance Field */}
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
  Invoice (Upload as picture or file)
  <input
    className={styles.ArtworkFormInput}
    type="file"
    name="invoice"
    accept="image/*,.pdf"
    onChange={(e) => setForm({ ...form, invoice: e.target.files[0] })}
    required 
  />
</label>

{/* {form.invoice && (
  <div>
    <p>Uploaded File: {form.invoice.name}</p>
    {form.invoice.type.startsWith("image/") && (
      <img
        src={URL.createObjectURL(form.invoice)}
        alt="Invoice Preview"
        style={{ maxWidth: "200px", marginTop: "10px" }}
      />
    )}
  </div>
)} */}


          {/* Upload Image Field */}
          <label>
            Upload Image
            <input
              className={styles.ArtworkFormInput}
              type="file"
              onChange={handleFileChange}
              required
            />
          </label>
          <div className={styles.artworkSubmitBtn}>
            <button className={styles.submitButton} type="submit" form="artworkForm">
              {id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
       
      </div>
    </div>
  );
};

export default ArtworkForm;
