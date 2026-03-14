import { useState } from "react";
import API from "../api/axios";

function AdminDashboard() {

  const [file, setFile] = useState(null);

  const upload = async () => {

    const formData = new FormData();
    formData.append("file", file);

    await API.post(
      "/hospitals/upload-brochure",
      formData
    );

    alert("Brochure uploaded successfully");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Hospital Admin Dashboard</h2>

      <h3>Upload Hospital Brochure</h3>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={upload}>
        Upload
      </button>

    </div>
  );
}

export default AdminDashboard;