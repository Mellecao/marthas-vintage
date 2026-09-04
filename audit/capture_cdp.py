import asyncio
import base64
import json
import time
import urllib.request
from pathlib import Path

import websockets

PORT = 58660
URL = "http://127.0.0.1:65024/"
OUT = Path(r"C:/Projetos/marthas-vintage/audit")


def new_page():
    req = urllib.request.Request(f"http://127.0.0.1:{PORT}/json/new?{URL}", method="PUT")
    with urllib.request.urlopen(req) as response:
        return json.load(response)["webSocketDebuggerUrl"]


async def capture(width, height):
    ws_url = new_page()
    async with websockets.connect(ws_url, max_size=50_000_000) as ws:
        seq = 0

        async def command(method, params=None):
            nonlocal seq
            seq += 1
            current = seq
            await ws.send(json.dumps({"id": current, "method": method, "params": params or {}}))
            while True:
                message = json.loads(await ws.recv())
                if message.get("id") == current:
                    if "error" in message:
                        raise RuntimeError(message["error"])
                    return message.get("result", {})

        await command("Page.enable")
        await command("Runtime.enable")
        await command("Emulation.setDeviceMetricsOverride", {
            "width": width,
            "height": height,
            "deviceScaleFactor": 1,
            "mobile": True,
            "screenWidth": width,
            "screenHeight": height,
        })
        await command("Page.navigate", {"url": URL})
        await asyncio.sleep(4)
        metrics = await command("Page.getLayoutMetrics")
        content = metrics["cssContentSize"]
        shot = await command("Page.captureScreenshot", {
            "format": "png",
            "captureBeyondViewport": True,
            "fromSurface": True,
            "clip": {"x": 0, "y": 0, "width": content["width"], "height": content["height"], "scale": 1},
        })
        output = OUT / f"marthas-{width}-full.png"
        output.write_bytes(base64.b64decode(shot["data"]))
        probe_expression = """(() => {
          const boxes = [...document.querySelectorAll('.personal-copy-left,.personal-copy-narrow,.personal-copy-wide,.hero-description,.eyes-copy-large,.collection-copy,.beyond-copy')].map(e => ({
            className:e.className, clientWidth:e.clientWidth, scrollWidth:e.scrollWidth,
            clientHeight:e.clientHeight, scrollHeight:e.scrollHeight,
            rect:{x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}
          }));
          return {
            innerWidth, clientWidth:document.documentElement.clientWidth,
            scrollWidth:document.documentElement.scrollWidth,
            scrollHeight:document.documentElement.scrollHeight,
            boxes,
            frames:[...document.querySelectorAll('.design-frame')].map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),
            failedImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)
          };
        })()"""
        probe = await command("Runtime.evaluate", {"expression": probe_expression, "returnByValue": True})
        data = probe["result"]["value"]
        (OUT / f"probe-{width}.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
        print(width, output, data["clientWidth"], data["scrollWidth"], data["scrollHeight"], data["failedImages"])


async def main():
    for width in (360, 402, 430):
        await capture(width, 874)

asyncio.run(main())
