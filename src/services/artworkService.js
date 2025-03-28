import axios from "axios";

const API_URL = "http://localhost:5000/api/artworks";

// Fetch all artworks
export const getArtworks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get a single artwork by ID
export const getArtworkById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Add new artwork
export const createArtwork = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update artwork
export const updateArtwork = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// Delete artwork
export const deleteArtwork = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
