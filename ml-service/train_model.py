import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

df = pd.read_csv("dataset.csv")

X = df[["fever","cough","headache","fatigue"]]
y = df["disease"]

model = RandomForestClassifier()

model.fit(X,y)

joblib.dump(model,"model.joblib")

print("Model trained and saved")