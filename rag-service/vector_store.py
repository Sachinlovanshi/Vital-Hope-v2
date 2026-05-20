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

    global documents

    embeddings = model.encode(chunks)

    embeddings = np.array(
        embeddings
    ).astype("float32")

    index.add(embeddings)

    documents.extend(chunks)

    print(
        f"Documents stored: {len(documents)}"
    )


def retrieve(query, k=3):

    global documents

    if len(documents) == 0:
        return []

    query_embedding = model.encode(
        [query]
    )

    query_embedding = np.array(
        query_embedding
    ).astype("float32")

    distances, indices = index.search(
        query_embedding,
        min(k, len(documents))
    )

    results = []

    for idx in indices[0]:

        # Safety check
        if (
            idx >= 0
            and idx < len(documents)
        ):
            results.append(
                documents[idx]
            )

    return results