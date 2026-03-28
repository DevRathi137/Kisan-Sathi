import streamlit as st
import joblib
import numpy as np
import os

st.set_page_config(
    page_title="Crop Recommendation | KisanSathi",
    page_icon="🌾",
    layout="wide"
)

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
    #MainMenu, footer, header { visibility: hidden; }
    .stApp { background: #f4f7f4; }

    .hero {
        background: linear-gradient(135deg, #1a2e1c 0%, #2f4632 60%, #3d6b42 100%);
        border-radius: 20px;
        padding: 2.5rem 3rem;
        margin-bottom: 2rem;
        color: white;
    }
    .hero h1 { font-size: 2.2rem; font-weight: 900; margin: 0 0 0.4rem 0; }
    .hero p  { font-size: 1rem; opacity: 0.7; margin: 0; }
    .badge {
        display: inline-block;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.2);
        color: #86efac;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.3rem 0.9rem;
        border-radius: 999px;
        margin-bottom: 1rem;
        letter-spacing: 0.5px;
    }
    .section-label {
        font-size: 0.95rem;
        font-weight: 700;
        color: #1a2e1c;
        margin-bottom: 0.8rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e8f0e8;
    }
    .stNumberInput label, .stSlider label {
        font-weight: 600 !important;
        color: #2f4632 !important;
        font-size: 0.85rem !important;
    }
    .stButton > button {
        background: linear-gradient(135deg, #1a2e1c, #2f4632) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        font-size: 1rem !important;
        font-weight: 700 !important;
        padding: 0.8rem 2rem !important;
        box-shadow: 0 4px 15px rgba(47,70,50,0.3) !important;
        transition: all 0.2s !important;
    }
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(47,70,50,0.4) !important;
    }
    .result-card {
        background: linear-gradient(135deg, #1a2e1c, #2f4632);
        border-radius: 16px;
        padding: 2rem 2.5rem;
        color: white;
        margin-bottom: 1rem;
    }
    .result-crop { font-size: 2rem; font-weight: 900; margin: 0.3rem 0; }
    .result-label { font-size: 0.75rem; opacity: 0.55; text-transform: uppercase; letter-spacing: 1px; }
    .metric-row { display: flex; gap: 1rem; margin-top: 1.2rem; }
    .metric-box {
        flex: 1;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 12px;
        padding: 0.9rem 1rem;
        text-align: center;
    }
    .metric-val { font-size: 1.5rem; font-weight: 900; color: #86efac; }
    .metric-lbl { font-size: 0.72rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; }
    .tip-box {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 10px;
        padding: 0.8rem 1rem;
        color: rgba(255,255,255,0.8);
        font-size: 0.88rem;
        margin-top: 1rem;
    }
    .bar-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        font-weight: 600;
        color: #2f4632;
        margin-bottom: 0.3rem;
    }
    .bar-bg {
        background: #e8f0e8;
        border-radius: 999px;
        height: 9px;
        overflow: hidden;
        margin-bottom: 0.9rem;
    }
    .bar-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #2f4632, #4ade80);
    }
    .ref-table { width:100%; font-size:0.82rem; color:#374151; border-collapse:collapse; }
    .ref-table td { padding: 5px 0; }
    .ref-table td:first-child { color:#6b7280; width:40%; }
</style>
""", unsafe_allow_html=True)

# ── Load model ────────────────────────────────────────────────
@st.cache_resource
def load_model():
    if not os.path.exists("crop_model.pkl"):
        st.error("Model not found. Please run train.py first.")
        st.stop()
    return joblib.load("crop_model.pkl"), joblib.load("label_encoder.pkl")

model, le = load_model()

crop_info = {
    "rice":        {"emoji": "🌾", "season": "Kharif",  "tip": "Needs flooded fields and high humidity."},
    "maize":       {"emoji": "🌽", "season": "Kharif",  "tip": "Grows well in well-drained loamy soil."},
    "chickpea":    {"emoji": "🫘", "season": "Rabi",    "tip": "Drought tolerant, needs cool dry weather."},
    "kidneybeans": {"emoji": "🫘", "season": "Kharif",  "tip": "Needs well-drained fertile soil."},
    "pigeonpeas":  {"emoji": "🌿", "season": "Kharif",  "tip": "Drought resistant, good for dry regions."},
    "mothbeans":   {"emoji": "🌿", "season": "Kharif",  "tip": "Thrives in arid and semi-arid regions."},
    "mungbean":    {"emoji": "🌿", "season": "Kharif",  "tip": "Short duration crop, good for soil health."},
    "blackgram":   {"emoji": "🌿", "season": "Kharif",  "tip": "Grows in tropical and subtropical regions."},
    "lentil":      {"emoji": "🫘", "season": "Rabi",    "tip": "Cool season crop, needs well-drained soil."},
    "pomegranate": {"emoji": "🍎", "season": "Annual",  "tip": "Drought tolerant, needs hot dry summers."},
    "banana":      {"emoji": "🍌", "season": "Annual",  "tip": "Needs high humidity and rich soil."},
    "mango":       {"emoji": "🥭", "season": "Annual",  "tip": "Tropical fruit, needs dry flowering season."},
    "grapes":      {"emoji": "🍇", "season": "Annual",  "tip": "Needs well-drained soil and dry summers."},
    "watermelon":  {"emoji": "🍉", "season": "Summer",  "tip": "Needs sandy loam soil and warm weather."},
    "muskmelon":   {"emoji": "🍈", "season": "Summer",  "tip": "Grows in warm climate with sandy soil."},
    "apple":       {"emoji": "🍎", "season": "Annual",  "tip": "Needs cold winters for proper fruiting."},
    "orange":      {"emoji": "🍊", "season": "Annual",  "tip": "Subtropical fruit, needs well-drained soil."},
    "papaya":      {"emoji": "🍈", "season": "Annual",  "tip": "Fast growing, needs warm humid climate."},
    "coconut":     {"emoji": "🥥", "season": "Annual",  "tip": "Coastal crop, needs high humidity."},
    "cotton":      {"emoji": "🌿", "season": "Kharif",  "tip": "Needs black soil and moderate rainfall."},
    "jute":        {"emoji": "🌿", "season": "Kharif",  "tip": "Needs high humidity and alluvial soil."},
    "coffee":      {"emoji": "☕", "season": "Annual",  "tip": "Grows in hilly regions with shade."},
}

# ── HERO ──────────────────────────────────────────────────────
st.markdown("""
<div class="hero">
    <div class="badge">AI-Powered · KisanSathi</div>
    <h1>🌾 Crop Recommendation</h1>
    <p>Enter your soil nutrients and local climate data to get the best crop suggestion for your field.</p>
</div>
""", unsafe_allow_html=True)

# ── INPUTS ────────────────────────────────────────────────────
left_col, right_col = st.columns(2, gap="large")

with left_col:
    st.markdown('<div class="section-label">🧪 Soil Nutrients</div>', unsafe_allow_html=True)
    c1, c2, c3 = st.columns(3)
    with c1:
        N = st.number_input("Nitrogen (N)", 0, 140, 80, help="kg/ha")
    with c2:
        P = st.number_input("Phosphorus (P)", 5, 145, 40, help="kg/ha")
    with c3:
        K = st.number_input("Potassium (K)", 5, 205, 40, help="kg/ha")

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-label">🌡️ Temperature & Humidity</div>', unsafe_allow_html=True)
    temperature = st.slider("Temperature (°C)", 8.0, 44.0, 23.0, 0.1)
    humidity    = st.slider("Humidity (%)", 14.0, 100.0, 82.0, 0.1)

with right_col:
    st.markdown('<div class="section-label">🌱 Soil & Rainfall</div>', unsafe_allow_html=True)
    ph       = st.slider("Soil pH", 3.5, 10.0, 6.4, 0.1, help="7 = neutral · <7 acidic · >7 alkaline")
    rainfall = st.slider("Rainfall (mm)", 20.0, 300.0, 236.0, 1.0)

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-label">📌 Quick Reference</div>', unsafe_allow_html=True)
    st.markdown("""
    <table class="ref-table">
        <tr><td>Soil pH</td><td><b>Acidic</b> &lt;6 · <b>Neutral</b> 6–7 · <b>Alkaline</b> &gt;7</td></tr>
        <tr><td>N (Nitrogen)</td><td>Promotes leaf &amp; stem growth</td></tr>
        <tr><td>P (Phosphorus)</td><td>Supports root &amp; flower growth</td></tr>
        <tr><td>K (Potassium)</td><td>Improves disease resistance</td></tr>
    </table>
    """, unsafe_allow_html=True)

# ── BUTTON ────────────────────────────────────────────────────
st.markdown("<br>", unsafe_allow_html=True)
predict = st.button("Get Crop Recommendation", use_container_width=True)

# ── RESULT ────────────────────────────────────────────────────
if predict:
    input_data    = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    pred_encoded  = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)[0]
    confidence    = probabilities[pred_encoded] * 100
    crop_name     = le.inverse_transform([pred_encoded])[0]
    info          = crop_info.get(crop_name, {"emoji": "🌿", "season": "—", "tip": ""})

    top3_idx = np.argsort(probabilities)[::-1][:3]
    top3 = [(le.inverse_transform([i])[0], probabilities[i] * 100) for i in top3_idx]

    st.markdown("<br>", unsafe_allow_html=True)
    r1, r2 = st.columns(2, gap="large")

    with r1:
        tip_html = f'<div class="tip-box">💡 {info["tip"]}</div>' if info["tip"] else ""
        st.markdown(f"""
        <div class="result-card">
            <div class="result-label">Recommended Crop</div>
            <div class="result-crop">{info['emoji']} {crop_name.upper()}</div>
            <div class="metric-row">
                <div class="metric-box">
                    <div class="metric-val">{confidence:.0f}%</div>
                    <div class="metric-lbl">Confidence</div>
                </div>
                <div class="metric-box">
                    <div class="metric-val" style="font-size:1.1rem">{info['season']}</div>
                    <div class="metric-lbl">Season</div>
                </div>
            </div>
            {tip_html}
        </div>
        """, unsafe_allow_html=True)

    with r2:
        st.markdown('<div class="section-label">📊 Top 3 Suggestions</div>', unsafe_allow_html=True)
        colors = ["#1a2e1c", "#2f4632", "#4a7c59"]
        for i, (crop, prob) in enumerate(top3):
            emoji = crop_info.get(crop, {}).get("emoji", "🌿")
            st.markdown(f"""
            <div class="bar-label">
                <span>{emoji} {crop.capitalize()}</span>
                <span style="color:{colors[i]}">{prob:.1f}%</span>
            </div>
            <div class="bar-bg">
                <div class="bar-fill" style="width:{min(prob,100):.1f}%;
                     background:linear-gradient(90deg,{colors[i]},#4ade80)"></div>
            </div>
            """, unsafe_allow_html=True)

# ── FOOTER ────────────────────────────────────────────────────
st.markdown("---")
st.markdown("""
<p style='text-align:center; color:#9ca3af; font-size:0.8rem'>
    <span style='color:#2f4632; font-weight:700'>कS</span> KisanSathi · AI-Powered Smart Agriculture
</p>
""", unsafe_allow_html=True)
