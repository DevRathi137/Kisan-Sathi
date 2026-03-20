# ============================================================
# CROP RECOMMENDATION MODEL - TRAINING SCRIPT
# ============================================================
# What this file does:
#   1. Loads the dataset (CSV file)
#   2. Splits it into training data and test data
#   3. Trains a Random Forest model
#   4. Evaluates how accurate it is
#   5. Saves the trained model as a .pkl file
#
# Run this ONCE to generate crop_model.pkl
# After that, the Streamlit app uses the .pkl directly
# ============================================================

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# ── STEP 1: Load the dataset ─────────────────────────────────
# The CSV has 2200 rows, 8 columns:
# N, P, K, temperature, humidity, ph, rainfall, label
# 'label' is the crop name (rice, wheat, mango, etc.)

csv_path = "Crop_recommendation.csv"

if not os.path.exists(csv_path):
    print("❌ ERROR: Crop_recommendation.csv not found!")
    print("   Please download it from:")
    print("   https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset")
    print("   and place it in this folder (ml-models/crop-recommendation/)")
    exit(1)

df = pd.read_csv(csv_path)
print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
print(f"   Crops in dataset: {sorted(df['label'].unique())}")
print(f"   Samples per crop:\n{df['label'].value_counts()}\n")

# ── STEP 2: Separate features (X) and target (y) ─────────────
# X = the 7 input columns the farmer provides
# y = the crop label we want to predict

X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

# ── STEP 3: Encode labels ─────────────────────────────────────
# The model works with numbers, not strings.
# LabelEncoder converts: apple→0, banana→1, blackgram→2, etc.
# We save the encoder too so the app can reverse it (0 → "apple")

le = LabelEncoder()
y_encoded = le.fit_transform(y)
print(f"✅ Label encoding done. Example: 'rice' → {le.transform(['rice'])[0]}")

# ── STEP 4: Split into train and test sets ────────────────────
# 80% of data is used to TRAIN the model
# 20% is held back to TEST how well it learned
# random_state=42 means the split is reproducible (same every run)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)
print(f"✅ Data split: {len(X_train)} training samples, {len(X_test)} test samples\n")

# ── STEP 5: Train the Random Forest model ────────────────────
# n_estimators=200 → build 200 decision trees
# Each tree is trained on a random subset of data
# Final prediction = majority vote across all 200 trees
# This makes it robust and resistant to overfitting

print("⏳ Training Random Forest model (this takes a few seconds)...")
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,       # trees grow until leaves are pure
    min_samples_split=2,
    random_state=42,
    n_jobs=-1             # use all CPU cores for speed
)
model.fit(X_train, y_train)
print("✅ Training complete!\n")

# ── STEP 6: Evaluate the model ───────────────────────────────
# Accuracy = how many predictions were correct out of total
# We also print a full report showing precision/recall per crop

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"🎯 Model Accuracy: {accuracy * 100:.2f}%")
print("\n📊 Detailed Report:")
print(classification_report(y_test, y_pred, target_names=le.classes_))

# ── STEP 7: Show feature importance ──────────────────────────
# Which input matters most for the prediction?
# Higher % = more important

importances = model.feature_importances_
feature_names = ['N', 'P', 'K', 'Temperature', 'Humidity', 'pH', 'Rainfall']
print("📌 Feature Importance (what the model relies on most):")
for name, imp in sorted(zip(feature_names, importances), key=lambda x: -x[1]):
    bar = "█" * int(imp * 50)
    print(f"   {name:<12} {imp*100:5.1f}%  {bar}")

# ── STEP 8: Save the model and encoder ───────────────────────
# joblib is faster than pickle for large numpy arrays
# The app will load these files instead of retraining every time

joblib.dump(model, "crop_model.pkl")
joblib.dump(le, "label_encoder.pkl")
print("\n✅ Saved: crop_model.pkl")
print("✅ Saved: label_encoder.pkl")
print("\n🚀 You can now run the Streamlit app:")
print("   streamlit run app.py")
