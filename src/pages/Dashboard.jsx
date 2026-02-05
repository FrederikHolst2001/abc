
import { useEffect, useState } from 'react';
import { API_BASE } from '../config';

export default function Dashboard(){
  const [prices,setPrices]=useState([]);
  const [signals,setSignals]=useState([]);
  const [analysis,setAnalysis]=useState([]);
  const [calendar,setCalendar]=useState([]);

  useEffect(()=>{
    fetch(`${API_BASE}/api/prices`).then(r=>r.json()).then(setPrices);
    fetch(`${API_BASE}/api/signals`).then(r=>r.json()).then(setSignals);
    fetch(`${API_BASE}/api/analysis`).then(r=>r.json()).then(setAnalysis);
    fetch(`${API_BASE}/api/calendar`).then(r=>r.json()).then(setCalendar);
  },[]);

  return (
    <div className="section">
      <h1>Professional Forex Trading Intelligence</h1>
      <iframe src="https://s.tradingview.com/widgetembed/?symbol=FX:EURUSD&interval=15&theme=dark" width="100%" height="420"></iframe>
      <h2>Live Prices</h2>
      {prices.map(p=><div className="card" key={p.symbol}>{p.symbol}: {p.price}</div>)}
      <h2>Trading Signals</h2>
      {signals.map((s,i)=><div className="card" key={i}>{s.symbol} - {s.signal||s.bias}</div>)}
      <h2>Market Analysis</h2>
      {analysis.map((a,i)=><div className="card" key={i}>{a.title}</div>)}
      <h2>Economic Calendar</h2>
      {calendar.map((e,i)=><div className="card" key={i}>{e.currency} {e.title}</div>)}
    </div>
  );
}
