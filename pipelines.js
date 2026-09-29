// ===== Central Kitchen Dashboard — data pipelines =====
// CK (kitchen ERP), PKT (USFOOD warehouse), DEM (sales-order demand)

// ---------- CK pipeline ----------
// ============================================================
// Central Kitchen — data pipeline (browser + Node compatible)
// parse -> raw intermediate (mergeable) -> build -> agent outputs
// Accumulate: mergeRaw() lets new uploads ADD to stored data.
// ============================================================
(function (root) {
  const MY_STORAGES = ["CK KL RAW MATERIAL", "PKT WAREHOUSE SHAH ALAM"];

  function classify(remark) {
    if (typeof remark !== "string") return "other";
    const r = remark.toUpperCase();
    if (r.indexOf("STOCK RECEIVED") >= 0 || r.startsWith("(GRN") || r.startsWith("GRN") || r.startsWith("(SRN")) return "received";
    if (r.startsWith("(JOB")) return "production";
    if (r.indexOf("AUTO STOCK OUT") >= 0 || r.startsWith("(DO")) return "dispatch";
    if (r.indexOf("STOCK ADJUSTMENT") >= 0 || r.indexOf("UOM MASTER") >= 0) return "adjustment";
    if (r.startsWith("(WS") || r.indexOf("TRANSFER") >= 0) return "transfer";
    return "other";
  }
  const numf = (v) => (v == null || v === "") ? 0 : (typeof v === "number" ? v : parseFloat(String(v).replace(/,/g, "")) || 0);
  const r1 = n => Math.round(n * 10) / 10;
  function numParse(s){ if(s==null)return{n:null,u:null}; if(typeof s==="number")return{n:s,u:null}; const m=/([\d,\.]+)\s*([A-Za-z]+)?/.exec(String(s).trim()); return m?{n:parseFloat(m[1].replace(/,/g,"")),u:m[2]||null}:{n:null,u:null}; }
  function iso(d){ return d?d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"):null; }
  function dateOf(title){ const m=/as at (\d{2})\/(\d{2})\/(\d{4})/.exec(title||""); return m?new Date(+m[3],+m[2]-1,+m[1]):null; }
  function parseDate(s){ if(!s) return null; const p=String(s).split(" ")[0].split("/"); return p.length===3?new Date(+p[2],+p[1]-1,+p[0]):null; }
  function detect(header, title) {
    const h = (header || []).map(x => String(x || "").trim());
    const has = (s) => h.indexOf(s) >= 0;
    if (has("Movement Date") && has("Item Name") && has("Category")) return "raw_movement";
    if (has("Job No.") && has("Expected Yield")) return "job_variance";
    if (has("Item Name") && has("Reason") && has("Cost")) return "wastage";
    if ((typeof title === "string" && title.indexOf("Stock Balance") >= 0) || (has("Item Code") && has("Storage Name") && has("Quantity"))) return "balance";
    return "unknown";  // semifg / fg movement etc. ignored
  }

  // ---- parse uploaded files into a mergeable raw intermediate ----
  function parseFiles(files) {
    const raw = { mvKeys:{}, movements: [], openings:{}, closings:{}, openTitle:null, closeTitle:null, jobRows:[], jobKeys:{}, wasteRows:[], wasteKeys:{}, costs:{} };
    files.forEach(f => f.sheets.forEach(sh => {
      const rows = sh.rows || [];
      let hi = 0;
      for (let i = 0; i < Math.min(rows.length, 3); i++) {
        const rs = (rows[i] || []).map(x => String(x || ""));
        if (rs.indexOf("Movement Date")>=0 || rs.indexOf("Item Code")>=0 || rs.indexOf("Job No.")>=0) { hi = i; break; }
      }
      const header = rows[hi] || [];
      const title = hi > 0 ? String((rows[0]||[])[0]||"") : (sh.title||"");
      const kind = detect(header, title);
      const body = rows.slice(hi + 1);
      if (kind === "raw_movement") {
        body.forEach(v => { if (!v || typeof v[0] !== "string") return; const k=v.join("\u0001"); if(raw.mvKeys[k])return; raw.mvKeys[k]=1; raw.movements.push(v); });
      } else if (kind === "balance") {
        const d = dateOf(title); const t = {};
        body.forEach(v => { if (v[0] && v[7] != null){ const k=v[7]+"\u0001"+v[0]; t[k]=numf(v[8]); const c=numf(v[10]); if(c) raw.costs[k]=c; } });
        mergeBalance(raw, t, title, d);
      } else if (kind === "job_variance") {
        body.forEach(v => { if(!v||!v[0])return; const k=String(v[0]); if(raw.jobKeys[k])return; raw.jobKeys[k]=1; raw.jobRows.push(v); });
      } else if (kind === "wastage") {
        body.forEach(v => { if(!v||!v[0])return; const k=String(v[1]||v.join("\u0001")); if(raw.wasteKeys[k])return; raw.wasteKeys[k]=1; raw.wasteRows.push(v); });
      }
    }));
    return raw;
  }
  // opening = earliest "as at"; closing = latest "as at"
  function mergeBalance(raw, table, title, d) {
    if (!Object.keys(table).length) return;
    const setOpen = () => { raw.openings = table; raw.openTitle = title; raw._openD = d; };
    const setClose = () => { raw.closings = table; raw.closeTitle = title; raw._closeD = d; };
    if (!raw.openTitle) { setOpen(); return; }
    if (d && raw._openD && d < raw._openD) { // new is earlier -> becomes opening, old opening -> closing if none/later
      if (!raw.closeTitle || (raw._openD > raw._closeD)) { raw.closings = raw.openings; raw.closeTitle = raw.openTitle; raw._closeD = raw._openD; }
      setOpen();
    } else { // new is later or equal -> closing (keep latest)
      if (!raw.closeTitle || (d && raw._closeD && d > raw._closeD) || !raw._closeD) setClose();
    }
  }

  // ---- merge two raw intermediates (accumulate) ----
  function mergeRaw(a, b) {
    if (!a) return b; if (!b) return a;
    const out = { mvKeys:{}, movements: [], openings:{}, closings:{}, openTitle:null, closeTitle:null, jobRows:[], jobKeys:{}, wasteRows:[], wasteKeys:{}, costs:{} };
    [a,b].forEach(src => {
      (src.movements||[]).forEach(v=>{ const k=v.join("\u0001"); if(out.mvKeys[k])return; out.mvKeys[k]=1; out.movements.push(v); });
      (src.jobRows||[]).forEach(v=>{ const k=String(v[0]); if(out.jobKeys[k])return; out.jobKeys[k]=1; out.jobRows.push(v); });
      (src.wasteRows||[]).forEach(v=>{ const k=String(v[1]||v.join("\u0001")); if(out.wasteKeys[k])return; out.wasteKeys[k]=1; out.wasteRows.push(v); });
      Object.keys(src.costs||{}).forEach(k=>{ out.costs[k]=src.costs[k]; });
    });
    // balances: earliest opening, latest closing (dates recomputed from titles — JSON-safe)
    [ [a.openTitle,a.openings], [b.openTitle,b.openings] ].forEach(([t,tbl])=>{ if(t && tbl && Object.keys(tbl).length) mergeBalance(out, tbl, t, dateOf(t)); });
    [ [a.closeTitle,a.closings], [b.closeTitle,b.closings] ].forEach(([t,tbl])=>{ if(t && tbl && Object.keys(tbl).length) mergeBalance(out, tbl, t, dateOf(t)); });
    return out;
  }

  function rowDate(v0){ const dm=/(\d{2})\/(\d{2})\/(\d{4})/.exec(String(v0||"")); return dm?new Date(+dm[3],+dm[2]-1,+dm[1]):null; }
  function inRange(d, range){ if(!range) return true; if(!d) return true; return (!range.from||d>=range.from)&&(!range.to||d<=range.to); }

  // ---- build agent-ready result from raw (optional date range: {from:Date,to:Date}) ----
  function build(raw, range) {
    const agg = {}, types = {}; let dmin=null,dmax=null;
    (raw.movements||[]).forEach(v => {
      const storage=v[4], code=v[1], name=v[2];
      if (MY_STORAGES.indexOf(storage)<0 || !code) return;
      const d0=rowDate(v[0]); if(!inRange(d0,range)) return;
      const dm=/(\d{2})\/(\d{2})\/(\d{4})/.exec(v[0]||"");
      if(dm){const d=new Date(+dm[3],+dm[2]-1,+dm[1]); if(!dmin||d<dmin)dmin=d; if(!dmax||d>dmax)dmax=d;}
      const t=classify(v[14]); types[t]=(types[t]||0)+1;
      const qi=numf(v[9]), qo=numf(v[11]);
      const k=storage+"\u0001"+code;
      const a=agg[k]||(agg[k]={storage,code,name,cat:v[3],uom:v[12]||v[10]||"",received:0,production:0,dispatch:0,adj_in:0,adj_out:0,other_in:0,other_out:0});
      if(t==="received")a.received+=qi; else if(t==="production")a.production+=qo; else if(t==="dispatch")a.dispatch+=qo;
      else if(t==="adjustment"){a.adj_in+=qi;a.adj_out+=qo;} else {a.other_in+=qi;a.other_out+=qo;}
    });
    const items=Object.keys(agg).map(k=>{ const a=agg[k];
      const op=raw.openings[a.storage+"\u0001"+a.code];
      const closing=Math.round(((op||0)+a.received+a.adj_in+a.other_in-a.production-a.dispatch-a.adj_out-a.other_out)*10)/10;
      const actual=raw.closings[a.storage+"\u0001"+a.code];
      const cost=(raw.costs||{})[a.storage+"\u0001"+a.code]||0;
      const stockQty=(actual!=null?actual:closing);
      return {storage:a.storage,code:a.code,name:a.name,category:a.cat,uom:a.uom,opening:op==null?null:op,
        received:r1(a.received),production_used:r1(a.production),dispatched:r1(a.dispatch),
        computed_closing:closing,actual_closing:actual==null?null:actual,
        avg_cost:cost,
        stock_value:Math.round(stockQty*cost*100)/100,
        consumed_value:Math.round(a.production*cost*100)/100,
        received_value:Math.round(a.received*cost*100)/100};
    });
    let matched=0,checked=0;
    items.forEach(i=>{if(i.actual_closing!=null){checked++;if(Math.abs(i.actual_closing-i.computed_closing)<=Math.max(1,Math.abs(i.actual_closing)*0.01))matched++;}});

    const prod={}; let jobs=0;
    (raw.jobRows||[]).forEach(v=>{ if(!v[0])return; if(!inRange(parseDate(v[1]),range))return; jobs++;
      const name=String(v[7]||"").trim(); const exp=numParse(v[9]), act=numParse(v[10]); if(exp.n==null)return;
      const p=prod[name]||(prod[name]={product:name,jobs:0,expected:0,actual:0,uom:exp.u,defect:0});
      p.jobs++;p.expected+=exp.n;p.actual+=(act.n||0); if(String(v[4]).indexOf("Defect")>=0)p.defect++;
    });
    const products=Object.keys(prod).map(n=>{const p=prod[n];return{product:p.product,jobs:p.jobs,expected:r1(p.expected),actual:r1(p.actual),uom:p.uom,variance_pct:p.expected?r1((p.actual-p.expected)/p.expected*100):0,defect_jobs:p.defect};});

    const waste=(raw.wasteRows||[]).filter(v=>v[0]&&inRange(parseDate(v[2]),range)).map(v=>({date:v[2],item:v[14],qty:v[15],uom:v[16],reason:(v[19]||v[18]||""),cost:v[20]}));
    const wasteCost=Math.round(waste.reduce((s,w)=>s+numf(w.cost),0)*100)/100;

    const wk={};
    (raw.jobRows||[]).forEach(v=>{ if(!v[1])return; const d=parseDate(v[1]); if(!d||!inRange(d,range))return; const key=weekKey(d);
      const act=numParse(v[10]).n||0, exp=numParse(v[9]).n||0; const w=wk[key]||(wk[key]={produced:0,expected:0}); w.produced+=act; w.expected+=exp; });
    waste.forEach(x=>{ const d=x.date instanceof Date?x.date:parseDate(x.date); if(!d)return; const key=weekKey(d); const w=wk[key]||(wk[key]={produced:0,expected:0}); w.wasteCost=(w.wasteCost||0)+numf(x.cost); });
    const wkKeys=Object.keys(wk).sort();
    const weekly={days:wkKeys.map(k=>k.slice(5)),produced:wkKeys.map(k=>Math.round(wk[k].produced)),sold:wkKeys.map(k=>Math.round(wk[k].expected)),
      waste:wkKeys.map(k=>Math.round((wk[k].wasteCost||0)*100)/100),variance:wkKeys.map(k=>wk[k].expected?Math.round((wk[k].produced-wk[k].expected)/wk[k].expected*1000)/10:0)};

    const ck=items.filter(i=>i.storage==="CK KL RAW MATERIAL");
    const sum=(arr,f)=>Math.round(arr.reduce((s,x)=>s+(x[f]||0),0)*100)/100;
    const cost={ stock_value:sum(ck,"stock_value"), consumed_value:sum(ck,"consumed_value"), received_value:sum(ck,"received_value"), waste_cost:wasteCost,
      top_consumed: ck.filter(i=>i.consumed_value>0).sort((a,b)=>b.consumed_value-a.consumed_value).slice(0,8).map(i=>({name:i.name,uom:i.uom,value:i.consumed_value,qty:i.production_used})) };

    return { cost, meta:{date_from:iso(dmin),date_to:iso(dmax),unique_rows:(raw.movements||[]).length,item_count:items.length,
        movement_types:types,validation_matched:matched,validation_total:checked,
        validation_match_pct:checked?Math.round(matched/checked*1000)/10:null,opening_source:raw.openTitle,closing_source:raw.closeTitle},
      items, production:{jobs,products}, wastage:{records:waste,total_cost:wasteCost}, weekly };
  }
  function weekKey(d){ const t=new Date(d); const day=(t.getDay()+6)%7; t.setDate(t.getDate()-day); return iso(t); }

  function processFiles(files, range){ return build(parseFiles(files), range); }

  function mapAgents(out) {
    const shortName = n => n.replace(/^MY US /i, "").replace(/\s+\d.*$/, "").trim();
    const dough = out.production.products.filter(p => /DOUGH/i.test(p.product) && !/PREMIX/i.test(p.product));
    const liveYield = dough.map(p => ({ size: shortName(p.product),
      yield_pct: p.expected ? Math.round(p.actual/p.expected*1000)/10 : 0,
      waste_pct: Math.max(0, Math.round(-p.variance_pct*10)/10) }));
    const liveAlerts = out.wastage.records.map(w => { const cost=Number(w.cost)||0;
      return { material:w.item, cause:"spoilage / wastage",
        note:`${w.qty} ${(w.uom||"").toLowerCase()} · RM${cost} · ${w.reason||""}`,
        route_to:"Production / Training", severity: cost>=100?"high":cost>=30?"medium":"low" }; });
    const liveProd = out.production.products.slice().sort((a,b)=>b.actual-a.actual)
      .map(p => ({ outlet: shortName(p.product), produced: Math.round(p.expected), sold: Math.round(p.actual) }));
    // Auto-order — real reorder suggestion: CK KL items with <1.5 weeks of stock left
    const weeks = Math.max(1, (out.weekly && out.weekly.days) ? out.weekly.days.length : 8);
    const liveOrder = (out.items||[])
      .filter(i => i.storage==="CK KL RAW MATERIAL" && i.category==="FOOD" && i.production_used>0 && i.actual_closing!=null)
      .map(i => { const perWeek=i.production_used/weeks; const stock=i.actual_closing; const weeksLeft=perWeek>0?stock/perWeek:99;
                  return { name:i.name, uom:i.uom, perWeek, stock, weeksLeft }; })
      .filter(x => x.weeksLeft < 1.5)
      .sort((a,b) => a.weeksLeft - b.weeksLeft)
      .slice(0,8)
      .map(x => ({ outlet: shortName(x.name), current_stock: Math.round(x.stock), order_qty: Math.max(1, Math.round(x.perWeek*2 - x.stock)) }));
    return { liveYield, liveAlerts, liveProd, liveOrder, weekly: out.weekly, pktPending: true, meta: out.meta, items: out.items };
  }

  // ---- CK GRN: recipe (expected) vs actual raw consumption ----
  function toGrams(q,u){ u=(u||"").toUpperCase(); if(u==="KG")return q*1000; if(u==="GM"||u==="G")return q; if(u==="L"||u==="LTR")return q*1000; if(u==="ML")return q; return null; }
  function nkey(s){ return String(s).toLowerCase().replace(/[^a-z0-9]/g,""); }
  function recipeVariance(out, recipeStd, prodMap){
    if(!recipeStd||!recipeStd.length) return [];
    const recBy={}; recipeStd.forEach(r=>recBy[nkey(r.name)]=r);
    const p2r={}; (prodMap||[]).forEach(m=>{ p2r[nkey(m.product)]=m.recipe; });
    function findRecipe(pn){ const pk=nkey(pn); const rn=p2r[pk]; if(rn){ let r=recBy[nkey(rn)]; if(r) return r; const nr=nkey(rn); for(const k in recBy){ if(k.indexOf(nr)>=0||nr.indexOf(k)>=0) return recBy[k]; } } if(recBy[pk]) return recBy[pk]; return null; }
    const exp={};
    (out.production.products||[]).forEach(p=>{ const r=findRecipe(p.product); if(!r) return;
      (r.ingredients||[]).forEach(i=>{ const g=toGrams(i.per_unit,i.unit); if(g==null) return; const k=nkey(i.name); (exp[k]=exp[k]||{name:i.name,g:0}).g += (p.actual||0)*g; }); });
    const act={};
    (out.items||[]).filter(i=>i.storage==="CK KL RAW MATERIAL").forEach(i=>{ const g=toGrams(i.production_used,i.uom); if(g==null) return; act[nkey(i.name)]={name:i.name,g:g,uom:i.uom}; });
    const rows=[];
    Object.keys(exp).forEach(k=>{ const e=exp[k], a=act[k]; if(!a||e.g<=0) return;
      const v=Math.round((a.g-e.g)/e.g*1000)/10;
      rows.push({ material:e.name, expected_kg:Math.round(e.g/100)/10, actual_kg:Math.round(a.g/100)/10, variance_pct:v }); });
    rows.sort((a,b)=>Math.abs(b.variance_pct)-Math.abs(a.variance_pct));
    return rows;
  }

  root.CKPipeline = { parseFiles, mergeRaw, build, processFiles, mapAgents, recipeVariance, classify };
})(typeof module !== "undefined" ? module.exports : (window.CK = window.CK || {}));

// ---------- PKT pipeline ----------
/* ===== PKT (USFOOD warehouse) parser — WMS daily exports, separate from CK ===== */
(function(root){
  function dnorm(s){ if(!s) return ""; const p=String(s).trim().split(/\s+/).slice(0,3); const d=new Date(p.join(" ")); if(isNaN(d)) return ""; return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
  function num(x){ const n=Number(x); return isNaN(n)?0:n; }
  function temp(storer){ const s=String(storer||"").toUpperCase(); return s.indexOf("FMUF")>=0?"frozen":(s.indexOf("AMUF")>=0?"ambient":"other"); }
  function region(ft){ const s=String(ft||"").toUpperCase(); return /^MY/.test(s)?"MY":(/^SG/.test(s)?"SG":"OTHER"); }
  function detect(head){ const H=(head||[]).map(x=>String(x||"").toUpperCase());
    if(H.indexOf("FROMTO")>=0 && H.indexOf("OUT")>=0) return "mvt";
    if(H.indexOf("AVAILABLE")>=0 && H.indexOf("LOC")>=0) return "bal";
    return null; }
  function isPKT(files){ return (files||[]).some(f=>(f.sheets||[]).some(sh=>detect((sh.rows||[])[0]))); }
  function parseFiles(files){
    const raw={ mvt:[], bal:[], mvtKeys:{}, dates:{} };
    (files||[]).forEach(f=>{ (f.sheets||[]).forEach(sh=>{
      const rows=sh.rows||[]; if(!rows.length) return; const kind=detect(rows[0]); if(!kind) return;
      const body=rows.slice(1).filter(v=>v&&v[0]);
      if(kind==="mvt"){
        body.forEach(v=>{ const t=temp(v[0]); const reg=region(v[7]); const date=dnorm(v[10]);
          const key=[v[6],v[2],v[7],v[15],v[12]].join("|"); if(raw.mvtKeys[key]) return; raw.mvtKeys[key]=1;
          raw.mvt.push({date:date,region:reg,outlet:String(v[7]||""),sku:String(v[2]||""),desc:String(v[3]||""),uom:String(v[8]||""),out:num(v[12]),inc:num(v[11]),doc:String(v[15]||""),so:String(v[6]||""),temp:t});
          if(date) raw.dates[date]=1; });
      } else {
        body.forEach(v=>{ raw.bal.push({sku:String(v[3]||""),desc:String(v[6]||""),uom:String(v[8]||""),qty:num(v[12]),available:num(v[15]),temp:temp(v[0])}); });
      }
    }); });
    return raw;
  }
  function mergeRaw(a,b){
    if(!a) return b; if(!b) return a;
    const out={ mvt:a.mvt.slice(), mvtKeys:Object.assign({},a.mvtKeys), bal:a.bal.slice(), dates:Object.assign({},a.dates) };
    b.mvt.forEach(m=>{ const key=[m.so,m.sku,m.outlet,m.doc,m.out].join("|"); if(out.mvtKeys[key])return; out.mvtKeys[key]=1; out.mvt.push(m); });
    Object.keys(b.dates).forEach(d=>out.dates[d]=1);
    const bTemps={}; b.bal.forEach(x=>bTemps[x.temp]=1);
    out.bal = out.bal.filter(x=>!bTemps[x.temp]).concat(b.bal);
    return out;
  }
  function build(raw, opts){
    opts=opts||{}; const reg=opts.region||"MY";
    const mv=(raw.mvt||[]).filter(m=>m.region===reg);
    const outlets={}, byItem={}; let totalOut=0; const skus={};
    mv.forEach(m=>{ totalOut+=m.out; outlets[m.outlet]=(outlets[m.outlet]||0)+m.out; skus[m.sku]=1;
      byItem[m.sku]=byItem[m.sku]||{sku:m.sku,desc:m.desc,uom:m.uom,out:0}; byItem[m.sku].out+=m.out; });
    const outletList=Object.entries(outlets).map(function(e){return {outlet:e[0],out:e[1]};}).sort((a,b)=>b.out-a.out);
    const log=mv.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(m=>({date:m.date,outlet:m.outlet,sku:m.sku,desc:m.desc,uom:m.uom,out:m.out,doc:m.doc,temp:m.temp}));
    const topItems=Object.keys(byItem).map(k=>byItem[k]).sort((a,b)=>b.out-a.out).slice(0,10);
    const stock={frozen:{qty:0,avail:0,skus:0},ambient:{qty:0,avail:0,skus:0}};
    const seen={frozen:{},ambient:{}};
    (raw.bal||[]).forEach(b=>{ const t=b.temp==="frozen"?"frozen":(b.temp==="ambient"?"ambient":null); if(!t)return;
      stock[t].qty+=b.qty; stock[t].avail+=b.available; if(!seen[t][b.sku]){seen[t][b.sku]=1;stock[t].skus++;} });
    const lowMap={};
    (raw.bal||[]).forEach(b=>{ const k=b.temp+"|"+b.sku; lowMap[k]=lowMap[k]||{desc:b.desc,uom:b.uom,temp:b.temp,avail:0}; lowMap[k].avail+=b.available; });
    const low=Object.keys(lowMap).map(k=>lowMap[k]).filter(x=>x.avail<=5).sort((a,b)=>a.avail-b.avail).slice(0,10);
    const dates=Object.keys(raw.dates||{}).sort();
    return { region:reg, totalOut:Math.round(totalOut), outletCount:outletList.length, skuCount:Object.keys(skus).length,
      outlets:outletList, log:log, topItems:topItems, stock:stock, low:low, dateFrom:dates[0]||null, dateTo:dates[dates.length-1]||null,
      mvtRows:mv.length, allDates:dates };
  }
  root.parseFiles=parseFiles; root.mergeRaw=mergeRaw; root.build=build; root.detect=detect; root.isPKT=isPKT;
})(window.PKT = window.PKT || {});

// ---------- DEM (demand) pipeline ----------
/* ===== DEMAND (Sales Orders CK -> outlets) parser ===== */
(function(root){
  function clean(s){return String(s==null?"":s).replace(/\s+/g," ").trim();}
  function num(x){var n=Number(x);return isNaN(n)?0:n;}
  var MON={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
  function dnorm(s){ if(!s)return""; s=clean(s); var m=s.match(/^(\d{1,2})[- ]([A-Za-z]{3})[- ](\d{4})$/); if(m){var mo=MON[m[2].toLowerCase()];if(mo!=null)return m[3]+"-"+String(mo+1).padStart(2,"0")+"-"+String(+m[1]).padStart(2,"0");} var d=new Date(s); if(!isNaN(d))return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); return ""; }
  function detect(head){ var H=(head||[]).map(function(x){return clean(x).toUpperCase();}); return H.indexOf("SALESORDERNO")>=0 && H.indexOf("ITEMDESC")>=0 && H.indexOf("QUANTITY")>=0; }
  function colmap(head){ var m={}; (head||[]).forEach(function(h,i){m[clean(h).toUpperCase()]=i;}); return m; }
  function sgOutlet(s){ return /\bSG\b|singapore/i.test(String(s||"")); }
  function isDEM(files){ return (files||[]).some(function(f){return (f.sheets||[]).some(function(sh){return detect((sh.rows||[])[0]);});}); }
  function parseFiles(files){
    var raw={lines:[],keys:{},dates:{}};
    (files||[]).forEach(function(f){ (f.sheets||[]).forEach(function(sh){
      var rows=sh.rows||[]; if(!rows.length||!detect(rows[0]))return; var C=colmap(rows[0]);
      var gi=function(r,k){var i=C[k];return i==null?null:r[i];};
      rows.slice(1).forEach(function(r){ if(!r||!r[C["SALESORDERNO"]])return;
        var so=clean(gi(r,"SALESORDERNO")),code=clean(gi(r,"ITEMCODE")),desc=clean(gi(r,"ITEMDESC")),qty=num(gi(r,"QUANTITY")),date=dnorm(gi(r,"DELIVEREDDATE"));
        var outlet=clean(gi(r,"DEBTORBRANCHCODE"))||clean(gi(r,"DEBTORNAME")),uom=clean(gi(r,"UOM")),val=num(gi(r,"SUBTOTAL"));
        if(sgOutlet(outlet))return;
        var key=[so,code,desc,qty,date].join("|"); if(raw.keys[key])return; raw.keys[key]=1;
        raw.lines.push({date:date,outlet:outlet,code:code,desc:desc,qty:qty,uom:uom,value:val,so:so});
        if(date)raw.dates[date]=1;
      });
    });});
    return raw;
  }
  function mergeRaw(a,b){ if(!a)return b; if(!b)return a; var o={lines:a.lines.slice(),keys:Object.assign({},a.keys),dates:Object.assign({},a.dates)};
    b.lines.forEach(function(l){var key=[l.so,l.code,l.desc,l.qty,l.date].join("|"); if(o.keys[key])return; o.keys[key]=1; o.lines.push(l);});
    Object.keys(b.dates).forEach(function(d){o.dates[d]=1;}); return o; }
  function nkey(s){return String(s).toLowerCase().replace(/[^a-z0-9]/g,"");}
  function build(raw){ var lines=(raw&&raw.lines)||[]; var byProd={},byOutlet={}; var dates=Object.keys((raw&&raw.dates)||{}).sort();
    lines.forEach(function(l){
      var pk=nkey(l.desc); var p=byProd[pk]||(byProd[pk]={desc:l.desc,code:l.code,qty:0,uoms:{},value:0,orders:0});
      p.qty+=l.qty; p.uoms[l.uom]=(p.uoms[l.uom]||0)+l.qty; p.value+=l.value; p.orders++;
      var o=byOutlet[l.outlet]||(byOutlet[l.outlet]={outlet:l.outlet,value:0,qty:0,lines:0}); o.value+=l.value; o.qty+=l.qty; o.lines++;
    });
    return { byProduct:Object.keys(byProd).map(function(k){return byProd[k];}).sort(function(a,b){return b.value-a.value;}),
      byOutlet:Object.keys(byOutlet).map(function(k){return byOutlet[k];}).sort(function(a,b){return b.value-a.value;}),
      totalValue:lines.reduce(function(s,l){return s+l.value;},0), lineCount:lines.length, productCount:Object.keys(byProd).length,
      dateFrom:dates[0]||null, dateTo:dates[dates.length-1]||null };
  }
  root.parseFiles=parseFiles; root.mergeRaw=mergeRaw; root.build=build; root.detect=detect; root.isDEM=isDEM; root.nkey=nkey;
})(window.DEM = window.DEM || {});
