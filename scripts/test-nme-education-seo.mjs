import { chromium } from '@playwright/test';
import fs from 'node:fs';
const origin=process.env.ORIGIN||'https://nomoreenabling.com';
const phase=process.env.PHASE||'live-before';
const dir=process.env.EVIDENCE_DIR||'/tmp/nme-education-seo';
fs.mkdirSync(dir,{recursive:true});
const routes=['/','/work-with-matt','/family-addiction-coaching','/intervention-help','/topic-hubs','/topic-hubs/financial-enabling','/helping-or-enabling','/articles/paying-rent-for-addicted-adult-child','/articles/should-i-give-money-to-someone-with-addiction','/glossary/enabling'];
const b=await chromium.launch({headless:true,args:['--no-sandbox']});const results=[];
for(const width of [390,1280]){
 const ctx=await b.newContext({viewport:{width,height:900}});
 await ctx.route('**/*',r=>{const q=r.request();return q.url().startsWith(origin)&&q.method()==='GET'&&['document','script','stylesheet','image','font'].includes(q.resourceType())?r.continue():r.abort()});
 const p=await ctx.newPage();
 for(const path of routes){
  const response=await p.goto(origin+path,{waitUntil:'networkidle'});await p.waitForTimeout(400);
  const data=await p.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonicals:[...document.querySelectorAll('link[rel="canonical"]')].map(x=>x.href),robots:[...document.querySelectorAll('meta[name="robots"]')].map(x=>x.content),og:document.querySelector('meta[property="og:url"]')?.content,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent.trim()),text:document.body.innerText,schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent)),links:[...document.querySelectorAll('main a[href]')].map(x=>({text:x.textContent.trim(),href:x.getAttribute('href')})),overflow:document.documentElement.scrollWidth>innerWidth}));
  results.push({path,width,status:response.status(),...data});
  fs.writeFileSync(`${dir}/${phase}.json`,JSON.stringify(results,null,2));
 }
 if(phase==='local-after'){
  for(const target of ['/helping-or-enabling','/glossary/enabling','/topic-hubs/financial-enabling']){
   await p.goto(origin+'/work-with-matt');const link=p.locator(`#education-options a[href="${target}"]`);await link.focus();await p.keyboard.press('Enter');await p.waitForURL(origin+target);
  }
  await p.goto(origin+'/intervention-help');if((await p.locator('body').innerText()).includes('Interventions fail when the family sends mixed messages.'))throw Error('Unsupported assertion remains');
  await p.goto(origin+'/work-with-matt');await p.locator('a[href="#consultation-form"]').first().click();if(await p.locator('#consultation-form').count()!==1)throw Error('Missing consultation anchor');
 }
 await ctx.close();
}
await b.close();
const failed=results.filter(r=>r.status!==200||r.h1.length!==1||r.canonicals.length!==1||!r.robots.includes('index, follow')||r.canonicals[0]!==`https://nomoreenabling.com${r.path==='/'?'/':r.path}`||r.overflow);
fs.writeFileSync(`${dir}/${phase}-summary.json`,JSON.stringify({cases:results.length,failed:failed.map(r=>({path:r.path,width:r.width,h1:r.h1,canonical:r.canonicals,overflow:r.overflow})),navigation:phase==='local-after'?'passed at both widths':'not exercised'},null,2));
console.log(JSON.stringify({phase,cases:results.length,failed:failed.map(r=>({path:r.path,width:r.width,overflow:r.overflow,canonicals:r.canonicals}))}));
if(failed.length)process.exitCode=1;
