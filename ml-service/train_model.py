import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv("dataset.csv")

print("Dataset loaded:", df.shape)

# Collect all unique symptoms
symptoms = set()

for col in df.columns[1:]:
    symptoms.update(df[col].dropna().unique())

symptoms = sorted(symptoms)

print("Total unique symptoms:", len(symptoms))

# Create empty feature matrix
X = pd.DataFrame(0, index=range(len(df)), columns=symptoms)

# Fill feature matrix
for i, row in df.iterrows():
    for symptom in row[1:]:
        if pd.notna(symptom):
            X.at[i, symptom] = 1

# Labels
y = df["Disease"]

print("Feature matrix shape:", X.shape)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train Random Forest
model = RandomForestClassifier(
    n_estimators=300,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("Model accuracy:", accuracy)

# Save model
joblib.dump(model, "model.joblib")

# Save symptom list
joblib.dump(symptoms, "symptoms.joblib")

print("Model and symptom list saved")