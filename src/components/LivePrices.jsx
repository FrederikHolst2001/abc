
import {useEffect,useState} from 'react'
export default function LivePrices(){
 const [d,setD]=useState([])
 useEffect(()=>{
  const f=async()=>setD(await fetch('https://forex-backend-sq8t.onrender.com/api/prices').then(r=>r.json()))
  f(); const i=setInterval(f,10000); return()=>clearInterval(i)
 },[])
 return <pre>{JSON.stringify(d,null,2)}</pre>
}
