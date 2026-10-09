// ===== Central Kitchen Dashboard — application logic =====
// ---- SAMPLE DATA (replace with Supabase queries later) ----
const DATA = {
  am: {
    metrics: { outlets:104, waste:"3.4%", alerts:6, mismatch:2 },
    production: [
      { outlet:"B", produced:100, sold:96 },
      { outlet:"C", produced:80,  sold:58 },
      { outlet:"D", produced:80,  sold:77 },
    ],
    yield: [
      { sku:"Personal (6\")", yield:95, waste:2 },
      { sku:"Regular (9\")",  yield:93, waste:3 },
      { sku:"Large (13\")",   yield:86, waste:7 },
    ],
    alerts: [
      { sev:"high",   outlet:"C", text:"flour usage +18% vs recipe → likely short-delivery" },
      { sev:"medium", outlet:"J", text:"waste +6% → check shift" },
      { sev:"low",    outlet:"A", text:"within tolerance, logged" },
    ],
    logistics: [
      { route:"KL-01", ok:true },
      { route:"KL-04", ok:true },
      { route:"JHR-02", ok:false },
    ],
  },
  pm: {
    metrics: { outlets:104, waste:"4.1%", alerts:9, mismatch:3 },
    production: [
      { outlet:"B", produced:100, sold:99 },
      { outlet:"C", produced:80,  sold:71 },
      { outlet:"D", produced:80,  sold:80 },
    ],
    yield: [
      { sku:"Personal (6\")", yield:92, waste:3 },
      { sku:"Regular (9\")",  yield:90, waste:5 },
      { sku:"Large (13\")",   yield:83, waste:9 },
    ],
    alerts: [
      { sev:"high",   outlet:"C", text:"closing stock short 12kg → escalate" },
      { sev:"high",   outlet:"D", text:"dough leftover +15% → overproduction" },
      { sev:"medium", outlet:"B", text:"waste +5% → monitor" },
      { sev:"low",    outlet:"A", text:"within tolerance, logged" },
    ],
    logistics: [
      { route:"KL-01", ok:true },
      { route:"KL-04", ok:false },
      { route:"JHR-02", ok:false },
    ],
  },
};

const SEV = {
  high:   { color:"var(--red)",   bg:"var(--red-bg)",   label:"High" },
  medium: { color:"var(--amber)", bg:"var(--amber-bg)", label:"Medium" },
  low:    { color:"var(--text-soft)", bg:"var(--panel-2)", label:"Low" },
};

// ---- WEEKLY TREND (read from weekly_trend.py output; fallback to sample) ----
let WEEKLY = {
  days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  waste:    [3.1, 3.4, 2.9, 4.1, 3.8, 5.2, 4.6],
  produced: [980, 1010, 950, 1100, 1050, 1200, 1150],
  sold:     [920, 970, 900, 1050, 1000, 1180, 1090],
  variance: [2, 3, 1, 4, 2, 5, 3],
};
let weeklyLive = false;
let trendMetric = "waste";

function drawTrend(metric) {
  const W = 640, H = 240, padL = 44, padR = 20, padT = 20, padB = 34;
  const pw = W - padL - padR, ph = H - padT - padB;
  const n = WEEKLY.days.length;
  const xAt = i => padL + (n === 1 ? 0 : i * (pw / (n - 1)));
  const xBar = i => padL + i * (pw / n);

  // pick data + max
  let series, maxY, kind, colors, labels;
  if (metric === "waste") {
    series = [WEEKLY.waste]; kind = "line"; colors = ["var(--amber)"]; labels = ["Waste cost (RM)"];
    maxY = Math.ceil(Math.max(...WEEKLY.waste) + 1);
  } else if (metric === "production") {
    series = [WEEKLY.produced, WEEKLY.sold]; kind = "line";
    colors = ["var(--accent)", "var(--green)"]; labels = ["Produced", "Expected"];
    maxY = Math.ceil(Math.max(...WEEKLY.produced) / 100) * 100 + 100;
  } else {
    series = [WEEKLY.variance]; kind = "bar"; colors = ["var(--red)"]; labels = ["Variance alerts"];
    maxY = Math.max(...WEEKLY.variance) + 1;
  }
  const yAt = v => padT + (1 - v / maxY) * ph;

  let svg = `<svg width="100%" viewBox="0 0 ${W} ${H}" style="font-family:inherit">`;

  // y gridlines + labels (4 ticks)
  for (let t = 0; t <= 4; t++) {
    const val = maxY * t / 4, y = yAt(val);
    svg += `<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="var(--border)" stroke-width="1"/>`;
    svg += `<text x="${padL-8}" y="${y+4}" text-anchor="end" font-size="11" fill="var(--text-mut)">${Math.round(val)}</text>`;
  }
  // x labels
  WEEKLY.days.forEach((d, i) => {
    const x = kind === "bar" ? xBar(i) + (pw/n)/2 : xAt(i);
    svg += `<text x="${x}" y="${H-12}" text-anchor="middle" font-size="11" fill="var(--text-mut)">${d}</text>`;
  });

  if (kind === "line") {
    series.forEach((data, s) => {
      const pts = data.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
      svg += `<polyline points="${pts}" fill="none" stroke="${colors[s]}" stroke-width="2.5" stroke-linejoin="round"/>`;
      data.forEach((v, i) => {
        const prefix = metric === "waste" ? "RM " : "";
        // visible dot
        svg += `<circle class="pt" cx="${xAt(i)}" cy="${yAt(v)}" r="4" fill="${colors[s]}" stroke="#fff" stroke-width="1.5"/>`;
        // large invisible hover target + tooltip
        svg += `<circle class="hit" cx="${xAt(i)}" cy="${yAt(v)}" r="14" fill="transparent"
          data-x="${xAt(i)}" data-y="${yAt(v)}" data-label="${WEEKLY.days[i]} · ${labels[s]}" data-val="${prefix}${v}"></circle>`;
      });
    });
  } else {
    const bw = (pw / n) * 0.55;
    WEEKLY.variance.forEach((v, i) => {
      const x = xBar(i) + (pw/n - bw)/2, y = yAt(v);
      svg += `<rect class="hit" x="${x}" y="${y}" width="${bw}" height="${padT+ph-y}" rx="4" fill="${colors[0]}"
        data-x="${x + bw/2}" data-y="${y}" data-label="${WEEKLY.days[i]} · alerts" data-val="${v}"></rect>`;
    });
  }

  // tooltip group (hidden until hover)
  svg += `<g id="tt" style="opacity:0; transition:opacity .12s" pointer-events="none">
    <rect id="ttbg" x="0" y="0" width="120" height="40" rx="6" fill="rgba(30,34,48,0.92)"/>
    <text id="ttlabel" x="0" y="0" font-size="11" fill="#cfd4e2"></text>
    <text id="ttval" x="0" y="0" font-size="14" font-weight="600" fill="#fff"></text>
  </g>`;

  // legend
  let lx = padL;
  labels.forEach((lab, s) => {
    svg += `<circle cx="${lx}" cy="14" r="5" fill="${colors[s]}"/>`;
    svg += `<text x="${lx+10}" y="18" font-size="12" fill="var(--text-soft)">${lab}</text>`;
    lx += lab.length * 7 + 30;
  });

  svg += `</svg>`;
  document.getElementById("chartArea").innerHTML = svg;

  // tooltip interactions
  const svgEl = document.querySelector("#chartArea svg");
  const tt = svgEl.querySelector("#tt");
  const ttbg = svgEl.querySelector("#ttbg");
  const ttlabel = svgEl.querySelector("#ttlabel");
  const ttval = svgEl.querySelector("#ttval");
  svgEl.querySelectorAll(".hit").forEach(hit => {
    hit.style.cursor = "pointer";
    hit.addEventListener("mouseenter", () => {
      const x = parseFloat(hit.dataset.x), y = parseFloat(hit.dataset.y);
      ttlabel.textContent = hit.dataset.label;
      ttval.textContent = hit.dataset.val;
      const w = Math.max(ttlabel.getComputedTextLength(), ttval.getComputedTextLength()) + 22;
      let bx = x - w/2; bx = Math.max(4, Math.min(bx, 640 - w - 4));
      let by = y - 52; if (by < 4) by = y + 16;
      ttbg.setAttribute("x", bx); ttbg.setAttribute("y", by); ttbg.setAttribute("width", w);
      ttlabel.setAttribute("x", bx + 11); ttlabel.setAttribute("y", by + 16);
      ttval.setAttribute("x", bx + 11); ttval.setAttribute("y", by + 32);
      tt.style.opacity = 1;
    });
    hit.addEventListener("mouseleave", () => { tt.style.opacity = 0; });
  });

  const badge = document.getElementById("trendBadge");
  if (badge) {
    badge.textContent = weeklyLive ? "● live from weekly_trend" : "○ sample data · 7-day demo";
    badge.className = "src-badge" + (weeklyLive ? " live" : "");
  }
}

// ---- STATE ----
let state = { snap:"am", outlet:"all", sev:"all" };
let liveYield = null;   // filled from dough_tracker_output.json if available
let liveProd = null;    // filled from hod_output.json if available
let liveAlerts = null;  // filled from ck_grn_output.json if available
let liveOrder = null;   // filled from auto_order_output.json if available
let liveLog = null;     // filled from pkt_output.json if available

// ---- LOAD LIVE DOUGH TRACKER OUTPUT ----
// Tries to read the JSON produced by dough_tracker.py. If it can't
// (file missing, or opened via file:// which blocks fetch), it quietly
// falls back to the built-in sample data.
async function loadLive() {
  // Dough Tracker → yield & waste card
  try {
    const res = await fetch("dough_tracker_output.json", { cache: "no-store" });
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    liveYield = data.records;
  } catch (e) {
    liveYield = null;   // fall back to sample
  }
  // HOD Central Kitchen → production vs demand card
  try {
    const res = await fetch("hod_output.json", { cache: "no-store" });
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    liveProd = data.records;
  } catch (e) {
    liveProd = null;   // fall back to sample
  }
  // CK GRN Agent → usage variance alerts card
  try {
    const res = await fetch("ck_grn_output.json", { cache: "no-store" });
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    liveAlerts = data.records;
  } catch (e) {
    liveAlerts = null;   // fall back to sample
  }
  // Auto-order (CK GRN Phase 2) → weekly auto-order card
  try {
    const res = await fetch("auto_order_output.json", { cache: "no-store" });
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    liveOrder = data.records;
  } catch (e) {
    liveOrder = null;
  }
  // PKT Email Reader → logistics log card
  try {
    const res = await fetch("pkt_output.json", { cache: "no-store" });
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    liveLog = data.records;
  } catch (e) {
    liveLog = null;
  }
  // Weekly trend → trend chart
  try {
    const res = await fetch("weekly_trend_output.json", { cache: "no-store" });
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    WEEKLY = { days: data.days, waste: data.waste, produced: data.produced, sold: data.sold, variance: data.variance };
    weeklyLive = true;
  } catch (e) {
    weeklyLive = false;
  }
  render();
  drawTrend(trendMetric);
  animateMetrics();
}

