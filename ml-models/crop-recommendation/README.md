# Crop Recommendation Model

## How it works
Takes 7 soil/weather inputs → Random Forest model → predicts best crop.

## Setup (one time)

1. Download dataset from Kaggle:
   https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset
   Place `Crop_recommendation.csv` in this folder.

2. Install dependencies:
   ```
   pip install pandas scikit-learn numpy streamlit joblib
   ```

3. Train the model (generates crop_model.pkl):
   ```
   python train.py
   ```

4. Run the app locally:
   ```
   streamlit run app.py
   ```

## Deploy on Streamlit Cloud (free)

1. Push this folder to GitHub
2. Go to https://share.streamlit.io
3. New app → select repo → set path to `ml-models/crop-recommendation/app.py`
4. Deploy → get public URL
5. Update `components/Model.jsx` in KisanSathi with the new URL

## Files
- `train.py` — trains the model, saves crop_model.pkl
- `app.py` — Streamlit UI that loads the model and serves predictions
- `requirements.txt` — Python dependencies for Streamlit Cloud
- `crop_model.pkl` — generated after running train.py (not in git)
- `label_encoder.pkl` — generated after running train.py (not in git)
