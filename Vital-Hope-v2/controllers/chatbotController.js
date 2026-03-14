import axios from "axios";

export const askChatbot = async (req, res) => {
  try {
    const { question } = req.body;

    const response = await axios.post(
      "http://localhost:8000/ask",
      {
        question
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({ error: "Chatbot failed" });
  }
};