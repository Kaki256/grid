var K=Object.defineProperty;var R=(m,r,i)=>r in m?K(m,r,{enumerable:!0,configurable:!0,writable:!0,value:i}):m[r]=i;var O=(m,r,i)=>R(m,typeof r!="symbol"?r+"":r,i);import{d as X,r as g,w as C,b as Y,o as c,c as w,a,e as y,v as I,F as b,g as k,j as Z,l as F,h as j,t as ee}from"./index-BdTa2wRU.js";import{_ as M}from"./CellLook.vue_vue_type_style_index_0_lang--26cZ512.js";const te={class:"control"},se={class:"stringInput"},oe={class:"convert"},le={class:"play-area"},re={class:"field"},ne={class:"pallet"},ie={class:"control"},ae=["value"],ue={class:"debug"},ce=X({__name:"CrosswordView",setup(m){const r=g(5),i=g(5),f=g(40),U=["black","white"],p=g("black"),n=g(Array.from({length:r.value},()=>Array.from({length:i.value},()=>"white"))),h=g("");C(h,s=>{sessionStorage.setItem("Crossword_inputString",s.toString());const e=s.split(`
`).map(t=>t.split(""));_.value=e});const W=g(!1),N=["buta","eigo","illust1_3","ippan"],S=g(N[0]);C(S,()=>{sessionStorage.setItem("Crossword_selectedDict",S.value)});const H=g([]),q=async()=>{const e=await(await fetch(`/src/assets/dictionaries/${S.value}.txt`)).text();H.value=e.split(`
`)},B=async()=>{W.value=!0,await q(),await E()},E=()=>{const s=Array.from({length:r.value+2},()=>Array.from({length:i.value+2},()=>"＊"));for(let o=0;o<r.value;o++)for(let l=0;l<i.value;l++)n.value[o][l]==="white"?s[o+1][l+1]="＿":n.value[o][l]==="black"?s[o+1][l+1]="＊":s[o+1][l+1]=n.value[o][l];console.log(s);const e=[];for(let o=1;o<=r.value;o++)for(let l=1;l<=i.value;l++)if(s[o][l]!=="＊"){if(s[o][l-1]==="＊"&&s[o][l+1]!=="＊"){let v=1,u=s[o][l];for(;s[o][l+v]!=="＊";)u+=s[o][l+v],v++;e.push({x:l,y:o,direction:"horizontal",length:v,word:u})}if(s[o-1][l]==="＊"&&s[o+1][l]!=="＊"){let v=1,u=s[o][l];for(;s[o+v][l]!=="＊";)u+=s[o+v][l],v++;e.push({x:l,y:o,direction:"vertical",length:v,word:u})}}console.log(e);const t=H.value.reduce((o,l)=>(o[l.length]||(o[l.length]=[]),o[l.length].push(l),o),{}),d=new L;for(d.enqueue(e);!d.isEmpty();){const o=d.dequeue()||[];let l=[];for(let u=0;u<o.length;u++)l.push({x:o[u].x,y:o[u].y,direction:o[u].direction,length:o[u].length,word:o[u].word});if(console.log(JSON.stringify(l)),!o)break;let v=!0;for(let u=0;u<o.length;u++){const D=o[u];let J=!0;for(let $=0;$<D.word.length;$++)D.word[$]==="＿"&&(J=!1);J||(v=!1,t[D.length])}if(v){console.log("isSlotFilled"),console.log(JSON.stringify(o));break}}W.value=!1};class L{constructor(){O(this,"items",[])}enqueue(e){this.items.push(e)}dequeue(){return this.items.shift()}isEmpty(){return this.items.length===0}size(){return this.items.length}}C([r,i],()=>{let s=Array.from({length:r.value},()=>Array.from({length:i.value},()=>"white"));for(let e=0;e<r.value;e++)for(let t=0;t<i.value;t++)e<n.value.length&&t<n.value[e].length&&(s[e][t]=n.value[e][t]||"white");n.value=s,sessionStorage.setItem("Crossword_H",r.value.toString()),sessionStorage.setItem("Crossword_W",i.value.toString()),sessionStorage.setItem("Crossword_field",JSON.stringify(n.value))}),C(f,s=>{sessionStorage.setItem("Crossword_cellSize",s.toString())}),C(p,s=>{sessionStorage.setItem("Crossword_selectedColor",s.toString())}),C(n,s=>{sessionStorage.setItem("Crossword_field",JSON.stringify(s)),G()},{deep:!0});const _=g(Array.from({length:r.value},()=>Array.from({length:i.value},()=>"＿"))),V=(s,e)=>{n.value[s][e]=p.value};let x=!1;const z=(s,e)=>{x=!0,V(s-1,e-1)},A=(s,e)=>{x&&V(s-1,e-1)},T=()=>{x=!1};document.addEventListener("mouseup",T),Y(()=>{console.log("mounted"),console.log(sessionStorage.getItem("Crossword_field")),sessionStorage.getItem("Crossword_H")?r.value=parseInt(sessionStorage.getItem("Crossword_H")||"5"):sessionStorage.setItem("Crossword_H",r.value.toString()),sessionStorage.getItem("Crossword_W")?i.value=parseInt(sessionStorage.getItem("Crossword_W")||"5"):sessionStorage.setItem("Crossword_W",i.value.toString()),sessionStorage.getItem("Crossword_cellSize")?f.value=parseInt(sessionStorage.getItem("Crossword_cellSize")||"40"):sessionStorage.setItem("Crossword_cellSize",f.value.toString()),sessionStorage.getItem("Crossword_selectedColor")?p.value=sessionStorage.getItem("Crossword_selectedColor")||"red":sessionStorage.setItem("Crossword_selectedColor",p.value.toString()),sessionStorage.getItem("Crossword_selectedDict")?S.value=sessionStorage.getItem("Crossword_selectedDict")||"buta":sessionStorage.setItem("Crossword_selectedDict",S.value.toString()),sessionStorage.getItem("Crossword_inputString")?h.value=sessionStorage.getItem("Crossword_inputString")||"":sessionStorage.setItem("Crossword_inputString",h.value.toString());const s=Array.from({length:r.value},()=>Array.from({length:i.value},()=>"white"));sessionStorage.getItem("Crossword_field")?(n.value=JSON.parse(sessionStorage.getItem("Crossword_field")||"[]"),n.value.length===0&&(n.value=s)):(n.value=s,sessionStorage.setItem("Crossword_field",JSON.stringify(n.value))),console.log(n.value)});const P=()=>{r.value=5,i.value=5,f.value=40,p.value="black",n.value=[];for(let s=0;s<r.value;s++){n.value.push([]);for(let e=0;e<i.value;e++)n.value[s].push("white")}},Q=()=>{const s=Array.from({length:r.value},()=>Array.from({length:i.value},()=>"white"));for(let e=0;e<r.value;e++)for(let t=0;t<i.value;t++)n.value[e]&&_.value[e][t]=="＊"?s[e][t]="black":n.value[e]&&_.value[e][t]=="＿"?s[e][t]="white":s[e][t]=_.value[e][t];n.value=s},G=()=>{h.value=n.value.join(`
`).replace(/,/g,"").replace(/black/g,"＊").replace(/white/g,"＿")};return(s,e)=>(c(),w("div",null,[a("div",te,[e[7]||(e[7]=a("label",{for:"H"},"H:",-1)),y(a("input",{id:"H",type:"number","onUpdate:modelValue":e[0]||(e[0]=t=>r.value=t)},null,512),[[I,r.value]]),e[8]||(e[8]=a("label",{for:"W"},"W:",-1)),y(a("input",{id:"W",type:"number","onUpdate:modelValue":e[1]||(e[1]=t=>i.value=t)},null,512),[[I,i.value]]),e[9]||(e[9]=a("label",{for:"cellSize"},"セルサイズ:",-1)),y(a("input",{id:"cellSize",type:"number","onUpdate:modelValue":e[2]||(e[2]=t=>f.value=t)},null,512),[[I,f.value]])]),a("div",se,[e[10]||(e[10]=a("label",{for:"inputString"},"入力文字列：",-1)),y(a("textarea",{"onUpdate:modelValue":e[3]||(e[3]=t=>h.value=t),style:{width:"60%",height:"100px"}},null,512),[[I,h.value]])]),a("div",oe,[a("button",{onClick:e[4]||(e[4]=t=>Q())},"変換↓")]),a("div",le,[a("div",re,[(c(!0),w(b,null,k(r.value,t=>(c(),w("div",{class:"row",key:t},[(c(!0),w(b,null,k(i.value,d=>(c(),w("div",{key:t*r.value+d},[n.value[t-1][d-1]==="black"?(c(),F(M,{key:0,cellSize:f.value,color:"black",onMousedown:o=>z(t,d),onMouseenter:o=>A(t,d)},null,8,["cellSize","onMousedown","onMouseenter"])):n.value[t-1][d-1]==="white"?(c(),F(M,{key:1,cellSize:f.value,color:"white",onMousedown:o=>z(t,d),onMouseenter:o=>A(t,d)},null,8,["cellSize","onMousedown","onMouseenter"])):(c(),F(M,{key:2,cellSize:f.value,color:"white",text:n.value[t-1][d-1],onMousedown:o=>z(t,d),onMouseenter:o=>A(t,d)},null,8,["cellSize","text","onMousedown","onMouseenter"]))]))),128))]))),128))])]),a("div",ne,[(c(),w(b,null,k(U,t=>a("div",{key:t},[j(M,{cellSize:50,color:t,onClick:d=>p.value=t},null,8,["color","onClick"])])),64))]),a("div",ie,[e[11]||(e[11]=a("label",{for:"selectedDict"},"辞書選択",-1)),y(a("select",{id:"selectedDict","onUpdate:modelValue":e[5]||(e[5]=t=>S.value=t)},[(c(),w(b,null,k(N,t=>a("option",{key:t,value:t},ee(t),9,ae)),64))],512),[[Z,S.value]]),a("button",{onClick:B},"検索")]),a("div",ue,[a("button",{onClick:e[6]||(e[6]=t=>P())},"リセット")])]))}});export{ce as default};
