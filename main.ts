import {readdirSync,readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function run(p,u){
 let pc=0,st=[],cs=[],mem=new Int32Array(256),out=[],ip=0,steps=0;
 const T=c=>{throw c};
 const need=n=>{if(st.length<n)T(2)};
 const push=v=>{if(st.length>255)T(3);st.push(v|0)};
 const fit=n=>{if(pc+n>=p.length)T(9)};
 const rel=()=>(p[pc+1]|p[pc+2]<<8)<<16>>16;
 const bin=f=>{need(2);const b=st.pop(),a=st.pop();push(f(a,b))};
 try{for(;;){
  if(steps===1000000)T(10);
  if(pc<0||pc>=p.length)T(9);
  const op=p[pc];let a,b,v,s;
  switch(op){
   case 0:return{out:Buffer.from(out),exit:0};
   case 1:fit(1);push((p[pc+1]<<24)>>24);pc+=2;break;
   case 2:fit(4);push(p[pc+1]|p[pc+2]<<8|p[pc+3]<<16|p[pc+4]<<24);pc+=5;break;
   case 3:need(1);st.pop();pc++;break;
   case 4:need(1);push(st[st.length-1]);pc++;break;
   case 5:need(2);a=st[st.length-1];st[st.length-1]=st[st.length-2];st[st.length-2]=a;pc++;break;
   case 6:need(2);push(st[st.length-2]);pc++;break;
   case 7:need(3);a=st[st.length-3];st[st.length-3]=st[st.length-2];st[st.length-2]=st[st.length-1];st[st.length-1]=a;pc++;break;
   case 0x10:bin((a,b)=>(a+b)|0);pc++;break;
   case 0x11:bin((a,b)=>(a-b)|0);pc++;break;
   case 0x12:bin((a,b)=>Math.imul(a,b));pc++;break;
   case 0x13:bin((a,b)=>{if(!b)T(4);return a===-2147483648&&b===-1?a:(a/b)|0});pc++;break;
   case 0x14:bin((a,b)=>{if(!b)T(4);return b===-1?0:(a%b)|0});pc++;break;
   case 0x15:bin((a,b)=>{if(!b)T(4);return Math.floor((a>>>0)/(b>>>0))|0});pc++;break;
   case 0x16:bin((a,b)=>{if(!b)T(4);return((a>>>0)%(b>>>0))|0});pc++;break;
   case 0x17:need(1);st[st.length-1]=(-st[st.length-1])|0;pc++;break;
   case 0x18:bin((a,b)=>a&b);pc++;break;
   case 0x19:bin((a,b)=>a|b);pc++;break;
   case 0x1a:bin((a,b)=>a^b);pc++;break;
   case 0x1b:need(1);st[st.length-1]=~st[st.length-1];pc++;break;
   case 0x1c:bin((a,b)=>a<<(b&31));pc++;break;
   case 0x1d:bin((a,b)=>a>>(b&31));pc++;break;
   case 0x1e:bin((a,b)=>(a>>>(b&31))|0);pc++;break;
   case 0x20:bin((a,b)=>a===b?1:0);pc++;break;
   case 0x21:bin((a,b)=>a<b?1:0);pc++;break;
   case 0x22:bin((a,b)=>(a>>>0)<(b>>>0)?1:0);pc++;break;
   case 0x30:fit(2);pc=pc+3+rel();break;
   case 0x31:fit(2);need(1);v=st.pop();pc=v===0?pc+3+rel():pc+3;break;
   case 0x32:fit(2);need(1);v=st.pop();pc=v!==0?pc+3+rel():pc+3;break;
   case 0x33:fit(2);if(cs.length>=64)T(7);cs.push(pc+3);pc=p[pc+1]|p[pc+2]<<8;break;
   case 0x34:if(!cs.length)T(8);pc=cs.pop();break;
   case 0x40:need(1);a=st.pop();if(a<0||a>255)T(6);push(mem[a]);pc++;break;
   case 0x41:need(2);a=st.pop();b=st.pop();if(a<0||a>255)T(6);mem[a]=b;pc++;break;
   case 0x50:need(1);v=st[st.length-1];s=String(v);if(out.length+s.length>65536)T(11);st.pop();for(const ch of s)out.push(ch.charCodeAt(0));pc++;break;
   case 0x51:need(1);v=st[st.length-1];if(out.length>65535)T(11);st.pop();out.push(v&255);pc++;break;
   case 0x52:push(ip<u.length?u[ip++]:-1);pc++;break;
   case 0x53:need(1);v=st.pop();return{out:Buffer.from(out),exit:v&255};
   default:T(5);
  }
  steps++;
 }}catch(e){if(typeof e==='number')return{out:Buffer.from(out),exit:e};throw e}
}
for(const id of readdirSync(I).sort()){
 let r;
 try{r=run(readFileSync(join(I,id,'program.bin')),readFileSync(join(I,id,'input.bin')))}catch{r={out:Buffer.alloc(0),exit:0}}
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),r.out);
 writeFileSync(join(O,id,'exit.txt'),r.exit+'\n');
}
