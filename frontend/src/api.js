import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function analyzeResume(file, jobDescription) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("job_description", jobDescription);

  const response = await axios.post(`${API_URL}/analyze`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}