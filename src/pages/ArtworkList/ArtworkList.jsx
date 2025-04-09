import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../ArtworkList/ArtworkList.module.css";
import { toast} from 'react-toastify';

const ArtworkForm = () => {
  const [dimensionValue, setDimensionValue] = useState('');
  const [dimensionUnit, setDimensionUnit] = useState('');

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
    additionalPictures: [],
  });

  const [file, setFile] = useState(null);
  const [techniques, setTechniques] = useState(() => {
    const storedTechniques = JSON.parse(localStorage.getItem("techniques"));
    return (
      storedTechniques || {
        painting: ["oil", "tempera", "gouache"],
        sculpture: ["marble", "bronze"],
      }
    );
  });

  const [mediums, setMediums] = useState(() => {
    const stored = localStorage.getItem("mediums");
    return stored ? JSON.parse(stored) : [];
  });

  const [additionalPictures, setAdditionalPictures] = useState([]);
  const [newMedium, setNewMedium] = useState("");
  const [newTechnique, setNewTechnique] = useState("");
  const [newSubTechnique, setNewSubTechnique] = useState("");
  const [subTechniqueVisible, setSubTechniqueVisible] = useState(true); 
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const validateForm = () => {
    console.log("Form data during validation:", form);
    const newErrors = {};
    
    if (!form.artist.trim()) newErrors.artist = "Artist is required.";
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.year || form.year < 1000 || form.year > new Date().getFullYear()) {
      newErrors.year = "Enter a valid year.";
    }
    if (!dimensionValue || dimensionValue <= 0)
      newErrors.dimensionValue = "Enter a valid dimension value.";
    if (!dimensionUnit)
      newErrors.dimensionUnit = "Please select a dimension unit.";
    if (!form.technique)
      newErrors.technique = "Technique is required.";
    if (!form.medium)
      newErrors.medium = "Medium is required.";
    if (!form.invoice)
      newErrors.invoice = "Invoice file is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  

  useEffect(() => {
    if (id) {
      // getArtworkById(id).then((data) => setForm(data));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleDimensionChange = (value, unit) => {
    setDimensionValue(value);
    setDimensionUnit(unit);
  
    if (value && unit) {
      const combined = `${value} ${unit}`;
      setForm({ ...form, dimensions: combined });
    }
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSelectChange = (e) => {
    const selectedTechnique = e.target.value;
    setForm({ ...form, technique: selectedTechnique, subTechnique: "" });
    setSubTechniqueVisible(true); // Show the sub-technique input when a new technique is selected
    if (selectedTechnique !== "addNew") {
      setNewTechnique("");
    }
  };

  const handleNewTechniqueChange = (e) => {
    setNewTechnique(e.target.value);
  };

  const handleAddNewTechnique = () => {
    const trimmedTechnique = newTechnique.trim();
    if (
      trimmedTechnique &&
      !techniques.hasOwnProperty.call(techniques, trimmedTechnique)
    ) {
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
      setSubTechniqueVisible(false); // Hide the sub-technique input after adding
    } else {
      alert("Please enter a valid sub-technique name and select a technique.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors in the form before submitting.");
      return;
    }
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key !== "invoice") {
        formData.append(key, form[key]);
      }
    });

    if (file) formData.append("picture", file);
    if (form.invoice) formData.append("invoice", form.invoice);

    // Append additional pictures
    additionalPictures.forEach((file) => {
      formData.append("additionalPictures", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/artworks",
        formData
      );
      console.log("Artwork submitted:", response.data);
      navigate("/Home");
    } catch (error) {
      console.error("Error submitting artwork:", error);
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
               className={`${styles.ArtworkFormInput} ${errors.artist ? styles.inputError : ""}`}
              type="text"
              name="artist"
              value={form.artist}
              onChange={handleChange}
              placeholder="Artist"
            
            />
            {errors.artist && <div className={styles.errorMessage}>{errors.artist}</div>}
          </label>

          {/* Title Field */}
          <label>
            Title
            <input
              className={`${styles.ArtworkFormInput} ${errors.title ? styles.inputError : ""}`} 
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
            
            />
            {errors.title && <div className={styles.errorMessage}>{errors.title}</div>}
          </label>

          {/* Year Field */}
          <label>
            Year
            <input
              className={`${styles.ArtworkFormInput} ${errors.year ? styles.inputError : ""}`}
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Year"
            
            />
            {errors.year && <div className={styles.errorMessage}>{errors.year}</div>}
          </label>

          {/* Dimensions Field */}
          <label>
  Dimensions (select between cm or mm)
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <input
      type="number"
      className={`${styles.ArtworkFormInput} ${errors.dimensions ? styles.inputError : ""}`}
      value={dimensionValue}
      onChange={(e) => handleDimensionChange(e.target.value, dimensionUnit)}
      placeholder="Enter value"
   
    />
    <select
      className={`${styles.ArtworkFormInput} ${errors.dimensions ? styles.inputError : ""}`}
      value={dimensionUnit}
      onChange={(e) => handleDimensionChange(dimensionValue, e.target.value)}
   
    >
      <option value="">Select unit</option>
      <option value="cm">Centimeters (cm)</option>
      <option value="mm">Millimeters (mm)</option>
    </select>
  </div>
  {errors.dimensionValue && <div className={styles.errorMessage}>{errors.dimensionValue}</div>}
  {errors.dimensionUnit && <div className={styles.errorMessage}>{errors.dimensionUnit}</div>}
</label>


          {/* Technique Field */}
          <label>
        Technique
        <select
         className={`${styles.ArtworkFormInput} ${errors.technique ? styles.inputError : ""}`}
          name="technique"
          value={form.technique}
          onChange={handleSelectChange}
        >
          <option value="">Select Technique</option>
          <option value="addNew" className={styles.addOption}>Add New Technique...</option>
          {Object.keys(techniques).map((technique, index) => (
            <option key={index} value={technique}>
              {technique}
            </option>
          ))}
        </select>
        {errors.technique && <div className={styles.errorMessage}>{errors.technique}</div>}
      </label>

      {/* New Technique Input */}
      {form.technique === "addNew" && (
        <div>
          <label>
            New Technique
            <input
              className={styles.ArtworkFormInput}
              type="text"
              value={newTechnique}
              onChange={handleNewTechniqueChange}
              placeholder="Enter new technique"
            />
            <button type="button" onClick={handleAddNewTechnique}  className={styles.addNewTechnique}>
              Add New Technique
            </button>
          </label>
        </div>
      )}

        {/* Sub Technique Field */}
        {form.technique && subTechniqueVisible && (
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
            <button
              type="button"
              onClick={handleAddSubTechnique}
              className={styles.addSubTechnique}
            >
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
          
        </label> )}

          {/* Medium Field */}
          {form.medium === "addNew" && (
            <label>
              New Medium Name
              <input
                className={`${styles.ArtworkFormInput} ${errors.medium ? styles.inputError : ""}`}
                type="text"
                value={newMedium}
                onChange={(e) => setNewMedium(e.target.value)}
                placeholder="Enter new medium"
              
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
              className={`${styles.ArtworkFormInput} ${errors.medium ? styles.inputError : ""}`}
              name="medium"
              value={form.medium}
              onChange={(e) => {
                const selected = e.target.value;
                setForm({ ...form, medium: selected });
                if (selected !== "addNew") {
                  setNewMedium("");
                }
              }}
             
            >
              <option value="">Select Medium</option>
              {mediums.map((medium, index) => (
                <option key={index} value={medium}>
                  {medium}
                </option>
              ))}
              <option value="addNew" className={styles.addOption}>Add new medium...</option>
            </select>
            {errors.medium && <div className={styles.errorMessage}>{errors.medium}</div>}
          </label>

          {/* Other Fields */}
          <label>
            Number of Editions
            <input
              className={`${styles.ArtworkFormInput} ${errors.numberOfEditions ? styles.inputError : ""}`}
              type="number"
              name="numberOfEditions"
              value={form.numberOfEditions}
              onChange={handleChange}
              placeholder="Number of Editions"
            />
            {errors.numberOfEditions && <div className={styles.errorMessage}>{errors.numberOfEditions}</div>}
          </label>

          {/* Edition Number Field */}
          <label>
            Edition Number
            <input
              className={`${styles.ArtworkFormInput} ${errors.editionNumber ? styles.inputError : ""}`}
              type="text"
              name="editionNumber"
              value={form.editionNumber}
              onChange={handleChange}
              placeholder="Edition Number"
            />
            {errors.editionNumber && <div className={styles.errorMessage}>{errors.editionNumber}</div>}
          </label>

          {/* Provenance Field */}
          <label>
            Provenance
            <textarea
              className={`${styles.ArtworkFormInput} ${errors.provenance ? styles.inputError : ""}`}
              name="provenance"
              value={form.provenance}
              onChange={handleChange}
              placeholder="Provenance"
            ></textarea>
            {errors.provenance && <div className={styles.errorMessage}>{errors.provenance}</div>}
          </label>
          <label>
            Literature List
            <textarea
              className={`${styles.ArtworkFormInput} ${errors.literatureList ? styles.inputError : ""}`}
              name="literatureList"
              value={form.literatureList}
              onChange={handleChange}
              placeholder="Literature List"
            ></textarea>
            {errors.literatureList && <div className={styles.errorMessage}>{errors.literatureList}</div>}
          </label>

          <label>
            Exhibition List
            <textarea
              className={`${styles.ArtworkFormInput} ${errors.exhibitionList ? styles.inputError : ""}`}
              name="exhibitionList"
              value={form.exhibitionList}
              onChange={handleChange}
              placeholder="Exhibition List"
            ></textarea>
            {errors.exhibitionList && <div className={styles.errorMessage}>{errors.exhibitionList}</div>}
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
              className={`${styles.ArtworkFormInput} ${errors.invoice ? styles.inputError : ""}`}
              type="file"
              name="invoice"
              accept="image/*,.pdf"
              onChange={(e) => setForm({ ...form, invoice: e.target.files[0] })}
            
            />
            {errors.invoice && <div className={styles.errorMessage}>{errors.invoice}</div>}
          </label>

          {/* Upload Image Field */}
          <label>
            Upload Image
            <input
              className={`${styles.ArtworkFormInput} ${errors.image  ? styles.inputError : ""}`}
              type="file"
              onChange={handleFileChange}
              
            />
            {errors.image && <div className={styles.errorMessage}>{errors.image }</div>}
          </label>

          <label>
            Upload Additional Pictures (Optional)
            <input
              className={styles.ArtworkFormInput}
              type="file"
              name="additionalPictures"
              multiple
              onChange={(e) =>
                setAdditionalPictures(Array.from(e.target.files))
              }
            />
          </label>

          <div className={styles.artworkSubmitBtn}>
            <button
              className={styles.submitButton}
              type="submit"
              form="artworkForm"
            >
              {id ? "Update" : "Submit"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ArtworkForm;
