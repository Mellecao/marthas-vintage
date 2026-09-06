"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useId, useRef, useState } from "react";

export function SlowMarquee() {
  return <div className="slow-marquee" aria-label="Curated, not accumulated"><div className="slow-marquee-track" aria-hidden="true">{[0,1].map(group=><div className="slow-marquee-group" key={group}>{[0,1,2].map(i=><span key={i}>Curated, not accumulated <i>✳</i></span>)}</div>)}</div></div>;
}
export function RotatingBadge() {
  const id = useId().replace(/:/g, "");
  return <div className="rotating-badge" aria-label="A collection with a point of view"><svg className="badge-lettering" viewBox="0 0 120 120" aria-hidden="true"><defs><path id={id} d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" /></defs><text><textPath href={`#${id}`} textLength="279">A COLLECTION WITH A POINT OF VIEW • </textPath></text></svg><img src="/assets/site/eye.svg" alt="" aria-hidden="true" /></div>;
}

const photoGroups = {
  store: ["store_1.jpg", "store_2.jpg", "store_3.jpg"],
  collection: ["look1_1.png", ...Array.from({length:8},(_,i)=>`look1_${i+2}.jpg`)],
  personal: Array.from({length:4},(_,i)=>`look2_${i+1}.jpg`),
  beyond: ["beyondthewardrobe_3.jpg", "beyondthewardrobe_1.jpg", "beyondthewardrobe_2.jpg", "beyondthewardrobe_4.jpg", "beyondthewardrobe_5.jpg", "beyondthewardrobe_6.jpg", "quadros.png"],
};
const photoDescriptions = {
  store: ["Clothing and collected objects in Martha’s sunlit shop", "Clothing racks and a table of vintage objects", "Hats, handbags and beautiful oddities in the shop"],
  collection: ["Burgundy beret, paisley top and plum skirt", "A red patterned vintage dress", "A white top and long patterned skirt with a hat", "Striped blazer with a floral skirt", "A dark jacket layered over a floral skirt", "A white shirt, floral skirt and straw hat", "Bright floral top with a patterned skirt", "Black tailored jacket and floral skirt", "A long dark patterned vintage dress"],
  personal: ["A hat, layered jewelry and a colorful patterned skirt", "A pale draped vintage evening dress", "Floral clothing styled with a scarf and jewelry", "The embroidered back of a vintage garment"],
  beyond: ["Patterned curtains framing a yellow room", "Framed artwork arranged above collected objects", "Colorful embroidery and textiles beside a bright window", "Vintage furniture, artwork and layered rugs", "Handworked textiles beside a window", "Two framed needlepoint portraits", "A pair of framed needlepoint portraits, shown together"],
};
export function PhotoCarousel({group,className=""}:{group:keyof typeof photoGroups;className?:string}) {
  const track=useRef<HTMLDivElement>(null); const [active,setActive]=useState(0); const id=useId(); const photos=photoGroups[group];
  function go(direction:number) { const el=track.current; if(!el)return; const next=Math.max(0,Math.min(photos.length-1,active+direction)); const target=el.children[next] as HTMLElement; el.scrollTo({left:target.offsetLeft-el.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }
  return <div className={`photo-carousel ${className}`} role="region" aria-roledescription="carousel" aria-label={`${group} photographs`}><div className="photo-carousel-track" ref={track} id={id} tabIndex={0} onScroll={()=>{const el=track.current;if(el)setActive(Math.round(el.scrollLeft/el.clientWidth));}}>{photos.map((photo,i)=><figure key={photo} role="group" aria-roledescription="slide" aria-label={`${i+1} of ${photos.length}`}><img src={`/assets/site/photos/${photo}`} alt={photoDescriptions[group][i]} loading="lazy" /></figure>)}</div><div className="carousel-controls"><button type="button" aria-label="Previous photograph" aria-controls={id} disabled={active===0} onClick={()=>go(-1)}>←</button><span aria-live="polite">{String(active+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</span><button type="button" aria-label="Next photograph" aria-controls={id} disabled={active===photos.length-1} onClick={()=>go(1)}>→</button></div></div>;
}

/** A local, unscaled path: dash lengths are actual rendered CSS pixels. */
export function ScrollRoadline() {
  const root=useRef<HTMLDivElement>(null); const path=useRef<SVGPathElement>(null);
  useEffect(()=>{
    const host=root.current, line=path.current;if(!host||!line)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;let length=0;
    const measure=()=>{const w=host.clientWidth,h=host.clientHeight;line.setAttribute('d',`M ${w+25} 0 C ${w-65} ${h*.12}, ${w-14} ${h*.27}, ${w-40} ${h*.39} C ${w-105} ${h*.56}, ${w+72} ${h*.53}, ${w+5} ${h*.43} C ${w-58} ${h*.34}, ${w-75} ${h*.68}, ${w+30} ${h}`);length=line.getTotalLength();line.style.strokeDasharray=`${length}`;update();};
    const update=()=>{frame=0;const box=host.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight*.78-box.top)/(box.height+innerHeight*.1)));line.style.strokeDashoffset=`${length*(1-progress)}`;line.style.opacity=progress>0&&!reduced.matches?'0.32':'0';line.style.visibility=progress>0&&!reduced.matches?'visible':'hidden';};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const resize=new ResizeObserver(measure);resize.observe(host);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure);reduced.addEventListener('change',schedule);measure();
    return()=>{resize.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);reduced.removeEventListener('change',schedule);};
  },[]);
  return <div ref={root} className="scroll-roadline" aria-hidden="true"><svg><path ref={path} fill="none" stroke="currentColor" strokeWidth="1.2" style={{opacity:0,visibility:'hidden'}} /></svg></div>;
}
