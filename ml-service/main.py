from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()

model = joblib.load("model.joblib")

drug_map = {
    "Flu": "Paracetamol",
    "Cold": "Antihistamine",
    "Migraine": "Ibuprofen",
    "Dengue": "Acetaminophen",
    "Bronchitis": "Bronchodilator"
}

@app.post("/predict")

def predict(data: dict):

    fever = data["fever"]
    cough = data["cough"]
    headache = data["headache"]
    fatigue = data["fatigue"]

    input_data = pd.DataFrame([[fever,cough,headache,fatigue]],
                              columns=["fever","cough","headache","fatigue"])

    disease = model.predict(input_data)[0]

    drug = drug_map[disease]

    return {
        "disease": disease,
        "recommended_drug": drug
    }