from fastapi import FastAPI, UploadFile
from rag_pipeline import process_pdf, ask_question
import shutil

app = FastAPI()

@app.post("/upload-brochure")
async def upload_brochure(file: UploadFile):

    path = f"uploads/{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    process_pdf(path)

    return {"message": "Brochure processed"}

@app.post("/ask")
async def ask(data: dict):

    question = data["question"]

    answer = ask_question(question)

    return {"answer": answer}