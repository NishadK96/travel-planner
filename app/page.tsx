"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BedDouble, Check, ChevronRight, Clock3, ExternalLink, MapPin, Navigation, Phone, Route, Utensils } from "lucide-react";

type Stop = { id:string; name:string; district:string; phone:string; address:string; lat:number; lon:number; time:string; duration:string; distance:string };
type DayPlan = { day:number; title:string; start:string; stay:string; distance:string; driving:string; depart:string; lunch:string; color:string; stops:Stop[]; startPoint:{name:string;lat:number;lon:number}; routePoints?:{name:string;lat:number;lon:number}[]; notes:string };

// Town-level map positions; address-based navigation below identifies the branch.
const plans: DayPlan[] = [
  {
    "day": 1,
    "title": "Local branches · return to Anand Hotel",
    "start": "Anand Hotel, Central Junction",
    "stay": "Anand Hotel",
    "distance": "~65.4 km",
    "driving": "~3–4 hr incl. waits",
    "depart": "9:00 AM",
    "lunch": "1:00–1:45 PM · Athirampuzha",
    "color": "#ea580c",
    "startPoint": {
      "name": "Anand Hotel",
      "lat": 9.589901,
      "lon": 76.522752
    },
    "routePoints": [
      {
        "name": "Anand Hotel",
        "lat": 9.589901,
        "lon": 76.522752
      },
      {
        "name": "Chingavanam",
        "lat": 9.531,
        "lon": 76.536
      },
      {
        "name": "Kottayam connection",
        "lat": 9.589901,
        "lon": 76.522752
      },
      {
        "name": "Athirampuzha",
        "lat": 9.668,
        "lon": 76.532
      },
      {
        "name": "Kallara",
        "lat": 9.726,
        "lon": 76.477
      },
      {
        "name": "Anand Hotel return",
        "lat": 9.589901,
        "lon": 76.522752
      }
    ],
    "notes": "9:00–10:00: hotel → Chingavanam by MC Road bus, plus walk/auto. 10:45–12:15: return to Kottayam and change for Athirampuzha. Lunch 1:00–1:45; tea/rest 1:45–2:00. 2:00–2:30: bus/auto to Kallara; confirm a direct service locally. 3:15–5:00: return to Anand Hotel (~23.1 km road estimate). Overnight at the same hotel. Distance includes the return journey.",
    "stops": [
      {
        "id": "chingavanam",
        "name": "Chingavanam",
        "district": "Kottayam",
        "phone": "9037854764",
        "address": "Ward No. II/134C, Kunutharayil Arcade, M.C. Road, Chingavanam P.O., 686531",
        "lat": 9.531,
        "lon": 76.536,
        "time": "10:00–10:45 AM",
        "duration": "45 min visit",
        "distance": "~9.3 km"
      },
      {
        "id": "athirampuzha",
        "name": "Athirampuzha",
        "district": "Kottayam",
        "phone": "9037854116",
        "address": "Pannackal Buildings, Central Junction, Athirampuzha, 686562",
        "lat": 9.668,
        "lon": 76.532,
        "time": "12:15–1:00 PM",
        "duration": "45 min visit",
        "distance": "~22.0 km via Kottayam"
      },
      {
        "id": "kallara",
        "name": "Kallara",
        "district": "Kottayam",
        "phone": "9037854210",
        "address": "Niravathaniyil Building, Kallara South P.O., Kallara, 686611",
        "lat": 9.726,
        "lon": 76.477,
        "time": "2:30–3:15 PM",
        "duration": "45 min visit",
        "distance": "~11.0 km"
      }
    ]
  },
  {
    "day": 2,
    "title": "KK Road branches · stay in Erumely",
    "start": "Anand Hotel, Central Junction",
    "stay": "Erumely town",
    "distance": "~67.1 km",
    "driving": "~3–4 hr incl. waits",
    "depart": "9:00 AM",
    "lunch": "12:45–1:30 PM · Mundakayam",
    "color": "#0f766e",
    "startPoint": {
      "name": "Anand Hotel",
      "lat": 9.589901,
      "lon": 76.522752
    },
    "notes": "9:00–10:00: take a Pampady/KK Road bus from Kottayam. 10:45–12:00: continue on KK Road to Mundakayam. Lunch 12:45–1:30; tea/rest 1:30–1:45. 1:45–2:30: change to an Erumely-bound bus. After the final visit, walk/auto to a hotel near Erumely bus stand; check in around 3:30–4:00 PM. Do not return to Anand Hotel. Accommodation is a suggested area, not a booking.",
    "stops": [
      {
        "id": "pampady",
        "name": "Pampady",
        "district": "Kottayam",
        "phone": "9037854212",
        "address": "Do. No. 72, Ward No. VII, Rhema Centre, K.K. Road, Vattamalappady, Pampady P.O., 686502",
        "lat": 9.566,
        "lon": 76.64,
        "time": "10:00–10:45 AM",
        "duration": "45 min visit",
        "distance": "~16.5 km"
      },
      {
        "id": "mundakayam",
        "name": "Mundakayam",
        "district": "Kottayam",
        "phone": "9037854640",
        "address": "Do. No. 341(C), Kuttenchirayil Building, Mundakayam P.O., 686513",
        "lat": 9.5441213,
        "lon": 76.876874,
        "time": "12:00–12:45 PM",
        "duration": "45 min visit",
        "distance": "~36.1 km"
      },
      {
        "id": "erumely",
        "name": "Erumely",
        "district": "Kottayam",
        "phone": "9037854146",
        "address": "Do. No. B, Ward No. XX, Modern Dental Tower, Erumely–Mundakayam Road, Erumely P.O., 686509",
        "lat": 9.4813743,
        "lon": 76.8448927,
        "time": "2:30–3:15 PM",
        "duration": "45 min visit",
        "distance": "~14.5 km"
      }
    ]
  },
  {
    "day": 3,
    "title": "Erumely to Pala-area branches",
    "start": "Erumely town",
    "stay": "Finish at Pravithanam",
    "distance": "~52.1 km",
    "driving": "~3–4 hr incl. waits",
    "depart": "7:45 AM",
    "lunch": "12:15–1:00 PM · Pala",
    "color": "#2563eb",
    "startPoint": {
      "name": "Erumely",
      "lat": 9.4813743,
      "lon": 76.8448927
    },
    "routePoints": [
      {
        "name": "Erumely",
        "lat": 9.4813743,
        "lon": 76.8448927
      },
      {
        "name": "Kanjirappally connection",
        "lat": 9.557,
        "lon": 76.789
      },
      {
        "name": "Erattupetta connection",
        "lat": 9.686,
        "lon": 76.782
      },
      {
        "name": "Bharananganam",
        "lat": 9.702,
        "lon": 76.724
      },
      {
        "name": "Palai",
        "lat": 9.713,
        "lon": 76.686
      },
      {
        "name": "Pravithanam",
        "lat": 9.761,
        "lon": 76.689
      }
    ],
    "notes": "7:45–10:15: Erumely → Kanjirappally → Erattupetta → Bharananganam, changing buses as needed; confirm these connections the previous evening. 11:00–11:30: Pala-bound bus to the Palai branch area. Lunch 12:15–1:00; rest 1:00–1:15. 1:15–2:00: take a Pravithanam/Anthinad-bound bus from Pala; confirm the stop with the conductor. Finish at 2:45 PM. No Day 3 return or hotel transfer is included; choose onward travel after work.",
    "stops": [
      {
        "id": "bharananganam",
        "name": "Bharananganam",
        "district": "Kottayam",
        "phone": "9037854010",
        "address": "Do. No. 1/243–249, Ward No. VII, Njayarkulam Buildings, Pala–Erattupetta Main Road, opposite St. Alphonsa Shrine Church, Bharananganam P.O., 686578",
        "lat": 9.702,
        "lon": 76.724,
        "time": "10:15–11:00 AM",
        "duration": "45 min visit",
        "distance": "~40.6 km via Kanjirappally / Erattupetta"
      },
      {
        "id": "palai",
        "name": "Palai (Pala)",
        "district": "Kottayam",
        "phone": "9037854062",
        "address": "Door No. 11/39-3, Ward No. 11, Kuthivalachel Building, Pala–Erattupetta Road, Pala P.O., Meenachil Taluk, 686575",
        "lat": 9.713,
        "lon": 76.686,
        "time": "11:30 AM–12:15 PM",
        "duration": "45 min visit",
        "distance": "~4.9 km"
      },
      {
        "id": "pravithanam",
        "name": "Pravithanam",
        "district": "Kottayam",
        "phone": "9037854183",
        "address": "Do. No. 74/F, Ward No. 10, Chooranolickal Arcade, Anthinad Junction, Pravithanam, 686651",
        "lat": 9.761,
        "lon": 76.689,
        "time": "2:00–2:45 PM",
        "duration": "45 min visit",
        "distance": "~6.6 km"
      }
    ]
  }
];

