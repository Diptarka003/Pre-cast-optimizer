import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Line, LineChart,
} from "recharts";

const INDUSTRY_BENCHMARKS = {
  manual:    { cycle: 32, cost: 12400, strength24h: 54 },
  industry:  { cycle: 22, cost: 9800,  strength24h: 68 },
  optimized: { cycle: 14, cost: 7200,  strength24h: 84 },
};

const HISTORICAL_DATA = [
  {id:1,  region:"Mumbai",    mix:"M40",cure:"Steam",    auto:"Semi",  fck:40,element:"Girder",    cycleHrs:14.2,str24:84,cost:8200, demould:11,quality:92},
  {id:2,  region:"Delhi",     mix:"M50",cure:"Steam",    auto:"Full",  fck:50,element:"Column",    cycleHrs:11.8,str24:88,cost:9100, demould:9, quality:95},
  {id:3,  region:"Chennai",   mix:"M30",cure:"Natural",  auto:"Manual",fck:30,element:"Slab",      cycleHrs:34.5,str24:55,cost:6100, demould:28,quality:74},
  {id:4,  region:"Kolkata",   mix:"M40",cure:"Polythene",auto:"Manual",fck:40,element:"Wall",      cycleHrs:26.2,str24:63,cost:7300, demould:22,quality:79},
  {id:5,  region:"Bangalore", mix:"M50",cure:"Chemical", auto:"Semi",  fck:50,element:"Girder",    cycleHrs:17.4,str24:76,cost:9800, demould:14,quality:88},
  {id:6,  region:"Ahmedabad", mix:"M60",cure:"Steam",    auto:"Full",  fck:60,element:"Pile",      cycleHrs:10.5,str24:91,cost:11200,demould:8, quality:97},
  {id:7,  region:"Pune",      mix:"M30",cure:"Chemical", auto:"Semi",  fck:30,element:"Slab",      cycleHrs:19.8,str24:69,cost:7100, demould:16,quality:83},
  {id:8,  region:"Mumbai",    mix:"M50",cure:"Natural",  auto:"Manual",fck:50,element:"Column",    cycleHrs:38.2,str24:51,cost:8800, demould:32,quality:71},
  {id:9,  region:"Delhi",     mix:"M40",cure:"Steam",    auto:"Full",  fck:40,element:"Wall",      cycleHrs:12.1,str24:86,cost:8600, demould:10,quality:94},
  {id:10, region:"Chennai",   mix:"M60",cure:"Steam",    auto:"Semi",  fck:60,element:"Girder",    cycleHrs:13.4,str24:87,cost:11800,demould:10,quality:96},
  {id:11, region:"Kolkata",   mix:"M30",cure:"Natural",  auto:"Manual",fck:30,element:"Pile",      cycleHrs:36.8,str24:52,cost:5900, demould:30,quality:70},
  {id:12, region:"Bangalore", mix:"M40",cure:"Steam",    auto:"Full",  fck:40,element:"Slab",      cycleHrs:13.8,str24:83,cost:8400, demould:11,quality:93},
  {id:13, region:"Ahmedabad", mix:"M50",cure:"Polythene",auto:"Manual",fck:50,element:"Column",    cycleHrs:29.3,str24:60,cost:9200, demould:24,quality:76},
  {id:14, region:"Pune",      mix:"M60",cure:"Chemical", auto:"Full",  fck:60,element:"Wall",      cycleHrs:15.6,str24:79,cost:12100,demould:13,quality:89},
  {id:15, region:"Mumbai",    mix:"M40",cure:"Steam",    auto:"Semi",  fck:40,element:"Pile",      cycleHrs:15.1,str24:82,cost:8300, demould:12,quality:91},
  {id:16, region:"Delhi",     mix:"M30",cure:"Natural",  auto:"Manual",fck:30,element:"Girder",    cycleHrs:33.4,str24:56,cost:6200, demould:27,quality:73},
  {id:17, region:"Chennai",   mix:"M40",cure:"Chemical", auto:"Semi",  fck:40,element:"Slab",      cycleHrs:18.7,str24:72,cost:8100, demould:15,quality:85},
  {id:18, region:"Kolkata",   mix:"M50",cure:"Steam",    auto:"Full",  fck:50,element:"Column",    cycleHrs:12.4,str24:87,cost:9400, demould:10,quality:94},
  {id:19, region:"Bangalore", mix:"M30",cure:"Polythene",auto:"Manual",fck:30,element:"Wall",      cycleHrs:27.9,str24:61,cost:6400, demould:23,quality:78},
  {id:20, region:"Ahmedabad", mix:"M60",cure:"Steam",    auto:"Semi",  fck:60,element:"Girder",    cycleHrs:11.2,str24:90,cost:11600,demould:9, quality:96},
  {id:21, region:"Pune",      mix:"M40",cure:"Natural",  auto:"Manual",fck:40,element:"Pile",      cycleHrs:35.6,str24:53,cost:7600, demould:29,quality:72},
  {id:22, region:"Mumbai",    mix:"M50",cure:"Steam",    auto:"Full",  fck:50,element:"Column",    cycleHrs:11.9,str24:89,cost:9600, demould:9, quality:96},
  {id:23, region:"Delhi",     mix:"M40",cure:"Chemical", auto:"Semi",  fck:40,element:"Slab",      cycleHrs:17.8,str24:74,cost:8000, demould:14,quality:86},
  {id:24, region:"Chennai",   mix:"M30",cure:"Steam",    auto:"Semi",  fck:30,element:"Wall",      cycleHrs:16.3,str24:80,cost:7400, demould:13,quality:88},
  {id:25, region:"Kolkata",   mix:"M60",cure:"Chemical", auto:"Full",  fck:60,element:"Girder",    cycleHrs:14.8,str24:81,cost:12300,demould:12,quality:90},
  {id:26, region:"Bangalore", mix:"M50",cure:"Steam",    auto:"Semi",  fck:50,element:"Pile",      cycleHrs:13.1,str24:86,cost:9700, demould:10,quality:93},
  {id:27, region:"Ahmedabad", mix:"M30",cure:"Natural",  auto:"Manual",fck:30,element:"Slab",      cycleHrs:39.2,str24:48,cost:5700, demould:33,quality:68},
  {id:28, region:"Pune",      mix:"M50",cure:"Steam",    auto:"Full",  fck:50,element:"Column",    cycleHrs:12.6,str24:88,cost:9500, demould:10,quality:95},
  {id:29, region:"Mumbai",    mix:"M30",cure:"Polythene",auto:"Semi",  fck:30,element:"Girder",    cycleHrs:24.1,str24:64,cost:6700, demould:20,quality:80},
  {id:30, region:"Delhi",     mix:"M60",cure:"Steam",    auto:"Full",  fck:60,element:"Wall",      cycleHrs:10.8,str24:92,cost:12000,demould:8, quality:97},
  {id:31, region:"Chennai",   mix:"M40",cure:"Steam",    auto:"Full",  fck:40,element:"Pile",      cycleHrs:13.6,str24:85,cost:8500, demould:11,quality:93},
  {id:32, region:"Kolkata",   mix:"M30",cure:"Chemical", auto:"Semi",  fck:30,element:"Slab",      cycleHrs:20.4,str24:68,cost:7000, demould:17,quality:82},
  {id:33, region:"Bangalore", mix:"M60",cure:"Natural",  auto:"Manual",fck:60,element:"Column",    cycleHrs:42.1,str24:46,cost:10200,demould:36,quality:66},
  {id:34, region:"Ahmedabad", mix:"M40",cure:"Steam",    auto:"Semi",  fck:40,element:"Girder",    cycleHrs:14.9,str24:83,cost:8700, demould:12,quality:91},
  {id:35, region:"Pune",      mix:"M30",cure:"Natural",  auto:"Manual",fck:30,element:"Wall",      cycleHrs:31.8,str24:57,cost:6000, demould:26,quality:74},
  {id:36, region:"Mumbai",    mix:"M60",cure:"Chemical", auto:"Semi",  fck:60,element:"Pile",      cycleHrs:16.2,str24:78,cost:12400,demould:13,quality:88},
  {id:37, region:"Delhi",     mix:"M30",cure:"Steam",    auto:"Semi",  fck:30,element:"Slab",      cycleHrs:15.7,str24:81,cost:7200, demould:13,quality:89},
  {id:38, region:"Chennai",   mix:"M50",cure:"Polythene",auto:"Manual",fck:50,element:"Column",    cycleHrs:30.1,str24:59,cost:9000, demould:25,quality:76},
  {id:39, region:"Kolkata",   mix:"M40",cure:"Steam",    auto:"Full",  fck:40,element:"Girder",    cycleHrs:13.3,str24:85,cost:8300, demould:11,quality:93},
  {id:40, region:"Bangalore", mix:"M50",cure:"Chemical", auto:"Semi",  fck:50,element:"Wall",      cycleHrs:17.1,str24:75,cost:9900, demould:14,quality:87},
  {id:41, region:"Ahmedabad", mix:"M30",cure:"Steam",    auto:"Semi",  fck:30,element:"Pile",      cycleHrs:16.8,str24:79,cost:7300, demould:14,quality:87},
  {id:42, region:"Pune",      mix:"M60",cure:"Steam",    auto:"Full",  fck:60,element:"Slab",      cycleHrs:11.4,str24:91,cost:12200,demould:9, quality:96},
  {id:43, region:"Mumbai",    mix:"M40",cure:"Natural",  auto:"Semi",  fck:40,element:"Column",    cycleHrs:29.8,str24:58,cost:7800, demould:24,quality:75},
  {id:44, region:"Delhi",     mix:"M50",cure:"Chemical", auto:"Full",  fck:50,element:"Pile",      cycleHrs:15.9,str24:77,cost:10100,demould:13,quality:88},
  {id:45, region:"Chennai",   mix:"M30",cure:"Polythene",auto:"Semi",  fck:30,element:"Girder",    cycleHrs:23.6,str24:65,cost:6600, demould:19,quality:81},
  {id:46, region:"Kolkata",   mix:"M60",cure:"Steam",    auto:"Semi",  fck:60,element:"Wall",      cycleHrs:12.7,str24:89,cost:11900,demould:10,quality:95},
  {id:47, region:"Bangalore", mix:"M40",cure:"Polythene",auto:"Manual",fck:40,element:"Slab",      cycleHrs:27.4,str24:62,cost:7500, demould:22,quality:79},
  {id:48, region:"Ahmedabad", mix:"M50",cure:"Steam",    auto:"Full",  fck:50,element:"Column",    cycleHrs:11.6,str24:90,cost:9300, demould:9, quality:96},
  {id:49, region:"Pune",      mix:"M40",cure:"Chemical", auto:"Semi",  fck:40,element:"Girder",    cycleHrs:18.2,str24:73,cost:8000, demould:15,quality:86},
  {id:50, region:"Mumbai",    mix:"M30",cure:"Steam",    auto:"Semi",  fck:30,element:"Pile",      cycleHrs:15.4,str24:82,cost:7100, demould:12,quality:90},
];

