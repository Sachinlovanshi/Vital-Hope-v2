import { useState } from "react";
import API from "../api/axios";

function RegisterHospital() {

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    totalBeds: "",
    icuBeds: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async () => {

    await API.post("/hospitals/register", form);

    alert("Hospital Registered");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register Hospital</h2>

      <input name="name" placeholder="Hospital Name" onChange={handleChange}/>
      <input name="address" placeholder="Address" onChange={handleChange}/>
      <input name="latitude" placeholder="Latitude" onChange={handleChange}/>
      <input name="longitude" placeholder="Longitude" onChange={handleChange}/>
      <input name="totalBeds" placeholder="Total Beds" onChange={handleChange}/>
      <input name="icuBeds" placeholder="ICU Beds" onChange={handleChange}/>

      <button onClick={submit}>
        Register Hospital
      </button>

    </div>
  );
}

export default RegisterHospital;