# ============================================================
# CROP RECOMMENDATION - STREAMLIT APP
# ============================================================
# What this file does:
#   - Loads the trained model (crop_model.pkl)
#   - Shows a clean UI for the farmer to enter soil/weather data
#   - Predicts and displays the best crop to grow
#
# Run with: streamlit run app.py
# ============================================================

import streamlit as st
import joblib
import numpy as np
import os

# ── Page config ───────────────────────────────────────────────
st.set_page_config(
    page_title="Crop Recommendation | KisanSathi",
    page_icon="🌾",
    layout="centered"
)

# ── Load model (cached so it only loads once) ─────────────────
@st.cache_resource
def load_model():
    if not os.path.exists("crop_model.pkl"):
        st.error("Model not found. Please run train.py first.")
        st.stop()
    model = joblib.load("crop_model.pkl")
    le    = joblib.load("label_encoder.pkl")
    return model, le

model, le = load_model()

# ── Crop info dictionary ──────────────────────────────────────
# Shown after prediction so the farmer knows what they're growing
crop_info = {
    "rice":       {"emoji": "🌾", "season": "Kharif",  "tip": "Needs flooded fields and high humidity."},
    "maize":      {"emoji": "🌽", "season": "Kharif",  "tip": "Grows well in well-drained loamy soil."},
    "chickpea":   {"emoji": "🫘", "season": "Rabi",    "tip": "Drought tolerant, needs cool dry weather."},
    "kidneybeans":{"emoji": "🫘", "season": "Kharif",  "tip": "Needs well-drained fertile soil."},
    "pigeonpeas": {"emoji": "🌿", "season": "Kharif",  "tip": "Drought resistant, good for dry regions."},
    "mothbeans":  {"emoji": "🌿", "season": "Kharif",  "tip": "Thrives in arid and semi-arid regions."},
    "mungbean":   {"emoji": "🌿", "season": "Kharif",  "tip": "Short duration crop, good for soil health."},
    "blackgram":  {"emoji": "🌿", "season": "Kharif",  "tip": "Grows in tropical and subtropical regions."},
    "lentil":     {"emoji": "🫘", "season": "Rabi",    "tip": "Cool season crop, needs well-drained soil."},
    "pomegranate":{"emoji": "🍎", "season": "Annual",  "tip": "Drought tolerant, needs hot dry summers."},
    "banana":     {"emoji": "🍌", "season": "Annual",  "tip": "Needs high humidity and rich soil."},
    "mango":      {"emoji": "🥭", "season": "Annual",  "tip": "Tropical fruit, needs dry flowering season."},
    "grapes":     {"emoji": "🍇", "season": "Annual",  "tip": "Needs well-drained soil and dry summers."},
    "watermelon": {"emoji": "🍉", "season": "Summer",  "tip": "Needs sandy loam soil and warm weather."},
    "muskmelon":  {"emoji": "🍈", "season": "Summer",  "tip": "Grows in warm climate with sandy soil."},
    "apple":      {"emoji": "🍎", "season": "Annual",  "tip": "Needs cold winters for proper fruiting."},
    "orange":     {"emoji": "🍊", "season": "Annual",  "tip": "Subtropical fruit, needs well-drained soil."},
    "papaya":     {"emoji": "🍈", "season": "Annual",  "tip": "Fast growing, needs warm humid climate."},
    "coconut":    {"emoji": "🥥", "season": "Annual",  "tip": "Coastal crop, needs high humidity."},
    "cotton":     {"emoji": "🌿", "season": "Kharif",  "tip": "Needs black soil and moderate rainfall."},
    "jute":       {"emoji": "🌿", "season": "Kharif",  "tip": "Needs high humidity and alluvial soil."},
    "coffee":     {"emoji": "☕", "season": "Annual",  "tip": "Grows in hilly regions with shade."},
}

