// Counts how many distinct loading.tsx fallback elements mount per client navigation.
// Usage: node measure.mjs [baseUrl]   (default http://localhost:7402)
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:7402";
const groups = {
  "slow-layout (async layout above loading.tsx)": ["/slow-layout/a", "/slow-layout/b", "/slow-layout/a", "/slow-layout/b"],
  "slow-page (control: async page under sync layout)": ["/slow-page/a", "/slow-page/b", "/slow-page/a", "/slow-page/b"],
};

const browser = await chromium.launch({ channel: "chrome", headless: true });
let failed = false;
for (const [name, [start, ...targets]] of Object.entries(groups)) {
  const page = await browser.newPage();
  await page.addInitScript(() => {
    const seen = new WeakSet();
    window.__lap = { n: 0, log: [], t0: 0 };
    const observer = new MutationObserver((records) => {
      const t = () => Math.round(performance.now() - window.__lap.t0);
      for (const record of records) for (const node of record.removedNodes) {
        if (node.nodeType !== 1) continue;
        for (const el of [node, ...node.querySelectorAll("[data-skeleton]")]) if (el.__n) window.__lap.log.push(`-${t()}ms #${el.__n}`);
      }
      for (const el of document.querySelectorAll("[data-skeleton]")) {
        if (seen.has(el)) continue;
        seen.add(el);
        el.__n = ++window.__lap.n;
        window.__lap.log.push(`+${t()}ms #${el.__n}`);
      }
    });
    document.addEventListener("DOMContentLoaded", () => observer.observe(document.body, { childList: true, subtree: true }));
  });
  await page.goto(base + start, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  console.log(`\n${name}`);
  let from = start;
  for (const target of targets) {
    await page.evaluate(() => { window.__lap.n = 0; window.__lap.log = []; window.__lap.t0 = performance.now(); });
    await page.click(`nav a[href="${target}"]`);
    await page.waitForURL(base + target);
    await page.waitForTimeout(2500);
    const { n, log } = await page.evaluate(() => window.__lap);
    if (n > 1) failed = true;
    console.log(`  ${from} -> ${target}: ${n} fallback element(s) mounted  ${log.join(" ")}`);
    from = target;
  }
  await page.close();
}
await browser.close();
process.exitCode = failed ? 1 : 0;