declare global { interface Window { L?: any } }

function googleRoute(plan:DayPlan){const points=plan.routePoints??[plan.startPoint,...plan.stops];const origin=`${points[0].lat},${points[0].lon}`;const last=points.at(-1)!;const waypoints=points.slice(1,-1).map(p=>`${p.lat},${p.lon}`).join("|");return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${last.lat},${last.lon}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`}

function MapPanel({plan}:{plan:DayPlan}){
  const node=useRef<HTMLDivElement>(null); const mapRef=useRef<any>(null);
  useEffect(()=>{let cancelled=false;const init=()=>{if(cancelled||!node.current||!window.L)return;if(mapRef.current)mapRef.current.remove();const L=window.L;const map=L.map(node.current,{zoomControl:false,scrollWheelZoom:false,dragging:false,touchZoom:false,doubleClickZoom:false,boxZoom:false,keyboard:false});mapRef.current=map;L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(map);const points=plan.routePoints??[plan.startPoint,...plan.stops];const bounds=L.latLngBounds(points.map(p=>[p.lat,p.lon]));points.forEach((p,index)=>{const marker=L.divIcon({className:"route-marker",html:`<span style="background:${index===0?"#172554":plan.color}">${index===0?"S":(plan.stops.findIndex(s=>s.lat===p.lat&&s.lon===p.lon)+1||"↔")}</span>`,iconSize:[30,30],iconAnchor:[15,15]});L.marker([p.lat,p.lon],{icon:marker,interactive:false}).addTo(map)});map.fitBounds(bounds,{padding:[24,24]});const coords=points.map(p=>`${p.lon},${p.lat}`).join(";");fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`).then(r=>r.json()).then((data:any)=>{if(!cancelled&&data.routes?.[0])L.geoJSON(data.routes[0].geometry,{style:{color:plan.color,weight:5,opacity:.9},interactive:false}).addTo(map)}).catch(()=>L.polyline(points.map(p=>[p.lat,p.lon]),{color:plan.color,weight:4,dashArray:"8 8",interactive:false}).addTo(map))};if(window.L)init();else{if(!document.querySelector("link[data-leaflet]")){const css=document.createElement("link");css.rel="stylesheet";css.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";css.dataset.leaflet="true";document.head.appendChild(css)}const existing=document.querySelector<HTMLScriptElement>("script[data-leaflet]");if(existing)existing.addEventListener("load",init,{once:true});else{const script=document.createElement("script");script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";script.dataset.leaflet="true";script.onload=init;document.body.appendChild(script)}}return()=>{cancelled=true;if(mapRef.current){mapRef.current.remove();mapRef.current=null}}},[plan]);
  return <div ref={node} className="h-full min-h-0 w-full" aria-label={`Day ${plan.day} route map`}/>;
}

