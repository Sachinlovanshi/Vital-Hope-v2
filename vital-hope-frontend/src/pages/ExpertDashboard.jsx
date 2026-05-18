import { useEffect, useState } from "react";
import socket from "../socket/socket";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function ExpertDashboard() {

  const [incoming, setIncoming] =
    useState(null);

  const [symptoms, setSymptoms] =
    useState([]);

  const [selectedSymptoms,
    setSelectedSymptoms] = useState([]);

  const [prediction,
    setPrediction] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    socket.on("incomingCall",
      (data) => {
        setIncoming(data);
      });

    loadSymptoms();

    return () => {
      socket.off("incomingCall");
    };

  }, []);

  const loadSymptoms = async () => {

    const { data } =
      await API.get("/drug/symptoms");

    setSymptoms(data.symptoms);
  };

  const toggleSymptom = (
    symptom
  ) => {

    if (
      selectedSymptoms.includes(symptom)
    ) {

      setSelectedSymptoms(
        selectedSymptoms.filter(
          s => s !== symptom
        )
      );

    } else {

      setSelectedSymptoms([
        ...selectedSymptoms,
        symptom
      ]);

    }
  };

  const predictDisease = async () => {

    const { data } =
      await API.post(
        "/drug/recommend",
        {
          symptoms:
            selectedSymptoms
        }
      );

    setPrediction(
      data.predicted_disease
    );
  };

  const acceptCall = async () => {

    await API.post(
      "/consultations/accept",
      {
        consultationId:
          incoming.consultationId
      }
    );

    navigate(
      `/video/${incoming.roomId}`
    );
  };

  const rejectCall = async () => {

    await API.post(
      "/consultations/reject",
      {
        consultationId:
          incoming.consultationId
      }
    );

    setIncoming(null);
  };

  return (
    <div style={{
      padding:"20px"
    }}>

      <h2>
        Expert Dashboard
      </h2>

      {incoming && (
        <div>
          <p>
            Incoming Call...
          </p>

          <button
            onClick={acceptCall}
          >
            Accept
          </button>

          <button
            onClick={rejectCall}
          >
            Reject
          </button>
        </div>
      )}

      <h3>
        Drug Recommendation
      </h3>

      <div style={{
        display:"grid",
        gridTemplateColumns:
        "repeat(4,1fr)",
        gap:"10px"
      }}>

        {symptoms.map(
          symptom => (

          <label
            key={symptom}
          >
            <input
              type="checkbox"

              checked={
                selectedSymptoms.includes(
                  symptom
                )
              }

              onChange={() =>
                toggleSymptom(
                  symptom
                )
              }
            />

            {symptom}
          </label>
        ))}
      </div>

      <button
        onClick={
          predictDisease
        }
        style={{
          marginTop:"20px"
        }}
      >
        Predict Disease
      </button>

      {prediction && (
        <h3>
          Prediction:
          {" "}
          {prediction}
        </h3>
      )}

    </div>
  );
}

export default ExpertDashboard;