const CLIMATE = {
  Mumbai:    {temp:32,rh:80,factor:0.88,zone:"Coastal",  wind:14},
  Delhi:     {temp:38,rh:25,factor:0.78,zone:"Hot-Dry",  wind:8},
  Chennai:   {temp:34,rh:75,factor:0.85,zone:"Tropical", wind:16},
  Kolkata:   {temp:30,rh:85,factor:0.90,zone:"Humid",    wind:10},
  Bangalore: {temp:26,rh:60,factor:1.00,zone:"Mild",     wind:12},
  Ahmedabad: {temp:40,rh:20,factor:0.72,zone:"Arid",     wind:6},
  Pune:      {temp:28,rh:55,factor:0.97,zone:"Moderate", wind:11},
};

const MIX = {
  M30:{wc:0.45,rate:1.00,costBase:4800,std:"IS:456"},
  M40:{wc:0.40,rate:1.18,costBase:5400,std:"IS:456"},
  M50:{wc:0.35,rate:1.35,costBase:6200,std:"IS:1343"},
  M60:{wc:0.32,rate:1.52,costBase:7100,std:"IS:1343"},
};

const CURING = {
  Steam:     {tMul:0.42,costF:1.55,boost:9, std:"PCI-MNL-116"},
  Chemical:  {tMul:0.58,costF:1.38,boost:5, std:"IS:9103"},
  Polythene: {tMul:0.80,costF:1.12,boost:3, std:"IS:456-Cl14"},
  Natural:   {tMul:1.00,costF:1.00,boost:0, std:"IS:456-Cl13"},
};

const AUTO = {
  Manual:      {red:0,    costAdd:0,    heads:4,   err:0.14},
  "Semi-Auto": {red:0.13, costAdd:0.08, heads:2.5, err:0.07},
  "Full-Auto": {red:0.28, costAdd:0.22, heads:1.2, err:0.02},
};

const ELEMENTS = {
  "PSC Girder":18, Column:16, Slab:20, "Wall Panel":14, Pile:15, "Box Culvert":22,
};

function buildCurve(mix, curing, region, fck) {
  const m = MIX[mix], c = CURING[curing], cl = CLIMATE[region];
  const pts = [];
  for (let h = 0; h <= 168; h += (h < 48 ? 2 : 6)) {
    const a = curing==="Steam"?0.9:curing==="Chemical"?1.4:curing==="Polythene"?2.1:3.2;
    const b = 0.95 + c.boost * 0.008;
    const n = 0.42 * m.rate * cl.factor;
    const tAdj = h * (1/c.tMul) * cl.factor * m.rate;
    const pct = Math.min(100, Math.max(0, 100 * Math.pow(tAdj/(a*fck+b*tAdj), n) * 1.05));
    const maturity = Math.max(0, ((curing==="Steam"?Math.min(70,cl.temp+35):cl.temp)+10)) * h;
    pts.push({h, pct:+pct.toFixed(1), maturity:+maturity.toFixed(0)});
  }
  return pts;
}

function simulate(p) {
  const {mix,curing,automation,region,fck,element,quantity,moulds} = p;
  const m=MIX[mix], c=CURING[curing], a=AUTO[automation], cl=CLIMATE[region];
  const base = ELEMENTS[element];
  const fckF = fck/40;
  const rawDemould = base * c.tMul * fckF * (1/m.rate) * cl.factor;
  const cycleHrs = +(rawDemould*(1-a.red)+2.5).toFixed(1);
  const cyclesPerMould = Math.max(1,Math.min(3,Math.floor(22/cycleHrs)));
  const dailyOut = moulds*cyclesPerMould;
  const projDays = Math.ceil(quantity/dailyOut);

  const labourCost = +(cycleHrs*480*a.heads).toFixed(0);
  const curingCost = +(m.costBase*(fck/40)*c.costF*0.28).toFixed(0);
  const mouldAmort = +(18000/(120*cyclesPerMould)).toFixed(0);
  const autoCost   = +(a.costAdd*m.costBase).toFixed(0);
  const totalCost  = labourCost+curingCost+mouldAmort+autoCost;

  const comp = HISTORICAL_DATA.filter(d=>d.mix===mix||d.region===region);
  const avgInd = comp.length ? +(comp.reduce((s,d)=>s+d.cycleHrs,0)/comp.length).toFixed(1) : 22;
  const cycleImp = +(((avgInd-cycleHrs)/avgInd)*100).toFixed(1);
  const annualSav = +(Math.max(0,INDUSTRY_BENCHMARKS.manual.cost-totalCost)*quantity*12/1e5).toFixed(1);

  const curve = buildCurve(mix,curing,region,fck);
  const demould70 = curve.find(d=>d.pct>=70)?.h ?? Math.round(rawDemould);

  const scenarios = Object.entries(CURING).map(([method,cf])=>{
    const t = +(base*cf.tMul*fckF*(1/m.rate)*cl.factor*(1-a.red)+2.5).toFixed(1);
    const lc = t*480*a.heads;
    const cc = m.costBase*(fck/40)*cf.costF*0.28;
    const cost = +(lc+cc+mouldAmort+autoCost).toFixed(0);
    const imp = +(((INDUSTRY_BENCHMARKS.industry.cycle-t)/INDUSTRY_BENCHMARKS.industry.cycle)*100).toFixed(1);
    const score = Math.min(99,+((50/t)*(10000/cost)*80+cf.boost*2).toFixed(1));
    return {method,cycleHrs:t,cost,imp,score,std:cf.std};
  }).sort((a,b)=>b.score-a.score);

  const radar = [
    {s:"Speed",      v:Math.min(99,Math.max(10,+(100-(cycleHrs/40)*100).toFixed(0)))},
    {s:"Cost Eff.",  v:Math.min(99,Math.max(10,+(100-(totalCost/160)).toFixed(0)))},
    {s:"Quality",    v:Math.min(99,+(60+m.rate*22+c.boost*0.8).toFixed(0))},
    {s:"Automation", v:automation==="Full-Auto"?93:automation==="Semi-Auto"?74:44},
    {s:"Climate",    v:+(cl.factor*100).toFixed(0)},
    {s:"Maturity",   v:Math.min(99,+((((curing==="Steam"?70:cl.temp)+10)*24)/14).toFixed(0))},
  ];

  const throughput = ["Jan","Feb","Mar","Apr","May","Jun"].map(month=>({
    month,
    current:  Math.round(dailyOut*25*(0.82+Math.random()*0.12)),
    optimized:Math.round(dailyOut*25*(1.12+Math.random()*0.10)),
    target:   Math.round(quantity/6),
  }));

  const best = scenarios[0];
  return {
    cycleHrs,demould70,cyclesPerMould,dailyOut,projDays,
    labourCost,curingCost,mouldAmort,autoCost,totalCost,
    avgInd,cycleImp,annualSav,curve,scenarios,radar,throughput,
    vsManualCycle:+(((INDUSTRY_BENCHMARKS.manual.cycle-cycleHrs)/INDUSTRY_BENCHMARKS.manual.cycle)*100).toFixed(1),
    vsManualCost: +(((INDUSTRY_BENCHMARKS.manual.cost-totalCost)/INDUSTRY_BENCHMARKS.manual.cost)*100).toFixed(1),
    rec: best.method!==curing
      ? `Switch to ${best.method} → ${cycleHrs}h → ${best.cycleHrs}h (${((1-best.cycleHrs/cycleHrs)*100).toFixed(0)}% faster). Saves ₹${(totalCost-best.cost).toLocaleString()}/element.`
      : `Setup near-optimal. ${automation!=="Full-Auto"?"Upgrade to Full-Auto for 15–18% additional reduction.":"Full-Auto + Steam is best-in-class."}`,
    climateNote: cl.rh>72
      ? `High RH ${cl.rh}% in ${region} — polythene wrap mandatory post-cast (IS:456 Cl.14)`
      : cl.temp>36
      ? `High temp ${cl.temp}°C — steam curing 20:00–06:00 IST, use chilled mixing water`
      : `Moderate ${region} climate — standard protocols apply; admixtures for M50+`,
  };
}