export default function Home(){
  const[activeDay,setActiveDay]=useState(1);const[visited,setVisited]=useState<string[]>([]);const plan=plans[activeDay-1];
  useEffect(()=>{try{setVisited(JSON.parse(localStorage.getItem("kottayam-nine-route-progress")||"[]"))}catch{}},[]);
  useEffect(()=>{localStorage.setItem("kottayam-nine-route-progress",JSON.stringify(visited))},[visited]);
  const allStops=useMemo(()=>plans.flatMap(p=>p.stops),[]);const nextStop=allStops.find(s=>!visited.includes(s.id));const toggle=(id:string)=>setVisited(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
  return <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-5 px-5 py-5 lg:px-8">
      <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-blue-950 text-white"><Route size={23}/></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">Field Visit Plan</p><h1 className="text-xl font-bold tracking-tight sm:text-2xl">Kottayam · 3-Day Route</h1></div></div>
      <div className="flex min-w-[260px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><div className="min-w-0 flex-1"><div className="flex justify-between text-sm font-semibold"><span>Trip progress</span><span>{visited.length}/9</span></div><Progress value={(visited.length/9)*100} className="mt-2 h-2"/></div><div className="grid size-9 place-items-center rounded-lg bg-white text-blue-800 shadow-sm"><Check size={18}/></div></div>
    </div></header>
    <section className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8">
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="mb-1 text-sm font-medium text-slate-500">Anand Hotel start · 9 branches · ~184.6 km including Day 1 return · estimated road distance along planned bus corridors</p><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Three branches maximum. Every visit before 5 PM.</h2></div>{nextStop&&<div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm"><span className="text-blue-700">Next pending</span><strong className="ml-2 text-blue-950">{nextStop.name}</strong></div>}</div>
      <Tabs value={String(activeDay)} onValueChange={v=>setActiveDay(Number(v))}><TabsList className="mb-5 grid h-[52px] w-full grid-cols-3 rounded-xl bg-slate-200/70 p-1.5 md:w-[660px]">{plans.map(item=><TabsTrigger key={item.day} value={String(item.day)} className="h-full min-h-0 rounded-lg px-1 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm sm:px-3"><span className="font-bold">Day {item.day}</span><span className="ml-2 hidden text-slate-500 md:inline">{item.stops.length} stops</span></TabsTrigger>)}</TabsList></Tabs>
      <div className="grid overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,.08)] xl:grid-cols-[minmax(0,1.15fr)_minmax(440px,.85fr)] xl:items-start">
        <div onWheel={event=>{event.preventDefault();window.scrollBy(0,event.deltaY)}} className="relative h-[320px] min-h-0 overflow-hidden rounded-t-2xl border-b border-slate-200 sm:h-[430px] xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)] xl:max-h-[760px] xl:min-h-[560px] xl:rounded-l-2xl xl:rounded-tr-none xl:border-b-0 xl:border-r"><MapPanel plan={plan}/><div className="pointer-events-none absolute bottom-3 left-3 right-3 z-[500] max-w-fit rounded-xl border border-white/60 bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Day {plan.day} route</p><p className="mt-1 font-bold">{plan.start} <ChevronRight className="inline" size={15}/> {plan.stay}</p></div></div>
        <aside className="flex min-w-0 flex-col"><div className="border-b border-slate-200 p-4 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold" style={{color:plan.color}}>DAY {plan.day}</p><h3 className="mt-1 text-xl font-bold">{plan.title}</h3></div><a className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900 sm:w-auto" href={googleRoute(plan)} target="_blank" rel="noreferrer">Open full route <ExternalLink size={16}/></a></div>
          <div className="mt-5 grid grid-cols-3 gap-3"><Metric icon={<Navigation size={17}/>} label="Est. road distance" value={plan.distance}/><Metric icon={<Clock3 size={17}/>} label="Bus travel" value={plan.driving}/><Metric icon={<BedDouble size={17}/>} label="Stay" value={plan.stay}/></div><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600"><span><strong className="text-slate-900">Depart:</strong> {plan.depart}</span><span className="inline-flex items-center gap-1.5"><Utensils size={15}/><strong className="text-slate-900">Lunch:</strong> {plan.lunch}</span></div></div>
          <div className="p-4 sm:p-6"><div className="relative space-y-4 before:absolute before:bottom-8 before:left-[17px] before:top-8 before:w-px before:bg-slate-200">{plan.stops.map((stop,index)=>{const done=visited.includes(stop.id);return <article key={stop.id} className={`relative grid grid-cols-[36px_minmax(0,1fr)] gap-3 rounded-xl border p-3 transition sm:p-4 ${done?"border-emerald-200 bg-emerald-50/70":"border-slate-200 bg-white hover:border-slate-300"}`}>
            <button onClick={()=>toggle(stop.id)} aria-label={done?`Mark ${stop.name} pending`:`Mark ${stop.name} visited`} className={`relative z-10 grid size-9 place-items-center rounded-full border-4 border-white text-sm font-bold text-white shadow-sm ${done?"bg-emerald-600":""}`} style={!done?{background:plan.color}:undefined}>{done?<Check size={17}/>:index+1}</button>
            <div className="min-w-0"><div className="flex flex-wrap items-start justify-between gap-2"><div><h4 className={`text-lg font-bold ${done?"line-through decoration-emerald-600/50":""}`}>{stop.name}</h4><p className="text-sm text-slate-500">{stop.district} · {stop.distance} from previous</p></div><span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">{stop.time}</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{stop.address}</p><div className="mt-3 flex flex-wrap gap-2"><a className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold hover:bg-slate-50" href={`tel:${stop.phone}`}><Phone size={15}/>{stop.phone}</a><a className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold hover:bg-slate-50" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`South Indian Bank ${stop.name}, ${stop.address}`)}`} target="_blank" rel="noreferrer"><MapPin size={15}/>Navigate</a><a className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold hover:bg-slate-50" href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(index===0?`${plan.startPoint.lat},${plan.startPoint.lon}`:`South Indian Bank ${plan.stops[index-1].name}, ${plan.stops[index-1].address}`)}&destination=${encodeURIComponent(`South Indian Bank ${stop.name}, ${stop.address}`)}&travelmode=transit`} target="_blank" rel="noreferrer"><Navigation size={15}/>Check transit</a><span className="inline-flex min-h-10 items-center text-sm text-slate-500">{stop.duration}</span></div></div>
          </article>})}</div><div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-950"><Clock3 className="mt-0.5 shrink-0" size={18}/><p>{plan.day===1&&<><a className="font-semibold underline" href="https://www.google.com/maps/dir/?api=1&origin=9.726,76.477&destination=9.589901,76.522752&travelmode=transit" target="_blank" rel="noreferrer">Check return transit to Anand Hotel</a><br/><br/></>}<strong>Day {plan.day} bus connections and breaks.</strong> {plan.notes}<br/><br/><strong>Distance basis:</strong> OSRM road routing through the planned connection towns, using approximate branch-area pins. These are not measured bus-service distances. Stops, detours, walks/auto rides and hotel transfers can change the total.  Allow for bus waits and short auto rides. Map pins are approximate; Navigate searches the branch address. Full route is a road overview, not a bus timetable. Confirm departures, branch opening and holidays locally. All planned visits finish before 4 PM.</p></div></div>
        </aside>
      </div>
    </section>
  </main>
}

function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="rounded-lg bg-slate-50 p-3"><div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">{icon}{label}</div><p className="mt-1 break-words text-sm font-bold text-slate-950 sm:text-base">{value}</p></div>}
