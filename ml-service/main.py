from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()

model = joblib.load("model.joblib")
symptoms = joblib.load("symptoms.joblib")

@app.post("/predict")
def predict(data: dict):

    # Create empty input
    input_data = {symptom: 0 for symptom in symptoms}

    # Mark selected symptoms
    for symptom in data["symptoms"]:
        if symptom in input_data:
            input_data[symptom] = 1

    df = pd.DataFrame([input_data])

    prediction = model.predict(df)[0]

    return {
        "predicted_disease": prediction
    }