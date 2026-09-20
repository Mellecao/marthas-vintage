const port = Number(process.env.CDP_PORT || 9333);
const url = process.argv[2] || "http://127.0.0.1:3017/direction";
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
};
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
const send = (method, params = {}) => new Promise((resolve) => {
  const current = ++id; pending.set(current, resolve); socket.send(JSON.stringify({ id: current, method, params }));
});
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const snap = async (label) => JSON.parse(await evaluate(`JSON.stringify((() => {
  const section=document.querySelector('#collection');
  const panel=document.querySelector('[aria-live="polite"]');
  const rail=panel?.querySelector('[aria-label$="image group"]');
  return {label:'${label}',scrollY,sectionTop:section?.getBoundingClientRect().top,panelTop:panel?.getBoundingClientRect().top,panelHeight:panel?.getBoundingClientRect().height,railTop:rail?.getBoundingClientRect().top,railScrollLeft:rail?.scrollLeft,images:[...document.querySelectorAll('[aria-live="polite"] img')].map(x=>({nw:x.naturalWidth,top:x.getBoundingClientRect().top,left:x.getBoundingClientRect().left}))};
})())`));
try {
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width:390,height:844,deviceScaleFactor:2,mobile:true });
  await send("Page.navigate", {url}); await wait(6000);
  await evaluate(`document.querySelector('#collection').scrollIntoView({block:'start'}); true`); await wait(800);
  const states=[await snap('before')];
  await evaluate(`document.querySelectorAll('[role="tab"]')[2].click(); true`);
  states.push(await snap('immediate')); await wait(100); states.push(await snap('100ms')); await wait(800); states.push(await snap('900ms'));
  for(let i=0;i<3;i+=1){
    await evaluate(`(() => { const rail=document.querySelector('[aria-live="polite"] [aria-label$="image group"]'); const fig=rail.children[${i}]; rail.scrollTo({left:fig.offsetLeft-rail.offsetLeft,behavior:'instant'}); return true; })()`);
    states.push(await snap(`slide-${i}-immediate`)); await wait(800); states.push(await snap(`slide-${i}-loaded`));
  }
  console.log(JSON.stringify(states,null,2));
} finally { socket.close(); }
