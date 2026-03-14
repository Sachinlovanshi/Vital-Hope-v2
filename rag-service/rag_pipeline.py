from dotenv import load_dotenv
import os


from openai import OpenAI
from pypdf import PdfReader
load_dotenv()

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY not found in environment variables")
from vector_store import add_embedding, search
client = OpenAI(
    
    api_key=os.getenv("OPENAI_API_KEY")
)

def process_pdf(file_path):
    reader = PdfReader(file_path)

    for page in reader.pages:
        text = page.extract_text()

        if not text:
            continue

        embedding = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        ).data[0].embedding

        add_embedding(embedding, text)

def ask_question(question):

    query_embedding = client.embeddings.create(
        model="text-embedding-3-small",
        input=question
    ).data[0].embedding

    context = search(query_embedding)

    prompt = f"""
Use the following hospital document context to answer.

Context:
{context}

Question:
{question}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":prompt}]
    )

    return response.choices[0].message.content