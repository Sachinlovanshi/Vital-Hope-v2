import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import socket from "../socket/socket";

function PatientDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
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
    <div>
      <h2>Patient Dashboard</h2>
      <button onClick={connectExpert}>
        Connect to Medical Expert
      </button>
    </div>
  );
}

export default PatientDashboard;
