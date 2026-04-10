import streamlit as st
import joblib
import numpy as np
import os

st.set_page_config(
    page_title="Fertilizer Recommendation | KisanSathi",
    page_icon="🌱",
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
    .stApp { background: #faf7f0; }

    .hero {
        background: linear-gradient(135deg, #2d1b00 0%, #5c3a00 60%, #7a5200 100%);
        border-radius: 20px; padding: 2.5rem 3rem;
        margin-bottom: 2rem; color: white;
    }
    .hero h1 { font-size: 2.2rem; font-weight: 900; margin: 0 0 0.4rem 0; }
    .hero p  { font-size: 1rem; opacity: 0.7; margin: 0; }
    .badge {
        display: inline-block;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.2);
        color: #fcd34d; font-size: 0.75rem; font-weight: 600;
        padding: 0.3rem 0.9rem; border-radius: 999px;
        margin-bottom: 1rem; letter-spacing: 0.5px;
    }
    .section-label {
        font-size: 0.95rem; font-weight: 700; color: #2d1b00;
        margin-bottom: 0.8rem; padding-bottom: 0.5rem;
        border-bottom: 2px solid #fde68a;
    }
    .stSelectbox label, .stSlider label, .stNumberInput label {
        font-weight: 600 !important; color: #5c3a00 !important; font-size: 0.85rem !important;
    }
    .stButton > button {
        background: linear-gradient(135deg, #2d1b00, #5c3a00) !important;
        color: white !important; border: none !important;
        border-radius: 12px !important; font-size: 1rem !important;
        font-weight: 700 !important; padding: 0.8rem 2rem !important;
        box-shadow: 0 4px 15px rgba(45,27,0,0.3) !important;
    }
    .stButton > button:hover { transform: translateY(-2px) !important; }
    .result-card {
        background: linear-gradient(135deg, #2d1b00, #5c3a00);
        border-radius: 16px; padding: 2rem 2.5rem;
        color: white; margin-bottom: 1rem;
    }
    .result-value { font-size: 2.4rem; font-weight: 900; color: #fcd34d; margin: 0.3rem 0; }
    .result-label { font-size: 0.75rem; opacity: 0.55; text-transform: uppercase; letter-spacing: 1px; }
    .metric-row { display: flex; gap: 1rem; margin-top: 1.2rem; flex-wrap: wrap; }
    .metric-box {
        flex: 1; min-width: 100px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 12px; padding: 0.9rem 1rem; text-align: center;
    }
    .metric-val { font-size: 1.4rem; font-weight: 900; color: #fcd34d; }
    .metric-lbl { font-size: 0.72rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; }
    .tip-box {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 10px; padding: 0.8rem 1rem;
        color: rgba(255,255,255,0.85); font-size: 0.88rem;
        margin-top: 1rem; line-height: 1.6;
    }
    .schedule-row {
        display: flex; align-items: flex-start; gap: 1rem;
        background: white; border: 1px solid #fde68a;
        border-radius: 12px; padding: 1rem 1.2rem; margin-bottom: 0.6rem;
    }
    .stage-dot {
        width: 12px; height: 12px; border-radius: 50%;
        background: #d97706; margin-top: 4px; flex-shrink: 0;
    }
    .stage-title { font-weight: 700; color: #2d1b00; font-size: 0.9rem; }
    .stage-desc  { font-size: 0.82rem; color: #6b7280; margin-top: 0.2rem; }
    .nutrient-bar-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.8rem; }
    .nutrient-name { font-weight: 700; color: #2d1b00; width: 30px; font-size: 0.9rem; }
    .nutrient-bar-bg { flex: 1; background: #fef3c7; border-radius: 999px; height: 12px; overflow: hidden; }
    .nutrient-bar-fill { height: 100%; border-radius: 999px; }
    .nutrient-val { font-weight: 700; color: #2d1b00; width: 80px; text-align: right; font-size: 0.85rem; }
    .soil-status { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; margin-left: 8px; }
    .status-low    { background: #fee2e2; color: #991b1b; }
    .status-medium { background: #fef3c7; color: #92400e; }
    .status-high   { background: #dcfce7; color: #166534; }
</style>
""", unsafe_allow_html=True)

# ── Load models ───────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@st.cache_resource
def load_models():
    files = ["model_N.pkl","model_P.pkl","model_K.pkl","model_fert.pkl",
             "le_crop.pkl","le_soil.pkl","le_irr.pkl","le_prev.pkl","le_fert.pkl"]
    for f in files:
        if not os.path.exists(os.path.join(BASE_DIR, f)):
            st.error(f"Missing: {f}. Run train.py first.")
            st.stop()
    return tuple(joblib.load(os.path.join(BASE_DIR, f)) for f in files)

model_N, model_P, model_K, model_fert, le_crop, le_soil, le_irr, le_prev, le_fert = load_models()

CROPS = sorted(le_crop.classes_)
SOILS = sorted(le_soil.classes_)
IRRS  = sorted(le_irr.classes_)
PREVS = sorted(le_prev.classes_)

SOIL_LABELS = {
    "black_cotton":"Black Cotton","clay":"Clay","clay_loam":"Clay Loam",
    "loamy":"Loamy","red_laterite":"Red Laterite","sandy":"Sandy","sandy_loam":"Sandy Loam"
}
IRR_LABELS  = {"drip":"Drip / Fertigation","irrigated":"Canal / Borewell Irrigated","rainfed":"Rainfed"}
PREV_LABELS = {"cereal":"Cereal (Wheat/Rice/Maize)","fallow":"Fallow (No crop)","legume":"Legume (Pulse/Soybean)",
               "sugarcane":"Sugarcane","vegetable":"Vegetable"}

# Application schedule per crop type
SCHEDULES = {
    "cereal": [
        ("Basal (At sowing)",        "Apply full P and K + 1/3 N as DAP/MOP before sowing. Mix into top 10 cm soil."),
        ("First top-dress (21 DAP)", "Apply 1/3 N as Urea when crop is 3 weeks old. Irrigate immediately after."),
        ("Second top-dress (45 DAP)","Apply remaining 1/3 N at tillering/panicle initiation stage."),
    ],
    "pulse": [
        ("Basal (At sowing)",        "Apply full P and K + starter N dose. Pulses fix their own N — avoid excess N."),
        ("Foliar spray (30 DAP)",    "Apply 2% DAP foliar spray at flowering to boost pod set."),
    ],
    "oilseed": [
        ("Basal (At sowing)",        "Apply full P and K + 1/2 N before sowing."),
        ("Top-dress (30 DAP)",       "Apply remaining 1/2 N at branching stage."),
        ("Foliar (Flowering)",       "Apply 0.5% Borax spray at flowering to improve seed set."),
    ],
    "vegetable": [
        ("Basal (Land prep)",        "Apply full P and K + 1/3 N with FYM during field preparation."),
        ("First top-dress (15 DAP)", "Apply 1/3 N after transplanting/thinning."),
        ("Second top-dress (35 DAP)","Apply remaining 1/3 N at fruit development stage."),
    ],
    "cash_crop": [
        ("Basal (At planting)",      "Apply full P and K + 1/4 N at planting."),
        ("First ratoon (60 DAP)",    "Apply 1/4 N at 60 days."),
        ("Second ratoon (120 DAP)",  "Apply 1/4 N at 120 days."),
        ("Final dose (180 DAP)",     "Apply remaining 1/4 N at grand growth phase."),
    ],
}

CROP_SCHEDULE_MAP = {
    "rice":"cereal","wheat":"cereal","maize":"cereal","sorghum":"cereal","bajra":"cereal","barley":"cereal",
    "chickpea":"pulse","lentil":"pulse","pigeonpeas":"pulse","mungbean":"pulse","soybean":"pulse",
    "groundnut":"oilseed","mustard":"oilseed","sunflower":"oilseed","sesame":"oilseed",
    "potato":"vegetable","tomato":"vegetable","onion":"vegetable","cabbage":"vegetable",
    "sugarcane":"cash_crop","cotton":"cash_crop","jute":"cash_crop",
    "banana":"cash_crop","mango":"cash_crop",
}

CROP_TIPS = {
    "rice":     "Split N application is critical for rice. Never apply all N at once — it causes lodging and increases blast risk.",
    "wheat":    "Apply Zinc Sulphate (25 kg/ha) as basal if soil Zn is deficient. Common in Indo-Gangetic plains.",
    "maize":    "Maize is a heavy feeder. Ensure adequate K — deficiency shows as yellowing of leaf margins.",
    "sugarcane":"Trash mulching after harvest reduces K requirement by 30%. Use trash as organic mulch.",
    "cotton":   "Avoid excess N in cotton — it promotes vegetative growth at the cost of boll formation.",
    "potato":   "Potatoes need high K for tuber quality. Deficiency causes hollow heart and poor storability.",
    "tomato":   "Use calcium nitrate as part of N source to prevent blossom end rot.",
    "chickpea": "Rhizobium inoculation of seeds can reduce N fertilizer need by 50% in chickpea.",
    "soybean":  "Soybean fixes 60-80 kg N/ha through symbiosis. Starter N of 20-25 kg/ha is sufficient.",
    "mustard":  "Sulphur (20-30 kg/ha as gypsum) is critical for mustard oil quality and yield.",
    "groundnut":"Gypsum application (500 kg/ha) at pegging stage is essential for pod filling in groundnut.",
    "banana":   "Banana responds well to fertigation. Split into 12 monthly doses for best results.",
    "onion":    "Excess N in onion causes thick necks and poor storage. Reduce N in last 30 days.",
    "default":  "Always do a soil test before applying fertilizers. Over-application wastes money and harms soil health.",
}

def soil_status(val, low, high):
    if val < low:   return "Low",    "status-low"
    elif val < high: return "Medium", "status-medium"
    else:            return "High",   "status-high"

# ── Hero ──────────────────────────────────────────────────────
st.markdown("""
<div class="hero">
    <div class="badge">ICAR-Based Recommendations</div>
    <h1>Fertilizer Recommendation</h1>
    <p>Precise N, P, K doses based on your soil test, crop, and field conditions — grounded in ICAR guidelines.</p>
</div>
""", unsafe_allow_html=True)

# ── Inputs ────────────────────────────────────────────────────
col1, col2, col3 = st.columns([1, 1, 1], gap="large")

with col1:
    st.markdown('<div class="section-label">Crop & Field</div>', unsafe_allow_html=True)
    crop       = st.selectbox("Crop", CROPS, format_func=lambda x: x.title())
    soil       = st.selectbox("Soil Type", SOILS, format_func=lambda x: SOIL_LABELS.get(x, x))
    irrigation = st.selectbox("Irrigation Type", IRRS, format_func=lambda x: IRR_LABELS.get(x, x))
    prev_crop  = st.selectbox("Previous Crop", PREVS, format_func=lambda x: PREV_LABELS.get(x, x))

with col2:
    st.markdown('<div class="section-label">Soil Test Report</div>', unsafe_allow_html=True)
    st.caption("Enter values from your soil test. If unavailable, use average values.")
    soil_N = st.number_input("Available Nitrogen (kg/ha)", min_value=0.0, max_value=900.0, value=250.0, step=10.0,
                              help="Low: <280 | Medium: 280-560 | High: >560")
    soil_P = st.number_input("Available Phosphorus (kg/ha)", min_value=0.0, max_value=45.0, value=10.0, step=0.5,
                              help="Low: <11 | Medium: 11-22 | High: >22")
    soil_K = st.number_input("Available Potassium (kg/ha)", min_value=0.0, max_value=500.0, value=150.0, step=10.0,
                              help="Low: <110 | Medium: 110-280 | High: >280")

with col3:
    st.markdown('<div class="section-label">Soil Properties</div>', unsafe_allow_html=True)
    soil_pH = st.slider("Soil pH", 4.0, 9.0, 6.5, step=0.1)
    organic_matter = st.slider("Organic Matter (%)", 0.1, 3.0, 0.8, step=0.1)
    target_yield   = st.number_input("Expected Yield (tonnes/ha)", min_value=0.1, max_value=100.0, value=3.0, step=0.5)

    # Show soil status indicators
    n_status, n_cls = soil_status(soil_N, 280, 560)
    p_status, p_cls = soil_status(soil_P, 11, 22)
    k_status, k_cls = soil_status(soil_K, 110, 280)
    st.markdown(f"""
    <div style="margin-top:1rem">
        <p style="font-size:0.8rem;font-weight:700;color:#5c3a00;margin-bottom:0.5rem">Soil Nutrient Status</p>
        <div>N: <span class="soil-status {n_cls}">{n_status}</span></div>
        <div style="margin-top:4px">P: <span class="soil-status {p_cls}">{p_status}</span></div>
        <div style="margin-top:4px">K: <span class="soil-status {k_cls}">{k_status}</span></div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)
predict_btn = st.button("Get Fertilizer Recommendation", use_container_width=True)

# ── Prediction ────────────────────────────────────────────────
if predict_btn:
    crop_enc = le_crop.transform([crop])[0]
    soil_enc = le_soil.transform([soil])[0]
    irr_enc  = le_irr.transform([irrigation])[0]
    prev_enc = le_prev.transform([prev_crop])[0]

    X_input = np.array([[crop_enc, soil_enc, irr_enc, prev_enc,
                         soil_N, soil_P, soil_K, soil_pH,
                         organic_matter, target_yield]])

    N_dose = max(0, float(model_N.predict(X_input)[0]))
    P_dose = max(0, float(model_P.predict(X_input)[0]))
    K_dose = max(0, float(model_K.predict(X_input)[0]))
    fert_enc = model_fert.predict(X_input)[0]
    fertilizer = le_fert.inverse_transform([fert_enc])[0]

    # Convert to commercial fertilizer quantities
    urea_qty   = round(N_dose / 0.46, 1)   # Urea is 46% N
    dap_qty    = round(P_dose / 0.46, 1)   # DAP is 46% P2O5
    mop_qty    = round(K_dose / 0.60, 1)   # MOP is 60% K2O

    tip = CROP_TIPS.get(crop, CROP_TIPS["default"])
    schedule_key = CROP_SCHEDULE_MAP.get(crop, "cereal")
    schedule = SCHEDULES[schedule_key]

    st.markdown("<br>", unsafe_allow_html=True)

    # Main result cards
    r1, r2 = st.columns(2, gap="large")

    with r1:
        st.markdown(f"""
        <div class="result-card">
            <div class="result-label">Recommended Fertilizer</div>
            <div class="result-value">{fertilizer}</div>
            <div class="metric-row">
                <div class="metric-box">
                    <div class="metric-val">{N_dose:.0f}</div>
                    <div class="metric-lbl">N (kg/ha)</div>
                </div>
                <div class="metric-box">
                    <div class="metric-val">{P_dose:.0f}</div>
                    <div class="metric-lbl">P₂O₅ (kg/ha)</div>
                </div>
                <div class="metric-box">
                    <div class="metric-val">{K_dose:.0f}</div>
                    <div class="metric-lbl">K₂O (kg/ha)</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

    with r2:
        st.markdown(f"""
        <div class="result-card" style="background: linear-gradient(135deg, #1a3a1a, #2f5c2f);">
            <div class="result-label">Commercial Quantities</div>
            <div class="metric-row">
                <div class="metric-box">
                    <div class="metric-val">{urea_qty}</div>
                    <div class="metric-lbl">Urea (kg/ha)</div>
                </div>
                <div class="metric-box">
                    <div class="metric-val">{dap_qty}</div>
                    <div class="metric-lbl">DAP (kg/ha)</div>
                </div>
                <div class="metric-box">
                    <div class="metric-val">{mop_qty}</div>
                    <div class="metric-lbl">MOP (kg/ha)</div>
                </div>
            </div>
            <div class="tip-box"><strong>Crop Tip:</strong> {tip}</div>
        </div>
        """, unsafe_allow_html=True)

    # NPK visual bars
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-label">Nutrient Dose Breakdown</div>', unsafe_allow_html=True)
    max_dose = max(N_dose, P_dose, K_dose, 1)
    for name, dose, color in [("N", N_dose, "#d97706"), ("P", P_dose, "#7c3aed"), ("K", K_dose, "#0891b2")]:
        pct = int((dose / max_dose) * 100)
        st.markdown(f"""
        <div class="nutrient-bar-row">
            <div class="nutrient-name">{name}</div>
            <div class="nutrient-bar-bg">
                <div class="nutrient-bar-fill" style="width:{pct}%; background:{color}"></div>
            </div>
            <div class="nutrient-val">{dose:.0f} kg/ha</div>
        </div>
        """, unsafe_allow_html=True)

    # Application schedule
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-label">Application Schedule</div>', unsafe_allow_html=True)
    for title, desc in schedule:
        st.markdown(f"""
        <div class="schedule-row">
            <div class="stage-dot"></div>
            <div>
                <div class="stage-title">{title}</div>
                <div class="stage-desc">{desc}</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("""
    <p style="font-size:0.75rem;color:#9ca3af;margin-top:1rem">
    Recommendations based on ICAR guidelines. Always verify with a certified agronomist for your specific field conditions.
    DAP = Di-Ammonium Phosphate | MOP = Muriate of Potash | SSP = Single Super Phosphate
    </p>
    """, unsafe_allow_html=True)
