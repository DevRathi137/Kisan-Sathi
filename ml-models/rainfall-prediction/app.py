import streamlit as st
import joblib
import numpy as np
import json
import os

st.set_page_config(
    page_title="Rainfall Prediction | KisanSathi",
    page_icon="🌧",
    layout="wide"
)

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
    #MainMenu, footer, header { visibility: hidden; }
    .stApp { background: #f0f4ff; }

    .hero {
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%);
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
        color: #a5b4fc;
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
        color: #1e1b4b;
        margin-bottom: 0.8rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e0e7ff;
    }
    .stSelectbox label, .stSlider label, .stNumberInput label {
        font-weight: 600 !important;
        color: #312e81 !important;
        font-size: 0.85rem !important;
    }
    .stButton > button {
        background: linear-gradient(135deg, #1e1b4b, #312e81) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        font-size: 1rem !important;
        font-weight: 700 !important;
        padding: 0.8rem 2rem !important;
        box-shadow: 0 4px 15px rgba(30,27,75,0.3) !important;
    }
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(30,27,75,0.4) !important;
    }
    .result-card {
        background: linear-gradient(135deg, #1e1b4b, #312e81);
        border-radius: 16px;
        padding: 2rem 2.5rem;
        color: white;
        margin-bottom: 1rem;
    }
    .result-value { font-size: 2.8rem; font-weight: 900; color: #a5b4fc; margin: 0.3rem 0; }
    .result-label { font-size: 0.75rem; opacity: 0.55; text-transform: uppercase; letter-spacing: 1px; }
    .metric-row { display: flex; gap: 1rem; margin-top: 1.2rem; flex-wrap: wrap; }
    .metric-box {
        flex: 1; min-width: 110px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 12px;
        padding: 0.9rem 1rem;
        text-align: center;
    }
    .metric-val { font-size: 1.3rem; font-weight: 900; color: #a5b4fc; }
    .metric-lbl { font-size: 0.72rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; }
    .cat-deficient { background: linear-gradient(135deg, #7f1d1d, #991b1b); }
    .cat-normal    { background: linear-gradient(135deg, #14532d, #166534); }
    .cat-excess    { background: linear-gradient(135deg, #1e3a8a, #1d4ed8); }
    .tip-box {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 10px;
        padding: 0.8rem 1rem;
        color: rgba(255,255,255,0.8);
        font-size: 0.88rem;
        margin-top: 1rem;
        line-height: 1.6;
    }
    .month-bar-row {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-bottom: 0.5rem;
    }
    .month-name { font-size: 0.8rem; font-weight: 600; color: #312e81; width: 70px; }
    .month-bar-bg { flex: 1; background: #e0e7ff; border-radius: 999px; height: 10px; overflow: hidden; }
    .month-bar-fill { height: 100%; border-radius: 999px; }
    .month-val { font-size: 0.78rem; font-weight: 700; color: #1e1b4b; width: 55px; text-align: right; }
    .highlight { background: rgba(165,180,252,0.2); border-radius: 8px; padding: 2px 6px; }
</style>
""", unsafe_allow_html=True)

# ── Load models ───────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@st.cache_resource
def load_models():
    files = ["rainfall_model.pkl", "le_state.pkl", "le_season.pkl", "imd_normals.json"]
    for f in files:
        if not os.path.exists(os.path.join(BASE_DIR, f)):
            st.error(f"File not found: {f}. Please run train.py first.")
            st.stop()
    model    = joblib.load(os.path.join(BASE_DIR, "rainfall_model.pkl"))
    le_state = joblib.load(os.path.join(BASE_DIR, "le_state.pkl"))
    le_season= joblib.load(os.path.join(BASE_DIR, "le_season.pkl"))
    with open(os.path.join(BASE_DIR, "imd_normals.json")) as f:
        normals = json.load(f)
    return model, le_state, le_season, normals

model, le_state, le_season, IMD_NORMALS = load_models()

MONTHS = ["January","February","March","April","May","June",
          "July","August","September","October","November","December"]

SEASONS = {
    1:"Winter", 2:"Winter", 3:"Pre-Kharif", 4:"Pre-Kharif",
    5:"Pre-Kharif", 6:"Kharif", 7:"Kharif", 8:"Kharif",
    9:"Kharif", 10:"Rabi", 11:"Rabi", 12:"Rabi"
}

FARMING_ADVICE = {
    "Deficient": {
        "Kharif":     "Low rainfall expected during Kharif. Consider drought-tolerant crops like bajra, jowar, or moong. Plan for supplemental irrigation.",
        "Rabi":       "Dry Rabi season ahead. Wheat and mustard may need extra irrigation. Check groundwater levels before sowing.",
        "Winter":     "Dry winter conditions. Protect rabi crops from moisture stress. Mulching can help retain soil moisture.",
        "Pre-Kharif": "Deficient pre-monsoon rains. Delay sowing until adequate moisture is available. Prepare water harvesting structures.",
    },
    "Normal": {
        "Kharif":     "Normal monsoon expected. Good conditions for rice, maize, soybean, and cotton. Proceed with planned sowing schedule.",
        "Rabi":       "Adequate moisture for Rabi crops. Wheat, chickpea, and mustard should perform well. Monitor for fungal diseases.",
        "Winter":     "Normal winter conditions. Good for vegetable cultivation and rabi crop establishment.",
        "Pre-Kharif": "Normal pre-monsoon showers. Prepare fields for Kharif sowing. Good time for land preparation.",
    },
    "Excess": {
        "Kharif":     "Heavy rainfall expected. Risk of waterlogging and flooding. Ensure proper field drainage. Avoid low-lying areas for sowing.",
        "Rabi":       "Excess moisture may delay Rabi sowing. Watch for root rot and fungal diseases. Improve field drainage.",
        "Winter":     "Heavy winter rains. Protect crops from lodging. Delay fertilizer application until fields dry.",
        "Pre-Kharif": "Heavy pre-monsoon rains. Good for soil moisture recharge but risk of soil erosion. Use contour bunding.",
    },
}

STATES = sorted(le_state.classes_)

# ── Hero ──────────────────────────────────────────────────────
st.markdown("""
<div class="hero">
    <div class="badge">IMD-Based Prediction</div>
    <h1>Rainfall Prediction</h1>
    <p>Forecast monthly rainfall for your state and plan your farming activities in advance.</p>
</div>
""", unsafe_allow_html=True)

# ── Inputs ────────────────────────────────────────────────────
col1, col2 = st.columns([1, 1], gap="large")

with col1:
    st.markdown('<div class="section-label">Location & Time</div>', unsafe_allow_html=True)
    state      = st.selectbox("State", STATES)
    month_name = st.selectbox("Month to Predict", MONTHS)
    month_num  = MONTHS.index(month_name) + 1
    season     = SEASONS[month_num]
    st.info(f"Season: **{season}**")

with col2:
    st.markdown('<div class="section-label">Current Conditions</div>', unsafe_allow_html=True)
    temperature   = st.slider("Current Temperature (°C)", 5, 45, 28)
    humidity      = st.slider("Current Humidity (%)", 10, 100, 65)
    prev_month_idx = (month_num - 2) % 12
    default_prev  = IMD_NORMALS[state][prev_month_idx] if state in IMD_NORMALS else 50
    prev_rain     = st.number_input(
        f"Last Month Rainfall (mm) — {MONTHS[prev_month_idx]}",
        min_value=0.0, max_value=800.0,
        value=float(default_prev), step=1.0
    )

st.markdown("<br>", unsafe_allow_html=True)
predict_btn = st.button("Predict Rainfall", use_container_width=True)

# ── Prediction ────────────────────────────────────────────────
if predict_btn:
    normal_rain = IMD_NORMALS[state][month_num - 1] if state in IMD_NORMALS else 100

    state_enc  = le_state.transform([state])[0]
    season_enc = le_season.transform([season])[0]

    X_input = np.array([[state_enc, month_num, season_enc,
                         temperature, humidity, prev_rain, normal_rain]])

    predicted = max(0, float(model.predict(X_input)[0]))

    # Departure from normal
    departure = ((predicted - normal_rain) / (normal_rain + 1)) * 100

    # Category based on IMD classification
    if departure < -20:
        category   = "Deficient"
        cat_class  = "cat-deficient"
        cat_desc   = f"{abs(departure):.0f}% below normal"
    elif departure > 20:
        category   = "Excess"
        cat_class  = "cat-excess"
        cat_desc   = f"{departure:.0f}% above normal"
    else:
        category   = "Normal"
        cat_class  = "cat-normal"
        cat_desc   = f"{abs(departure):.0f}% {'below' if departure < 0 else 'above'} normal"

    advice = FARMING_ADVICE[category].get(season, "Plan your farming activities based on the predicted rainfall.")

    # Results
    st.markdown("<br>", unsafe_allow_html=True)
    res1, res2 = st.columns(2, gap="large")

    with res1:
        st.markdown(f"""
        <div class="result-card">
            <div class="result-label">Predicted Rainfall — {month_name}</div>
            <div class="result-value">{predicted:.0f} mm</div>
            <div class="metric-row">
                <div class="metric-box">
                    <div class="metric-val">{normal_rain} mm</div>
                    <div class="metric-lbl">IMD Normal</div>
                </div>
                <div class="metric-box">
                    <div class="metric-val">{departure:+.0f}%</div>
                    <div class="metric-lbl">Departure</div>
                </div>
                <div class="metric-box">
                    <div class="metric-val">{season}</div>
                    <div class="metric-lbl">Season</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

    with res2:
        st.markdown(f"""
        <div class="result-card {cat_class}">
            <div class="result-label">Rainfall Category</div>
            <div class="result-value">{category}</div>
            <div style="color:rgba(255,255,255,0.6); font-size:0.85rem; margin-top:0.3rem">{cat_desc}</div>
            <div class="tip-box"><strong>Farming Advice:</strong><br>{advice}</div>
        </div>
        """, unsafe_allow_html=True)

    # Annual pattern chart
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown(f'<div class="section-label">Annual Rainfall Pattern — {state}</div>', unsafe_allow_html=True)

    if state in IMD_NORMALS:
        monthly_normals = IMD_NORMALS[state]
        max_rain = max(monthly_normals) or 1

        for i, (m, val) in enumerate(zip(MONTHS, monthly_normals)):
            is_current = (i + 1 == month_num)
            bar_color  = "#a5b4fc" if not is_current else "#fbbf24"
            pct        = int((val / max_rain) * 100)
            highlight  = ' class="highlight"' if is_current else ''
            st.markdown(f"""
            <div class="month-bar-row">
                <div class="month-name"{highlight}>{m[:3]}</div>
                <div class="month-bar-bg">
                    <div class="month-bar-fill" style="width:{pct}%; background:{bar_color}"></div>
                </div>
                <div class="month-val">{val} mm</div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown('<p style="font-size:0.75rem;color:#6b7280;margin-top:0.5rem">Yellow bar = selected month. Based on IMD historical normals.</p>', unsafe_allow_html=True)
