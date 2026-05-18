from pypdf import PdfReader
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from vector_store import (
    add_documents,
    retrieve
)

import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def process_pdf(file_path):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        extracted = page.extract_text()

        if extracted:
            text += extracted

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    chunks = splitter.split_text(text)

    add_documents(chunks)

    print(
        f"{len(chunks)} chunks added to FAISS"
    )


def ask_question(question):

    context = retrieve(question)

    prompt = f"""
You are a hospital assistant chatbot.

Answer ONLY from the brochure context.

If answer is unavailable,
say "Information not found."

Context:
{context}

Question:
{question}

Answer clearly.
"""

    response = model.generate_content(
        prompt
    )

    return response.text