import { useEffect, useState } from "react";
import socket from "../socket/socket";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function ExpertDashboard() {

  const [incoming, setIncoming] = useState(null);
  const navigate = useNavigate();

  // Drug recommendation state
  const [symptoms, setSymptoms] = useState({
    fever: 0,
    cough: 0,
    headache: 0,
    fatigue: 0
  });

  const [result, setResult] = useState(null);

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

  const handleChange = (e) => {
    setSymptoms({
      ...symptoms,
      [e.target.name]: Number(e.target.value)
    });
  };

  const predictDisease = async () => {

    try {

      const { data } = await API.post(
        "/drug/recommend",
        symptoms
      );

      setResult(data);

    } catch (error) {
      alert("Prediction failed");
    }

  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Expert Dashboard</h2>

      {/* Incoming Call Section */}
      {incoming && (
        <div style={{ border: "1px solid gray", padding: "10px", marginBottom:"20px" }}>
          <p>Incoming Call...</p>

          <button onClick={acceptCall}>
            Accept
          </button>

          <button onClick={rejectCall}>
            Reject
          </button>
        </div>
      )}

      {/* Drug Recommendation Section */}
      <div style={{ border:"1px solid #ccc", padding:"20px", marginTop:"20px", maxWidth:"400px" }}>

        <h3>Drug Recommendation System</h3>

        <label>Fever</label>
        <select name="fever" onChange={handleChange}>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <br/><br/>

        <label>Cough</label>
        <select name="cough" onChange={handleChange}>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <br/><br/>

        <label>Headache</label>
        <select name="headache" onChange={handleChange}>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <br/><br/>

        <label>Fatigue</label>
        <select name="fatigue" onChange={handleChange}>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <br/><br/>

        <button onClick={predictDisease}>
          Predict Disease
        </button>

        {result && (
          <div style={{ marginTop:"20px" }}>
            <h4>Prediction Result</h4>

            <p>
              <strong>Disease:</strong> {result.disease}
            </p>

            <p>
              <strong>Recommended Drug:</strong> {result.recommended_drug}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}

export default ExpertDashboard;