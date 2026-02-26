import { useEffect, useState } from "react";
import socket from "../socket/socket";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function ExpertDashboard() {
  const [incoming, setIncoming] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("incomingCall", (data) => {
      setIncoming(data);
    });

    return () => {
      socket.off("incomingCall");
    };
  }, []);

  const acceptCall = async () => {
    await API.post("/consultations/accept", {
      consultationId: incoming.consultationId
    });

    navigate(`/video/${incoming.roomId}`);
  };

  const rejectCall = async () => {
    await API.post("/consultations/reject", {
      consultationId: incoming.consultationId
    });

    setIncoming(null);
  };

  return (
    <div>
      <h2>Expert Dashboard</h2>

      {incoming && (
        <div>
          <p>Incoming Call...</p>
          <button onClick={acceptCall}>Accept</button>
          <button onClick={rejectCall}>Reject</button>
        </div>
      )}
    </div>
  );
}

export default ExpertDashboard;
