import streamlit as st
import joblib
import numpy as np
import os

st.set_page_config(
    page_title="Water Management | KisanSathi",
    page_icon="💧",
    layout="wide"
)

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
    #MainMenu, footer, header { visibility: hidden; }
    .stAppToolbar, [data-testid="stToolbar"], [data-testid="stDecoration"],
    .viewerBadge_container__r5tak, .styles_viewerBadge__CvC9N,
    #stDecoration { display: none !important; }
    .stApp { background: #f0f6fb; }

    .hero {
        background: linear-gradient(135deg, #0c2340 0%, #1a3a5c 60%, #1e5080 100%);
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
        color: #7dd3fc;
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
        color: #0c2340;
        margin-bottom: 0.8rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #dbeafe;
    }
    .stSelectbox label, .stSlider label, .stNumberInput label {
        font-weight: 600 !important;
        color: #1a3a5c !important;
        font-size: 0.85rem !important;
    }
    .stButton > button {
        background: linear-gradient(135deg, #0c2340, #1a3a5c) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        font-size: 1rem !important;
        font-weight: 700 !important;
        padding: 0.8rem 2rem !important;
        box-shadow: 0 4px 15px rgba(12,35,64,0.3) !important;
    }
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(12,35,64,0.4) !important;
    }
    .result-card {
        background: linear-gradient(135deg, #0c2340, #1a3a5c);
        border-radius: 16px;
        padding: 2rem 2.5rem;
        color: white;
        margin-bottom: 1rem;
    }
    .result-value { font-size: 2.5rem; font-weight: 900; color: #7dd3fc; margin: 0.3rem 0; }
    .result-label { font-size: 0.75rem; opacity: 0.55; text-transform: uppercase; letter-spacing: 1px; }
    .metric-row { display: flex; gap: 1rem; margin-top: 1.2rem; flex-wrap: wrap; }
    .metric-box {
        flex: 1;
        min-width: 120px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 12px;
        padding: 0.9rem 1rem;
        text-align: center;
    }
    .metric-val { font-size: 1.4rem; font-weight: 900; color: #7dd3fc; }
    .metric-lbl { font-size: 0.72rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; }
    .risk-low    { background: linear-gradient(135deg, #14532d, #166534); }
    .risk-medium { background: linear-gradient(135deg, #713f12, #92400e); }
    .risk-high   { background: linear-gradient(135deg, #7f1d1d, #991b1b); }
    .tip-box {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 10px;
        padding: 0.8rem 1rem;
        color: rgba(255,255,255,0.8);
        font-size: 0.88rem;
        margin-top: 1rem;
    }
    .schedule-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: white;
        border: 1px solid #dbeafe;
        border-radius: 12px;
        padding: 0.9rem 1.2rem;
        margin-bottom: 0.6rem;
    }
    .schedule-day { font-weight: 700; color: #1a3a5c; min-width: 60px; }
    .schedule-bar-bg { flex: 1; background: #dbeafe; border-radius: 999px; height: 8px; }
    .schedule-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #1a3a5c, #38bdf8); }
    .schedule-val { font-weight: 700; color: #0c2340; min-width: 70px; text-align: right; font-size: 0.9rem; }
</style>
""", unsafe_allow_html=True)

# ── Load models ───────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@st.cache_resource
def load_models():
    files = ["water_model.pkl", "interval_model.pkl", "le_crop.pkl", "le_soil.pkl", "le_stage.pkl"]
    for f in files:
        if not os.path.exists(os.path.join(BASE_DIR, f)):
            st.error(f"Model not found: {f}. Please run train.py first.")
            st.stop()
    return (
        joblib.load(os.path.join(BASE_DIR, "water_model.pkl")),
        joblib.load(os.path.join(BASE_DIR, "interval_model.pkl")),
        joblib.load(os.path.join(BASE_DIR, "le_crop.pkl")),
        joblib.load(os.path.join(BASE_DIR, "le_soil.pkl")),
        joblib.load(os.path.join(BASE_DIR, "le_stage.pkl")),
    )

model_water, model_interval, le_crop, le_soil, le_stage = load_models()

CROPS  = sorted(le_crop.classes_)
SOILS  = sorted(le_soil.classes_)
STAGES = sorted(le_stage.classes_)

SOIL_LABELS = {
    "clay": "Clay", "clay_loam": "Clay Loam", "loamy": "Loamy",
    "sandy": "Sandy", "sandy_loam": "Sandy Loam"
}
STAGE_LABELS = {
    "development": "Development", "initial": "Initial",
    "late": "Late Season", "mid": "Mid Season"
}

CROP_TIPS = {
    "rice":      "Rice needs flooded conditions. Maintain 5-10 cm standing water during mid-season.",
    "wheat":     "Wheat is sensitive to water stress at crown root initiation and grain filling stages.",
    "maize":     "Critical water periods: tasseling and silking. Avoid stress during these stages.",
    "sugarcane": "Sugarcane needs consistent moisture. Drip irrigation can save up to 40% water.",
    "cotton":    "Reduce irrigation after boll opening. Excess water causes boll rot.",
    "soybean":   "Most sensitive to drought during pod filling. Maintain soil moisture at 50-70% FC.",
    "potato":    "Tuber initiation and bulking are critical stages. Avoid waterlogging.",
    "tomato":    "Drip irrigation recommended. Inconsistent watering causes blossom end rot.",
    "onion":     "Reduce irrigation 2 weeks before harvest to improve storage quality.",
    "chickpea":  "Drought tolerant. One irrigation at flowering significantly boosts yield.",
    "groundnut": "Critical stages: pegging and pod development. Avoid waterlogging.",
    "sunflower": "Deep-rooted crop. Irrigate at head formation and seed filling stages.",
    "banana":    "High water demand. Drip or micro-sprinkler irrigation is most efficient.",
    "mango":     "Withhold irrigation during flowering to improve fruit set.",
    "mustard":   "Sensitive at flowering. One well-timed irrigation can increase yield by 30%.",
}

# ── Hero ──────────────────────────────────────────────────────
st.markdown("""
<div class="hero">
    <div class="badge">AI-Powered Irrigation</div>
    <h1>Water Management</h1>
    <p>Get precise irrigation schedules based on your crop, soil, and local weather conditions.</p>
</div>
""", unsafe_allow_html=True)

# ── Input form ────────────────────────────────────────────────
col1, col2 = st.columns([1, 1], gap="large")

with col1:
    st.markdown('<div class="section-label">Crop & Field Details</div>', unsafe_allow_html=True)
    crop = st.selectbox("Crop", CROPS, format_func=lambda x: x.title())
    soil = st.selectbox("Soil Type", SOILS, format_func=lambda x: SOIL_LABELS.get(x, x))
    stage = st.selectbox("Growth Stage", STAGES, format_func=lambda x: STAGE_LABELS.get(x, x))
    area_unit = st.selectbox("Area Unit", ["Hectares", "Acres", "Bigha"])
    area_val  = st.number_input(f"Field Area ({area_unit})", min_value=0.1, max_value=500.0, value=1.0, step=0.1)

    # Convert everything to hectares internally
    UNIT_TO_HA = {"Hectares": 1.0, "Acres": 0.404686, "Bigha": 0.2529}
    area = area_val * UNIT_TO_HA[area_unit]

with col2:
    st.markdown('<div class="section-label">Weather Conditions</div>', unsafe_allow_html=True)
    temperature  = st.slider("Temperature (°C)", 10, 45, 28)
    humidity     = st.slider("Relative Humidity (%)", 10, 100, 60)
    wind_speed   = st.slider("Wind Speed (m/s)", 0.0, 8.0, 2.0, step=0.5)
    sunshine     = st.slider("Sunshine Hours / Day", 2, 14, 8)
    rainfall     = st.slider("Recent Rainfall (mm/day)", 0.0, 30.0, 2.0, step=0.5)

st.markdown("<br>", unsafe_allow_html=True)
predict_btn = st.button("Calculate Irrigation Requirement", use_container_width=True)

# ── Prediction ────────────────────────────────────────────────
if predict_btn:
    crop_enc  = le_crop.transform([crop])[0]
    soil_enc  = le_soil.transform([soil])[0]
    stage_enc = le_stage.transform([stage])[0]

    X_input = np.array([[crop_enc, soil_enc, stage_enc,
                         temperature, humidity, wind_speed,
                         sunshine, rainfall]])

    water_req = float(model_water.predict(X_input)[0])
    interval  = max(1, round(float(model_interval.predict(X_input)[0])))
    water_req = max(0, water_req)

    # Total volume for the field
    total_liters = water_req * area * 10000  # mm * ha -> liters
    weekly_total = water_req * 7 * area * 10000

    # Risk level
    if water_req < 2:
        risk = "Low"
        risk_class = "risk-low"
        risk_desc = "Soil moisture is adequate. Monitor and irrigate only if rainfall drops."
    elif water_req < 5:
        risk = "Moderate"
        risk_class = "risk-medium"
        risk_desc = "Moderate water stress risk. Irrigate on schedule to maintain yield."
    else:
        risk = "High"
        risk_class = "risk-high"
        risk_desc = "High water demand. Ensure consistent irrigation to prevent crop stress."

    # Results
    st.markdown("<br>", unsafe_allow_html=True)
    res1, res2 = st.columns(2, gap="large")

    with res1:
        st.markdown(f"""
        <div class="result-card">
            <div class="result-label">Daily Water Requirement</div>
            <div class="result-value">{water_req:.1f} mm/day</div>
            <div class="metric-row">
                <div class="metric-box">
                    <div class="metric-val">{total_liters:,.0f} L</div>
                    <div class="metric-lbl">Per Day ({area_val} {area_unit})</div>
                </div>
                <div class="metric-box">
                    <div class="metric-val">{weekly_total/1000:,.1f} kL</div>
                    <div class="metric-lbl">Per Week</div>
                </div>
                <div class="metric-box">
                    <div class="metric-val">{interval} days</div>
                    <div class="metric-lbl">Irrigate Every</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

    with res2:
        st.markdown(f"""
        <div class="result-card {risk_class}">
            <div class="result-label">Water Stress Risk</div>
            <div class="result-value">{risk}</div>
            <div class="tip-box">{risk_desc}</div>
            <div class="tip-box" style="margin-top:0.6rem">
                <strong>Crop Tip:</strong> {CROP_TIPS.get(crop, "")}
            </div>
        </div>
        """, unsafe_allow_html=True)

    # 7-day irrigation schedule
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-label">7-Day Irrigation Schedule</div>', unsafe_allow_html=True)

    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    max_val = water_req * 1.3

    for i, day in enumerate(days):
        # Irrigate on interval days, reduce on rainy days
        if (i % interval) == 0:
            val = water_req * area * 10000
            label = f"{val:,.0f} L — Irrigate"
        else:
            val = 0
            label = "No irrigation needed"
        pct = int((val / (max_val * area * 10000 + 1)) * 100)
        st.markdown(f"""
        <div class="schedule-row">
            <div class="schedule-day">{day}</div>
            <div class="schedule-bar-bg">
                <div class="schedule-bar-fill" style="width:{pct}%"></div>
            </div>
            <div class="schedule-val">{label}</div>
        </div>
        """, unsafe_allow_html=True)