// count-up animation for the top metric numbers (runs once on load)
function animateMetrics() {
  document.querySelectorAll('.metric-val').forEach(el => {
    const raw = el.textContent.trim();
    const m = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const target = parseFloat(m[1]);
    const suffix = m[2];
    const decimals = (m[1].split('.')[1] || '').length;
    const dur = 800, t0 = performance.now();
    function step(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = (target * p).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// live real-time clock
function tickClock() {
  const lu = document.getElementById("lastUpdated");
  if (!lu) return;
  const n = new Date();
  const day = n.toLocaleDateString([], {weekday:'short'});
  const time = n.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
  lu.textContent = day + " · " + time;
}
tickClock();
setInterval(tickClock, 1000);

// Warning shown on the variance card when the two data sources cover different date spans.
function varWindowNote(){
  const w = window.__VARWIN__; if(!w) return "";
  return `<div style="background:#fff4e5;border:1px solid #f0c48a;color:#8a5a00;border-radius:8px;padding:8px 11px;margin:6px 0 10px;font-size:12px;line-height:1.5">`
    + `⚠️ Consumption data runs to <b>${w.cons_to}</b> but production data only to <b>${w.job_to}</b>. `
    + `Variance below is computed on the shared window (<b>${w.from} → ${w.to}</b>) so the figures stay comparable. `
    + `For full coverage, export both reports with the same end date.</div>`;
}

// ---- RENDER ----
function render() {
  const d = DATA[state.snap];

  // metrics — auto-calculated from live agent data when available, else sample
  // Avg waste: mean of Dough Tracker waste %
  const avgWaste = liveYield
    ? (liveYield.reduce((s, r) => s + r.waste_pct, 0) / liveYield.length).toFixed(1) + "%"
    : d.metrics.waste;
  // Variance alerts: count of CK GRN records that aren't "within tolerance"
  const varCount = liveAlerts
    ? liveAlerts.filter(a => a.severity !== "low").length
    : d.metrics.alerts;
  // PKT dispatched (MY): units shipped from PKT warehouse to MY outlets
  const pktDispMY = (window.PKT_SUMMARY && window.PKT_SUMMARY.MY) ? Number(window.PKT_SUMMARY.MY.totalOut).toLocaleString() : "—";
  // Products made: distinct products produced (from HOD job production), else sample
  const productCount = liveProd ? liveProd.length : d.metrics.outlets;
  // Outlets: distinct outlets that ordered, from the Sales Order demand data (— if none loaded)
  let outletCount = "—";
  try{ const dv = (typeof demandView==="function") ? demandView() : null;
       if(dv && dv.byOutlet && dv.byOutlet.length) outletCount = dv.byOutlet.length; }catch(e){}

  document.getElementById("metrics").innerHTML = `
    <div class="metric"><p class="metric-label">Outlets</p><p class="metric-val">${outletCount}</p></div>
    <div class="metric"><p class="metric-label">Products made</p><p class="metric-val">${productCount}</p></div>
    <div class="metric"><p class="metric-label">Avg waste</p><p class="metric-val">${avgWaste}</p></div>
    <div class="metric"><p class="metric-label">Variance alerts</p><p class="metric-val" style="color:var(--amber)">${varCount}</p></div>
    <div class="metric"><p class="metric-label">PKT dispatched (MY)</p><p class="metric-val">${pktDispMY}</p></div>`;

  // summary banner
  const banner = document.getElementById("banner");
  if (banner) {
    const highAlerts = liveAlerts ? liveAlerts.filter(a => a.severity === "high").length : 0;
    const pktLow = (window.PKT_SUMMARY && window.PKT_SUMMARY.MY && window.PKT_SUMMARY.MY.low) ? window.PKT_SUMMARY.MY.low.length : 0;
    const parts = [];
    if (highAlerts > 0) parts.push(`${highAlerts} recipe variance alert(s)`);
    if (pktLow > 0) parts.push(`${pktLow} PKT low-stock item(s)`);
    if (!parts.length) {
      banner.innerHTML = `<span style="color:var(--green)">✓ All normal today</span>`;
      banner.style.background = "var(--green-bg)";
    } else {
      banner.innerHTML = `<span style="color:var(--red)">⚠ ${parts.join(" · ")} today</span>`;
      banner.style.background = "var(--red-bg)";
    }
  }

  // production — use LIVE data from HOD Central Kitchen JSON if loaded, else sample
  const prodSource = liveProd ? liveProd : d.production;
  let prod = prodSource.filter(p => state.outlet==="all" || p.outlet===state.outlet);
  const prodBadge = liveProd
    ? `<div class="src-badge live">● live from hod_central_kitchen</div>`
    : `<div class="src-badge">○ sample data</div>`;
  document.getElementById("prodList").innerHTML = prodBadge + (prod.length ? prod.map(p => {
    const pct = Math.round(p.sold / p.produced * 100);
    const col = pct >= 90 ? "var(--accent)" : "var(--amber)";
    const txtcol = pct >= 90 ? "var(--text-soft)" : "var(--amber)";
    return `<div class="bar-row">
      <div class="bar-top"><span>${p.outlet}</span><span style="color:${txtcol}">planned ${p.produced} / actual ${p.sold}</span></div>
      <div class="track"><div class="fill" style="width:${pct}%; background:${col}"></div></div>
    </div>`;
  }).join("") : `<div class="empty">No outlet selected data</div>`);

  // yield — use LIVE data from Dough Tracker JSON if it loaded, else sample
  const yieldData = liveYield
    ? liveYield.map(r => ({ sku: r.size, yield: r.yield_pct, waste: r.waste_pct }))
    : d.yield;
  const srcBadge = liveYield
    ? `<div class="src-badge live">● live from dough_tracker</div>`
    : `<div class="src-badge">○ sample data</div>`;
  document.getElementById("yieldList").innerHTML = srcBadge + yieldData.map(y => {
    const col = y.waste <= 4 ? "var(--green)" : "var(--amber)";
    return `<div class="line"><span>${y.sku}</span><span style="color:${col}">yield ${y.yield}% · waste ${y.waste}%</span></div>`;
  }).join("");

  // alerts — use LIVE data from CK GRN Agent JSON if loaded, else sample
  let alertBadge, alerts;
  if (liveAlerts) {
    alertBadge = `<div class="src-badge live">● recipe variance · matched by item code</div>` + varWindowNote();
    // CK GRN alerts are material-level (not outlet), so filter by severity only.
    alerts = liveAlerts
      .filter(a => state.sev==="all" || a.severity===state.sev)
      .map(a => ({ sev:a.severity, head:`${a.material} · ${a.cause}`, text:`${a.note} → ${a.route_to}` }));
  } else {
    alertBadge = `<div class="src-badge">○ sample data</div>`;
    alerts = d.alerts
      .filter(a => (state.sev==="all" || a.sev===state.sev) && (state.outlet==="all" || a.outlet===state.outlet))
      .map(a => ({ sev:a.sev, head:`${SEV[a.sev].label} · Outlet ${a.outlet}`, text:a.text }));
  }
  document.getElementById("alertList").innerHTML = alertBadge + (alerts.length ? alerts.map(a => {
    const s = SEV[a.sev];
    return `<div class="alert" style="background:${s.bg}">
      <span class="a-head" style="color:${s.color}">${a.head}</span>
      <span style="color:${s.color}">${a.text}</span></div>`;
  }).join("") : `<div class="empty">No alerts match this filter</div>`);

  // logistics — PKT (real WMS dispatches, MY/SG separate)
  renderPKT();

  // weekly auto-order (CK GRN Phase 2)
  if (liveOrder) {
    const rows = liveOrder
      .filter(o => state.outlet==="all" || o.outlet===state.outlet)
      .map(o => `<div class="line"><span>${o.outlet} <span style="color:var(--text-mut)">(have ${o.current_stock})</span></span><span style="color:var(--accent); font-weight:600">order ${o.order_qty}</span></div>`)
      .join("");
    document.getElementById("orderList").innerHTML =
      `<div class="src-badge live">● live from auto_order · draft, needs approval</div>` +
      (rows || `<div class="empty">No outlet selected data</div>`);
  } else {
    document.getElementById("orderList").innerHTML =
      `<div class="src-badge">○ run auto_order.py to see draft orders</div>`;
  }
}

// ---- EVENTS ----
document.getElementById("sevChips").addEventListener("click", e => {
  if (e.target.dataset.sev) {
    state.sev = e.target.dataset.sev;
    document.querySelectorAll("#sevChips .chip").forEach(c => c.classList.toggle("active", c===e.target));
    render();
  }
});

document.getElementById("trendToggle").addEventListener("click", e => {
  if (e.target.dataset.metric) {
    trendMetric = e.target.dataset.metric;
    document.querySelectorAll("#trendToggle button").forEach(b => b.classList.toggle("active", b===e.target));
    drawTrend(trendMetric);
  }
});

// ---- NAV: dashboard <-> recipes ----
document.getElementById("nav").addEventListener("click", e => {
  if (!e.target.dataset.view) return;
  const v = e.target.dataset.view;
  document.querySelectorAll("#nav .nav-btn").forEach(b => b.classList.toggle("active", b===e.target));
  document.getElementById("view-dashboard").style.display = v==="dashboard" ? "" : "none";
  document.getElementById("view-recipes").style.display = v==="recipes" ? "" : "none";
  const vd=document.getElementById("view-details"); if(vd) vd.style.display = v==="details" ? "" : "none";
  const vg=document.getElementById("view-guide"); if(vg) vg.style.display = v==="guide" ? "" : "none";
  if (v==="recipes" && !RECIPES.length) loadRecipes();
  if (v==="details") renderDetails();
});

// ---- RECIPES view ----
let RECIPES = [];
let rFilter = "ALL", rQuery = "";
const RCAT = { DOUGH:"#c47d15", MEAT:"#c0392b", PREMIX:"#7a5bb0", SAUCES:"#2f7d5b", "SIDE DISHES":"#2b7a9e" };

// Populate recipe-variance globals synchronously so applyData()/recipeVariance() can use them
// (the inline <script id="recipedata"> / "recmapdata"> elements already exist above this script).
(function(){
  try{ var rd=document.getElementById("recipedata"); if(rd) window.__RECIPES__=JSON.parse(rd.textContent||"{}"); }catch(e){ console.warn("recipes global init failed",e); }
  try{ var rm=document.getElementById("recmapdata"); if(rm) window.__RECMAP__=JSON.parse(rm.textContent||"[]"); }catch(e){ console.warn("recmap global init failed",e); }
})();

async function loadRecipes() {
  try {
    // recipe data now lives in data.js as window.__RECIPES__ (moved out of the HTML during the file split)
    if (window.__RECIPES__ && window.__RECIPES__.recipes) { RECIPES = window.__RECIPES__.recipes; }
    else {
      const el = document.getElementById("recipedata");
      if (el) { const inl = JSON.parse(el.textContent||"{}"); if (inl && inl.recipes) RECIPES = inl.recipes; }
    }
    if (!RECIPES.length) { const res = await fetch("recipe_standard.json", { cache:"no-store" }); RECIPES = (await res.json()).recipes || []; }
  } catch(e) {
    console.warn("loadRecipes failed", e);
  }
  if (!RECIPES.length) { document.getElementById("rgrid").innerHTML = `<div class="empty">No recipe data.</div>`; return; }
  drawRTabs(); drawRecipes();
}

function rCats() { return ["ALL", ...new Set(RECIPES.map(r=>r.category))]; }

function drawRTabs() {
  document.getElementById("rtabs").innerHTML = rCats().map(c => {
    const n = c==="ALL" ? RECIPES.length : RECIPES.filter(r=>r.category===c).length;
    const lbl = c==="ALL" ? "All" : c[0]+c.slice(1).toLowerCase();
    return `<span class="rtab${c===rFilter?' active':''}" data-cat="${c}">${lbl} (${n})</span>`;
  }).join("");
  document.querySelectorAll("#rtabs .rtab").forEach(t => t.onclick = () => { rFilter=t.dataset.cat; drawRTabs(); drawRecipes(); });
}

function drawRecipes() {
  let list = rFilter==="ALL" ? RECIPES : RECIPES.filter(r=>r.category===rFilter);
  if (rQuery) {
    const s = rQuery.toLowerCase();
    list = list.filter(r => r.name.toLowerCase().includes(s) || r.ingredients.some(i=>i.name.toLowerCase().includes(s)));
  }
  const g = document.getElementById("rgrid");
  if (!list.length) { g.innerHTML = `<div class="empty">No recipes match.</div>`; return; }
  g.innerHTML = list.map(r => {
    const col = RCAT[r.category] || "var(--accent)";
    return `<div class="card">
      <div class="rcard-head">
        <p class="rname">${r.name}</p>
        <span class="rcat" style="background:${col}">${r.category}</span>
      </div>
      <p class="ryield">1 batch → ${r.yield_qty} ${r.yield_unit} · ${r.dimension}</p>
      <table class="rtable">
        <tr><th>Ingredient</th><th style="text-align:right">Per batch</th><th style="text-align:right">Per ${r.yield_unit.toLowerCase()}</th></tr>
        ${r.ingredients.map(i=>`<tr>
          <td>${i.name}</td>
          <td class="num">${i.qty.toLocaleString()} ${i.unit.toLowerCase()}</td>
          <td class="num">${i.per_unit} ${i.unit.toLowerCase()}</td>
        </tr>`).join("")}
      </table>
    </div>`;
  }).join("");
}

document.getElementById("rsearch").addEventListener("input", e => { rQuery = e.target.value; drawRecipes(); });

// ---- SUPABASE (shared persistence) ----
const SB_URL="https://dfhuoyffwpxlhnewlykt.supabase.co";
const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaHVveWZmd3B4bGhuZXdseWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5Njc0NDQsImV4cCI6MjEwNTU0MzQ0NH0.BtAutfSoY2TZ_IkGXdhZ8TqovegS8UDh8C-cLgcKWKI";
let SB=null;
try{ if(window.supabase) SB=window.supabase.createClient(SB_URL,SB_KEY,{auth:{storage:window.sessionStorage,persistSession:true,autoRefreshToken:true}}); }catch(e){ console.warn("supabase init failed",e); }
let RAW=null;
let CURRENT_USER="";      // display name (or email) of the signed-in user (for "uploaded by")
let CURRENT_EMAIL="";     // the signed-in user's email (for admin check / reset requests)
let IS_ADMIN=false;
let UPLOAD_INFO=null;     // {by, at} of the last upload that populated the shared data
// Prefer a Supabase display name (set in Authentication → Users → User Metadata:
// full_name / name / display_name); fall back to email if none is set.
function userLabel(u){ if(!u) return ""; const md=u.user_metadata||{};
  return md.full_name || md.name || md.display_name || u.email || ""; }
function slimRaw(raw){
  const mv=(raw.movements||[]).map(v=>{ const c=v.slice(0,15); c[5]=null;c[6]=null;c[7]=null;c[8]=null;c[13]=null; return c; });
  return { movements:mv, openings:raw.openings, closings:raw.closings, openTitle:raw.openTitle, closeTitle:raw.closeTitle, jobRows:raw.jobRows, wasteRows:raw.wasteRows, costs:raw.costs };
}
function renderCost(out){
  const el=document.getElementById("costList"); if(!el) return;
  const c=out.cost; if(!c){ el.innerHTML='<div class="empty">No cost data</div>'; return; }
  const rm=n=>"RM "+Number(n||0).toLocaleString(undefined,{maximumFractionDigits:0});
  let h='<div class="src-badge live">● from stock balance (avg cost)</div>';
  h+='<div class="line"><span>Stock value on hand</span><span style="font-weight:600">'+rm(c.stock_value)+'</span></div>';
  h+='<div class="line"><span>Raw consumed (production)</span><span style="font-weight:600">'+rm(c.consumed_value)+'</span></div>';
  h+='<div class="line"><span>Waste cost</span><span style="color:var(--amber);font-weight:600">'+rm(c.waste_cost)+'</span></div>';
  if(c.top_consumed&&c.top_consumed.length){
    h+='<div style="margin-top:8px;font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;">Top consumed by value</div>';
    c.top_consumed.slice(0,5).forEach(t=>{ h+='<div class="line"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60%">'+t.name+'</span><span>'+rm(t.value)+'</span></div>'; });
  }
  el.innerHTML=h;
}
function renderWastage(out){
  const el=document.getElementById("wasteList"); if(!el) return;
  const recs=(out.wastage&&out.wastage.records)||[];
  if(!recs.length){ el.innerHTML='<div class="empty">No wastage records in this period</div>'; return; }
  const rm=n=>"RM "+Number(n||0).toLocaleString(undefined,{maximumFractionDigits:2});
  const rows=recs.map(w=>({item:w.item||"—",qty:Number(w.qty)||0,uom:(w.uom||"").toLowerCase(),reason:w.reason||"—",cost:Number(w.cost)||0}))
    .sort((a,b)=>b.cost-a.cost);
  const total=rows.reduce((s,w)=>s+w.cost,0);
  // group by reason for a quick "cause" summary
  const byReason={}; rows.forEach(w=>{ const k=w.reason||"—"; byReason[k]=(byReason[k]||0)+w.cost; });
  const causes=Object.keys(byReason).sort((a,b)=>byReason[b]-byReason[a]).slice(0,4);
  let h='<div class="src-badge live">● from wastage report</div>';
  h+='<div class="line"><span style="font-weight:600">Total waste</span><span style="color:var(--amber);font-weight:600">'+rm(total)+' · '+rows.length+' record(s)</span></div>';
  if(causes.length){
    h+='<div style="margin:6px 0 2px;font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;">Top causes</div>';
    causes.forEach(c=>{ h+='<div class="line"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60%">'+c+'</span><span>'+rm(byReason[c])+'</span></div>'; });
  }
  h+='<div style="margin:8px 0 2px;font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;">Items</div>';
  h+='<div style="max-height:190px;overflow-y:auto;">';
  rows.slice(0,40).forEach(w=>{
    h+='<div class="line" style="align-items:flex-start"><span style="max-width:62%"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">'+w.item+'</span>'+
       '<span style="font-size:10.5px;color:var(--text-mut)">'+(w.qty?w.qty+' '+w.uom+' · ':'')+w.reason+'</span></span>'+
       '<span style="color:var(--amber);font-weight:600;white-space:nowrap">'+rm(w.cost)+'</span></div>';
  });
  h+='</div>';
  if(rows.length>40) h+='<div style="font-size:10.5px;color:var(--text-mut);margin-top:4px">+ '+(rows.length-40)+' more — see Details / export</div>';
  el.innerHTML=h;
}
// ---- #4 MONTH-OVER-MONTH + #5 SUMMARY ----
function metricsOf(out){
  const prod=((out.production&&out.production.products)||[]).reduce((s,p)=>s+(p.actual||0),0);
  const jobs=out.production?out.production.jobs:0;
  const waste=(out.wastage&&out.wastage.total_cost)||0;
  const cost=(out.cost&&out.cost.consumed_value)||0;
  return { prod:Math.round(prod), jobs:jobs, waste:Math.round(waste*100)/100, cost:Math.round(cost) };
}
function renderMoM(){
  const el=document.getElementById("momCard"); if(!el) return;
  if(!RAW||!FULL_MAX){ el.style.display="none"; return; }
  el.style.display="";
  // anchor the comparison on the month being VIEWED (selected range), not the latest data date,
  // so a stray next-month record doesn't collapse the card to a 1-day month.
  const anchor = (CURRENT_RANGE && CURRENT_RANGE.to) ? CURRENT_RANGE.to : FULL_MAX;
  const y=anchor.getFullYear(), m=anchor.getMonth(), day=anchor.getDate();
  const daysPrev=new Date(y,m,0).getDate(); const pEnd=Math.min(day,daysPrev);
  const currR={from:new Date(y,m,1), to:new Date(y,m,day,23,59,59)};
  const prevR={from:new Date(y,m-1,1), to:new Date(y,m-1,pEnd,23,59,59)};
  const A=metricsOf(window.CK.CKPipeline.build(RAW,currR));
  const B=metricsOf(window.CK.CKPipeline.build(RAW,prevR));
  const mn=d=>d.toLocaleDateString(undefined,{month:"short"});
  const curLbl=mn(currR.from)+" 1–"+day, prvLbl=mn(prevR.from)+" 1–"+pEnd;
  if(B.prod===0 && B.waste===0 && B.cost===0){
    el.innerHTML='<p class="card-title">📊 Month-over-month</p><div class="empty">Not enough history to compare yet — no data in the previous month ('+prvLbl+').</div>';
    return;
  }
  function delta(cur,prev,goodUp){ if(!prev) return {txt:"—",col:"var(--text-mut)"};
    const pct=Math.round((cur-prev)/prev*1000)/10; const arrow=pct>0?"▲":(pct<0?"▼":"—");
    let col="var(--text-mut)"; if(goodUp!==null && pct!==0){ const good=goodUp?(pct>0):(pct<0); col=good?"var(--green)":"var(--red)"; }
    return {txt:arrow+" "+Math.abs(pct)+"%", col:col}; }
  const rm=n=>"RM "+Number(n||0).toLocaleString(undefined,{maximumFractionDigits:0});
  const num=n=>Number(n||0).toLocaleString();
  const items=[
    {l:"Production output", v:num(A.prod), p:num(B.prod), d:delta(A.prod,B.prod,true)},
    {l:"Waste cost", v:rm(A.waste), p:rm(B.waste), d:delta(A.waste,B.waste,false)},
    {l:"Raw consumed", v:rm(A.cost), p:rm(B.cost), d:delta(A.cost,B.cost,null)} ];
  let h='<p class="card-title">📊 Month-over-month <span style="font-weight:400;color:var(--text-mut);font-size:12px">'+curLbl+' vs '+prvLbl+'</span></p>';
  h+='<div class="grid3">';
  items.forEach(it=>{ h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0 0 3px">'+it.l+'</p>'+
    '<p style="font-size:21px;font-weight:700;margin:0">'+it.v+'</p>'+
    '<p style="font-size:12px;margin:3px 0 0;color:'+it.d.col+';font-weight:600">'+it.d.txt+' <span style="color:var(--text-mut);font-weight:400">vs '+it.p+'</span></p></div>'; });
  h+='</div>';
  el.innerHTML=h;
}
function openSummary(){
  const out=window.__OUT__; if(!out){ alert("No data loaded yet — upload the ERP files first."); return; }
  const m=out.meta||{};
  const rm=n=>"RM "+Number(n||0).toLocaleString(undefined,{maximumFractionDigits:0});
  const num=n=>Number(n||0).toLocaleString();
  const A=metricsOf(out);
  const yieldRows=((typeof liveYield!=="undefined"&&liveYield)||[]).map(function(y){return "<tr><td>"+y.size+"</td><td style='text-align:right'>"+y.yield_pct+"%</td><td style='text-align:right'>"+y.waste_pct+"%</td></tr>";}).join("");
  const alerts=((typeof liveAlerts!=="undefined"&&liveAlerts)||[]).filter(function(a){return a.severity==="high";}).slice(0,12).map(function(a){return "<tr><td>"+a.material+"</td><td>"+(a.note||a.cause||"")+"</td></tr>";}).join("");
  const recs=(out.wastage&&out.wastage.records)||[]; const byR={}; recs.forEach(function(w){var k=w.reason||"—"; byR[k]=(byR[k]||0)+(Number(w.cost)||0);});
  const causes=Object.keys(byR).sort(function(a,b){return byR[b]-byR[a];}).map(function(c){return "<tr><td>"+c+"</td><td style='text-align:right'>"+rm(byR[c])+"</td></tr>";}).join("");
  const genBy=(UPLOAD_INFO&&UPLOAD_INFO.by)||CURRENT_USER||"";
  const H="<!doctype html><html><head><meta charset='utf-8'><title>Central Kitchen Summary "+(m.date_from||"")+" to "+(m.date_to||"")+"</title>"+
  "<style>body{font-family:-apple-system,Segoe UI,Roboto,Helvetica,sans-serif;color:#1a1a1a;padding:32px;max-width:820px;margin:auto}h1{font-size:22px;margin:0 0 2px}.sub{color:#666;font-size:12px;margin:0 0 3px}h2{font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#555;margin:24px 0 8px;border-bottom:1px solid #ddd;padding-bottom:5px}table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:5px 8px;border-bottom:1px solid #eee;text-align:left}th{color:#666;font-weight:600}.kpis{display:flex;gap:18px;flex-wrap:wrap;margin:12px 0}.kpi{flex:1;min-width:110px}.kpi .v{font-size:22px;font-weight:700}.kpi .l{font-size:10.5px;color:#666;text-transform:uppercase;letter-spacing:.03em}.foot{margin-top:30px;font-size:10.5px;color:#999;line-height:1.5}@media print{body{padding:6px}}</style></head><body>"+
  "<h1>Central Kitchen — Summary</h1>"+
  "<p class='sub'>Malaysia · Period: "+(m.date_from||"—")+" → "+(m.date_to||"—")+"</p>"+
  "<p class='sub'>Generated "+new Date().toLocaleString()+(genBy?(" · by "+genBy):"")+"</p>"+
  "<div class='kpis'><div class='kpi'><div class='v'>"+num(A.prod)+"</div><div class='l'>Production output</div></div>"+
  "<div class='kpi'><div class='v'>"+A.jobs+"</div><div class='l'>Jobs</div></div>"+
  "<div class='kpi'><div class='v'>"+rm(A.cost)+"</div><div class='l'>Raw consumed</div></div>"+
  "<div class='kpi'><div class='v'>"+rm(A.waste)+"</div><div class='l'>Waste cost</div></div></div>"+
  "<h2>Dough yield &amp; waste</h2><table><tr><th>Size</th><th style='text-align:right'>Yield</th><th style='text-align:right'>Waste</th></tr>"+(yieldRows||"<tr><td colspan='3'>—</td></tr>")+"</table>"+
  "<h2>Cost overview</h2><table><tr><td>Stock value on hand</td><td style='text-align:right'>"+rm(out.cost&&out.cost.stock_value)+"</td></tr>"+
  "<tr><td>Raw consumed (production)</td><td style='text-align:right'>"+rm(out.cost&&out.cost.consumed_value)+"</td></tr>"+
  "<tr><td>Waste cost</td><td style='text-align:right'>"+rm(out.cost&&out.cost.waste_cost)+"</td></tr></table>"+
  "<h2>Wastage by cause</h2><table>"+(causes||"<tr><td>No wastage records</td></tr>")+"</table>"+
  "<h2>High recipe-variance alerts</h2><table>"+(alerts||"<tr><td>None</td></tr>")+"</table>"+
  "<p class='foot'>US Pizza Central Kitchen dashboard · figures from ERP exports. Recipe-variance compares actual ERP consumption against the Codemax recipe standard, matched by item code, so large outliers are flags to verify, not confirmed loss.</p>"+
  "</body></html>";
  const w=window.open("","_blank"); if(!w){ alert("Please allow pop-ups to open the summary."); return; }
  w.document.write(H); w.document.close();
  auditLog("export", "Summary / PDF" + (CURRENT_RANGE ? " · "+fmtD(CURRENT_RANGE.from)+"→"+fmtD(CURRENT_RANGE.to) : ""));  // audit trail
  // trigger print from the opener (CSP-safe: no inline script inside the popup)
  setTimeout(function(){ try{ w.focus(); w.print(); }catch(e){} }, 400);
}
// ---- header "uploaded by / when" — reflects the most recent upload (CK or PKT) ----
function noteUpload(by,at){ if(!at) return; if(!UPLOAD_INFO || !UPLOAD_INFO.at || new Date(at)>=new Date(UPLOAD_INFO.at)){ UPLOAD_INFO={by:by||"",at:at}; } }
function renderDataInfo(){
  const di=document.getElementById("dataInfo"); if(!di) return;
  const m=(window.__OUT__&&window.__OUT__.meta)||{};
  let t = m.date_from ? ("Live · "+(m.date_from||"")+" → "+(m.date_to||"")) : "";
  if(UPLOAD_INFO&&UPLOAD_INFO.at){ let dt=""; try{ const d=new Date(UPLOAD_INFO.at); dt=d.toLocaleDateString(undefined,{day:"2-digit",month:"short"})+" "+d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"}); }catch(e){}
    t += (t?" · ":"")+"uploaded "+dt+(UPLOAD_INFO.by?(" by "+UPLOAD_INFO.by):""); }
  di.textContent=t;
}
// ---- shared: horizontal bar chart (single-hue magnitude) + CSV download ----
function hbars(rows, opts){ opts=opts||{}; var color=opts.color||"var(--accent)"; var fmt=opts.fmt||function(n){return n;};
  if(!rows.length) return '<div class="empty">No data</div>';
  var max=1; rows.forEach(function(r){ if(r.value>max) max=r.value; });
  var h='';
  rows.forEach(function(r){ var w=Math.max(2,Math.round(r.value/max*100)); var lbl=String(r.label);
    h+='<div style="margin-bottom:9px;">'+
       '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;gap:8px;"><span style="max-width:62%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+lbl+'</span><span style="font-weight:600;white-space:nowrap">'+fmt(r.value)+'</span></div>'+
       '<div style="height:8px;background:var(--track);border-radius:5px;overflow:hidden;"><div style="height:8px;width:'+w+'%;background:'+color+';border-radius:5px;" title="'+lbl.replace(/"/g,"")+': '+fmt(r.value)+'"></div></div>'+
       '</div>';
  });
  return h;
}
function downloadCSV(filename, head, rows){
  var esc=function(v){ v=(v==null?"":String(v)); return /[",\n]/.test(v)?('"'+v.replace(/"/g,'""')+'"'):v; };
  var csv=[head.map(esc).join(",")].concat(rows.map(function(r){return r.map(esc).join(",");})).join("\n");
  var blob=new Blob([csv],{type:"text/csv"}); var a=document.createElement("a");
  a.href=URL.createObjectURL(blob); a.download=filename; a.click(); setTimeout(function(){URL.revokeObjectURL(a.href);},100);
  auditLog("export", filename+" ("+(rows?rows.length:0)+" rows)");   // audit trail
}
// ---- Audit log: records who did what, when (best-effort; a DB webhook fans out to Telegram/email) ----
async function auditLog(action, detail){
  try{
    if(!SB) return;
    await SB.from("audit_log").insert({ actor: (CURRENT_USER||"unknown"), action: action, detail: (detail||"") });
  }catch(e){ /* best-effort — never block the user action */ }
}

// ---- Maker-checker RESET: request (any user) → admin approve → data cleared ----
async function resetRequest(){
  if(!SB) return;
  const scope=((document.getElementById("resetScope")||{}).value)||"all";
  const msg=document.getElementById("resetMsg"); if(!msg) return;
  if(!confirm('Request a reset of "'+scope+'"?\nNothing is deleted yet — an admin must approve first.')) return;
  msg.style.color="var(--text-soft)"; msg.textContent="Sending request…";
  const {error}=await SB.rpc("request_reset",{p_scope:scope});
  if(error){ msg.style.color="var(--red)"; msg.textContent=error.message; }
  else { msg.style.color="var(--green)"; msg.textContent="✓ Request sent — waiting for an admin to approve."; renderPendingResets(); }
}
async function renderPendingResets(){
  const el=document.getElementById("pendingResets"); if(!el||!SB) return;
  try{ const {data:adm}=await SB.rpc("is_admin"); IS_ADMIN=!!adm; }catch(e){ IS_ADMIN=false; }
  const {data,error}=await SB.from("reset_requests").select("*").eq("status","pending").order("requested_at",{ascending:false});
  if(error){ el.innerHTML=""; return; }
  if(!data||!data.length){ el.innerHTML='<div style="font-size:12px;color:var(--text-mut)">No pending reset requests.</div>'; return; }
  let h='<div style="font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin-bottom:6px">Pending reset requests'+(IS_ADMIN?' · you can approve/reject':'')+'</div>';
  data.forEach(function(r){
    h+='<div class="line" style="align-items:center"><span style="max-width:60%">'+r.scope
      +'<br><span style="font-size:10.5px;color:var(--text-mut)">by '+r.requested_by+' · '+String(r.requested_at||"").slice(0,16).replace("T"," ")+'</span></span>';
    if(IS_ADMIN) h+='<span style="display:flex;gap:6px"><button class="nav-btn rr-ap" data-id="'+r.id+'" style="cursor:pointer;padding:3px 11px">Approve</button>'
      +'<button class="nav-btn rr-rj" data-id="'+r.id+'" style="cursor:pointer;padding:3px 11px;color:var(--red)">Reject</button></span>';
    else h+='<span style="font-size:11px;color:var(--amber)">pending</span>';
    h+='</div>';
  });
  el.innerHTML=h;
}
async function resetDecide(id, approve){
  if(!SB) return;
  const msg=document.getElementById("resetMsg");
  const {error}=await SB.rpc(approve?"approve_reset":"reject_reset",{p_id:Number(id)});
  if(error){ if(msg){ msg.style.color="var(--red)"; msg.textContent=error.message; } return; }
  if(msg){ msg.style.color="var(--green)"; msg.textContent= approve?"✓ Approved — data cleared.":"Request rejected."; }
  await renderPendingResets();
  if(approve) setTimeout(function(){ location.reload(); }, 900);  // data was cleared — refresh
}
(function(){
  const rb=document.getElementById("resetRequestBtn"); if(rb) rb.addEventListener("click", resetRequest);
  const pr=document.getElementById("pendingResets");
  if(pr) pr.addEventListener("click",function(e){ const b=e.target.closest&&e.target.closest("button[data-id]"); if(!b) return;
    resetDecide(b.getAttribute("data-id"), b.classList.contains("rr-ap")); });
})();
// ---- DEMAND (Sales Orders CK -> outlets) ----
let DEMRAW=null;
function demandView(){
  // returns the aggregated view whether DEMRAW holds raw lines (this session)
  // or a stored aggregate (loaded from Supabase — kept small to avoid save timeouts)
  if(DEMRAW && DEMRAW.lines && DEMRAW.lines.length) return window.DEM.build(DEMRAW);
  if(DEMRAW && DEMRAW.agg) return DEMRAW.agg;
  return null;
}
function renderDemand(){
  const el=document.getElementById("demandList"); if(!el) return;
  const b=demandView();
  if(!b || !b.byOutlet || !b.byOutlet.length){
    el.innerHTML='<div class="src-badge">○ No demand data yet — upload the RMS Sales Order (batch) export.</div>';
    return;
  }
  const rm=n=>"RM "+Number(n||0).toLocaleString(undefined,{maximumFractionDigits:0});
  const q=((document.getElementById("demSearch")||{}).value||"").toLowerCase().trim();
  let outlets=b.byOutlet, prods=b.byProduct;
  if(q){ outlets=outlets.filter(o=>o.outlet.toLowerCase().indexOf(q)>=0); prods=prods.filter(p=>p.desc.toLowerCase().indexOf(q)>=0); }
  const dspan=b.dateFrom===b.dateTo?(b.dateFrom||""):((b.dateFrom||"")+" → "+(b.dateTo||""));
  let h='<div class="src-badge live">● from Sales Orders · '+dspan+'</div>';
  h+='<div style="font-size:11px;color:var(--amber);margin:2px 0 8px;">Note: reflects only the uploaded sales orders ('+b.byOutlet.length+' outlets) — not necessarily every outlet.</div>';
  h+='<div style="display:flex;gap:22px;flex-wrap:wrap;margin:0 0 12px;">';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Total ordered (value)</p><p style="font-size:21px;font-weight:700;margin:0">'+rm(b.totalValue)+'</p></div>';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Outlets</p><p style="font-size:21px;font-weight:700;margin:0">'+b.byOutlet.length+'</p></div>';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Products</p><p style="font-size:21px;font-weight:700;margin:0">'+b.productCount+'</p></div>';
  h+='</div>';
  if(q) h+='<div style="font-size:11px;color:var(--text-mut);margin:-4px 0 8px;">Filter: “'+q+'” · '+outlets.length+' outlet(s), '+prods.length+' product(s)</div>';
  h+='<div class="grid2">';
  // top outlets — bar chart
  h+='<div><div style="font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin-bottom:6px">Top outlets by order value (RM)</div>';
  h+=hbars(outlets.slice(0,8).map(o=>({label:o.outlet,value:o.value})),{fmt:rm});
  h+='</div>';
  // demand by CK product
  h+='<div><div style="font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin-bottom:4px">Demand by CK product</div>';
  const ckprods=prods.filter(p=>/^my us/i.test(p.desc)); const showP=(ckprods.length?ckprods:prods).slice(0,12);
  if(!showP.length) h+='<div class="empty">No match</div>';
  showP.forEach(p=>{ const uoms=Object.keys(p.uoms).map(u=>Math.round(p.uoms[u])+" "+(u||"").toLowerCase()).join(", ");
    h+='<div class="line"><span style="max-width:58%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+p.desc+'</span><span style="font-weight:600">'+uoms+'</span></div>'; });
  h+='</div></div>';
  el.innerHTML=h;
}
function demExportCSV(){
  if(DEMRAW && DEMRAW.lines && DEMRAW.lines.length){
    const rows=DEMRAW.lines.map(l=>[l.date,l.outlet,l.code,l.desc,l.qty,l.uom,l.value,l.so]);
    downloadCSV("outlet_demand.csv",["Date","Outlet","ItemCode","ItemDesc","Qty","UOM","Value_RM","SalesOrder"],rows);
    return;
  }
  // loaded from a stored aggregate (no raw lines) — export the product-level summary instead
  const b=demandView();
  if(b && b.byProduct && b.byProduct.length){
    const rows=b.byProduct.map(p=>[p.desc,p.code,Math.round(p.qty),Math.round(p.value),p.orders]);
    downloadCSV("outlet_demand_summary.csv",["Product","ItemCode","TotalQty","Value_RM","Orders"],rows);
    return;
  }
  alert("No demand data to export.");
}

// ---- JPC (Job Production Material Costing) — real cost-per-unit variance ----
let JPCRAW=null;
function renderJPC(){
  const el=document.getElementById("jpcList"); if(!el) return;
  if(!JPCRAW || !JPCRAW.jobs || !JPCRAW.jobs.length){
    el.innerHTML='<div class="src-badge">○ No job-costing data yet — upload the Job Production Material Costing report.</div>';
    return;
  }
  const b=window.JPC.build(JPCRAW);
  const rm=n=>"RM "+Number(n||0).toLocaleString(undefined,{maximumFractionDigits:0});
  const rm2=n=>"RM "+Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  const q=((document.getElementById("jpcSearch")||{}).value||"").toLowerCase().trim();
  const dspan=b.dateFrom===b.dateTo?(b.dateFrom||""):((b.dateFrom||"")+" → "+(b.dateTo||""));
  let prods=b.products, alerts=b.alerts;
  if(q){ prods=prods.filter(p=>p.product.toLowerCase().indexOf(q)>=0); alerts=alerts.filter(a=>a.product.toLowerCase().indexOf(q)>=0); }
  let h='<div class="src-badge live">● from Job Production Material Costing · '+dspan+'</div>';
  h+='<div style="font-size:11px;color:var(--text-mut);margin:2px 0 8px;">Variance = each job’s cost per unit produced vs its product’s median. Flags jobs ≥25% off the norm to review (uses cost in RM, so mixed units don’t distort it).</div>';
  h+='<div style="display:flex;gap:22px;flex-wrap:wrap;margin:0 0 12px;">';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Jobs</p><p style="font-size:21px;font-weight:700;margin:0">'+b.jobCount+'</p></div>';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Products</p><p style="font-size:21px;font-weight:700;margin:0">'+b.productCount+'</p></div>';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Total material cost</p><p style="font-size:21px;font-weight:700;margin:0">'+rm(b.totalCost)+'</p></div>';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Jobs flagged</p><p style="font-size:21px;font-weight:700;margin:0;color:'+(alerts.length?"var(--amber)":"var(--green)")+'">'+alerts.length+'</p></div>';
  h+='</div>';
  h+='<div class="grid2">';
  // flagged jobs
  h+='<div><div style="font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin-bottom:6px">Jobs to review (cost/unit vs product norm)</div>';
  if(!alerts.length) h+='<div class="empty">No jobs deviate ≥25% — production cost is consistent.</div>';
  alerts.slice(0,10).forEach(a=>{ const up=a.dev>0; const col=up?"var(--red)":"var(--green)";
    h+='<div class="line"><span style="max-width:60%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+a.product+'<br><span style="font-size:10.5px;color:var(--text-mut)">'+a.job+' · '+(a.date||"")+'</span></span>'
      +'<span style="text-align:right;font-weight:600;color:'+col+'">'+(up?"+":"")+Math.round(a.dev)+'%<br><span style="font-size:10.5px;color:var(--text-mut);font-weight:400">'+rm2(a.cpu)+'/'+((a.unit||"").toLowerCase()||"unit")+' vs '+rm2(a.median)+'</span></span></div>'; });
  h+='</div>';
  // per-product breakdown
  h+='<div><div style="font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin-bottom:6px">By product (median cost per unit)</div>';
  if(!prods.length) h+='<div class="empty">No match</div>';
  prods.slice(0,14).forEach(p=>{
    h+='<div class="line"><span style="max-width:52%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+p.product+'<br><span style="font-size:10.5px;color:var(--text-mut)">'+p.jobs+' jobs · '+Math.round(p.totalOut).toLocaleString()+' '+((p.unit||"").toLowerCase())+'</span></span>'
      +'<span style="text-align:right;font-weight:600">'+rm2(p.medianCPU)+'<br><span style="font-size:10.5px;color:var(--text-mut);font-weight:400">'+rm(p.totalCost)+' total</span></span></div>'; });
  h+='</div></div>';
  el.innerHTML=h;
}
function jpcExportCSV(){ if(!JPCRAW||!JPCRAW.jobs||!JPCRAW.jobs.length){ alert("No job-costing data to export."); return; }
  const b=window.JPC.build(JPCRAW); const rows=[];
  b.products.forEach(p=>p.rows.forEach(r=>rows.push([p.product,r.job,r.date,r.status,Math.round(r.out),r.cost.toFixed(2),r.cpu.toFixed(3),p.medianCPU.toFixed(3),Math.round(r.dev)+"%"])));
  downloadCSV("job_production_costing.csv",["Product","JobNo","Date","Status","Output","TotalCost_RM","CostPerUnit","MedianCostPerUnit","DeviationPct"],rows);
}
// ---- PVD (Production vs Demand) — did CK make enough to cover outlet orders? ----
/* Compares what CK produced (Job Production yield) against what outlets ordered
   (Sales Order demand) for each CK product, over the window where BOTH datasets
   overlap (so the two sides are measured over the same dates). Demand is converted
   into the production unit using the pack-size map below. Products whose unit we
   can't yet convert are shown raw, flagged "pack-size needed". */
const PVD_CONV = {
  // dough: produced in PCS, ordered in CTN  (pcs per carton)
  "myuspersonaldough":{u:"PCS",f:{CTN:200}},
  "myusregulardough":{u:"PCS",f:{CTN:100}},
  "myuslargedough":{u:"PCS",f:{CTN:45}},
  // sauces/paste: produced in PKT. Pack-sizes (PKT per CTN) taken from Codemax item
  // descriptions in the Cost / Requisition / GRN reports. PKT demand is 1:1.
  "myustomyumpaste":{u:"PKT",f:{PKT:1}},
  "myussambalgepuk":{u:"PKT",f:{PKT:1}},
  "myusmarshallsauce":{u:"PKT",f:{PKT:1}},
  "myusspicysauce":{u:"PKT",f:{PKT:1}},
  "myusduncansauce":{u:"PKT",f:{CTN:15,PKT:1}},        // 1 KG X 15 PKT X CTN
  "myuslasagna":{u:"PKT",f:{CTN:8,PKT:1}},             // 2 PCS X 8 PKT X CTN
  "myusgarlicbutter":{u:"PKT",f:{CTN:4,PKT:1}},        // 1 KG X 4 PKT X CTN
  "myusmushroomsouppremix":{u:"PKT",f:{CTN:12,PKT:1}}, // 12 PKT X CTN
  "myusitalianmayo":{u:"PKT",f:{CTN:12,PKT:1}},        // 500 GM X 12 PKT X CTN
  "myusitaliansauce":{u:"PKT",f:{CTN:4,PKT:1}}         // 1 KG X 4 PKT X CTN
  // still needed: Bolognese (ordered in BOX) — confirm PKT per BOX with Miss
};
let PVD_MONTH=null;  // "YYYY-MM" chosen in the card's month picker; null = auto (dominant demand month)
function pvdSetMonth(v){ PVD_MONTH = v || null; renderPVD(); }
function pvdKey(s){ return String(s||"").toLowerCase().replace(/[^a-z0-9]/g,""); }
// compact per-product daily demand for CK products — small enough to persist in Supabase
function pvdBuildDaily(lines){
  const daily={};
  (lines||[]).forEach(l=>{ const dt=l.cdate||l.date; if(!dt || !/^my us/i.test(l.desc||"")) return;
    const k=pvdKey(l.desc); const o=daily[k]||(daily[k]={name:l.desc,days:{}});
    const dd=o.days[dt]||(o.days[dt]={}); dd[l.uom]=(dd[l.uom]||0)+l.qty; });
  return daily;
}
// returns the demand daily map from whichever source is available this session
function pvdDemandDaily(){
  if(DEMRAW && DEMRAW.lines && DEMRAW.lines.length) return pvdBuildDaily(DEMRAW.lines);
  if(DEMRAW && DEMRAW.agg && DEMRAW.agg.ckDaily) return DEMRAW.agg.ckDaily;
  if(DEMRAW && DEMRAW.ckDaily) return DEMRAW.ckDaily;
  return null;
}
function pvdCompute(){
  if(!JPCRAW || !JPCRAW.jobs || !JPCRAW.jobs.length) return {err:"nojpc"};
  const demDaily = pvdDemandDaily();
  if(!demDaily || !Object.keys(demDaily).length) return {err:"nodem"};
  const jd = JPCRAW.jobs.map(j=>j.date).filter(Boolean).sort();
  const dd = []; const monthCount={};
  Object.keys(demDaily).forEach(k=>Object.keys(demDaily[k].days).forEach(d=>{ dd.push(d); const ym=d.slice(0,7); monthCount[ym]=(monthCount[ym]||0)+1; }));
  dd.sort();
  if(!jd.length || !dd.length) return {err:"nodates"};
  const prodSpan=[jd[0],jd[jd.length-1]], demSpan=[dd[0],dd[dd.length-1]];
  // compare BY MONTH. The card's own month picker (PVD_MONTH) decides which month;
  // when unset, default to the month with the most demand. Months offered = any month
  // that has demand or production data.
  const pad=n=>String(n).padStart(2,"0");
  const demMonths=Object.keys(monthCount);
  // offer only months that have demand (a comparison needs demand), newest first
  const monthsAvail=demMonths.slice().sort().reverse();
  let targetYM;
  if(PVD_MONTH && monthsAvail.indexOf(PVD_MONTH)>=0) targetYM=PVD_MONTH;
  else targetYM=demMonths.slice().sort((a,b)=>monthCount[b]-monthCount[a])[0];
  const [ty,tm]=targetYM.split("-").map(Number);
  const monthStart = targetYM+"-01";
  const lastDay = new Date(ty, tm, 0).getDate();
  const monthEnd = targetYM+"-"+pad(lastDay);
  const prodMax = prodSpan[1];
  const winFrom = monthStart;
  const winTo = (prodMax<monthEnd ? prodMax : monthEnd);
  if(prodMax<monthStart || prodSpan[0]>monthEnd) return {err:"nooverlap",prodSpan,demSpan};
  const monthLabel = new Date(ty,tm-1,1).toLocaleDateString(undefined,{month:"long",year:"numeric"});
  const truncated = winTo<monthEnd;
  // production within window
  const prod={};
  JPCRAW.jobs.forEach(j=>{ if(!j.date || j.date<winFrom || j.date>winTo) return;
    const k=pvdKey(j.product); const o=prod[k]||(prod[k]={key:k,name:j.product,unit:(j.yield&&j.yield.unit)||"",qty:0,jobs:0});
    o.qty += (j.yield&&j.yield.qty)||0; o.jobs++; });
  // demand within window (CK products only), summed from the daily map
  const dem={};
  Object.keys(demDaily).forEach(k=>{ const src=demDaily[k]; const o=dem[k]||(dem[k]={key:k,name:src.name,uoms:{}});
    Object.keys(src.days).forEach(date=>{ if(date<winFrom||date>winTo) return; const dd2=src.days[date];
      Object.keys(dd2).forEach(u=>{ o.uoms[u]=(o.uoms[u]||0)+dd2[u]; }); }); });
  const rows=[];
  Object.keys(prod).forEach(k=>{
    const p=prod[k], d=dem[k], conv=PVD_CONV[k];
    let demRaw="", demConv=null, cover=null, status;
    if(d){ demRaw=Object.keys(d.uoms).map(u=>Math.round(d.uoms[u])+" "+(u||"").toLowerCase()).join(", "); }
    if(conv && d){
      let tot=0, ok=true;
      Object.keys(d.uoms).forEach(u=>{ const f=conv.f[u]; if(f==null){ ok=false; } else { tot+=d.uoms[u]*f; } });
      if(ok && tot>0){ demConv=tot; cover=p.qty/tot*100; status = cover<80?"under":(cover>120?"over":"ok"); }
      else { status="nopack"; }
    } else if(!d){ status="nodemand"; }
    else { status="nopack"; }
    rows.push({name:p.name,key:k,prodQty:p.qty,prodUnit:p.unit,jobs:p.jobs,demRaw:demRaw,demConv:demConv,cover:cover,status:status});
  });
  const order={under:0,over:1,ok:2,nopack:3,nodemand:4};
  rows.sort((a,b)=>(order[a.status]-order[b.status])||(b.prodQty-a.prodQty));
  return {rows,winFrom,winTo,prodSpan,demSpan,truncated,monthLabel,monthEnd,monthsAvail,targetYM};
}
function renderPVD(){
  const el=document.getElementById("pvdList"); if(!el) return;
  const r=pvdCompute();
  if(r.err){
    const msg = r.err==="nojpc" ? "Upload the Job Production Material Costing report."
      : r.err==="nodem" ? "Upload the Sales Order Listing (demand) export."
      : r.err==="nooverlap" ? "Production and demand data don't share any dates — upload reports for the same month."
      : "Not enough dated data to compare yet.";
    el.innerHTML='<div class="src-badge">○ Needs both production and demand data. '+msg+'</div>';
    return;
  }
  const q=((document.getElementById("pvdSearch")||{}).value||"").toLowerCase().trim();
  let rows=r.rows; if(q) rows=rows.filter(x=>x.name.toLowerCase().indexOf(q)>=0);
  const nf=n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:0});
  const col={under:"var(--red)",over:"var(--amber)",ok:"var(--green)",nopack:"var(--text-mut)",nodemand:"var(--text-mut)"};
  const lbl={under:"Under",over:"Over",ok:"On target",nopack:"Pack-size needed",nodemand:"No orders"};
  const compared=r.rows.filter(x=>x.cover!=null);
  const under=compared.filter(x=>x.status==="under").length, over=compared.filter(x=>x.status==="over").length;
  let h='<div class="src-badge live">● production vs demand · '+r.monthLabel+' ('+r.winFrom+' → '+r.winTo+')</div>';
  // month picker — choose any month that has data, independent of the dashboard period
  if(r.monthsAvail && r.monthsAvail.length){
    const mName=ym=>{ const [y,m]=ym.split("-").map(Number); return new Date(y,m-1,1).toLocaleDateString(undefined,{month:"short",year:"numeric"}); };
    h+='<div style="margin:6px 0 2px;font-size:12px;color:var(--text-mut)">Month: <select id="pvdMonthSel" style="font-size:12px;padding:5px 10px;border-radius:14px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.7);outline:none;cursor:pointer">'
      + r.monthsAvail.map(ym=>'<option value="'+ym+'"'+(ym===r.targetYM?' selected':'')+'>'+mName(ym)+'</option>').join('')
      + '</select></div>';
  }
  h+='<div style="font-size:11px;color:var(--text-mut);margin:2px 0 8px;">For each CK product: units produced vs units ordered by outlets, within the month, over the dates both reports cover. Demand converted to the production unit using pack-size. Coverage = produced as a % of demand (100% = exact match).</div>';
  // window warning
  if(r.truncated){
    h+='<div style="background:#fff4e5;border:1px solid #f0c48a;color:#8a5a00;border-radius:8px;padding:8px 11px;margin:6px 0 10px;font-size:12px;line-height:1.5">'
      +'⚠️ Production data for '+r.monthLabel+' only runs to <b>'+r.winTo+'</b> (month ends '+r.monthEnd+'). '
      +'To keep both sides fair, demand is also measured only to <b>'+r.winTo+'</b>, so this is a partial-month view. '
      +'Re-export the Job Production report for the full month for a complete picture.</div>';
  }
  h+='<div style="display:flex;gap:22px;flex-wrap:wrap;margin:0 0 12px;">';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Products compared</p><p style="font-size:21px;font-weight:700;margin:0">'+compared.length+'</p></div>';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Under-produced</p><p style="font-size:21px;font-weight:700;margin:0;color:'+(under?"var(--red)":"var(--green)")+'">'+under+'</p></div>';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Over-produced</p><p style="font-size:21px;font-weight:700;margin:0;color:'+(over?"var(--amber)":"var(--green)")+'">'+over+'</p></div>';
  h+='</div>';
  if(q) h+='<div style="font-size:11px;color:var(--text-mut);margin:-4px 0 8px;">Filter: “'+q+'” · '+rows.length+' product(s)</div>';
  if(!rows.length){ h+='<div class="empty">No match</div>'; el.innerHTML=h; return; }
  // table
  h+='<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">';
  h+='<tr style="text-align:left;color:var(--text-mut);font-size:10.5px;text-transform:uppercase;letter-spacing:.03em">'
    +'<th style="padding:6px 8px 6px 0">Product</th><th style="padding:6px 8px;text-align:right">Produced</th>'
    +'<th style="padding:6px 8px;text-align:right">Demand (ordered)</th><th style="padding:6px 8px;text-align:right">Demand (in prod. unit)</th>'
    +'<th style="padding:6px 8px;text-align:right">Coverage</th><th style="padding:6px 0 6px 8px;text-align:right">Status</th></tr>';
  rows.forEach(x=>{
    const c=col[x.status]; const u=(x.prodUnit||"").toLowerCase();
    h+='<tr style="border-top:1px solid var(--glass-border)">'
      +'<td style="padding:7px 8px 7px 0">'+x.name+'</td>'
      +'<td style="padding:7px 8px;text-align:right;font-weight:600">'+nf(x.prodQty)+' '+u+'<br><span style="font-size:10px;color:var(--text-mut);font-weight:400">'+x.jobs+' jobs</span></td>'
      +'<td style="padding:7px 8px;text-align:right">'+(x.demRaw||"—")+'</td>'
      +'<td style="padding:7px 8px;text-align:right">'+(x.demConv!=null?nf(x.demConv)+' '+u:"—")+'</td>'
      +'<td style="padding:7px 8px;text-align:right;font-weight:700;color:'+c+'">'+(x.cover!=null?Math.round(x.cover)+"%":"—")+'</td>'
      +'<td style="padding:7px 0 7px 8px;text-align:right"><span style="font-size:10.5px;color:'+c+';font-weight:600">'+lbl[x.status]+'</span></td>'
      +'</tr>';
  });
  h+='</table></div>';
  h+='<div style="font-size:10.5px;color:var(--text-mut);margin-top:8px;line-height:1.5">On target = 80–120% · Under = below 80% (may run short) · Over = above 120% (possible excess). '
    +'Low-volume items made in big batches can read very high over a short window — a full month evens this out.</div>';
  el.innerHTML=h;
}
function pvdExportCSV(){
  const r=pvdCompute();
  if(r.err){ alert("Need both production and demand data to export."); return; }
  const rows=r.rows.map(x=>[x.name,Math.round(x.prodQty),(x.prodUnit||""),x.demRaw,(x.demConv!=null?Math.round(x.demConv):""),(x.cover!=null?Math.round(x.cover)+"%":""),x.status]);
  downloadCSV("production_vs_demand.csv",["Product","Produced","ProdUnit","DemandOrdered","DemandInProdUnit","Coverage","Status"],rows);
}

// ---- PKT (USFOOD warehouse) — real WMS dispatches, MY/SG separate ----
let PKTRAW=null, pktRegion="MY", pktLogPage=0; const PKT_LOG_PAGE=50;
function pktLogPrev(){ if(pktLogPage>0){ pktLogPage--; renderPKT(); } }
function pktLogNext(){ pktLogPage++; renderPKT(); }
function pktExportCSV(){ if(!PKTRAW||!PKTRAW.mvt||!PKTRAW.mvt.length){ alert("No PKT data to export."); return; }
  const b=window.PKT.build(PKTRAW,{region:pktRegion});
  const pq=((document.getElementById("pktSearch")||{}).value||"").toLowerCase().trim();
  let rows=b.log; if(pq) rows=rows.filter(l=>((l.outlet||"")+" "+(l.desc||"")+" "+(l.doc||"")).toLowerCase().indexOf(pq)>=0);
  downloadCSV("pkt_dispatch_"+pktRegion+".csv",["Date","Outlet","SKU","Item","UOM","Qty_Out","DO","Temp"],
    rows.map(l=>[l.date,l.outlet,l.sku,l.desc,l.uom,l.out,l.doc,l.temp])); }
window.PKT_SUMMARY=null;
function refreshPKTSummary(){
  if(PKTRAW && PKTRAW.mvt && PKTRAW.mvt.length && window.PKT){
    window.PKT_SUMMARY={ MY:window.PKT.build(PKTRAW,{region:"MY"}), SG:window.PKT.build(PKTRAW,{region:"SG"}) };
    window.__pktPending=false;
  } else { window.PKT_SUMMARY=null; window.__pktPending=true; }
}
function renderPKT(){
  const el=document.getElementById("logList"); if(!el) return;
  if(!PKTRAW || !PKTRAW.mvt || !PKTRAW.mvt.length){
    el.innerHTML='<div class="src-badge">○ PKT data not loaded yet — upload the USFOOD daily files (frozen + ambient, movement + balance).</div>';
    return;
  }
  const b=window.PKT.build(PKTRAW,{region:pktRegion});
  const rm=n=>Number(n||0).toLocaleString();
  const dspan = b.dateFrom===b.dateTo ? (b.dateFrom||"") : ((b.dateFrom||"")+" → "+(b.dateTo||""));
  let h='<div class="src-badge live">● live from PKT WMS · dispatched '+dspan+'</div>';
  h+='<div style="display:flex;gap:22px;flex-wrap:wrap;margin:6px 0 12px;">';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Dispatched ('+pktRegion+')</p><p style="font-size:21px;font-weight:700;margin:0">'+rm(b.totalOut)+'</p></div>';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">Outlets</p><p style="font-size:21px;font-weight:700;margin:0">'+b.outletCount+'</p></div>';
  h+='<div><p style="font-size:11px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin:0">SKUs</p><p style="font-size:21px;font-weight:700;margin:0">'+b.skuCount+'</p></div>';
  h+='</div>';
  h+='<div class="grid2">';
  h+='<div><div style="font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin-bottom:6px">Top outlets ('+pktRegion+') — units dispatched</div>';
  h+=hbars(b.outlets.slice(0,8).map(o=>({label:o.outlet,value:o.out})),{fmt:rm});
  h+='</div>';
  h+='<div><div style="font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em;margin-bottom:4px">Warehouse stock on-hand <span style="text-transform:none">(shared MY+SG)</span></div>';
  h+='<div class="line"><span>❄️ Frozen available</span><span style="font-weight:600">'+rm(b.stock.frozen.avail)+' <span style="color:var(--text-mut);font-weight:400">('+b.stock.frozen.skus+' SKU)</span></span></div>';
  h+='<div class="line"><span>🌡️ Ambient available</span><span style="font-weight:600">'+rm(b.stock.ambient.avail)+' <span style="color:var(--text-mut);font-weight:400">('+b.stock.ambient.skus+' SKU)</span></span></div>';
  if(b.low && b.low.length){ h+='<div style="margin-top:8px;font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em">Low stock (≤5)</div>';
    b.low.slice(0,5).forEach(x=>{ h+='<div class="line"><span style="max-width:66%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+x.desc+'</span><span style="color:var(--red);font-weight:600">'+rm(x.avail)+' '+(x.uom||"").toLowerCase()+'</span></div>'; }); }
  h+='</div></div>';
  const pq=((document.getElementById("pktSearch")||{}).value||"").toLowerCase().trim();
  let logAll=b.log;
  if(pq) logAll=b.log.filter(l=>((l.outlet||"")+" "+(l.desc||"")+" "+(l.doc||"")).toLowerCase().indexOf(pq)>=0);
  const total=logAll.length; const pages=Math.max(1,Math.ceil(total/PKT_LOG_PAGE));
  if(pktLogPage>=pages) pktLogPage=pages-1; if(pktLogPage<0) pktLogPage=0;
  const start=pktLogPage*PKT_LOG_PAGE; const pageRows=logAll.slice(start,start+PKT_LOG_PAGE);
  h+='<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:12px 0 6px;">';
  h+='<span style="font-size:10.5px;color:var(--text-mut);text-transform:uppercase;letter-spacing:.03em">Dispatch log ('+pktRegion+') · '+total+' line(s)'+(pq?' · filter “'+pq+'”':'')+'</span>';
  h+='<span style="display:flex;align-items:center;gap:8px;font-size:12px;">'+
     '<button data-pkt="prev" class="nav-btn" style="cursor:pointer;padding:3px 11px;'+(pktLogPage<=0?'opacity:.35;pointer-events:none;':'')+'">◀ Prev</button>'+
     '<span style="color:var(--text-soft);white-space:nowrap">'+(total?(start+1):0)+'–'+Math.min(start+PKT_LOG_PAGE,total)+' / '+total+'</span>'+
     '<button data-pkt="next" class="nav-btn" style="cursor:pointer;padding:3px 11px;'+(pktLogPage>=pages-1?'opacity:.35;pointer-events:none;':'')+'">Next ▶</button>'+
     '</span></div>';
  h+='<div class="tblwrap" style="max-height:340px;border:1px solid var(--glass-border);border-radius:10px;">';
  h+='<table style="width:100%;border-collapse:collapse;font-size:12px;min-width:460px"><thead><tr>'+
     '<th style="text-align:left;padding:6px 8px;position:sticky;top:0;background:var(--card-bg,#fff)">Date</th>'+
     '<th style="text-align:left;padding:6px 8px;position:sticky;top:0;background:var(--card-bg,#fff)">Outlet</th>'+
     '<th style="text-align:left;padding:6px 8px;position:sticky;top:0;background:var(--card-bg,#fff)">Item</th>'+
     '<th style="text-align:right;padding:6px 8px;position:sticky;top:0;background:var(--card-bg,#fff)">Qty</th>'+
     '<th style="text-align:left;padding:6px 8px;position:sticky;top:0;background:var(--card-bg,#fff)">DO</th></tr></thead><tbody>';
  pageRows.forEach(l=>{ h+='<tr>'+
    '<td style="padding:4px 8px;border-top:1px solid var(--glass-border)">'+(l.date||"")+'</td>'+
    '<td style="padding:4px 8px;border-top:1px solid var(--glass-border)">'+l.outlet+'</td>'+
    '<td style="padding:4px 8px;border-top:1px solid var(--glass-border);max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+l.desc+'</td>'+
    '<td style="padding:4px 8px;border-top:1px solid var(--glass-border);text-align:right">'+rm(l.out)+'</td>'+
    '<td style="padding:4px 8px;border-top:1px solid var(--glass-border);color:var(--text-mut)">'+l.doc+'</td></tr>'; });
  if(!pageRows.length) h+='<tr><td colspan="5" style="padding:10px;text-align:center;color:var(--text-mut)">No dispatches</td></tr>';
  h+='</tbody></table></div>';
  el.innerHTML=h;
}
function applyData(out){
  const A=window.CK.CKPipeline.mapAgents(out);
  liveYield=A.liveYield; liveProd=A.liveProd; liveOrder=A.liveOrder; liveLog=null;
  try{
    // Align the variance comparison to the window both data sources actually cover.
    // (e.g. if raw consumption runs to 19 Sep but job production only to 9 Sep,
    //  comparing all consumption vs 9 days of production makes everything look ~2x over.)
    let rvOut = out; window.__VARWIN__ = null;
    try{
      const m = out.meta || {};
      if (RAW && m.cons_from && m.cons_to && m.job_from && m.job_to) {
        const cf=new Date(m.cons_from), ct=new Date(m.cons_to), jf=new Date(m.job_from), jt=new Date(m.job_to);
        const from = cf>jf?cf:jf, to = ct<jt?ct:jt;
        if (from<=to && (m.cons_to!==m.job_to || m.cons_from!==m.job_from)) {
          rvOut = window.CK.CKPipeline.build(RAW, {from:from, to:to});
          window.__VARWIN__ = { from: m.cons_from<m.job_from?m.job_from:m.cons_from,
                                to: m.cons_to<m.job_to?m.cons_to:m.job_to,
                                cons_to:m.cons_to, job_to:m.job_to };
        }
      }
    }catch(we){ console.warn("variance window align failed", we); rvOut = out; }
    const rv=window.CK.CKPipeline.recipeVariance(rvOut, (window.__RECIPES__&&window.__RECIPES__.recipes)||[], window.__RECMAP__||[]);
    window.__RVMAP__={}; rv.forEach(function(r){ window.__RVMAP__[nkeyJS(r.material)]=r.variance_pct; });
    liveAlerts = rv.map(function(r){ var av=Math.abs(r.variance_pct);
      var sev = av>=15?"high":av>=8?"medium":"low";
      var cause = r.variance_pct>0 ? (av>=15?"over-usage vs recipe":"slightly over recipe") : "within / under recipe";
      return { material:r.material, cause:cause, severity:sev,
        note:"recipe "+r.expected_kg+"kg vs actual "+r.actual_kg+"kg ("+(r.variance_pct>0?"+":"")+r.variance_pct+"%)",
        route_to: sev==="high"?"Review / Audit":(sev==="medium"?"Training":"-") }; });
    if(!liveAlerts.length) liveAlerts=A.liveAlerts;
  }catch(e){ console.warn("recipe variance failed",e); liveAlerts=A.liveAlerts; }
  if(A.weekly && A.weekly.days && A.weekly.days.length){ WEEKLY=A.weekly; weeklyLive=true; }
  window.__OUT__=out;
  if(typeof setLoadState==="function") setLoadState("");
  render(); drawTrend(trendMetric); animateMetrics(); renderCost(out); renderWastage(out); renderMoM(); renderDetails(); renderPVD();
  const m=out.meta||{};
  const tb=document.getElementById("trendBadge"); if(tb) tb.innerHTML="● live · weekly from job production";
  renderDataInfo();
  const st=document.querySelector(".subtitle"); if(st) st.textContent="Malaysia · live from ERP exports";
  return m;
}
// ---- DETAILS (full material table) ----
function nkeyJS(s){ return String(s).toLowerCase().replace(/[^a-z0-9]/g,""); }
let detSort={key:"value",dir:-1};
function renderDetails(){
  const fmt=n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:0});
  const out=window.__OUT__; const tb=document.querySelector("#detTable tbody"); if(!tb) return;
  if(!out){ tb.innerHTML='<tr><td colspan="7" class="empty">No data yet — upload files</td></tr>'; return; }
  const rvmap=window.__RVMAP__||{};
  let rows=(out.items||[]).filter(i=>i.storage==="CK KL RAW MATERIAL").map(i=>({
    name:i.name, uom:i.uom||"", received:i.received||0, consumed:i.production_used||0,
    stock:(i.actual_closing!=null?i.actual_closing:i.computed_closing)||0,
    value:i.consumed_value||0, varpct: (rvmap[nkeyJS(i.name)]!=null?rvmap[nkeyJS(i.name)]:null) }));
  const q=(document.getElementById("detSearch").value||"").toLowerCase();
  if(q) rows=rows.filter(r=>r.name.toLowerCase().indexOf(q)>=0);
  const k=detSort.key, d=detSort.dir;
  rows.sort((a,b)=>{ let x=a[k],y=b[k]; if(k==="name"||k==="uom"){ return d*String(x).localeCompare(String(y)); } x=(x==null?-1e15:x); y=(y==null?-1e15:y); return d*(x-y); });
  document.getElementById("detCount").textContent=rows.length+" materials";
  tb.innerHTML = rows.length ? rows.map(r=>{
    const vc = r.varpct==null?"":(Math.abs(r.varpct)>=15?' style="color:var(--red);font-weight:600"':(Math.abs(r.varpct)>=8?' style="color:var(--amber)"':''));
    const vtxt = r.varpct==null?"–":((r.varpct>0?"+":"")+r.varpct+"%");
    return "<tr><td>"+r.name+"</td><td>"+r.uom+"</td>"+
      '<td class="num">'+fmt(r.received)+'</td><td class="num">'+fmt(r.consumed)+'</td>'+
      '<td class="num">'+fmt(r.stock)+'</td><td class="num">'+fmt(r.value)+'</td>'+
      '<td class="num"'+vc+">"+vtxt+"</td></tr>"; }).join("") : '<tr><td colspan="7" class="empty">No match</td></tr>';
  window.__DETROWS__=rows;
}
(function(){
  const s=document.getElementById("detSearch"); if(s) s.addEventListener("input", renderDetails);
  const heads=["name","uom","received","consumed","stock","value","varpct"];
  const ths=document.querySelectorAll("#detTable thead th");
  ths.forEach((th,idx)=>{ th.style.cursor="pointer"; th.addEventListener("click",()=>{ const k=heads[idx]; if(detSort.key===k) detSort.dir*=-1; else detSort={key:k,dir:(k==="name"||k==="uom")?1:-1}; renderDetails(); }); });
  const ex=document.getElementById("detExport");
  if(ex) ex.addEventListener("click",()=>{
    const rows=window.__DETROWS__||[]; if(!rows.length) return;
    const head=["Material","UOM","Received","Consumed","Stock","Value_RM","Recipe_Var_%"];
    const csv=[head.join(",")].concat(rows.map(r=>['"'+r.name.replace(/"/g,'""')+'"',r.uom,r.received,r.consumed,r.stock,r.value,(r.varpct==null?"":r.varpct)].join(","))).join("\n");
    const blob=new Blob([csv],{type:"text/csv"}); const a=document.createElement("a");
    a.href=URL.createObjectURL(blob); a.download="central_kitchen_materials.csv"; a.click(); URL.revokeObjectURL(a.href);
  });
})();
// ---- PERIOD / DATE-RANGE ----
let CURRENT_RANGE=null, FULL_MAX=null;
function fmtD(d){ try{ return d? (d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")):""; }catch(e){ return ""; } }
function monthRange(d){ return {from:new Date(d.getFullYear(),d.getMonth(),1), to:d}; }
function weekRange(d){ const to=new Date(d), from=new Date(d); from.setDate(from.getDate()-6); return {from,to}; }
function setActivePeriod(p){ document.querySelectorAll("#periodToggle button").forEach(b=>b.classList.toggle("active", b.dataset.period===p)); }
function syncDateInputs(){ const f=document.getElementById("dFrom"), t=document.getElementById("dTo"); if(f&&CURRENT_RANGE) f.value=fmtD(CURRENT_RANGE.from); if(t&&CURRENT_RANGE) t.value=fmtD(CURRENT_RANGE.to); }
function updatePeriodLabel(){ const el=document.getElementById("periodLabel"); if(!el) return; el.textContent = CURRENT_RANGE ? ("Showing "+fmtD(CURRENT_RANGE.from)+"  →  "+fmtD(CURRENT_RANGE.to)) : "Showing all data"; }
function setDefaultRange(){ const full=window.CK.CKPipeline.build(RAW); FULL_MAX = full.meta.date_to ? new Date(full.meta.date_to+"T00:00:00") : new Date(); CURRENT_RANGE = monthRange(FULL_MAX); setActivePeriod("month"); syncDateInputs(); }
function rebuild(){ if(!RAW) return null; const out=window.CK.CKPipeline.build(RAW, CURRENT_RANGE); applyData(out); updatePeriodLabel(); return out; }

function isSupportedSpreadsheet(file){
  const n=(file&&file.name||"").toLowerCase();
  return n.endsWith(".xlsx")||n.endsWith(".xls")||n.endsWith(".xlsm")||n.endsWith(".csv");
}
async function ckReadFile(file){
  const buf=await file.arrayBuffer();
  if(!buf||buf.byteLength===0) throw new Error("file is empty (0 bytes)");
  let wb;
  try{ wb=XLSX.read(buf,{type:"array"}); }
  catch(e){ throw new Error("could not be read as a spreadsheet — it may be corrupted, password-protected, or not actually an Excel file"); }
  if(!wb.SheetNames||!wb.SheetNames.length) throw new Error("has no sheets");
  return { name:file.name, sheets: wb.SheetNames.map(sn=>({title:sn, rows:XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,raw:true,defval:null})})) };
}
async function ckProcessUploaded(list){
  const status=document.getElementById("ckStatus");
  list=Array.from(list||[]);
  if(!list.length){ status.textContent="Please choose the ERP Excel files first."; return; }
  status.textContent="Reading "+list.length+" file(s)…";
  const skipped=[];
  try{
    const ckFiles=[], pktFiles=[], demFiles=[], jpcFiles=[];
    for(const f of list){
      if(!isSupportedSpreadsheet(f)){ skipped.push(f.name+" — not a supported spreadsheet file (.xlsx/.xls/.csv)"); continue; }
      let rf;
      try{ rf=await ckReadFile(f); }
      catch(e){ skipped.push(f.name+" — "+(e&&e.message||"could not be read")); continue; }
      if(window.DEM && window.DEM.isDEM([rf])) demFiles.push(rf);
      else if(window.JPC && window.JPC.isJPC([rf])) jpcFiles.push(rf);
      else if(window.PKT && window.PKT.isPKT([rf])) pktFiles.push(rf);
      else ckFiles.push(rf);
    }
    const parts=[]; const nowIso=new Date().toISOString();

    // ---- CK (kitchen) files ----
    if(ckFiles.length){
      const newRaw=window.CK.CKPipeline.parseFiles(ckFiles);
      RAW = RAW ? window.CK.CKPipeline.mergeRaw(RAW, newRaw) : newRaw;
      setDefaultRange(); rebuild();
      const m=window.CK.CKPipeline.build(RAW).meta;
      parts.push("CK: "+(m.unique_rows||0).toLocaleString()+" movements · "+m.item_count+" items · "+m.date_from+" → "+m.date_to+" · verified "+m.validation_match_pct+"%");
      auditLog("upload","CK Stock Movement · "+m.date_from+"→"+m.date_to);
      if(SB){
        const pl=slimRaw(RAW); pl.__uploadedBy=CURRENT_USER||""; pl.__uploadedAt=nowIso;
        noteUpload(pl.__uploadedBy, pl.__uploadedAt);
        const {error}=await SB.from("ck_state").upsert({id:"latest",payload:pl,updated_at:nowIso});
        if(!error){ rebuild(); } else parts.push("⚠ CK save failed: "+error.message);
      }
    }

    // ---- PKT (USFOOD warehouse) files ----
    if(pktFiles.length){
      const newP=window.PKT.parseFiles(pktFiles);
      PKTRAW = PKTRAW ? window.PKT.mergeRaw(PKTRAW, newP) : newP;
      refreshPKTSummary(); renderPKT(); if(typeof render==="function") render();
      const my=window.PKT_SUMMARY&&window.PKT_SUMMARY.MY, sg=window.PKT_SUMMARY&&window.PKT_SUMMARY.SG;
      parts.push("PKT: MY "+(my?my.totalOut:0)+" units/"+(my?my.outletCount:0)+" outlets · SG "+(sg?sg.totalOut:0)+" · dates "+(my?my.dateFrom:"")+"→"+(my?my.dateTo:""));
      auditLog("upload","PKT dispatch · "+(my?my.dateFrom:"")+"→"+(my?my.dateTo:""));
      if(SB){
        PKTRAW.__uploadedBy=CURRENT_USER||""; PKTRAW.__uploadedAt=nowIso;
        noteUpload(PKTRAW.__uploadedBy, PKTRAW.__uploadedAt); renderDataInfo();
        const {error}=await SB.from("ck_state").upsert({id:"pkt",payload:PKTRAW,updated_at:nowIso});
        if(error) parts.push("⚠ PKT save failed: "+error.message);
      }
    }

    // ---- DEMAND (Sales Order) files ----
    if(demFiles.length){
      const newD=window.DEM.parseFiles(demFiles);
      // merge with existing raw lines only if this session has them; a fresh session
      // loads a stored aggregate (no lines), so a new upload replaces it (full-range snapshot)
      DEMRAW = (DEMRAW && DEMRAW.lines) ? window.DEM.mergeRaw(DEMRAW, newD) : newD;
      renderDemand(); renderPVD(); if(typeof render==="function") render();
      const db=window.DEM.build(DEMRAW);
      parts.push("Demand: "+db.lineCount+" lines · "+db.byOutlet.length+" outlets · RM "+Math.round(db.totalValue).toLocaleString()+" · "+db.dateFrom+"→"+db.dateTo);
      auditLog("upload","Sales Order / demand · "+db.dateFrom+"→"+db.dateTo);
      if(SB){
        // store only the aggregated view (small) — raw 37k+ lines time out the DB write.
        // ckDaily = compact per-CK-product daily demand, so Production-vs-Demand survives a reload.
        db.ckDaily = pvdBuildDaily(DEMRAW.lines);
        const demStore={ agg:db, __agg:true, __uploadedBy:CURRENT_USER||"", __uploadedAt:nowIso };
        noteUpload(demStore.__uploadedBy, demStore.__uploadedAt); renderDataInfo();
        const {error}=await SB.from("ck_state").upsert({id:"demand",payload:demStore,updated_at:nowIso});
        if(error) parts.push("⚠ Demand save failed: "+error.message);
      }
    }

    // ---- JPC (Job Production Material Costing) files ----
    if(jpcFiles.length){
      const newJ=window.JPC.parseFiles(jpcFiles);
      JPCRAW = JPCRAW ? window.JPC.mergeRaw(JPCRAW, newJ) : newJ;
      renderJPC(); renderPVD();
      const jb=window.JPC.build(JPCRAW);
      parts.push("Job Costing: "+jb.jobCount+" jobs · "+jb.productCount+" products · RM "+Math.round(jb.totalCost).toLocaleString()+" · "+jb.alerts.length+" flagged · "+jb.dateFrom+"→"+jb.dateTo);
      auditLog("upload","Job Production Costing · "+jb.dateFrom+"→"+jb.dateTo);
      if(SB){
        JPCRAW.__uploadedBy=CURRENT_USER||""; JPCRAW.__uploadedAt=nowIso;
        noteUpload(JPCRAW.__uploadedBy, JPCRAW.__uploadedAt); renderDataInfo();
        const {error}=await SB.from("ck_state").upsert({id:"jobcost",payload:JPCRAW,updated_at:nowIso});
        if(error) parts.push("⚠ Job Costing save failed: "+error.message);
      }
    }

    const skipHtml = skipped.length ? '<div style="color:var(--amber);margin-top:6px;">⚠ Skipped '+skipped.length+' file(s):<br>'+skipped.map(s=>"• "+s).join("<br>")+'</div>' : "";
    if(!ckFiles.length && !pktFiles.length && !demFiles.length && !jpcFiles.length){
      status.innerHTML='<span style="color:var(--amber)">No recognised ERP / PKT / Sales Order / Job Costing files in that selection.</span>'+skipHtml;
      return;
    }
    // colour each part by outcome: a failure/warning shows RED so it can't be mistaken for success
    const isFail = p => /fail|⚠|error|timeout/i.test(p);
    const anyFail = parts.some(isFail) || skipped.length > 0;
    const body = parts.map(p => isFail(p)
      ? '<span style="color:var(--red);font-weight:600">'+p+'</span>'
      : '<span style="color:var(--green)">'+p+'</span>').join('<span style="color:var(--text-mut)"> &nbsp;|&nbsp; </span>');
    if(anyFail){
      // do NOT claim "saved" when something failed
      const note = SB ? '' : '<span style="color:var(--amber)"> · (Supabase not connected)</span>';
      status.innerHTML='<div style="color:var(--red);font-weight:700;margin-bottom:4px">⚠ Completed with problems — check the red items below:</div>'+body+note+skipHtml;
    } else {
      const saved = SB ? '<span style="color:var(--green)"> · saved & shared ✓</span>' : '<span style="color:var(--amber)"> · (Supabase not connected)</span>';
      status.innerHTML='<span style="color:var(--green);font-weight:600">✓ </span>'+body+saved+skipHtml;
    }
  }catch(err){ status.innerHTML='<span style="color:var(--red);font-weight:700">✕ Error: '+(err&&err.message||err)+'</span>'+(skipped.length?'<div style="color:var(--amber);margin-top:6px;">⚠ Also skipped: '+skipped.join("; ")+'</div>':""); console.error(err); }
}
(function(){ const bs=document.getElementById("btnSummary"); if(bs) bs.addEventListener("click", openSummary); })();
(function(){ const t=document.getElementById("pktRegionToggle"); if(t) t.addEventListener("click",function(e){ const r=e.target.dataset.reg; if(!r)return; pktRegion=r; pktLogPage=0; t.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.reg===r)); renderPKT(); }); })();
(function(){
  const ps=document.getElementById("pktSearch"); if(ps) ps.addEventListener("input",function(){ pktLogPage=0; renderPKT(); });
  const pe=document.getElementById("pktExport"); if(pe) pe.addEventListener("click",pktExportCSV);
  const ds=document.getElementById("demSearch"); if(ds) ds.addEventListener("input",renderDemand);
  const de=document.getElementById("demExport"); if(de) de.addEventListener("click",demExportCSV);
  const js=document.getElementById("jpcSearch"); if(js) js.addEventListener("input",renderJPC);
  const je=document.getElementById("jpcExport"); if(je) je.addEventListener("click",jpcExportCSV);
  const vs=document.getElementById("pvdSearch"); if(vs) vs.addEventListener("input",renderPVD);
  const ve=document.getElementById("pvdExport"); if(ve) ve.addEventListener("click",pvdExportCSV);
  // delegated handlers (CSP-safe: no inline on* attributes)
  const vl=document.getElementById("pvdList");
  if(vl) vl.addEventListener("change",function(e){ if(e.target && e.target.id==="pvdMonthSel") pvdSetMonth(e.target.value); });
  const pl=document.getElementById("pktList");
  if(pl) pl.addEventListener("click",function(e){ const b=e.target.closest&&e.target.closest("button[data-pkt]"); if(!b)return; if(b.getAttribute("data-pkt")==="prev")pktLogPrev(); else pktLogNext(); });
})();
document.getElementById("ckProcess").addEventListener("click",function(){ ckProcessUploaded(document.getElementById("ckFiles").files); });
document.getElementById("ckFiles").addEventListener("change",function(e){ if(e.target.files.length) ckProcessUploaded(e.target.files); });
document.getElementById("periodToggle").addEventListener("click",function(e){
  const p=e.target.dataset.period; if(!p||!RAW) return;
  setActivePeriod(p);
  if(p==="all") CURRENT_RANGE=null;
  else if(p==="week") CURRENT_RANGE=weekRange(FULL_MAX||new Date());
  else CURRENT_RANGE=monthRange(FULL_MAX||new Date());
  syncDateInputs(); rebuild();
});
document.getElementById("dApply").addEventListener("click",function(){
  const f=document.getElementById("dFrom").value, t=document.getElementById("dTo").value;
  if(!f||!t||!RAW) return;
  CURRENT_RANGE={from:new Date(f+"T00:00:00"), to:new Date(t+"T23:59:59")};
  setActivePeriod(""); rebuild();
});
async function loadFromSupabase(){
  if(!SB) return false;
  try{
    const {data,error}=await SB.from("ck_state").select("payload").eq("id","latest").maybeSingle();
    if(error) throw error;
    if(data && data.payload && data.payload.movements){
      RAW=data.payload;
      if(RAW.__uploadedAt) noteUpload(RAW.__uploadedBy||"", RAW.__uploadedAt);
      setDefaultRange(); rebuild();
      const full=window.CK.CKPipeline.build(RAW).meta;
      const s=document.getElementById("ckStatus"); if(s) s.innerHTML='<span style="color:var(--green)">✓ Loaded shared data · '+full.date_from+' → '+full.date_to+'. Upload more files to add to it.</span>';
      return true;
    }
  }catch(e){ console.warn("supabase load failed",e); }
  return false;
}
async function loadPKTFromSupabase(){
  if(!SB) return false;
  try{
    const {data,error}=await SB.from("ck_state").select("payload").eq("id","pkt").maybeSingle();
    if(error) throw error;
    if(data && data.payload && data.payload.mvt){
      PKTRAW=data.payload; refreshPKTSummary(); renderPKT(); if(typeof render==="function") render();
      if(PKTRAW.__uploadedAt) noteUpload(PKTRAW.__uploadedBy||"", PKTRAW.__uploadedAt);
      renderDataInfo();
      return true;
    }
  }catch(e){ console.warn("pkt load failed",e); }
  return false;
}
async function loadDemandFromSupabase(){
  if(!SB) return false;
  try{
    const {data,error}=await SB.from("ck_state").select("payload").eq("id","demand").maybeSingle();
    if(error) throw error;
    if(data && data.payload && (data.payload.agg || data.payload.lines)){
      DEMRAW=data.payload; renderDemand(); renderPVD(); if(typeof render==="function") render();
      if(DEMRAW.__uploadedAt) noteUpload(DEMRAW.__uploadedBy||"", DEMRAW.__uploadedAt);
      renderDataInfo();
      return true;
    }
  }catch(e){ console.warn("demand load failed",e); }
  return false;
}
async function loadJPCFromSupabase(){
  if(!SB) return false;
  try{
    const {data,error}=await SB.from("ck_state").select("payload").eq("id","jobcost").maybeSingle();
    if(error) throw error;
    if(data && data.payload && data.payload.jobs){
      JPCRAW=data.payload; renderJPC(); renderPVD();
      if(JPCRAW.__uploadedAt) noteUpload(JPCRAW.__uploadedBy||"", JPCRAW.__uploadedAt);
      renderDataInfo();
      return true;
    }
  }catch(e){ console.warn("job-costing load failed",e); }
  return false;
}
let __inited=false;
function setLoadState(msg){ const el=document.getElementById("loadState"); if(!el) return; if(msg){ el.textContent=msg; el.style.display=""; } else { el.style.display="none"; } }
async function initApp(){
  if(__inited) return; __inited=true;
  setLoadState("Loading data…");                 // show while Supabase loads (no fake sample)
  const ok=await loadFromSupabase();
  const okp=await loadPKTFromSupabase();
  const okd=await loadDemandFromSupabase();
  const okj=await loadJPCFromSupabase();
  renderJPC();  // show empty-state message if no job-costing data yet
  renderPVD();  // production-vs-demand (shows its own empty state until both datasets exist)
  renderPendingResets(); // maker-checker reset panel
  if(ok||okp||okd||okj){ setLoadState(""); }
  else { setLoadState("No data loaded yet — upload the ERP / PKT / Sales Order / Job Costing files below to populate the dashboard."); }
}
function showApp(){ document.getElementById("loginOverlay").style.display="none"; const w=document.querySelector(".wrap"); if(w) w.style.display=""; initApp(); }
function showLogin(){ document.getElementById("loginOverlay").style.display="flex"; const w=document.querySelector(".wrap"); if(w) w.style.display="none"; }

// ---- 30-DAY RE-VERIFICATION (OTP) ----
function showOtp(){ document.getElementById("loginOverlay").style.display="none"; var o=document.getElementById("otpOverlay"); if(o) o.style.display="flex"; const w=document.querySelector(".wrap"); if(w) w.style.display="none"; }
function hideOtp(){ var o=document.getElementById("otpOverlay"); if(o) o.style.display="none"; }
async function otpSend(){
  var info=document.getElementById("otpInfo"), err=document.getElementById("otpErr");
  if(err) err.textContent="";
  if(info){ info.style.color="var(--text-soft)"; info.textContent="Sending a verification code to "+CURRENT_EMAIL+"…"; }
  if(!SB){ return; }
  try{
    const {error}=await SB.auth.signInWithOtp({ email: CURRENT_EMAIL, options:{ shouldCreateUser:false } });
    if(error){ if(info) info.textContent=""; if(err){ err.style.color="var(--red)"; err.textContent=error.message; } }
    else if(info){ info.textContent="We emailed a verification code to "+CURRENT_EMAIL+". Enter it below to continue."; }
  }catch(e){ if(err){ err.style.color="var(--red)"; err.textContent=String(e); } }
}
// decide: straight into the app, or force re-verification first
async function gateThenShowApp(){
  if(!SB){ showApp(); resetIdle(); return; }
  var need=false;
  try{ const {data}=await SB.rpc("needs_reverify"); need=!!data; }catch(e){ need=false; }
  if(!need){ showApp(); resetIdle(); return; }
  showOtp(); otpSend();
}
const _otf=document.getElementById("otpForm");
if(_otf) _otf.addEventListener("submit", async function(e){
  e.preventDefault();
  var code=((document.getElementById("otpCode")||{}).value||"").trim();
  var err=document.getElementById("otpErr");
  if(!code){ if(err){ err.style.color="var(--red)"; err.textContent="Enter the code."; } return; }
  if(err){ err.style.color="var(--text-soft)"; err.textContent="Verifying…"; }
  try{
    const {data,error}=await SB.auth.verifyOtp({ email: CURRENT_EMAIL, token: code, type:"email" });
    if(error){ if(err){ err.style.color="var(--red)"; err.textContent=error.message; } return; }
    if(data&&data.user){ CURRENT_USER=userLabel(data.user)||CURRENT_USER; CURRENT_EMAIL=data.user.email||CURRENT_EMAIL; }
    try{ await SB.rpc("mark_verified"); }catch(e){}
    hideOtp(); showApp(); resetIdle();
  }catch(e){ if(err){ err.style.color="var(--red)"; err.textContent=String(e); } }
});
const _otr=document.getElementById("otpResend");
if(_otr) _otr.addEventListener("click", function(){ otpSend(); });

const _lf=document.getElementById("loginForm");
if(_lf) _lf.addEventListener("submit", async function(e){
  e.preventDefault();
  const em=document.getElementById("loginEmail").value.trim();
  const pw=document.getElementById("loginPass").value;
  const err=document.getElementById("loginErr"); err.style.color="var(--text-soft)"; err.textContent="Signing in\u2026";
  if(!SB){ err.style.color="var(--red)"; err.textContent="Supabase not connected."; return; }
  const {data,error}=await SB.auth.signInWithPassword({email:em,password:pw});
  if(error){ err.style.color="var(--red)"; err.textContent=error.message; }
  else { CURRENT_USER=userLabel(data&&data.user)||em; CURRENT_EMAIL=(data&&data.user&&data.user.email)||em; err.textContent=""; gateThenShowApp(); }
});
async function doSignOut(reason){ try{ if(SB) await SB.auth.signOut(); }catch(e){} location.reload(); }
const _lo=document.getElementById("logoutBtn");
if(_lo) _lo.addEventListener("click", function(){ doSignOut("manual"); });

// ---- AUTO-LOGOUT AFTER 30 MIN IDLE ----
const IDLE_MS=30*60*1000;
let __idleTimer=null;
function markActive(){ try{ localStorage.setItem("ck_lastActive", String(Date.now())); }catch(e){} }
function idleTooLong(){ try{ var la=parseInt(localStorage.getItem("ck_lastActive")||"0",10)||0; return la>0 && (Date.now()-la)>IDLE_MS; }catch(e){ return false; } }
function resetIdle(){
  if(document.getElementById("loginOverlay").style.display!=="none") return; // only when logged in
  markActive();
  clearTimeout(__idleTimer);
  __idleTimer=setTimeout(function(){ doSignOut("idle"); }, IDLE_MS);
}
["click","keydown","mousemove","scroll","touchstart"].forEach(function(ev){ document.addEventListener(ev, resetIdle, {passive:true}); });

(async function(){
  if(!SB){ showApp(); resetIdle(); return; }   // fallback if auth lib missing
  try{ const {data}=await SB.auth.getSession();
    if(data && data.session){
      if(idleTooLong()){ try{ await SB.auth.signOut(); }catch(e){} try{ localStorage.removeItem("ck_lastActive"); }catch(e){} showLogin(); return; }
      CURRENT_USER=userLabel(data.session.user); CURRENT_EMAIL=(data.session.user&&data.session.user.email)||""; gateThenShowApp();
    } else { showLogin(); }
  } catch(e){ showLogin(); }
})();
