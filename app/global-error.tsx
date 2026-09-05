"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="bn"><body><main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:"24px",fontFamily:"system-ui,sans-serif",background:"#f4f9f8",color:"#244e5c"}}><section style={{maxWidth:520,textAlign:"center",padding:32,border:"1px solid #d8e7e3",borderRadius:20,background:"white"}}><h1>TomarShikkha আবার চালু করি</h1><p style={{lineHeight:1.7,color:"#647d85"}}>একটি অপ্রত্যাশিত সমস্যা হয়েছে, তবে এই device-এ save থাকা progress মুছে যায়নি।</p><button onClick={reset} style={{border:0,borderRadius:10,padding:"12px 18px",background:"#0b7e68",color:"white",fontWeight:800,cursor:"pointer"}}>আবার চেষ্টা করি</button></section></main></body></html>;
}