# ── UI ────────────────────────────────────────────────────────
st.markdown("""
    <div style='text-align:center; padding: 1rem 0'>
        <h1 style='color:#2f4632; font-size:2.2rem; font-weight:900'>
            🌾 Crop Recommendation
        </h1>
        <p style='color:#555; font-size:1rem'>
            Enter your soil and weather details to get the best crop suggestion
        </p>
    </div>
""", unsafe_allow_html=True)

st.divider()

# ── Input form ────────────────────────────────────────────────
# Two columns for a cleaner layout
st.subheader("🧪 Soil Nutrients")
col1, col2, col3 = st.columns(3)

with col1:
    N = st.number_input(
        "Nitrogen (N)", min_value=0, max_value=140, value=50,
        help="Ratio of Nitrogen content in soil (kg/ha)"
    )
with col2:
    P = st.number_input(
        "Phosphorus (P)", min_value=5, max_value=145, value=50,
        help="Ratio of Phosphorus content in soil (kg/ha)"
    )
with col3:
    K = st.number_input(
        "Potassium (K)", min_value=5, max_value=205, value=50,
        help="Ratio of Potassium content in soil (kg/ha)"
    )

st.subheader("🌤️ Climate & Soil Conditions")
col4, col5 = st.columns(2)

with col4:
    temperature = st.slider(
        "Temperature (°C)", min_value=8.0, max_value=44.0, value=25.0, step=0.1,
        help="Average temperature in your region"
    )
    humidity = st.slider(
        "Humidity (%)", min_value=14.0, max_value=100.0, value=70.0, step=0.1,
        help="Average relative humidity"
    )
with col5:
    ph = st.slider(
        "Soil pH", min_value=3.5, max_value=10.0, value=6.5, step=0.1,
        help="pH 7 = neutral, <7 = acidic, >7 = alkaline"
    )
    rainfall = st.slider(
        "Rainfall (mm)", min_value=20.0, max_value=300.0, value=100.0, step=1.0,
        help="Average annual rainfall in your area"
    )

st.divider()

# ── Prediction ────────────────────────────────────────────────
if st.button("🌱 Get Crop Recommendation", use_container_width=True, type="primary"):
    # Build input array in the same order as training
    input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])

    # Get prediction (returns encoded number)
    prediction_encoded = model.predict(input_data)[0]

    # Get probability scores for all crops
    probabilities = model.predict_proba(input_data)[0]
    confidence = probabilities[prediction_encoded] * 100

    # Decode back to crop name
    crop_name = le.inverse_transform([prediction_encoded])[0]

    # Get top 3 alternatives
    top3_idx = np.argsort(probabilities)[::-1][:3]
    top3 = [(le.inverse_transform([i])[0], probabilities[i] * 100) for i in top3_idx]

    # Display result
    info = crop_info.get(crop_name, {"emoji": "🌿", "season": "—", "tip": ""})

    st.success(f"### {info['emoji']} Recommended Crop: **{crop_name.upper()}**")

    col_a, col_b, col_c = st.columns(3)
    col_a.metric("Confidence", f"{confidence:.1f}%")
    col_b.metric("Season", info["season"])
    col_c.metric("Crop", crop_name.capitalize())

    if info["tip"]:
        st.info(f"💡 **Tip:** {info['tip']}")

    # Show top 3 alternatives
    st.subheader("📊 Top 3 Suggestions")
    for i, (crop, prob) in enumerate(top3):
        emoji = crop_info.get(crop, {}).get("emoji", "🌿")
        st.progress(int(prob), text=f"{i+1}. {emoji} {crop.capitalize()} — {prob:.1f}%")

# ── Footer ────────────────────────────────────────────────────
st.markdown("---")
st.markdown(
    "<p style='text-align:center; color:#aaa; font-size:0.8rem'>"
    "KisanSathi · AI-Powered Smart Agriculture"
    "</p>",
    unsafe_allow_html=True
)
