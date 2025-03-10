import{d as x,r as v,w as u,b as F,o as m,c as S,a as r,e as p,v as C,f as w,F as _,g as h,h as N,n as U,i as A}from"./index-BdTa2wRU.js";import{_ as O}from"./CellLook.vue_vue_type_style_index_0_lang--26cZ512.js";const $={class:"control"},J={class:"play-area"},B={class:"field"},E={class:"pallet"},D=["onClick"],L={key:0},P={class:"debug"},j="50px",R="50px",K=x({__name:"GridView",setup(T){const a=v(5),s=v(5),g=v(40),d=v(10),i=v(!1),n=v(!1),G=["white","red","lime","blue","yellow","magenta","#0ff","black"],f=v(G[1]),o=v(Array.from({length:2*a.value+1},()=>Array.from({length:2*s.value+1},()=>"white"))),I=(t,e)=>(t||e)&&!(t&&e);u([a,s,i,n],()=>{let t=Array.from({length:2*a.value+1},()=>Array.from({length:2*s.value+1},()=>"white"));for(let e=0;e<2*a.value+1;e++)for(let l=0;l<2*s.value+1;l++)!n.value&&e%2===0&&l%2===0||!i.value&&I(e%2===0,l%2===0)?t[e][l]="#ccc":e<o.value.length&&l<o.value[e].length&&(t[e][l]=o.value[e][l]||"white");o.value=t,sessionStorage.setItem("Grid_H",a.value.toString()),sessionStorage.setItem("Grid_W",s.value.toString()),sessionStorage.setItem("Grid_playareaColor",JSON.stringify(o.value))}),u(g,t=>{sessionStorage.setItem("Grid_cellSize",t.toString())}),u(d,t=>{sessionStorage.setItem("Grid_frameSize",t.toString())}),u(i,t=>{sessionStorage.setItem("Grid_isFrameChangable",t.toString())}),u(n,t=>{sessionStorage.setItem("Grid_isIntersectionChangable",t.toString())}),u(f,t=>{sessionStorage.setItem("Grid_selectedColor",t.toString())}),u(o,t=>{console.log("playareaColor changed"),sessionStorage.setItem("Grid_playareaColor",JSON.stringify(t))},{deep:!0});const z=t=>{f.value=t},b=(t,e)=>{console.log(t,e),!(!n.value&&t%2===0&&e%2===0)&&(!i.value&&I(t%2===0,e%2===0)||(o.value[t][e]=f.value))};let y=!1;const k=(t,e)=>{y=!0,b(t-1,e-1)},M=(t,e)=>{y&&b(t-1,e-1)},V=()=>{y=!1};document.addEventListener("mouseup",V),u(i,t=>{if(console.log("isFrameChangable changed"),t===!1)for(let e=0;e<2*a.value+1;e++)for(let l=0;l<2*s.value+1;l++)I(e%2===0,l%2===0)&&(o.value[e][l]="#ccc");else for(let e=0;e<2*a.value+1;e++)for(let l=0;l<2*s.value+1;l++)I(e%2===0,l%2===0)&&o.value[e][l]==="#ccc"&&(o.value[e][l]="white")}),u(n,t=>{if(console.log("isIntersectionChangable changed"),t===!1)for(let e=0;e<2*a.value+1;e++)for(let l=0;l<2*s.value+1;l++)e%2===0&&l%2===0&&(o.value[e][l]="#ccc");else for(let e=0;e<2*a.value+1;e++)for(let l=0;l<2*s.value+1;l++)e%2===0&&l%2===0&&o.value[e][l]==="#ccc"&&(o.value[e][l]="white")}),F(()=>{console.log("mounted"),console.log(sessionStorage.getItem("Grid_playareaColor")),sessionStorage.getItem("Grid_H")?a.value=parseInt(sessionStorage.getItem("Grid_H")||"5"):sessionStorage.setItem("Grid_H",a.value.toString()),sessionStorage.getItem("Grid_W")?s.value=parseInt(sessionStorage.getItem("Grid_W")||"5"):sessionStorage.setItem("Grid_W",s.value.toString()),sessionStorage.getItem("Grid_cellSize")?g.value=parseInt(sessionStorage.getItem("Grid_cellSize")||"40"):sessionStorage.setItem("Grid_cellSize",g.value.toString()),sessionStorage.getItem("Grid_frameSize")?d.value=parseInt(sessionStorage.getItem("Grid_frameSize")||"10"):sessionStorage.setItem("Grid_frameSize",d.value.toString()),sessionStorage.getItem("Grid_isFrameChangable")?i.value=sessionStorage.getItem("Grid_isFrameChangable")==="true":sessionStorage.setItem("Grid_isFrameChangable",i.value.toString()),sessionStorage.getItem("Grid_isIntersectionChangable")?n.value=sessionStorage.getItem("Grid_isIntersectionChangable")==="true":sessionStorage.setItem("Grid_isIntersectionChangable",n.value.toString()),sessionStorage.getItem("Grid_selectedColor")?f.value=sessionStorage.getItem("Grid_selectedColor")||"red":sessionStorage.setItem("Grid_selectedColor",f.value.toString());const t=Array.from({length:2*a.value+1},()=>Array.from({length:2*s.value+1},()=>"white"));if(!i.value)for(let e=0;e<2*a.value+1;e++)for(let l=0;l<2*s.value+1;l++)I(e%2===0,l%2===0)&&(t[e][l]="#ccc");if(!n.value)for(let e=0;e<2*a.value+1;e++)for(let l=0;l<2*s.value+1;l++)e%2===0&&l%2===0&&(t[e][l]="#ccc");sessionStorage.getItem("Grid_playareaColor")?(o.value=JSON.parse(sessionStorage.getItem("Grid_playareaColor")||"[]"),o.value.length===0&&(o.value=t)):(sessionStorage.setItem("Grid_playareaColor",JSON.stringify(o.value)),o.value=t),console.log(o.value)});const H=()=>{a.value=5,s.value=5,g.value=40,d.value=10,i.value=!1,n.value=!1,f.value=G[1],o.value=[];for(let t=0;t<2*a.value+1;t++){o.value.push([]);for(let e=0;e<2*s.value+1;e++)t%2===1&&e%2===1?o.value[t].push("white"):o.value[t].push("#ccc")}};return(t,e)=>(m(),S("div",null,[r("div",$,[e[7]||(e[7]=r("label",{for:"H"},"H:",-1)),p(r("input",{id:"H",type:"number","onUpdate:modelValue":e[0]||(e[0]=l=>a.value=l)},null,512),[[C,a.value]]),e[8]||(e[8]=r("label",{for:"W"},"W:",-1)),p(r("input",{id:"W",type:"number","onUpdate:modelValue":e[1]||(e[1]=l=>s.value=l)},null,512),[[C,s.value]]),e[9]||(e[9]=r("label",{for:"cellSize"},"セルサイズ:",-1)),p(r("input",{id:"cellSize",type:"number","onUpdate:modelValue":e[2]||(e[2]=l=>g.value=l)},null,512),[[C,g.value]]),e[10]||(e[10]=r("label",{for:"frameSize"},"枠サイズ:",-1)),p(r("input",{id:"frameSize",type:"number","onUpdate:modelValue":e[3]||(e[3]=l=>d.value=l)},null,512),[[C,d.value]]),e[11]||(e[11]=r("label",{for:"frameColor"},"辺変更可能:",-1)),p(r("input",{id:"frameColor",type:"checkbox","onUpdate:modelValue":e[4]||(e[4]=l=>i.value=l)},null,512),[[w,i.value]]),e[12]||(e[12]=r("label",{for:"intersectionColor"},"頂点変更可能:",-1)),p(r("input",{id:"intersectionColor",type:"checkbox","onUpdate:modelValue":e[5]||(e[5]=l=>n.value=l)},null,512),[[w,n.value]])]),r("div",J,[r("div",B,[(m(!0),S(_,null,h(2*a.value+1,l=>(m(),S("div",{class:"row",key:l},[(m(!0),S(_,null,h(2*s.value+1,c=>(m(),S("div",{key:l*(2*a.value+1)+c},[N(O,{row:l-1,col:c-1,cellSize:g.value,frameSize:d.value,color:o.value[l-1][c-1],onMousedown:W=>k(l,c),onMouseenter:W=>M(l,c)},null,8,["row","col","cellSize","frameSize","color","onMousedown","onMouseenter"])]))),128))]))),128))]),r("div",E,[(m(),S(_,null,h(G,l=>r("div",{onClick:c=>z(l),class:"cell",key:l,style:U({width:j,height:R,backgroundColor:l})},[l===f.value?(m(),S("span",L,"✓")):A("",!0)],12,D)),64))])]),r("div",P,[r("button",{onClick:e[6]||(e[6]=l=>H())},"リセット")])]))}});export{K as default};
