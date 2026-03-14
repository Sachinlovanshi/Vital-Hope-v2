import faiss
import numpy as np

dimension = 1536
index = faiss.IndexFlatL2(dimension)

documents = []

def add_embedding(embedding, text):
    vector = np.array([embedding]).astype("float32")
    index.add(vector)
    documents.append(text)

def search(query_embedding, k=3):
    vector = np.array([query_embedding]).astype("float32")
    distances, indices = index.search(vector, k)

    results = []
    for i in indices[0]:
        if i < len(documents):
            results.append(documents[i])

    return results