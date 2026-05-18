from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)

dimension = 384

index = faiss.IndexFlatL2(dimension)

documents = []


def add_documents(chunks):

    embeddings = model.encode(chunks)

    index.add(
        np.array(embeddings).astype("float32")
    )

    documents.extend(chunks)


def retrieve(query, k=3):

    query_embedding = model.encode([query])

    distances, indices = index.search(
        np.array(query_embedding).astype("float32"),
        k
    )

    results = []

    for idx in indices[0]:
        if idx < len(documents):
            results.append(documents[idx])

    return results