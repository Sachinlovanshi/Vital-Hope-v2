import { useEffect, useState } from "react";
import API from "../api/axios";
import socket from "../socket/socket";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function PatientDashboard() {
  const navigate = useNavigate();

  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {

    // Get user location
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);

        // Fetch nearby hospitals
        const { data } = await API.get(
          `/hospitals/nearby?latitude=${lat}&longitude=${lng}`
        );

        setHospitals(data);
      },
      (err) => {
        console.error("Location error:", err);
      }
    );

    socket.on("callAccepted", (data) => {
      navigate(`/video/${data.roomId}`);
    });

    socket.on("callRejected", () => {
      alert("Call rejected by expert");
    });

    return () => {
      socket.off("callAccepted");
      socket.off("callRejected");
    };

  }, []);

  const connectExpert = async () => {
    await API.post("/consultations/create");
    alert("Waiting for expert...");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Patient Dashboard</h2>

      <button onClick={connectExpert}>
        Connect to Medical Expert
      </button>

      <h3 style={{ marginTop: "20px" }}>
        Nearby Hospitals
      </h3>

      {position && (
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "500px", marginTop: "10px" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Marker */}
          <Marker position={position}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Hospital Markers */}
          {hospitals.map((hospital) => (
            <Marker
              key={hospital._id}
              position={[
                hospital.location.coordinates[1],
                hospital.location.coordinates[0]
              ]}
            >
              <Popup>
                <strong>{hospital.name}</strong>
                <br />
                Available Beds: {hospital.availableBeds}
              </Popup>
            </Marker>
          ))}
          
        </MapContainer>
      )}
       <h3>Hospital AI Assistant</h3>
<Chatbot />
<h3>Hospital Bed Availability</h3>

{hospitals.map((h) => (

  <div key={h._id} style={{
    border:"1px solid gray",
    padding:"10px",
    marginTop:"10px"
  }}>

    <h4>{h.name}</h4>

    <p>Available Beds: {h.availableBeds}</p>

    <p>ICU Beds: {h.icuBeds}</p>

  </div>

))}
    </div>
    
  );
}

export default PatientDashboard;