// ── Robust JSON extractor: handles truncated, markdown-wrapped responses ──
function extractJSON(raw) {
  if (!raw) return null;
  // Strip markdown fences
  let s = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/g, "").trim();
  // Try direct parse first
  try { return JSON.parse(s); } catch (_) {}
  // Find outermost { ... }
  const start = s.indexOf("{");
  if (start === -1) return null;
  // Walk forward to find balanced closing brace
  let depth = 0, end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end !== -1) {
    try { return JSON.parse(s.slice(start, end + 1)); } catch (_) {}
  }
  // Truncated — attempt to close open structure
  const partial = end !== -1 ? s.slice(start, end + 1) : s.slice(start);
  try {
    // Count unclosed braces/brackets and close them
    let fixed = partial;
    let od = 0, od2 = 0;
    let inStr = false, esc = false;
    for (const ch of fixed) {
      if (esc) { esc = false; continue; }
      if (ch === "\\") { esc = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === "{") od++;
      else if (ch === "}") od--;
      else if (ch === "[") od2++;
      else if (ch === "]") od2--;
    }
    // Remove trailing incomplete key/value (ends mid-string or mid-key)
    fixed = fixed.replace(/,\s*"[^"]*$/, "").replace(/,\s*$/, "");
    fixed += "]".repeat(Math.max(0, od2)) + "}".repeat(Math.max(0, od));
    return JSON.parse(fixed);
  } catch (_) { return null; }
}

async function callGemini(apiKey, params, res) {
  const cl = CLIMATE[params.region];
  // Compact prompt — reduces output size while keeping all structured fields
  const prompt = `You are a precast concrete AI. Respond ONLY with valid JSON, no markdown fences.

Config: element=${params.element} mix=${params.mix} fck=${params.fck}MPa region=${params.region} temp=${cl.temp}C RH=${cl.rh}% curing=${params.curing} automation=${params.automation} moulds=${params.moulds} qty=${params.quantity}
Results: cycle=${res.cycleHrs}h industryAvg=${res.avgInd}h demould70=${res.demould70}h projDays=${res.projDays} cost=Rs${res.totalCost} vsManual=${res.vsManualCycle}% annualSav=Rs${res.annualSav}L
Benchmarks: Manual=32h/Rs12400 IndiaAvg=22h/Rs9800 BestInClass=14h/Rs7200

Return exactly this JSON structure (keep all string values concise, under 120 chars each):
{"verdict":"OPTIMAL|GOOD|SUBOPTIMAL","verdictReason":"1 sentence","protocolAssessment":"2 sentences with IS codes","recommendations":[{"rank":1,"action":"action text","improvement":"X%","detail":"reason"},{"rank":2,"action":"action text","improvement":"X%","detail":"reason"},{"rank":3,"action":"action text","improvement":"X%","detail":"reason"}],"risks":[{"risk":"title","severity":"HIGH|MEDIUM|LOW","detail":"description","mitigation":"IS code + action"},{"risk":"title","severity":"HIGH|MEDIUM|LOW","detail":"description","mitigation":"IS code + action"}],"quality":{"strength28day":"XXX-YYY MPa","defectProbability":"X%","complianceStatus":"COMPLIANT|MARGINAL|AT-RISK","complianceNote":"note"},"roi":{"savingPerElement":"Rs X","annualSaving":"Rs X","paybackMonths":N,"summary":"1-2 sentences"}}`;

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        contents:[{parts:[{text:prompt}]}],
        generationConfig:{
          temperature:0.1,
          maxOutputTokens:8192,   // ← FIX: was 2000, now 8192 (free tier supports this)
          responseMimeType:"application/json",  // ← FIX: forces JSON-only response, no markdown fences
        },
      }),
    }
  );
  if (!r.ok) { const e=await r.json(); throw new Error(e.error?.message||"Gemini API error"); }
  const d = await r.json();
  const raw = d.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // ── FIX: use robust extractor instead of simple replace ──
  const parsed = extractJSON(raw);
  if (parsed) return parsed;

  // Last resort: return structured error so UI still renders nicely
  throw new Error("Could not parse Gemini response. Raw: " + raw.slice(0, 200));
}

const ChartTip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:"#1a1f2e",border:"1px solid #2d3548",padding:"10px 14px",borderRadius:6,fontSize:12,color:"#c8d0e0"}}>
      <div style={{color:"#6b7a99",marginBottom:5,fontSize:11}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color,marginBottom:2}}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
};

