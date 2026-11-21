'use strict';
const http=require('node:http');
const {createMBColumnCore}=require('./mbcolumn-core');
const core=createMBColumnCore();
const PORT=Number(process.env.PORT||8787);
const allowed=[...new Set([...((process.env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean)), 'https://anhbq1298.github.io', 'https://mcalcplatform.dev', 'http://localhost:8000'])];
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const counts=new Map();
function reply(res,status,data,origin){
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  if(origin&&allowed.includes(origin)){headers['Access-Control-Allow-Origin']=origin;headers['Vary']='Origin';}
  res.writeHead(status,headers);res.end(JSON.stringify(data));
}
http.createServer(async(req,res)=>{
  const origin=req.headers.origin;
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(origin&&!allowed.includes(origin))return reply(res,403,{error:'Origin not allowed'},null);
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':origin||'','Vary':'Origin','Access-Control-Allow-Methods':'POST,GET,OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'});return res.end();}
  if(req.method==='GET'&&pathname==='/health')return reply(res,200,{status:'ok',api:'MBColumnLite',version:'2026-10-26-cors-fix',originAllowed:!origin||allowed.includes(origin)},origin);
  if(req.method!=='POST'||!['/api/analyse','/api/creep','/api/slenderness'].includes(pathname))return reply(res,404,{error:'Not found'},origin);
  const ip=req.headers['x-forwarded-for']?.split(',')[0]||req.socket.remoteAddress,now=Date.now(),limit=counts.get(ip)||{n:0,until:now+60000};
  if(now>limit.until){limit.n=0;limit.until=now+60000;}counts.set(ip,limit);if(++limit.n>20)return reply(res,429,{error:'Rate limited'},origin);
  try{
    let body='';for await(const ch of req){body+=ch;if(body.length>256000)throw Error('Too large');}
    const d=JSON.parse(body);let out;
    if(pathname==='/api/analyse'){
      if(!d?.section||!d?.settings||!d?.concrete||!d?.steel||!Array.isArray(d.demands)||!Array.isArray(d.section.bars))throw Error('Invalid input');
      if(![d.section.b,d.section.h,d.concrete.fc,d.steel.fy,d.steel.es].every(finite)||d.section.b<100||d.section.h<100||d.section.b>5000||d.section.h>5000||d.section.bars.length>300||d.demands.length>50)throw Error('Invalid section');
      const x=d.settings.fiberCountX,y=d.settings.fiberCountY;
      if(!Number.isInteger(x)||!Number.isInteger(y)||x<8||y<8||x*y>160000)throw Error('Invalid mesh');
      if(!d.section.bars.every(b=>[b.x,b.y,b.area].every(finite)&&b.area>0)||!d.demands.every(v=>[v.pu,v.mux,v.muy].every(finite)))throw Error('Invalid load');
      out=core.analyse(d);
      // Typed arrays stringify as numeric-keyed objects; send a JSON array for 3D rendering.
      if(out?.mesh?.xyz) out.mesh.xyz=Array.from(out.mesh.xyz);
    }else if(pathname==='/api/creep'){
      if(![d.rh,d.t0,d.h0,d.fcm].every(finite))throw Error('Invalid creep input');out=core.creepCoefficient(d);
    }else{
      if(!d?.section||!d?.member||!Array.isArray(d.loads)||d.loads.length>50||!d.loads.every(l=>[l.nEd,l.mxTop,l.mxBot,l.myTop,l.myBot].every(finite)))throw Error('Invalid slenderness input');
      out=d.loads.map(l=>core.ec2Slenderness(d.section,d.member,l));
    }
    reply(res,200,out,origin);
  }catch(e){console.error(e);reply(res,400,{error:'Invalid calculation request'},origin);}
}).listen(PORT,()=>console.log('MBColumn API on '+PORT));
