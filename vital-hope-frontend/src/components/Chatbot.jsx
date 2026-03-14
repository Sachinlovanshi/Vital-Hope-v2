import { useState } from "react";
import API from "../api/axios";

function Chatbot() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const ask = async () => {

    const { data } = await API.post(
      "/chatbot/ask",
      { question }
    );

    setAnswer(data.answer);
  };

  return (
    <div>
      <h3>Hospital Assistant</h3>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about hospital..."
      />

      <button onClick={ask}>Ask</button>

      <p>{answer}</p>
    </div>
  );
}

export default Chatbot;