export default function App() {
  const [p, setP] = useState({mix:"M40",curing:"Steam",automation:"Semi-Auto",region:"Mumbai",fck:40,element:"PSC Girder",quantity:150,moulds:4});
  const [res, setRes]         = useState(null);
  const [tab, setTab]         = useState("dashboard");
  const [apiKey, setApiKey]   = useState("");
  const [aiText, setAiText]   = useState(null);
  const [aiLoading, setAiLoad]= useState(false);
  const [aiError, setAiError] = useState("");
  const [showKeyVisible, setShowKeyVisible] = useState(false); // toggle show/hide password
  const [computing, setComp]  = useState(false);
  const timer = useRef(null);

  const set = (k,v) => setP(prev=>({...prev,[k]:v}));

  useEffect(()=>{
    setComp(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(()=>{ setRes(simulate(p)); setComp(false); }, 240);
    return ()=>clearTimeout(timer.current);
  },[p]);

  const runAI = async () => {
    if (!apiKey.trim()) { setAiError("Please enter your Gemini API key above."); return; }
    setAiLoad(true); setAiError(""); setAiText(null);
    try { const t=await callGemini(apiKey,p,res); setAiText(t); setTab("ai"); }
    catch(e) { setAiError(e.message); }
    finally { setAiLoad(false); }
  };

  const TABS=[
    {id:"dashboard",label:"Dashboard"},
    {id:"strength", label:"Strength Curve"},
    {id:"scenarios",label:"Scenarios"},
    {id:"dataset",  label:"Dataset"},
    {id:"impact",   label:"Impact & ROI"},
    {id:"roadmap",  label:"Roadmap"},
    {id:"ai",       label:"✦ AI Analysis"},
  ];

  const cycleColor = res?(res.cycleHrs<15?"#4ade80":res.cycleHrs<22?"#fbbf24":"#f87171"):"#e2b96f";
  const impColor   = res&&res.cycleImp>0?"#4ade80":"#f87171";

  return (
    <div style={{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",background:"#0e1117",color:"#c8d0e0",fontFamily:"'JetBrains Mono','Fira Code',monospace",fontSize:13,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#2d3548;border-radius:4px}
        .sel{width:100%;background:#131928;border:1px solid #232d42;color:#c8d0e0;padding:9px 32px 9px 12px;border-radius:6px;font-family:inherit;font-size:13px;outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23e2b96f'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;transition:border-color .15s}
        .sel:hover,.sel:focus{border-color:#e2b96f;background-color:#161d2e}
        input[type=range]{width:100%;accent-color:#e2b96f;cursor:pointer;height:3px}
        input[type=password],input[type=text]{background:#131928;border:1px solid #232d42;color:#c8d0e0;padding:9px 12px;border-radius:6px;font-family:inherit;font-size:13px;outline:none;width:100%;transition:border-color .15s}
        input[type=password]:focus,input[type=text]:focus{border-color:#e2b96f}
        .tb{background:none;border:none;cursor:pointer;padding:0 16px;height:100%;font-family:inherit;font-size:12px;letter-spacing:.06em;text-transform:uppercase;transition:all .18s;border-bottom:2px solid transparent;white-space:nowrap}
        .tb.on{color:#e2b96f;border-bottom-color:#e2b96f}
        .tb.off{color:#2d3a56}
        .tb.off:hover{color:#6b7a99}
        .card{background:#131928;border:1px solid #1e2640;border-radius:10px}
        .lbl{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#2d3a56;margin-bottom:6px}
        .disp{font-family:'Outfit',sans-serif;font-weight:800;line-height:1}
        .aibtn{background:linear-gradient(135deg,#b87a0a,#e2b96f);color:#0e1117;border:none;border-radius:6px;padding:12px 18px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:.06em;transition:all .2s;width:100%}
        .aibtn:hover{filter:brightness(1.1);transform:translateY(-1px)}
        .aibtn:disabled{filter:grayscale(.5);cursor:not-allowed;transform:none}
        .rh:hover>td{background:#161d2e!important}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .fade{animation:fadeUp .28s ease}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin{animation:spin 1s linear infinite;display:inline-block}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        .blink{animation:blink 1.4s infinite}
        .prose{white-space:pre-wrap;line-height:1.9;font-size:13px;color:#8896b0}
        .prose strong{color:#e2b96f;font-weight:600}
        .pill{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.04em}
        .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;letter-spacing:.06em}
        hr.dv{border:none;border-top:1px solid #1e2640;margin:14px 0}
      `}</style>

      {/* TOPBAR */}
      <div style={{height:56,flexShrink:0,display:"flex",alignItems:"stretch",background:"#0b0e18",borderBottom:"1px solid #1a2035"}}>
        <div style={{display:"flex",alignItems:"center",padding:"0 22px",gap:12,borderRight:"1px solid #1a2035",flexShrink:0}}>
          <div style={{width:38,height:38,borderRadius:9,background:"linear-gradient(135deg,#b87a0a,#e2b96f)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:12,color:"#0e1117",letterSpacing:"-.02em"}}>PCO</div>
          <div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:15,color:"#f0f4ff",letterSpacing:".03em"}}>PRECAST OPTIMIZER</div>
            <div style={{color:"#1e2a42",fontSize:10,letterSpacing:".16em",marginTop:1}}>L&T CREATECH '26 · AI CYCLE TIME SYSTEM</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"stretch",flex:1,paddingLeft:4,overflowX:"auto"}}>
          {TABS.map(t=>(
            <button key={t.id} className={`tb ${tab===t.id?"on":"off"}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:18,padding:"0 22px",borderLeft:"1px solid #1a2035",flexShrink:0}}>
          <div style={{textAlign:"right"}}>
            <div style={{color:"#1e2a42",fontSize:10,letterSpacing:".1em"}}>INDIA MARKET</div>
            <div style={{color:"#e2b96f",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>$6.69B → $17.37B</div>
          </div>
          <div style={{width:1,height:26,background:"#1a2035"}}/>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:computing?"#fbbf24":"#4ade80",boxShadow:`0 0 8px ${computing?"#fbbf24":"#4ade80"}`,transition:"all .3s"}}/>
            <span style={{color:"#1e2a42",fontSize:10,letterSpacing:".12em"}}>{computing?"COMPUTING":"LIVE"}</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* SIDEBAR */}
        <div style={{width:268,flexShrink:0,borderRight:"1px solid #1a2035",background:"#0b0e18",overflowY:"auto",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"18px 16px",flex:1}}>
            <div className="lbl" style={{marginBottom:16}}>Configuration</div>

            {[
              {label:"Region / Climate",  key:"region",    opts:Object.keys(CLIMATE)},
              {label:"Mix Design",        key:"mix",       opts:Object.keys(MIX)},
              {label:"Curing Method",     key:"curing",    opts:Object.keys(CURING)},
              {label:"Automation Level",  key:"automation",opts:Object.keys(AUTO)},
              {label:"Element Type",      key:"element",   opts:Object.keys(ELEMENTS)},
            ].map(({label,key,opts})=>(
              <div key={key} style={{marginBottom:13}}>
                <div className="lbl">{label}</div>
                <select className="sel" value={p[key]} onChange={e=>set(key,e.target.value)}>
                  {opts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}

            {[
              {label:"Target fck",key:"fck",    min:25,max:60, step:5,  unit:"MPa"},
              {label:"Quantity",  key:"quantity",min:20,max:500,step:10, unit:"nos"},
              {label:"Moulds",    key:"moulds",  min:1, max:20, step:1,  unit:"nos"},
            ].map(({label,key,min,max,step,unit})=>(
              <div key={key} style={{marginBottom:15}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                  <span className="lbl" style={{marginBottom:0}}>{label}</span>
                  <span style={{color:"#e2b96f",fontSize:13,fontWeight:600}}>{p[key]} {unit}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={p[key]} onChange={e=>set(key,+e.target.value)}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                  <span style={{color:"#1a2035",fontSize:10}}>{min}</span>
                  <span style={{color:"#1a2035",fontSize:10}}>{max}</span>
                </div>
              </div>
            ))}

            <hr className="dv"/>
            <div className="lbl" style={{marginBottom:10}}>AI Engine · Gemini 2.5 Flash</div>

            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span className="lbl" style={{marginBottom:0}}>Gemini API Key</span>
                {apiKey&&(
                  <span style={{color:"#4ade80",fontSize:10,letterSpacing:".08em"}}>✓ KEY SET</span>
                )}
              </div>
              <div style={{position:"relative"}}>
                <input
                  type={showKeyVisible?"text":"password"}
                  placeholder="AIza... (free at aistudio.google.com)"
                  value={apiKey}
                  onChange={e=>setApiKey(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&runAI()}
                  style={{paddingRight:38}}
                />
                <button
                  onClick={()=>setShowKeyVisible(v=>!v)}
                  style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#2d3a56",cursor:"pointer",fontSize:13,padding:0,lineHeight:1}}
                  title={showKeyVisible?"Hide key":"Show key"}
                >{showKeyVisible?"🙈":"👁"}</button>
              </div>
              <div style={{color:"#1e2a42",fontSize:10,marginTop:5,lineHeight:1.5}}>
                Get a free key at{" "}
                <span style={{color:"#e2b96f",cursor:"pointer",textDecoration:"underline"}}
                  onClick={()=>window.open("https://aistudio.google.com/apikey","_blank")}>
                  aistudio.google.com
                </span>
              </div>
            </div>

            <button className="aibtn" onClick={runAI} disabled={aiLoading||!res}>
              {aiLoading?<span><span className="spin">⟳</span> Analysing...</span>:"✦ Run AI Analysis"}
            </button>
            {aiError&&(
              <div style={{color:"#f87171",fontSize:11,marginTop:8,lineHeight:1.6,background:"#180e0e",padding:"8px 10px",borderRadius:5,border:"1px solid #3a1010"}}>{aiError}</div>
            )}
          </div>

          {res&&(
            <div style={{padding:"0 16px 18px"}}>
              <hr className="dv" style={{marginTop:0}}/>
              <div className="lbl" style={{marginBottom:10}}>Quick Stats</div>
              {[
                {label:"Cycle Time",   val:res.cycleHrs+" h",       color:cycleColor},
                {label:"De-mould",     val:res.demould70+" h",       color:"#a78bfa"},
                {label:"Daily Output", val:res.dailyOut+" els",      color:"#60a5fa"},
                {label:"Project",      val:res.projDays+" days",     color:"#c8d0e0"},
                {label:"Cost/Element", val:"₹"+res.totalCost.toLocaleString(), color:"#fbbf24"},
                {label:"vs Industry",  val:(res.cycleImp>0?"▼ ":"▲ ")+Math.abs(res.cycleImp)+"%", color:impColor},
              ].map(({label,val,color})=>(
                <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                  <span style={{color:"#2d3a56",fontSize:12}}>{label}</span>
                  <span style={{color,fontSize:13,fontWeight:600}}>{val}</span>
                </div>
              ))}
              <hr className="dv"/>
              <div style={{background:"#0c1a0e",border:"1px solid #1a3a1a",borderRadius:7,padding:"11px 13px",marginBottom:10}}>
                <div style={{color:"#4ade80",fontSize:10,letterSpacing:".12em",marginBottom:5}}>RECOMMENDATION</div>
                <div style={{color:"#86efac",fontSize:12,lineHeight:1.7}}>{res.rec}</div>
              </div>
              <div style={{background:"#0e1522",border:"1px solid #1e2e48",borderRadius:7,padding:"11px 13px"}}>
                <div style={{color:"#60a5fa",fontSize:10,letterSpacing:".12em",marginBottom:5}}>CLIMATE NOTE</div>
                <div style={{color:"#93c5fd",fontSize:12,lineHeight:1.7}}>{res.climateNote}</div>
              </div>
            </div>
          )}
        </div>

        {/* MAIN */}
        <div style={{flex:1,overflowY:"auto",padding:18,display:"flex",flexDirection:"column",gap:14}}>

          {/* ── DASHBOARD ── */}
          {res&&tab==="dashboard"&&(
            <div className="fade">
              {/* 6 KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:11,marginBottom:14}}>
                {[
                  {label:"Cycle Time",    val:res.cycleHrs+" h",  sub:"cast to reset",       color:cycleColor},
                  {label:"De-mould Point",val:res.demould70+" h", sub:"70% fck threshold",   color:"#a78bfa"},
                  {label:"Cycles / Day",  val:res.cyclesPerMould,  sub:"per mould",           color:"#60a5fa"},
                  {label:"Project Days",  val:res.projDays+" d",  sub:`${p.quantity} elements`,color:"#38bdf8"},
                  {label:"Cost/Element",  val:"₹"+res.totalCost.toLocaleString(), sub:"all-in estimate", color:"#fbbf24"},
                  {label:"vs Industry",   val:(res.cycleImp>0?"▼":"▲")+Math.abs(res.cycleImp)+"%", sub:"cycle improvement", color:impColor},
                ].map(k=>(
                  <div key={k.label} className="card" style={{padding:"16px 16px",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",bottom:-14,right:-6,fontSize:54,color:k.color,opacity:.05,fontFamily:"'Outfit',sans-serif",fontWeight:900,lineHeight:1,userSelect:"none"}}>{k.val}</div>
                    <div className="lbl" style={{marginBottom:8}}>{k.label}</div>
                    <div className="disp" style={{color:k.color,fontSize:24,marginBottom:5}}>{k.val}</div>
                    <div style={{color:"#1e2a42",fontSize:11}}>{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Benchmark bar */}
              <div className="card" style={{padding:"16px 20px",marginBottom:14}}>
                <div className="lbl" style={{marginBottom:14}}>Cycle Time Benchmark — vs Industry Standards (hours)</div>
                {[
                  {label:"Manual / Natural (Baseline)",  val:INDUSTRY_BENCHMARKS.manual.cycle,    color:"#f87171", you:false},
                  {label:"Industry Average — India 2024",val:INDUSTRY_BENCHMARKS.industry.cycle,  color:"#fbbf24", you:false},
                  {label:"Your Configuration",           val:res.cycleHrs,                         color:"#e2b96f", you:true},
                  {label:"Best-in-Class (PCI MNL-116)",  val:INDUSTRY_BENCHMARKS.optimized.cycle, color:"#4ade80", you:false},
                ].map((row,i)=>(
                  <div key={row.label} style={{display:"flex",alignItems:"center",gap:12,marginBottom:i<3?10:0}}>
                    <div style={{width:232,color:row.you?"#c8d0e0":"#3d4a66",fontSize:12,flexShrink:0}}>
                      {row.label}
                      {row.you&&<span className="badge" style={{background:"#2a2010",color:"#e2b96f",border:"1px solid #4a3818",marginLeft:8}}>YOU</span>}
                    </div>
                    <div style={{flex:1,background:"#1a2035",borderRadius:3,height:20,overflow:"hidden"}}>
                      <div style={{
                        width:`${(row.val/44)*100}%`,height:"100%",
                        background:row.you?`linear-gradient(90deg,${row.color}aa,${row.color})`:row.color+"44",
                        borderRadius:3,transition:"width .7s cubic-bezier(.4,0,.2,1)",
                      }}/>
                    </div>
                    <div style={{color:row.color,fontSize:15,fontWeight:800,fontFamily:"'Outfit',sans-serif",width:50,textAlign:"right",flexShrink:0}}>{row.val}h</div>
                  </div>
                ))}
              </div>

              {/* Radar + Cost */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1.65fr",gap:12,marginBottom:12}}>
                <div className="card" style={{padding:"16px 12px"}}>
                  <div className="lbl" style={{marginBottom:10}}>Performance Radar</div>
                  <ResponsiveContainer width="100%" height={224}>
                    <RadarChart data={res.radar} margin={{top:8,right:18,bottom:8,left:18}}>
                      <PolarGrid stroke="#1e2640"/>
                      <PolarAngleAxis dataKey="s" tick={{fill:"#3d4a66",fontSize:11}}/>
                      <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
                      <Radar dataKey="v" stroke="#e2b96f" fill="#e2b96f" fillOpacity={0.14} strokeWidth={2}
                        dot={{r:3,fill:"#e2b96f",strokeWidth:0}}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{padding:"16px 16px"}}>
                  <div className="lbl" style={{marginBottom:10}}>Cost Breakdown per Element (₹)</div>
                  <ResponsiveContainer width="100%" height={224}>
                    <BarChart data={[
                      {name:"Labour",    val:res.labourCost},
                      {name:"Curing",    val:res.curingCost},
                      {name:"Mould",     val:res.mouldAmort},
                      {name:"Automation",val:res.autoCost},
                      {name:"Misc",      val:Math.round(res.totalCost*.04)},
                    ]} margin={{top:10,right:14,left:-6,bottom:4}} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a2035"/>
                      <XAxis dataKey="name" tick={{fill:"#3d4a66",fontSize:11}}/>
                      <YAxis tick={{fill:"#3d4a66",fontSize:11}}/>
                      <Tooltip content={<ChartTip/>}/>
                      <Bar dataKey="val" name="₹" radius={[4,4,0,0]} fill="#e2b96f"
                        label={{position:"top",fill:"#3d4a66",fontSize:10,formatter:v=>"₹"+v.toLocaleString()}}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Climate strip */}
              <div className="card" style={{padding:"13px 20px"}}>
                <div className="lbl" style={{marginBottom:10}}>Regional Climate & Mix Parameters — {p.region}</div>
                <div style={{display:"flex"}}>
                  {[
                    ["Zone",       CLIMATE[p.region].zone],
                    ["Temp",       CLIMATE[p.region].temp+"°C"],
                    ["Humidity",   CLIMATE[p.region].rh+"%"],
                    ["Wind",       CLIMATE[p.region].wind+" km/h"],
                    ["Clim. Factor",(CLIMATE[p.region].factor*100).toFixed(0)+"%"],
                    ["Mix Std",    MIX[p.mix].std],
                    ["w/c Ratio",  MIX[p.mix].wc],
                    ["Cure Std",   CURING[p.curing].std],
                    ["fck",        p.fck+" MPa"],
                    ["Automation", p.automation],
                  ].map(([k,v],i,arr)=>(
                    <div key={k} style={{flex:1,padding:"0 12px",borderRight:i<arr.length-1?"1px solid #1a2035":"none",minWidth:0}}>
                      <div style={{color:"#1e2a42",fontSize:9,letterSpacing:".1em",marginBottom:4}}>{k}</div>
                      <div style={{color:"#6b7a99",fontSize:12,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STRENGTH ── */}
          {res&&tab==="strength"&&(
            <div className="fade" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="card" style={{padding:"18px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div>
                    <div className="lbl">Strength Gain Curve</div>
                    <div style={{color:"#c8d0e0",fontSize:15,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>{p.curing} Curing · {p.mix} · fck={p.fck} MPa · {p.region}</div>
                  </div>
                  <div style={{display:"flex",gap:7}}>
                    <span className="pill" style={{background:"#1a2e1a",color:"#4ade80",border:"1px solid #2a4a2a"}}>Nurse-Saul Maturity (IS:1343)</span>
                    <span className="pill" style={{background:"#1a2035",color:"#60a5fa",border:"1px solid #1e3060"}}>PCI MNL-116</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={res.curve} margin={{top:10,right:24,left:0,bottom:24}}>
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#e2b96f" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#e2b96f" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2035"/>
                    <XAxis dataKey="h" tick={{fill:"#3d4a66",fontSize:11}}
                      label={{value:"Time (hours)",fill:"#3d4a66",fontSize:11,position:"insideBottom",offset:-16}}/>
                    <YAxis tick={{fill:"#3d4a66",fontSize:11}} unit="%" domain={[0,105]}/>
                    <Tooltip content={({active,payload,label})=>active&&payload?.length?(
                      <div style={{background:"#131928",border:"1px solid #1e2640",padding:"10px 14px",borderRadius:6,fontSize:12}}>
                        <div style={{color:"#3d4a66",marginBottom:4}}>Hour {label}</div>
                        <div style={{color:"#e2b96f"}}>Strength: {payload[0]?.value}%</div>
                        <div style={{color:"#60a5fa"}}>Maturity: {res.curve.find(d=>d.h===label)?.maturity} °C·h</div>
                      </div>
                    ):null}/>
                    <ReferenceLine y={70} stroke="#4ade80" strokeDasharray="6 3"
                      label={{value:"70% fck — De-mould",fill:"#4ade80",fontSize:11,position:"insideTopRight"}}/>
                    <ReferenceLine x={res.demould70} stroke="#fbbf24" strokeDasharray="4 2"
                      label={{value:res.demould70+"h",fill:"#fbbf24",fontSize:11,position:"top"}}/>
                    <Area type="monotone" dataKey="pct" name="Strength %" stroke="#e2b96f" fill="url(#sg)" strokeWidth={2.5} dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{display:"flex",gap:28,marginTop:14,flexWrap:"wrap"}}>
                  {[
                    {label:"De-mould @ 70% fck",    val:res.demould70+"h",   color:"#4ade80"},
                    {label:"Full strength (28-day)", val:"168h",             color:"#60a5fa"},
                    {label:"Curing boost",           val:"+"+CURING[p.curing].boost+"%", color:"#e2b96f"},
                    {label:"Climate efficiency",     val:(CLIMATE[p.region].factor*100).toFixed(0)+"%", color:"#a78bfa"},
                  ].map(({label,val,color})=>(
                    <div key={label}>
                      <div style={{color:"#2d3a56",fontSize:11}}>{label}</div>
                      <div style={{color,fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",marginTop:3}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{padding:"16px 20px"}}>
                <div className="lbl" style={{marginBottom:12}}>Curing Method Comparison — 24h Strength from Dataset</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={Object.keys(CURING).map(method=>{
                    const r=HISTORICAL_DATA.filter(d=>d.cure===method);
                    return {method,"Avg Str @24h":+(r.reduce((s,d)=>s+d.str24,0)/Math.max(1,r.length)).toFixed(1),"Avg Cycle h":+(r.reduce((s,d)=>s+d.cycleHrs,0)/Math.max(1,r.length)).toFixed(1)};
                  })} margin={{top:4,right:12,left:-8,bottom:4}} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2035"/>
                    <XAxis dataKey="method" tick={{fill:"#3d4a66",fontSize:11}}/>
                    <YAxis yAxisId="l" tick={{fill:"#3d4a66",fontSize:11}} unit="%"/>
                    <YAxis yAxisId="r" orientation="right" tick={{fill:"#3d4a66",fontSize:11}} unit="h"/>
                    <Tooltip content={<ChartTip/>}/>
                    <Legend wrapperStyle={{color:"#3d4a66",fontSize:11}}/>
                    <Bar yAxisId="l" dataKey="Avg Str @24h" fill="#e2b96f" radius={[3,3,0,0]}/>
                    <Bar yAxisId="r" dataKey="Avg Cycle h"  fill="#60a5fa" radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── SCENARIOS ── */}
          {res&&tab==="scenarios"&&(
            <div className="fade" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="card" style={{padding:"18px 20px"}}>
                <div className="lbl" style={{marginBottom:4}}>All Curing Scenarios — AI Ranked</div>
                <div style={{color:"#2d3a56",fontSize:12,marginBottom:16}}>{p.element} · {p.mix} · {p.region} · fck={p.fck} MPa · {p.automation}</div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #1e2640"}}>
                      {["Rank","Method","Standard","Cycle (h)","vs Industry","Cost/El (₹)","Score"].map(h=>(
                        <th key={h} style={{color:"#1e2a42",fontSize:10,letterSpacing:".1em",padding:"8px 12px",textAlign:"left",fontWeight:600}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {res.scenarios.map((s,i)=>{
                      const isCur=s.method===p.curing;
                      return (
                        <tr key={s.method} className="rh" style={{borderBottom:"1px solid #0e1117",background:isCur?"#161d30":"transparent"}}>
                          <td style={{padding:"11px 12px",color:i===0?"#e2b96f":i===1?"#6b7a99":"#2d3a56",fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:16}}>#{i+1}</td>
                          <td style={{padding:"11px 12px"}}>
                            <span style={{color:isCur?"#e2b96f":"#8896b0",fontWeight:isCur?600:400}}>{s.method}</span>
                            {isCur&&<span className="badge" style={{background:"#2a2010",color:"#e2b96f",border:"1px solid #4a3818",marginLeft:8}}>ACTIVE</span>}
                            {i===0&&!isCur&&<span className="badge" style={{background:"#0e2010",color:"#4ade80",border:"1px solid #1a4020",marginLeft:8}}>BEST</span>}
                          </td>
                          <td style={{padding:"11px 12px",color:"#1e2a42",fontSize:11}}>{s.std}</td>
                          <td style={{padding:"11px 12px",color:i===0?"#4ade80":"#6b7a99",fontWeight:i===0?700:400,fontFamily:"'Outfit',sans-serif",fontSize:15}}>{s.cycleHrs}</td>
                          <td style={{padding:"11px 12px",color:s.imp>0?"#4ade80":"#f87171",fontSize:12}}>{s.imp>0?"▼":"▲"} {Math.abs(s.imp)}%</td>
                          <td style={{padding:"11px 12px",color:"#6b7a99"}}>₹{s.cost.toLocaleString()}</td>
                          <td style={{padding:"11px 12px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{width:80,height:4,background:"#1a2035",borderRadius:2,overflow:"hidden"}}>
                                <div style={{width:`${s.score}%`,height:"100%",background:i===0?"#e2b96f":"#2d3a56",borderRadius:2}}/>
                              </div>
                              <span style={{color:i===0?"#e2b96f":"#2d3a56",fontSize:12}}>{s.score.toFixed(0)}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{color:"#1a2035",fontSize:10,marginTop:12}}>Score = composite: cycle efficiency + cost-effectiveness + strength boost + climate suitability · Baseline: India avg {INDUSTRY_BENCHMARKS.industry.cycle}h</div>
              </div>
              <div className="card" style={{padding:"16px 20px"}}>
                <div className="lbl" style={{marginBottom:12}}>Cycle Time vs AI Score — All Methods</div>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={res.scenarios} margin={{top:5,right:20,left:-8,bottom:5}} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2035"/>
                    <XAxis dataKey="method" tick={{fill:"#3d4a66",fontSize:11}}/>
                    <YAxis yAxisId="l" tick={{fill:"#3d4a66",fontSize:11}}/>
                    <YAxis yAxisId="r" orientation="right" tick={{fill:"#3d4a66",fontSize:11}} domain={[0,100]}/>
                    <Tooltip content={<ChartTip/>}/>
                    <Legend wrapperStyle={{color:"#3d4a66",fontSize:11}}/>
                    <Bar yAxisId="l" dataKey="cycleHrs" name="Cycle (h)" fill="#60a5fa" radius={[3,3,0,0]}/>
                    <Bar yAxisId="r" dataKey="score"    name="AI Score"  fill="#e2b96f" radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── DATASET ── */}
          {tab==="dataset"&&(
            <div className="fade" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:11}}>
                {[
                  {label:"Total Records", val:"50",  color:"#e2b96f"},
                  {label:"Avg Cycle Time",val:(HISTORICAL_DATA.reduce((s,d)=>s+d.cycleHrs,0)/50).toFixed(1)+" h", color:"#fbbf24"},
                  {label:"Best Recorded", val:Math.min(...HISTORICAL_DATA.map(d=>d.cycleHrs)).toFixed(1)+" h",    color:"#4ade80"},
                  {label:"Avg Str @24h",  val:(HISTORICAL_DATA.reduce((s,d)=>s+d.str24,0)/50).toFixed(0)+"%",     color:"#a78bfa"},
                  {label:"Regions",       val:"7",   color:"#60a5fa"},
                ].map(k=>(
                  <div key={k.label} className="card" style={{padding:"14px 16px"}}>
                    <div className="lbl" style={{marginBottom:6}}>{k.label}</div>
                    <div className="disp" style={{color:k.color,fontSize:22}}>{k.val}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:"16px 18px"}}>
                <div className="lbl" style={{marginBottom:3}}>Historical Pour Records</div>
                <div style={{color:"#1e2a42",fontSize:11,marginBottom:14}}>50 records · IS:1343 / PCI calibrated · 7 regions · 6 element types · 4 curing methods</div>
                <div style={{overflowX:"auto",maxHeight:360,overflowY:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead style={{position:"sticky",top:0,background:"#131928",zIndex:1}}>
                      <tr style={{borderBottom:"1px solid #1e2640"}}>
                        {["#","Region","Mix","Curing","Auto","fck","Element","Cycle(h)","Str@24h","Cost","Demould","Quality"].map(h=>(
                          <th key={h} style={{color:"#1e2a42",fontSize:10,padding:"8px 10px",textAlign:"left",fontWeight:600,letterSpacing:".08em",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HISTORICAL_DATA.map((d,i)=>(
                        <tr key={d.id} className="rh" style={{borderBottom:"1px solid #0e1117",background:i%2===0?"transparent":"#0b0e18"}}>
                          <td style={{padding:"7px 10px",color:"#1e2a42"}}>{d.id}</td>
                          <td style={{padding:"7px 10px",color:"#6b7a99"}}>{d.region}</td>
                          <td style={{padding:"7px 10px",color:"#a78bfa"}}>{d.mix}</td>
                          <td style={{padding:"7px 10px",color:d.cure==="Steam"?"#e2b96f":d.cure==="Chemical"?"#4ade80":d.cure==="Polythene"?"#fbbf24":"#f87171"}}>{d.cure}</td>
                          <td style={{padding:"7px 10px",color:"#2d3a56"}}>{d.auto}</td>
                          <td style={{padding:"7px 10px",color:"#8896b0"}}>{d.fck}</td>
                          <td style={{padding:"7px 10px",color:"#6b7a99",whiteSpace:"nowrap"}}>{d.element}</td>
                          <td style={{padding:"7px 10px",fontWeight:600,color:d.cycleHrs<16?"#4ade80":d.cycleHrs<24?"#fbbf24":"#f87171",fontFamily:"'Outfit',sans-serif"}}>{d.cycleHrs}</td>
                          <td style={{padding:"7px 10px",color:d.str24>80?"#4ade80":d.str24>65?"#fbbf24":"#f87171"}}>{d.str24}%</td>
                          <td style={{padding:"7px 10px",color:"#6b7a99"}}>₹{d.cost.toLocaleString()}</td>
                          <td style={{padding:"7px 10px",color:"#2d3a56"}}>{d.demould}h</td>
                          <td style={{padding:"7px 10px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <div style={{width:d.quality*.5,height:3,borderRadius:2,background:d.quality>90?"#4ade80":d.quality>80?"#fbbf24":"#f87171"}}/>
                              <span style={{color:"#2d3a56",fontSize:11}}>{d.quality}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div className="card" style={{padding:"14px 16px"}}>
                  <div className="lbl" style={{marginBottom:10}}>Cycle Distribution by Curing</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={Object.keys(CURING).map(m=>{const r=HISTORICAL_DATA.filter(d=>d.cure===m);return {method:m,Avg:+(r.reduce((s,d)=>s+d.cycleHrs,0)/Math.max(1,r.length)).toFixed(1),Min:Math.min(...r.map(d=>d.cycleHrs))};
                    })} margin={{top:4,right:10,left:-8,bottom:4}} barSize={22}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a2035"/>
                      <XAxis dataKey="method" tick={{fill:"#3d4a66",fontSize:10}}/>
                      <YAxis tick={{fill:"#3d4a66",fontSize:10}} unit="h"/>
                      <Tooltip content={<ChartTip/>}/>
                      <Legend wrapperStyle={{color:"#3d4a66",fontSize:10}}/>
                      <Bar dataKey="Avg" fill="#e2b96f" radius={[2,2,0,0]}/>
                      <Bar dataKey="Min" fill="#4ade80" radius={[2,2,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{padding:"14px 16px"}}>
                  <div className="lbl" style={{marginBottom:10}}>Avg Strength @24h by Region</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={Object.keys(CLIMATE).map(r=>({region:r,"Str%":+(HISTORICAL_DATA.filter(d=>d.region===r).reduce((s,d)=>s+d.str24,0)/Math.max(1,HISTORICAL_DATA.filter(d=>d.region===r).length)).toFixed(1)}))} margin={{top:4,right:10,left:-8,bottom:4}} barSize={22}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a2035"/>
                      <XAxis dataKey="region" tick={{fill:"#3d4a66",fontSize:9}}/>
                      <YAxis tick={{fill:"#3d4a66",fontSize:10}} unit="%"/>
                      <Tooltip content={<ChartTip/>}/>
                      <Bar dataKey="Str%" fill="#a78bfa" radius={[2,2,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── IMPACT & ROI ── */}
          {res&&tab==="impact"&&(
            <div className="fade" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
                {[
                  {label:"Cycle Reduction vs Manual",val:res.vsManualCycle+"%",  sub:`${INDUSTRY_BENCHMARKS.manual.cycle}h → ${res.cycleHrs}h`, color:"#4ade80"},
                  {label:"Cost Saving vs Manual",    val:res.vsManualCost+"%",   sub:`₹${INDUSTRY_BENCHMARKS.manual.cost.toLocaleString()} → ₹${res.totalCost.toLocaleString()}`, color:"#34d399"},
                  {label:"Annual Savings Potential", val:"₹"+res.annualSav+"L", sub:`${p.quantity} els × 12 months`,color:"#fbbf24"},
                  {label:"India Market by 2033",     val:"$17.37B",              sub:"11.1% CAGR (MarketsandMarkets)",color:"#a78bfa"},
                ].map(k=>(
                  <div key={k.label} className="card" style={{padding:"18px 20px",borderColor:k.color+"22"}}>
                    <div className="lbl" style={{marginBottom:8}}>{k.label}</div>
                    <div className="disp" style={{color:k.color,fontSize:30,marginBottom:6}}>{k.val}</div>
                    <div style={{color:"#1e2a42",fontSize:11}}>{k.sub}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:"16px 20px"}}>
                <div className="lbl" style={{marginBottom:12}}>6-Month Throughput Projection</div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={res.throughput} margin={{top:8,right:24,left:0,bottom:8}}>
                    <defs>
                      <linearGradient id="go" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2035"/>
                    <XAxis dataKey="month" tick={{fill:"#3d4a66",fontSize:11}}/>
                    <YAxis tick={{fill:"#3d4a66",fontSize:11}}/>
                    <Tooltip content={<ChartTip/>}/>
                    <Legend wrapperStyle={{color:"#3d4a66",fontSize:11}}/>
                    <Area type="monotone" dataKey="optimized" name="Optimised" stroke="#4ade80" fill="url(#go)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="current"   name="Current"   stroke="#60a5fa" fill="url(#gc)" strokeWidth={1.5} strokeDasharray="4 2"/>
                    <Line  type="monotone" dataKey="target"   name="Target"    stroke="#fbbf24" strokeDasharray="6 3" strokeWidth={1.5} dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="card" style={{padding:"16px 20px"}}>
                <div className="lbl" style={{marginBottom:14}}>Quantified ROI — Full Comparison Table</div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #1e2640"}}>
                      {["Metric","Manual Baseline","Industry Avg","Your Config","Best-in-Class"].map((h,i)=>(
                        <th key={h} style={{color:i===3?"#e2b96f":i===4?"#4ade80":"#1e2a42",fontSize:10,padding:"8px 14px",textAlign:"left",fontWeight:600,letterSpacing:".08em"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Cycle Time (h)",  INDUSTRY_BENCHMARKS.manual.cycle,   INDUSTRY_BENCHMARKS.industry.cycle,  res.cycleHrs,                                             INDUSTRY_BENCHMARKS.optimized.cycle],
                      ["Cost/El (₹)",     "₹"+INDUSTRY_BENCHMARKS.manual.cost.toLocaleString(),"₹"+INDUSTRY_BENCHMARKS.industry.cost.toLocaleString(),"₹"+res.totalCost.toLocaleString(),"₹"+INDUSTRY_BENCHMARKS.optimized.cost.toLocaleString()],
                      ["Strength @24h",   "52–58%","65–72%",(res.curve.find(d=>d.h===24)?.pct||"--")+"%","88–92%"],
                      ["Cycles/Day/Mould","1","1–2",res.cyclesPerMould,"3"],
                      ["Defect Rate",     "14%","8%",(AUTO[p.automation].err*100).toFixed(0)+"%","2%"],
                    ].map(([label,...vals])=>(
                      <tr key={label} className="rh" style={{borderBottom:"1px solid #1a2035"}}>
                        <td style={{padding:"10px 14px",color:"#6b7a99",fontWeight:600}}>{label}</td>
                        {vals.map((v,i)=>(
                          <td key={i} style={{padding:"10px 14px",color:i===2?"#e2b96f":i===3?"#4ade80":"#2d3a56",fontWeight:i===2||i===3?700:400,fontFamily:i===2||i===3?"'Outfit',sans-serif":"inherit",fontSize:i===2||i===3?14:13}}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{color:"#1a2035",fontSize:10,marginTop:12}}>Sources: India precast $6.69B (2024) → $17.37B (2033) · Manual: CPWD SOR 2024 · Industry avg: L&T benchmarks · Best-in-class: PCI MNL-116</div>
              </div>
            </div>
          )}

          {/* ── ROADMAP ── */}
          {tab==="roadmap"&&(
            <div className="fade" style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div>
                  <div className="lbl">Implementation Roadmap</div>
                  <div style={{color:"#c8d0e0",fontSize:16,fontWeight:700,fontFamily:"'Outfit',sans-serif"}}>6-Phase Deployment Plan</div>
                </div>
                <span className="pill" style={{background:"#131928",color:"#60a5fa",border:"1px solid #1e3060"}}>24-week timeline</span>
              </div>
              {[
                {ph:"Phase 1",title:"Data Foundation & IoT",           dur:"Weeks 1–4",  color:"#60a5fa",steps:["Deploy in-situ temp + RH sensors at 2 pilot precast yards (Mumbai & Delhi)","Instrument mould occupancy sensors → MQTT → InfluxDB time-series pipeline","Collect 500+ historical pour records per IS:1343: w/c, cement grade, admixture, ambient conditions","Define 28 input features; cube test ground truth @ 6h, 12h, 24h, 48h, 7d, 28d"]},
                {ph:"Phase 2",title:"ML Model Training",               dur:"Weeks 5–10", color:"#a78bfa",steps:["XGBoost/LightGBM strength predictor: RMSE < 2 MPa on holdout (IS:1343 calibrated)","Nurse-Saul Maturity as physics-informed constraint (IS:1343 / ASTM C1074)","De-mould classifier: predict 70% fck ±1h, validated against cube tests","SHAP explainability: top-5 feature importances per prediction for engineer trust"]},
                {ph:"Phase 3",title:"Multi-Objective Optimization",    dur:"Weeks 9–13", color:"#4ade80",steps:["NSGA-II: minimize cycle_time + cost/element subject to IS:456 strength constraints","Bayesian optimization (Optuna) for curing protocol hyper-params (temp ramp, hold, cooldown)","Monte Carlo: climate variability ±3°C, ±15% RH for regional stress-testing","Output: Pareto-optimal strategies with 90% confidence bands"]},
                {ph:"Phase 4",title:"Dashboard & ERP Integration",     dur:"Weeks 12–16",color:"#fbbf24",steps:["React dashboard + Gemini 2.5 Flash for real-time protocol recommendations","FastAPI: /predict, /optimize, /simulate for SAP PM module integration","Mobile PWA: push notification when predicted strength hits 70% fck (±1h)","SAP PM link: auto-schedule mould reuse and labour allocation from AI output"]},
                {ph:"Phase 5",title:"Pilot & A/B Testing",             dur:"Weeks 15–24",color:"#fb923c",steps:["Pilot: 2 L&T yards (PSC girders + floor slabs), n=200 pours","A/B test: AI protocol vs engineer judgment; measure actual vs predicted delta","Weekly retraining: field corrections → MLflow + Docker CI/CD","KPI targets: 25–35% cycle reduction, 12–18% cost saving, defect < 5%"]},
                {ph:"Phase 6",title:"Scale Across India",              dur:"Months 6–12",color:"#f472b6",steps:["20+ L&T yards with region-specific calibration (7 climate zones)","Digital Twin: 3D mould yard simulation linked to cycle optimizer","GenAI layer: Gemini daily cycle reports in natural language for PMs","SaaS: licence to external Indian precast contractors — ₹2L/yard/year"]},
              ].map((phase,i)=>(
                <div key={i} style={{display:"flex",gap:14}}>
                  <div style={{width:3,background:phase.color,borderRadius:2,flexShrink:0,alignSelf:"stretch"}}/>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <span className="pill" style={{background:phase.color+"18",color:phase.color,border:`1px solid ${phase.color}44`}}>{phase.ph}</span>
                      <span style={{color:"#c8d0e0",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14}}>{phase.title}</span>
                      <span style={{color:"#1e2a42",fontSize:10,marginLeft:"auto",flexShrink:0}}>{phase.dur}</span>
                    </div>
                    <div className="card" style={{padding:"12px 16px"}}>
                      {phase.steps.map((s,j)=>(
                        <div key={j} style={{display:"flex",gap:10,marginBottom:j<phase.steps.length-1?8:0}}>
                          <span style={{color:phase.color,fontSize:8,marginTop:5,flexShrink:0}}>◆</span>
                          <span style={{color:"#6b7a99",fontSize:12,lineHeight:1.7}}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="card" style={{padding:"14px 18px"}}>
                <div className="lbl" style={{marginBottom:12}}>Tech Stack</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {[["ML/AI","XGBoost · LightGBM · SHAP · PyTorch"],["Optimization","NSGA-II · Optuna · SciPy"],["Backend","FastAPI · Python 3.11 · PostgreSQL · InfluxDB"],["Frontend","React · Recharts · Gemini 2.5 Flash"],["IoT","RPi · MQTT · AWS IoT Core"],["MLOps","MLflow · Docker · Kubernetes"],["Cloud","AWS / Azure · S3 · Lambda"],["Integration","SAP PM · REST/GraphQL · Power BI"]].map(([cat,val])=>(
                    <div key={cat} style={{background:"#0e1117",border:"1px solid #1a2035",borderRadius:6,padding:"8px 12px",minWidth:188}}>
                      <div style={{color:"#e2b96f",fontSize:9,letterSpacing:".1em",marginBottom:3}}>{cat}</div>
                      <div style={{color:"#2d3a56",fontSize:11}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── AI ANALYSIS ── */}
          {tab==="ai"&&(
            <div className="fade" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="card" style={{padding:"24px 26px"}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
                  <div style={{width:46,height:46,borderRadius:11,background:"linear-gradient(135deg,#b87a0a,#e2b96f)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>✦</div>
                  <div>
                    <div style={{color:"#f0f4ff",fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:18}}>Gemini 2.5 Flash — Expert Analysis</div>
                    <div style={{color:"#1e2a42",fontSize:12,marginTop:3}}>Senior Precast Engineer · IS:1343 / PCI MNL-116 · Real-time protocol assessment</div>
                  </div>
                  {res&&(
                    <div style={{marginLeft:"auto",display:"flex",gap:7,flexWrap:"wrap"}}>
                      {[{v:p.element,c:"#60a5fa"},{v:p.mix,c:"#a78bfa"},{v:p.region,c:"#e2b96f"},{v:res.cycleHrs+"h",c:"#4ade80"}].map(({v,c})=>(
                        <span key={v} className="pill" style={{background:c+"15",color:c,border:`1px solid ${c}33`}}>{v}</span>
                      ))}
                    </div>
                  )}
                </div>

                {aiLoading&&(
                  <div style={{display:"flex",alignItems:"center",gap:14,padding:"36px 0",color:"#2d3a56"}}>
                    <span className="spin" style={{fontSize:22,color:"#e2b96f"}}>✦</span>
                    <span style={{fontSize:12,letterSpacing:".14em"}} className="blink">GEMINI 2.5 FLASH ANALYSING CONFIGURATION...</span>
                  </div>
                )}

                {aiText!=null&&!aiLoading&&(()=>{
                  const ai = aiText;
                  const verdictColor = ai.verdict==="OPTIMAL"?"#4ade80":ai.verdict==="GOOD"?"#fbbf24":"#f87171";
                  const severityColor = s => s==="HIGH"?"#f87171":s==="MEDIUM"?"#fbbf24":"#4ade80";
                  const compColor = s => s==="COMPLIANT"?"#4ade80":s==="MARGINAL"?"#fbbf24":"#f87171";

                  // Graceful fallback if verdict is missing (partial parse)
                  if (!ai.verdict) {
                    return (
                      <div style={{background:"#180e0e",border:"1px solid #3a1010",borderRadius:8,padding:"16px 18px"}}>
                        <div style={{color:"#f87171",fontSize:11,letterSpacing:".1em",marginBottom:8}}>PARTIAL RESPONSE — Could not fully parse AI output</div>
                        <pre style={{color:"#6b7a99",fontSize:11,whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{JSON.stringify(ai,null,2)}</pre>
                      </div>
                    );
                  }

                  return (
                    <div style={{display:"flex",flexDirection:"column",gap:14}}>
                      {/* Verdict banner */}
                      <div style={{background:verdictColor+"12",border:`1px solid ${verdictColor}33`,borderRadius:8,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:22,color:verdictColor}}>{ai.verdict}</div>
                        <div style={{color:"#c8d0e0",fontSize:13,lineHeight:1.6}}>{ai.verdictReason}</div>
                      </div>

                      {/* Protocol Assessment */}
                      <div style={{background:"#0e1522",border:"1px solid #1e2e48",borderRadius:8,padding:"14px 18px"}}>
                        <div style={{color:"#60a5fa",fontSize:10,letterSpacing:".14em",marginBottom:8,fontWeight:600}}>PROTOCOL ASSESSMENT</div>
                        <div style={{color:"#93c5fd",fontSize:13,lineHeight:1.8}}>{ai.protocolAssessment}</div>
                      </div>

                      {/* Recommendations */}
                      <div style={{background:"#0c1a0e",border:"1px solid #1a3a1a",borderRadius:8,padding:"14px 18px"}}>
                        <div style={{color:"#4ade80",fontSize:10,letterSpacing:".14em",marginBottom:12,fontWeight:600}}>CRITICAL RECOMMENDATIONS — RANKED BY IMPACT</div>
                        <div style={{display:"flex",flexDirection:"column",gap:10}}>
                          {(ai.recommendations||[]).map((rec,i)=>(
                            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                              <div style={{width:28,height:28,borderRadius:6,background:"#4ade80"+(i===0?"":"33"),display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:13,color:i===0?"#0e1117":"#4ade80",flexShrink:0}}>#{rec.rank}</div>
                              <div style={{flex:1}}>
                                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                                  <span style={{color:"#c8d0e0",fontSize:13,fontWeight:600}}>{rec.action}</span>
                                  <span style={{background:"#4ade8022",color:"#4ade80",border:"1px solid #4ade8044",borderRadius:20,padding:"1px 8px",fontSize:11,fontWeight:600}}>{rec.improvement}</span>
                                </div>
                                <div style={{color:"#6b7a99",fontSize:12,lineHeight:1.65}}>{rec.detail}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Risks + Quality side by side */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        <div style={{background:"#1a0e0e",border:"1px solid #3a1010",borderRadius:8,padding:"14px 18px"}}>
                          <div style={{color:"#f87171",fontSize:10,letterSpacing:".14em",marginBottom:12,fontWeight:600}}>RISK FLAGS</div>
                          {(ai.risks||[]).map((risk,i)=>(
                            <div key={i} style={{marginBottom:i<(ai.risks.length-1)?12:0}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                                <span style={{background:severityColor(risk.severity)+"22",color:severityColor(risk.severity),border:`1px solid ${severityColor(risk.severity)}44`,borderRadius:3,padding:"1px 7px",fontSize:10,fontWeight:700}}>{risk.severity}</span>
                                <span style={{color:"#fca5a5",fontSize:13,fontWeight:600}}>{risk.risk}</span>
                              </div>
                              <div style={{color:"#6b7a99",fontSize:12,lineHeight:1.65,marginBottom:4}}>{risk.detail}</div>
                              <div style={{color:"#4ade8099",fontSize:11}}>→ {risk.mitigation}</div>
                            </div>
                          ))}
                        </div>

                        <div style={{background:"#0f0f1e",border:"1px solid #2a1f3e",borderRadius:8,padding:"14px 18px"}}>
                          <div style={{color:"#a78bfa",fontSize:10,letterSpacing:".14em",marginBottom:12,fontWeight:600}}>QUALITY INDICATORS</div>
                          {ai.quality&&(
                            <div style={{display:"flex",flexDirection:"column",gap:9}}>
                              {[
                                {label:"28-Day Strength",  val:ai.quality.strength28day,        color:"#c8d0e0"},
                                {label:"Defect Probability",val:ai.quality.defectProbability,   color:"#fbbf24"},
                                {label:"IS Compliance",    val:ai.quality.complianceStatus,     color:compColor(ai.quality.complianceStatus)},
                              ].map(({label,val,color})=>(
                                <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1e2640",paddingBottom:8}}>
                                  <span style={{color:"#3d4a66",fontSize:12}}>{label}</span>
                                  <span style={{color,fontSize:13,fontWeight:700,fontFamily:"'Outfit',sans-serif"}}>{val}</span>
                                </div>
                              ))}
                              <div style={{color:"#6b7a99",fontSize:11,lineHeight:1.65,marginTop:2}}>{ai.quality.complianceNote}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ROI */}
                      {ai.roi&&(
                        <div style={{background:"#0e1a10",border:"1px solid #1a3a1a",borderRadius:8,padding:"14px 18px"}}>
                          <div style={{color:"#4ade80",fontSize:10,letterSpacing:".14em",marginBottom:10,fontWeight:600}}>ROI SUMMARY</div>
                          <div style={{display:"flex",gap:0,marginBottom:10}}>
                            {[
                              {label:"Saving / Element",   val:ai.roi.savingPerElement},
                              {label:"Annual Saving",       val:ai.roi.annualSaving},
                              {label:"Payback Period",      val:ai.roi.paybackMonths+" months"},
                            ].map(({label,val},i,arr)=>(
                              <div key={label} style={{flex:1,padding:"0 16px",borderRight:i<arr.length-1?"1px solid #1a3a1a":"none"}}>
                                <div style={{color:"#2d4a2d",fontSize:10,marginBottom:4}}>{label}</div>
                                <div style={{color:"#4ade80",fontSize:16,fontWeight:800,fontFamily:"'Outfit',sans-serif"}}>{val}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{color:"#86efac",fontSize:13,lineHeight:1.7}}>{ai.roi.summary}</div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {aiText==null&&!aiLoading&&(
                  <div style={{padding:"40px 0",textAlign:"center"}}>
                    <div style={{fontSize:40,marginBottom:16,opacity:.12}}>✦</div>
                    <div style={{color:"#2d3a56",fontSize:15,marginBottom:8}}>
                      Click <strong style={{color:"#e2b96f"}}>Run AI Analysis</strong> in the sidebar
                    </div>
                    <div style={{color:"#1e2a42",fontSize:12,maxWidth:460,margin:"0 auto",lineHeight:1.8}}>
                      Gemini 2.5 Flash will assess your configuration against IS:1343, IS:456, and PCI MNL-116,
                      returning quantified recommendations with specific % improvements and ₹ impact figures.
                    </div>
                    <div style={{marginTop:18,display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
                      {["Protocol Assessment","Risk Flags","3 Ranked Recommendations","ROI in ₹","IS Code Citations"].map(t=>(
                        <span key={t} className="pill" style={{background:"#131928",color:"#2d3a56",border:"1px solid #1e2640"}}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {res&&(
                <div className="card" style={{padding:"14px 18px"}}>
                  <div className="lbl" style={{marginBottom:8}}>Context Sent to Gemini 2.5 Flash</div>
                  <div style={{background:"#0e1117",borderRadius:6,padding:"12px 14px",fontSize:11,color:"#1e2a42",lineHeight:2}}>
                    <span style={{color:"#e2b96f"}}>Element:</span> {p.element} ({p.mix}, fck={p.fck}MPa) &nbsp;|&nbsp;
                    <span style={{color:"#e2b96f"}}>Region:</span> {p.region} ({CLIMATE[p.region].temp}°C, {CLIMATE[p.region].rh}% RH) &nbsp;|&nbsp;
                    <span style={{color:"#e2b96f"}}>Curing:</span> {p.curing} ({CURING[p.curing].std}) &nbsp;|&nbsp;
                    <span style={{color:"#e2b96f"}}>Auto:</span> {p.automation}<br/>
                    <span style={{color:"#e2b96f"}}>Cycle:</span> {res.cycleHrs}h &nbsp;|&nbsp;
                    <span style={{color:"#e2b96f"}}>De-mould @70%:</span> {res.demould70}h &nbsp;|&nbsp;
                    <span style={{color:"#e2b96f"}}>Cost/el:</span> ₹{res.totalCost.toLocaleString()} &nbsp;|&nbsp;
                    <span style={{color:"#e2b96f"}}>vs Manual:</span> {res.vsManualCycle}% faster<br/>
                    <span style={{color:"#1a2035"}}>Benchmarks injected: PCI MNL-116 · IS:1343 · IS:456 · CPWD SOR 2024 · MarketsandMarkets 2024</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}