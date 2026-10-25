(function(){
"use strict";
var $=function(s){return document.querySelector(s)};
function show(id){document.querySelectorAll(".screen").forEach(function(s){s.classList.toggle("on",s.id===id)});cur=id;syncAudio()}

/* ---------- music ----------
   - synthesised Happy Birthday: plays on the HAPPY BIRTHDAY slide (s2) and on the final ending (s5)
   - picture/background.mp3: loops ONLY during the Clash of Clans battle screen (s3)  */
var AC=null,muted=false,musicOn=false,master=null,musBus=null,loopT=null,cur="";
var bg=new Audio("picture/background.mp3");bg.loop=true;bg.volume=.5;bg.preload="auto";
var N={G4:392,A4:440,B4:494,C5:523,D5:587,E5:659,F5:698,G5:784};
var tune=[["G4",.75],["G4",.25],["A4",1],["G4",1],["C5",1],["B4",2],
["G4",.75],["G4",.25],["A4",1],["G4",1],["D5",1],["C5",2],
["G4",.75],["G4",.25],["G5",1],["E5",1],["C5",1],["B4",1],["A4",2],
["F5",.75],["F5",.25],["E5",1],["C5",1],["D5",1],["C5",2]];
function note(f,t,d){
  var o=AC.createOscillator(),g=AC.createGain();
  o.type="triangle";o.frequency.value=f;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5,t+.02);
  g.gain.exponentialRampToValueAtTime(.001,t+d);
  o.connect(g);g.connect(musBus);o.start(t);o.stop(t+d+.05);
}
function playLoop(){
  if(!musicOn||!musBus)return;
  var t=AC.currentTime+.1,beat=.46,total=0;
  tune.forEach(function(n){note(N[n[0]],t+total*beat,n[1]*beat*1.1);total+=n[1]});
  loopT=setTimeout(playLoop,(total*beat+1.2)*1000);
}
function startMusic(){
  try{
    if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=muted?0:.22;master.connect(AC.destination)}
    if(AC.state==="suspended")AC.resume();
  }catch(e){}
  syncAudio();
}
function syncAudio(){
  var want=cur==="s2"||cur==="s5";           /* birthday tune: greeting slide + the ending */
  if(want&&AC&&!musicOn){musicOn=true;musBus=AC.createGain();musBus.connect(master);playLoop()}
  if(!want&&musicOn){musicOn=false;clearTimeout(loopT);if(musBus){try{musBus.disconnect()}catch(e){}musBus=null}}
  if(cur==="s3"){bg.muted=muted;if(bg.paused){var p=bg.play();if(p&&p.catch)p.catch(function(){})}}   /* battle theme: game only; retried on every tap if the browser blocked it */
  else if(!bg.paused){bg.pause();bg.currentTime=0}
}
document.addEventListener("pointerdown",startMusic);
document.addEventListener("keydown",startMusic);
bg.addEventListener("canplaythrough",syncAudio);
bg.addEventListener("error",function(){var m=document.getElementById("gmsg");if(m&&cur==="s3")m.textContent="Music file not found: it must be at picture/background.mp3 (next to index.html)."});
function pop(){
  if(!AC||muted)return;
  try{var o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;
  o.type="square";o.frequency.setValueAtTime(600,t);o.frequency.exponentialRampToValueAtTime(90,t+.12);
  g.gain.setValueAtTime(.25,t);g.gain.exponentialRampToValueAtTime(.001,t+.14);
  o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.15)}catch(e){}
}

/* ---------- 1: Clash of Clans sliding puzzle ---------- */
var order=[],moves=0,solved=false,pic="",puzzleDone=false,battleDone=false;
function drawPic(){
  var c=document.createElement("canvas");c.width=c.height=600;var x=c.getContext("2d");
  var g=x.createLinearGradient(0,0,0,600);g.addColorStop(0,"#6fb0ff");g.addColorStop(.38,"#cfe9ff");g.addColorStop(.385,"#8dc43f");g.addColorStop(1,"#4f8a2a");
  x.fillStyle=g;x.fillRect(0,0,600,600);
  for(var i=0;i<12;i++)for(var j=0;j<7;j++){if((i+j)%2){x.fillStyle="rgba(255,255,255,.08)";x.fillRect(i*50,234+j*52,50,52)}}
  x.lineJoin="round";x.strokeStyle="#0d2352";x.lineWidth=6;
  function fs(col){x.fillStyle=col;x.fill();x.stroke()}
  function rect(col,a,b,w,h){x.beginPath();x.rect(a,b,w,h);fs(col)}
  function circ(col,a,b,r){x.beginPath();x.arc(a,b,r,0,6.283);fs(col)}
  rect("#b9a37a",190,300,220,140);rect("#d2c29a",225,235,150,70);
  x.beginPath();x.moveTo(200,245);x.lineTo(300,150);x.lineTo(400,245);x.closePath();fs("#2f6fd6");
  circ("#ffd447",300,138,17);
  rect("#8a7650",172,300,28,140);rect("#8a7650",400,300,28,140);
  x.beginPath();x.moveTo(272,440);x.lineTo(272,385);x.arc(300,385,28,3.14,0);x.lineTo(328,440);x.closePath();fs("#d6342c");
  rect("#6fb0ff",250,255,28,34);rect("#6fb0ff",322,255,28,34);
  circ("#6b7280",95,470,42);circ("#374151",95,470,16);
  x.save();x.translate(95,462);x.rotate(-.55);x.beginPath();x.rect(0,-13,78,26);fs("#1f2937");x.restore();
  rect("#2f6fd6",470,455,64,70);circ("#f2c9a0",502,418,36);
  x.beginPath();x.arc(502,412,38,3.4,6.02);x.closePath();fs("#f0b429");
  x.fillStyle="#f0b429";x.beginPath();x.ellipse(488,436,14,7,.2,0,6.28);x.ellipse(516,436,14,7,-.2,0,6.28);x.fill();x.stroke();
  circ("#0d2352",490,416,4);circ("#0d2352",514,416,4);
  x.strokeStyle="#0d2352";x.lineWidth=16;x.beginPath();x.moveTo(552,470);x.lineTo(585,360);x.stroke();
  x.strokeStyle="#e5e7eb";x.lineWidth=8;x.beginPath();x.moveTo(552,470);x.lineTo(585,360);x.stroke();
  x.strokeStyle="#0d2352";x.lineWidth=6;
  circ("#ffd447",90,230,24);circ("#ffd447",520,285,20);circ("#ffd447",330,520,18);
  x.beginPath();x.rect(50,36,500,96);fs("#d6342c");x.beginPath();x.rect(50,36,500,20);fs("#e8584f");
  x.font="56px 'Lilita One',Impact,sans-serif";x.textAlign="center";x.textBaseline="middle";x.lineWidth=9;
  x.strokeStyle="#0d2352";x.strokeText("CLASH OF CLANS",300,88);x.fillStyle="#fff";x.fillText("CLASH OF CLANS",300,88);
  return c.toDataURL("image/png");
}
function nbrs(p){var r=Math.floor(p/3),c=p%3,a=[];if(r>0)a.push(p-3);if(r<2)a.push(p+3);if(c>0)a.push(p-1);if(c<2)a.push(p+1);return a}
function isSolved(){return order.every(function(t,i){return t===i})}
/* a long random walk of legal slides (always solvable) */
function scramble(){
  var a=[0,1,2,3,4,5,6,7,8],e=8,prev=-1;
  for(var k=0;k<150;k++){
    var nb=nbrs(e).filter(function(n){return n!==prev}),n=nb[Math.floor(Math.random()*nb.length)];
    a[e]=a[n];a[n]=8;prev=e;e=n;
  }
  return a;
}
function makePuzzle(){
  if(!pic){pic=drawPic();$("#prev").src=pic}
  stopAuto();hintPos=-1;$("#auto").style.visibility="";$("#auto").disabled=false;
  var tries=0;
  do{
    order=scramble();tries++;
  }while((isSolved()||solvePath().length<12)&&tries<40);   /* never solved, never nearly solved */
  moves=0;solved=false;$("#mv").textContent="0";
  $("#pmsg").textContent="Slide the pieces to finish the picture. The empty space ends at the bottom-right.";
  renderPuzzle();
}
var auto=null,hintPos=-1;
function stopAuto(){if(auto){clearInterval(auto);auto=null}}
function renderPuzzle(){
  var bd=$("#board");bd.innerHTML="";bd.classList.toggle("done",solved);
  order.forEach(function(t,pos){
    var b=document.createElement("button");b.type="button";b.className="tile";
    if(t===8&&!solved){b.classList.add("empty");b.setAttribute("aria-label","Empty space")}
    else{b.style.backgroundImage="url("+pic+")";b.style.backgroundPosition=(t%3)*50+"% "+Math.floor(t/3)*50+"%";b.setAttribute("aria-label","Puzzle piece "+(t+1));b.setAttribute("data-n",t+1)}
    if(pos===hintPos)b.classList.add("hint");
    b.addEventListener("click",function(){slide(pos,false)});
    bd.appendChild(b);
  });
}
function slide(pos,byAuto){
  if(solved||(auto&&!byAuto))return;
  var e=order.indexOf(8);
  if(nbrs(pos).indexOf(e)<0)return;
  startMusic();pop();hintPos=-1;
  order[e]=order[pos];order[pos]=8;moves++;$("#mv").textContent=moves;
  if(isSolved()){
    solved=true;puzzleDone=true;stopAuto();$("#pmsg").textContent="Puzzle complete in "+moves+" moves!";
    setTimeout(function(){show("s2")},1600);
  }
  renderPuzzle();
}
function solvePath(){
  var a=order.slice(),path=[];
  function h(x){var d=0;for(var i=0;i<9;i++){var t=x[i];if(t!==8)d+=Math.abs(Math.floor(t/3)-Math.floor(i/3))+Math.abs(t%3-i%3)}return d}
  function dfs(e,g,lim,prev){
    var hh=h(a),f=g+hh;if(f>lim)return f;if(hh===0)return -1;
    var min=1e9,nb=nbrs(e);
    for(var k=0;k<nb.length;k++){
      var n=nb[k];if(n===prev)continue;
      a[e]=a[n];a[n]=8;path.push(n);
      var r=dfs(n,g+1,lim,e);
      if(r===-1)return -1;
      path.pop();a[n]=a[e];a[e]=8;
      if(r<min)min=r;
    }
    return min;
  }
  var lim=h(a),e0=a.indexOf(8);
  while(lim<80){var r=dfs(e0,0,lim,-1);if(r===-1)return path;lim=r}
  return [];
}
$("#hint").addEventListener("click",function(){
  if(solved||auto)return;var p=solvePath();
  if(p.length){hintPos=p[0];renderPuzzle()}
});
var declines=0;
var DECLINES=[
"Payment declined 💸 Your card has insufficient clan gold.",
"Declined again! Even the Goblins can't afford this.",
"Error 1000: Not enough love in the bank account 😅"];
function openPaywall(){
  declines=0;$("#pwsub").textContent="Subscribe $1000";$("#pwcancel").hidden=true;
  $("#pwtext").innerHTML="Auto-Solve is part of <b>Clan Pass Gold</b>. Subscribe now for only <b>$1000</b> / month!";
  $("#pw").classList.add("on");
}
/* Subscribe -> declined -> "Try again" + "Cancel" */
$("#pwsub").addEventListener("click",function(){
  $("#pwtext").textContent=DECLINES[declines++%DECLINES.length];
  this.textContent="Try again";$("#pwcancel").hidden=false;
});
/* Cancel -> popup closes, "Solve for me" is locked and the player must solve the puzzle by hand */
$("#pwcancel").addEventListener("click",function(){
  $("#pw").classList.remove("on");
  var b=$("#auto");b.disabled=true;b.style.visibility="hidden";
  $("#pmsg").textContent="Subscription cancelled. Solve the puzzle yourself! 💪";
});
$("#auto").addEventListener("click",function(){
  if(solved||auto||this.disabled)return;
  openPaywall();
});
$("#shuf").addEventListener("click",function(){if(!solved)makePuzzle()});

/* ---------- 2 + 5: HAPPY BIRTHDAY letters ---------- */
function buildHB(h){
  var words=["HAPPY","BIRTHDAY"],k=0;
  words.forEach(function(w){
    var line=document.createElement("div");
    w.split("").forEach(function(ch){
      var s=document.createElement("span");s.textContent=ch;
      s.className=k%2?"l2":"l1";s.style.animationDelay=(k*.09)+"s";k++;line.appendChild(s);
    });
    h.appendChild(line);
  });
}
buildHB($("#hb"));buildHB($("#hb2"));
$("#next").addEventListener("click",function(){show("s3");startGame();$("#dm").classList.add("on")});
$("#dmok").addEventListener("click",function(){$("#dm").classList.remove("on")});

/* ---------- THE END: confetti + happy birthday music ---------- */
var cf=$("#confetti"),cx=cf.getContext("2d"),bits=[],cfRaf=null,CCOL=["#d6342c","#2f6fd6","#ffd447","#6fb0ff","#ff8ad0","#7cf06a","#ffffff"];
function sizeCf(){cf.width=window.innerWidth;cf.height=window.innerHeight}
function bit(initial){
  return {x:Math.random()*cf.width,y:initial?Math.random()*-cf.height:-20,w:6+Math.random()*8,h:10+Math.random()*10,
    c:CCOL[Math.floor(Math.random()*CCOL.length)],vy:2+Math.random()*3.5,vx:(Math.random()-.5)*2.4,
    r:Math.random()*6.28,vr:(Math.random()-.5)*.3,sw:Math.random()*6.28,sv:.03+Math.random()*.05};
}
function stepCf(){
  cx.clearRect(0,0,cf.width,cf.height);
  bits.forEach(function(b){
    b.y+=b.vy;b.sw+=b.sv;b.x+=b.vx+Math.sin(b.sw)*1.2;b.r+=b.vr;
    if(b.y>cf.height+20){b.y=-20;b.x=Math.random()*cf.width}
    if(b.x<-20)b.x=cf.width+20;if(b.x>cf.width+20)b.x=-20;
    cx.save();cx.translate(b.x,b.y);cx.rotate(b.r);cx.scale(1,Math.abs(Math.cos(b.sw)));
    cx.fillStyle=b.c;cx.fillRect(-b.w/2,-b.h/2,b.w,b.h);cx.restore();
  });
  cfRaf=requestAnimationFrame(stepCf);
}
function startConfetti(){
  sizeCf();bits=[];
  var n=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches?60:220;
  for(var i=0;i<n;i++)bits.push(bit(true));
  cancelAnimationFrame(cfRaf);stepCf();
}
window.addEventListener("resize",function(){if(cur==="s5")sizeCf()});
/* called when she taps "HAPPY BIRTHDAY" in the letter: this is the end of the website */
window.endParty=function(){
  cancelAnimationFrame(raf);
  show("s5");startMusic();startConfetti();
};

/* ---------- 3: Clash-style battle (3D, three.js) ---------- */
var W=900,H=560,GX=450,GZ=280;
var wrapEl=$("#cv"),renderer,scene,camera,dyn,ray,plane;

/* --- materials & primitives: PBR-ish, soft cartoon shading --- */
function lin(c){return new THREE.Color(c).convertSRGBToLinear()}
function mat(c,r){return new THREE.MeshStandardMaterial({color:lin(c),roughness:r==null?.7:r,metalness:0})}
function mk(geo,c,x,y,z,par){var m=new THREE.Mesh(geo,mat(c));m.position.set(x||0,y||0,z||0);m.castShadow=true;m.receiveShadow=true;if(par)par.add(m);return m}
function box(w,h,d,c,x,y,z,par){return mk(new THREE.BoxGeometry(w,h,d),c,x,y,z,par)}
function cyl(rt,rb,h,c,x,y,z,par,seg){return mk(new THREE.CylinderGeometry(rt,rb,h,seg||18),c,x,y,z,par)}
function ball(r,c,x,y,z,par){return mk(new THREE.SphereGeometry(r,16,12),c,x,y,z,par)}
function lump(r,c,x,y,z,par){var m=mk(new THREE.IcosahedronGeometry(r,1),c,x,y,z,par);m.material.flatShading=true;return m}
function metal(m,r){m.material.metalness=.7;m.material.roughness=r||.35;return m}
function shine(m,e){m.material.emissive=new THREE.Color(m.material.color).multiplyScalar(e||.35);m.material.metalness=.5;m.material.roughness=.3;return m}
function blob(r,par){var m=new THREE.Mesh(new THREE.CircleGeometry(r,20),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.28,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.6;par.add(m);return m}
function mkBar(w){
  var g=new THREE.Group();
  function m(c,ww,hh,z){var o=new THREE.Mesh(new THREE.PlaneGeometry(ww,hh),new THREE.MeshBasicMaterial({color:c,depthTest:false}));o.position.z=z;o.renderOrder=10;return o}
  g.add(m(0x000000,w,6,0));g.f=m(0x7cf06a,w-2,4,.5);g.add(g.f);g.visible=false;dyn.add(g);return g;
}
function setBar(g,r,w){g.f.scale.x=Math.max(.001,r);g.f.position.x=-(w-2)*(1-r)/2}

function grassTex(){
  var c=document.createElement("canvas");c.width=c.height=256;var x=c.getContext("2d");
  x.fillStyle="#8fcb2e";x.fillRect(0,0,256,256);x.fillStyle="#7fbb26";x.fillRect(0,0,128,128);x.fillRect(128,128,128,128);
  for(var i=0;i<900;i++){x.fillStyle=Math.random()<.5?"rgba(255,255,160,.10)":"rgba(40,90,10,.10)";x.fillRect(Math.random()*256,Math.random()*256,2,5)}
  var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;
}
function mkTree(x,z,s){
  var t=new THREE.Group();t.position.set(x,0,z);t.scale.setScalar(s);scene.add(t);blob(30,t);
  cyl(5,8,26,0x6b4423,0,13,0,t,8);
  lump(26,0x2f8a35,0,48,0,t);lump(20,0x3fa042,6,70,-3,t);lump(14,0x56b84c,-3,88,2,t);
}
function mkBush(x,z){var b=new THREE.Group();b.position.set(x,0,z);scene.add(b);blob(14,b);lump(10,0x3a9a3c,0,8,0,b);lump(7,0x4db54a,8,6,3,b)}
function mkRock(x,z,s){var r=lump(10*s,0x8b929c,x,5*s,z,scene);r.scale.y=.7;r.rotation.y=Math.random()*3}
function mkFlower(x,z){var c=[0xff7aa8,0xffd447,0xffffff][Math.floor(Math.random()*3)];cyl(.5,.5,6,0x3b8a2e,x,3,z,scene,5);ball(2.5,c,x,7,z,scene)}

function initScene(){
  ray=new THREE.Raycaster();plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
  renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
  renderer.setSize(1350,840,false);
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  wrapEl.appendChild(renderer.domElement);
  renderer.domElement.addEventListener("pointerdown",deploy);renderer.domElement.addEventListener("pointermove",moved);
  scene=new THREE.Scene();scene.background=lin(0x8fcfff);scene.fog=new THREE.Fog(lin(0xb4defa),1100,2300);
  camera=new THREE.PerspectiveCamera(40,900/560,10,3500);
  camera.position.set(0,720,600);camera.lookAt(0,0,20);
  scene.add(new THREE.HemisphereLight(0xdff0ff,0x4f7a2a,.75));
  var sun=new THREE.DirectionalLight(0xfff0c8,1.6);sun.position.set(-320,520,260);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0006;sun.shadow.radius=3;
  var sc=sun.shadow.camera;sc.left=-640;sc.right=640;sc.top=540;sc.bottom=-540;sc.near=10;sc.far=1800;
  scene.add(sun);
  var og=new THREE.Mesh(new THREE.PlaneGeometry(3600,2800),mat(0x5f9a2c,1));og.rotation.x=-Math.PI/2;og.position.y=-2;og.receiveShadow=true;scene.add(og);
  var tx=grassTex();tx.repeat.set(W/64,H/64);
  var f=new THREE.Mesh(new THREE.PlaneGeometry(W,H),new THREE.MeshStandardMaterial({map:tx,roughness:1}));f.rotation.x=-Math.PI/2;f.receiveShadow=true;scene.add(f);
  /* dirt edge + wooden fence like the village border */
  var dc=0x9a7040,fc=0x8b5a2b,i;
  box(W+40,6,22,dc,0,3,-GZ-11,scene);box(W+40,6,22,dc,0,3,GZ+11,scene);box(22,6,H,dc,-GX-11,3,0,scene);box(22,6,H,dc,GX+11,3,0,scene);
  for(i=-GX;i<=GX;i+=45){[ -GZ-8,GZ+8 ].forEach(function(z){cyl(3,3.5,22,fc,i,15,z,scene,6);cyl(0,3.6,5,fc,i,28,z,scene,6)})}
  for(i=-GZ;i<=GZ;i+=45){[ -GX-8,GX+8 ].forEach(function(x){cyl(3,3.5,22,fc,x,15,i,scene,6);cyl(0,3.6,5,fc,x,28,i,scene,6)})}
  box(W+16,4,3,0xa26b35,0,18,-GZ-8,scene);box(W+16,4,3,0xa26b35,0,18,GZ+8,scene);box(3,4,H+16,0xa26b35,-GX-8,18,0,scene);box(3,4,H+16,0xa26b35,GX+8,18,0,scene);
  /* scenery */
  for(i=0;i<34;i++){
    var tx2,tz;do{tx2=(Math.random()-.5)*1900;tz=(Math.random()-.5)*1200}while(Math.abs(tx2)<520&&Math.abs(tz)<340);
    mkTree(tx2,tz,.8+Math.random()*.6);
  }
  for(i=0;i<22;i++){var bx,bz;do{bx=(Math.random()-.5)*1300;bz=(Math.random()-.5)*900}while(Math.abs(bx)<475&&Math.abs(bz)<305);if(i%3===0)mkRock(bx,bz,1+Math.random());else mkBush(bx,bz)}
  for(i=0;i<70;i++)mkFlower((Math.random()-.5)*(W-60),(Math.random()-.5)*(H-60));
  dyn=new THREE.Group();scene.add(dyn);
  ring=new THREE.Mesh(new THREE.RingGeometry(18,22,24),new THREE.MeshBasicMaterial({color:0x7cf06a,side:THREE.DoubleSide,transparent:true,opacity:.85}));ring.rotation.x=-Math.PI/2;ring.visible=false;scene.add(ring);
}

/* ---------- 3: Clash campaign - build a home ---------- */
var FINAL_MESSAGE=[
"A LEGENDARY HERO WAS BORN…",
"From the Builder's Workshop to the Clan Capital, word has spread across the kingdom. The troops are assembled, and a special celebration awaits.",
"But today, we're not fighting for trophies or raiding for gold. Today, the kingdom celebrates someone far more precious than any treasure.",
"HAPPY BIRTHDAY, MY FAVORITE CHIEF!",
"Another year, another level unlocked, and another chapter of your story begins. And if there's one adventure I'd choose over and over again, it would always be the one with you.",
"Now, my love… ready to unlock your birthday surprise?"
];
var TY={
 cn:{c:300,r:22,hp:320,rng:190,dmg:20,cd:.9},
 at:{c:450,r:20,hp:280,rng:260,dmg:11,cd:.55},
 mt:{c:650,r:24,hp:300,rng:340,min:90,dmg:36,cd:2.4,spl:55},
 gm:{c:250,r:24,hp:220},ec:{c:250,r:22,hp:220},wl:{c:50,r:12,hp:300},hs:{r:50,hp:1000}
};
var PT={
 b:{c:2,hp:70,sp:75,dmg:9,cd:.6,s:1.5,skin:0xf2c9a0,hair:0xe8a21c},
 a:{c:2,hp:40,sp:80,dmg:8,cd:.65,rng:140,s:1.3,skin:0xf2c9a0,hair:0xff7aa8},
 gi:{c:5,hp:400,sp:45,dmg:22,cd:1.2,s:2.5,skin:0xe9a574,hair:0xff9a2e}
};
var EN={
 g:{hp:30,sp:125,dmg:6,cd:.4,s:1,skin:0x6cc04a,hair:0x3d7a2a},
 b:{hp:60,sp:70,dmg:7,cd:.5,s:1.5,skin:0xf2c9a0,hair:0xe8a21c},
 gi:{hp:250,sp:45,dmg:22,cd:1.2,s:2.5,skin:0xe9a574,hair:0xff9a2e,fav:1},
 bk:{hp:900,sp:40,dmg:40,cd:1.4,s:3.4,skin:0x9aa3b2,hair:0x374151,fav:1}
};
var LV=[
 {tip:"Level 1: claim the land! Defend the stakes, and the foundation will be laid.",w:[[["g",5]],[["g",4],["b",3]],[["b",5],["g",4]]]},
 {tip:"Level 2: raise the frame! Upgrade your defenses and hold the line.",w:[[["b",5],["g",5]],[["gi",2],["b",4]],[["gi",2],["b",5],["g",6]]]},
 {tip:"Level 3: build the roof! A mighty boss is coming. Use everything you have.",w:[[["b",6],["g",6]],[["gi",3],["b",5]],[["gi",2],["b",6],["g",8]],[["bk",1],["gi",2],["b",6]]]}
];
var STGN=["Foundation","Frame","Roof"];
var B,T,P,shots,parts,elixir=0,gold=0,phase="end",sel=null,tsel="b",level=0,completed=0,wave=0,waveT=0,down=false,ring,hs,snap,bt=0,anim=null,stg=1,homeSrc="",ovAct=function(){},last,raf,lastStars=0,lastReward=0;
function msg(s){$("#gmsg").textContent=s}
function mkB(t,x,y,lvl){var ty=TY[t],m=1+.5*(lvl-1);return {t:t,x:x,y:y,lvl:lvl,r:ty.r,hp:ty.hp*m,max:ty.hp*m,cd:0,sc:1+.07*(lvl-1)}}
function setCam(k){camera.position.set(0,620-320*k,520-190*k);camera.lookAt(0,40*k,20-20*k)}

/* Town Hall construction stages */
function stage(g,s){
  var sg=new THREE.Group();g.add(sg);
  if(s===1){
    box(130,10,106,0x8d949e,0,5,0,sg);box(118,4,94,0xc5ccd6,0,12,0,sg);box(60,5,12,0xa9b0ba,0,3,58,sg);box(44,3,12,0xa9b0ba,0,1.5,66,sg);
    [[-60,-48],[60,-48],[-60,48],[60,48]].forEach(function(p){box(12,16,12,0x6b7280,p[0],8,p[1],sg)});
  }else if(s===2){
    [[-54,-42],[-18,-42],[18,-42],[54,-42],[-54,42],[-18,42],[18,42],[54,42]].forEach(function(p){box(8,64,8,0xb07a3f,p[0],43,p[1],sg)});
    [-42,42].forEach(function(z){box(120,8,8,0x8b5a2b,0,78,z,sg);box(116,5,5,0x8b5a2b,0,50,z,sg)});
    [-54,54].forEach(function(x){box(8,8,96,0x8b5a2b,x,78,0,sg);box(5,5,92,0x8b5a2b,x,50,0,sg)});
    var d1=box(5,5,86,0x8b5a2b,-54,48,0,sg);d1.rotation.x=.8;var d2=box(5,5,86,0x8b5a2b,54,48,0,sg);d2.rotation.x=-.8;
    box(110,6,90,0x9a7040,0,16,0,sg);
  }else{
    box(112,56,4,0xf3e6c8,0,43,-42,sg);box(112,56,4,0xf3e6c8,0,43,42,sg);box(4,56,88,0xf3e6c8,-54,43,0,sg);box(4,56,88,0xf3e6c8,54,43,0,sg);
    [[-54,-42],[0,-42],[54,-42],[-54,42],[0,42],[54,42]].forEach(function(p){box(9,60,9,0x8b5a2b,p[0],43,p[1],sg)});
    box(124,6,98,0x8b5a2b,0,74,0,sg);
    box(26,38,4,0x5a3a1c,0,29,44,sg);var arch=cyl(13,13,4,0x5a3a1c,0,48,44,sg);arch.rotation.x=Math.PI/2;
    [-34,34].forEach(function(x){box(18,18,3,0x7fc4ff,x,50,44,sg);box(22,3,5,0x8b5a2b,x,39,45,sg)});
    var sh=new THREE.Shape();sh.moveTo(-70,0);sh.lineTo(70,0);sh.lineTo(0,56);sh.closePath();
    var rf=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:132,bevelEnabled:true,bevelSize:2,bevelThickness:2,bevelSegments:1}),mat(0xc8332b,.6));
    rf.rotation.y=Math.PI/2;rf.position.set(-66,76,0);rf.castShadow=true;rf.receiveShadow=true;sg.add(rf);
    box(138,5,8,0x2f6fd6,0,132,0,sg);
    box(12,34,12,0x9a8863,34,108,-18,sg);box(16,5,16,0x7a6a4a,34,126,-18,sg);
    cyl(1.2,1.2,26,0x4b5563,0,146,0,sg,6);shine(ball(6,0xffd447,0,162,0,sg),.4);
    var fl=box(16,10,1.5,0x2f6fd6,9,154,0,sg);fl.castShadow=false;
  }
  return sg;
}

function build(b){
  var g=new THREE.Group();g.position.set(b.x-GX,0,b.y-GZ);g.scale.setScalar(b.sc||1);b.g=g;
  if(b.t!=="hs"&&b.t!=="wl")blob(TY[b.t].r+6,g);
  if(b.t==="hs"){
    var pl=new THREE.Group();g.add(pl);b.plot=pl;
    if(completed===0)[[-52,-42],[52,-42],[-52,42],[52,42]].forEach(function(p){cyl(2.5,2.5,36,0x8b5a2b,p[0],18,p[1],pl);box(16,10,2,0xd6342c,p[0]+8,32,p[1],pl)});
    for(var s=1;s<=completed;s++)stage(g,s);
    b.by=170;
  }else if(b.t==="cn"){
    cyl(26,30,10,0x8d949e,0,5,0,g,10);cyl(22,24,8,0x6b7280,0,13,0,g,10);
    cyl(17,18,8,0x4b5563,0,21,0,g);
    [-20,20].forEach(function(x){var w=cyl(13,13,5,0x8b5a2b,x,20,-4,g);w.rotation.z=Math.PI/2;cyl(3,3,6,0x3f2a14,x,20,-4,g).rotation.z=Math.PI/2});
    var p=new THREE.Group();p.position.y=30;g.add(p);b.barrel=p;
    var br=metal(cyl(8,11,48,0x2b2f38,0,0,22,p),.3);br.rotation.x=Math.PI/2;
    var r1=cyl(10,10,4,0x1a1d23,0,0,40,p);r1.rotation.x=Math.PI/2;
    var r2=shine(cyl(9.5,9.5,3,0xffc93c,0,0,8,p),.3);r2.rotation.x=Math.PI/2;
    metal(ball(15,0x3b4250,0,0,0,p),.35);b.by=64;
  }else if(b.t==="at"){
    [[-14,-14],[14,-14],[-14,14],[14,14]].forEach(function(q){box(5,56,5,0x8b5a2b,q[0],28,q[1],g)});
    box(34,4,4,0xa26b35,0,18,-14,g);box(34,4,4,0xa26b35,0,18,14,g);box(4,4,34,0xa26b35,-14,34,0,g);box(4,4,34,0xa26b35,14,34,0,g);
    box(46,8,46,0xb08a5a,0,58,0,g);
    [[-20,-20],[20,-20],[-20,20],[20,20]].forEach(function(q){box(4,14,4,0x8b5a2b,q[0],68,q[1],g)});
    var a=new THREE.Group();a.position.y=64;g.add(a);box(6,8,5,0x2f6fd6,0,4,0,a);ball(5,0xf2c9a0,0,12,0,a);var ah=ball(5.4,0xff7aa8,0,13,-.5,a);ah.scale.y=.8;
    var r2=cyl(0,36,24,0xc8332b,0,92,0,g,4);r2.rotation.y=Math.PI/4;
    [[-17,-17],[17,-17],[-17,17],[17,17]].forEach(function(q){box(3,24,3,0x8b5a2b,q[0],80,q[1],g)});
    shine(ball(4,0xffd447,0,106,0,g),.4);b.by=118;
  }else if(b.t==="mt"){
    cyl(27,31,10,0x8d949e,0,5,0,g,8);cyl(22,26,12,0x6b7280,0,16,0,g,8);
    var bowl=metal(ball(18,0x3b4250,0,26,0,g),.4);bowl.scale.y=.75;
    var tb=metal(cyl(12,16,36,0x2b2f38,0,38,-4,g),.3);tb.rotation.x=-.45;
    var rim=shine(cyl(13,13,4,0xc8962c,0,52,-14,g),.25);rim.rotation.x=-.45;b.by=78;
  }else if(b.t==="gm"){
    box(42,24,42,0x8b6b3a,0,12,0,g);box(46,3,46,0x6b4a22,0,25,0,g);
    var r3=cyl(0,38,22,0x7a4e24,0,36,0,g,4);r3.rotation.y=Math.PI/4;
    box(14,22,3,0x3f2a14,0,11,21,g);
    for(var j=0;j<5;j++)shine(ball(4+Math.random()*2,0xffc93c,-34+j*5,4+(j%2)*5,28-j*3,g),.4);
    var ct=box(20,12,16,0x6b4a22,30,8,10,g);shine(ball(7,0xffc93c,30,16,10,g),.4);
    cyl(5,5,3,0x3f2a14,22,3,18,g).rotation.z=Math.PI/2;cyl(5,5,3,0x3f2a14,38,3,18,g).rotation.z=Math.PI/2;
    shine(cyl(8,8,4,0xffd447,0,50,0,g,12),.4);b.by=70;
  }else if(b.t==="ec"){
    cyl(24,27,8,0x8d949e,0,4,0,g,12);
    var glass=cyl(17,19,36,0xe0449c,0,26,0,g);glass.material.transparent=true;glass.material.opacity=.85;glass.material.emissive=new THREE.Color(0x7a1a5a);
    shine(ball(16,0xff8ad0,0,46,0,g),.5);
    [10,26,40].forEach(function(y){metal(cyl(19.5,19.5,3,0x6b7280,0,y+4,0,g),.4)});
    var pp=metal(cyl(3,3,26,0x6b7280,22,16,0,g),.4);ball(5,0xc084fc,22,30,0,g);b.by=76;
  }else{
    box(26,18,26,0x9097a2,0,9,0,g);box(28,5,28,0xc5ccd6,0,20,0,g);
    [[-9,-9],[9,-9],[-9,9],[9,9]].forEach(function(q){box(7,6,7,0xb4bbc6,q[0],25,q[1],g)});b.by=36;
  }
  for(var i=1;i<b.lvl;i++)shine(ball(4.5,0xffd447,(i-1)*12-6*(b.lvl-2),b.by-4,0,g),.45);
  dyn.add(g);b.bar=mkBar(b.t==="wl"?26:b.t==="hs"?70:46);
}

/* a big, shiny, clearly visible sword (blade points forward along z) */
function sword(sw,L,w){
  shine(box(w,w*.4,L,0xf4f8ff,0,0,6+L/2,sw),.35);          /* blade */
  box(w*.5,w*.5,L*.8,0xffffff,0,w*.22,6+L/2,sw);            /* highlight along the blade */
  box(w*3.2,w,w*1.2,0xc8962c,0,0,5,sw);                      /* cross-guard */
  box(w*.9,w*.9,6,0x5a3a1c,0,0,1.5,sw);                      /* handle */
  shine(ball(w*.6,0xffd447,0,0,-2,sw),.4);                   /* pommel */
}

/* Chibi troops, Clash style: big head, small body */
function mkUnit(u,shirt){
  var e=u.e,k=u.k,g=new THREE.Group(),sw=new THREE.Group(),h;
  blob(9,g);
  box(4,7,5,0x4a3b2a,-3.5,3.5,0,g);box(4,7,5,0x4a3b2a,3.5,3.5,0,g);
  box(14,12,9,k==="a"?0x2f8f3a:k==="g"?0x7a5a32:shirt,0,13,0,g);
  box(15,3,10,0x5a3a1c,0,8,0,g);
  box(3.5,9,3.5,e.skin,-8.5,13,0,g);
  h=ball(8,e.skin,0,27,0,g);h.scale.set(1.08,.96,1);
  ball(2,0xffffff,-3,28,6.8,g);ball(2,0xffffff,3,28,6.8,g);ball(1,0x111111,-3,28,8.4,g);ball(1,0x111111,3,28,8.4,g);
  box(4.5,1.2,1,0x3a2a14,-3,31,7.4,g).rotation.z=.3;box(4.5,1.2,1,0x3a2a14,3,31,7.4,g).rotation.z=-.3;
  var hr=mk(new THREE.SphereGeometry(8.7,14,8,0,6.28,0,1.55),k==="a"?0x2f8f3a:e.hair,0,27.5,0,g);hr.rotation.x=-.3;
  if(k==="b"){box(9,2.4,2,e.hair,0,23.6,8,g);box(14,2,10,0xc8962c,0,33,0,g)}
  if(k==="a"){box(5,12,3,e.hair,-6,22,-5,g);box(5,12,3,e.hair,6,22,-5,g);ball(3,0xffffff,0,23.5,8,g).scale.set(1.6,.3,.5)}
  if(k==="g"){[-1,1].forEach(function(s){var ear=cyl(0,3.2,11,e.skin,s*10,29,0,g,6);ear.rotation.z=-s*1.35});box(5,1.5,1.5,0xffffff,0,23.5,8,g)}
  if(k==="gi"){box(11,6,3,e.hair,0,22.5,7,g);[-8.8,8.8].forEach(function(x){cyl(2.6,2.6,3,0xc8962c,x,9,0,g,8)})}
  if(k==="bk"){shine(cyl(7,9,7,0xffd447,0,35,0,g,6),.4);box(12,6,4,0x374151,0,22.5,7,g)}
  sw.position.set(9,13,1);g.add(sw);box(3.5,3.5,8,e.skin,0,0,3,sw);
  if(e.rng){var bow=new THREE.Mesh(new THREE.TorusGeometry(9,1.1,6,14,Math.PI),mat(0x8b5a2b));bow.rotation.z=Math.PI/2;bow.position.set(0,0,9);bow.castShadow=true;sw.add(bow);box(.5,.5,18,0xffffff,0,0,9,sw).rotation.x=0}
  else if(k==="g"){sword(sw,17,3.2)}
  else if(k==="b"){sword(sw,32,4.6)}
  else if(k==="gi"){sword(sw,42,6.5)}
  else if(k==="bk"){cyl(2.5,4,22,0x4a3b2a,0,0,14,sw,8).rotation.x=Math.PI/2;[3,9].forEach(function(z){ball(2.2,0xdde3ea,0,4,14+z,sw)})}
  g.scale.setScalar(e.s);g.position.set(u.x-GX,0,u.y-GZ);dyn.add(g);u.sw=sw;u.bar=mkBar(16+e.s*4);return g;
}
function spawnU(list,e,k,x,y,team){
  var u={x:x,y:y,k:k,e:e,hp:e.hp,max:e.hp,cd:0,ph:Math.random()*6,ang:0,mv:false,atk:false,team:team};
  u.g=mkUnit(u,team?0xb02a24:0x2f6fd6);list.push(u);
}
function clearField(){while(dyn.children.length)dyn.remove(dyn.children[0])}
function updSteps(){[].forEach.call($("#steps").children,function(s,i){s.className=i<completed?"done":i===level?"active":""})}
function beginLevel(){
  clearField();T=[];P=[];shots=[];parts=[];
  B=B.filter(function(b){return b.hp>0});
  B.forEach(function(b){b.hp=b.max;b.dead=false;b.flash=0;b.cd=0;build(b)});
  hs=B[0];elixir=8;wave=0;waveT=1.5;phase="build";sel=null;setCam(0);anim=null;
  snap={gold:gold,bl:B.slice(1).map(function(b){return {t:b.t,x:b.x,y:b.y,lvl:b.lvl}})};
  $("#over").classList.remove("on");$("#shop").style.display="flex";$("#troops").style.display="none";
  document.querySelectorAll("#shop .card").forEach(function(c){c.classList.remove("sel")});
  updSteps();msg(LV[level].tip+" Pick a building, then tap the grass.");
  last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
function restore(){
  B=[mkB("hs",450,280,1)].concat(snap.bl.map(function(o){return mkB(o.t,o.x,o.y,o.lvl)}));
  B.slice(1).forEach(function(b){var m=1+.5*(b.lvl-1);b.hp=b.max=TY[b.t].hp*m});
  gold=snap.gold;beginLevel();
}
function startGame(){
  if(!window.THREE){msg("The 3D engine could not load. Check your internet connection and reload.");return}
  if(!renderer)initScene();
  level=0;completed=0;gold=2000;homeSrc="";
  B=[mkB("hs",450,280,1)];beginLevel();
}
function worldPos(e){
  var rc=renderer.domElement.getBoundingClientRect(),p=new THREE.Vector3();
  ray.setFromCamera(new THREE.Vector2((e.clientX-rc.left)/rc.width*2-1,-((e.clientY-rc.top)/rc.height*2-1)),camera);
  if(!ray.ray.intersectPlane(plane,p))return null;
  return {x:p.x+GX,y:p.z+GZ};
}
function snap25(v){return Math.round(v/25)*25}
function canPlace(x,y,r){
  if(x<30||x>W-30||y<30||y>H-30)return false;
  return !B.some(function(b){return b.hp>0&&Math.hypot(b.x-x,b.y-y)<b.r+r-2});
}
function deployP(p){
  var c=PT[tsel].c;
  if(elixir<c){msg("Not enough elixir!");return}
  if(p.x<10||p.x>W-10||p.y<10||p.y>H-10)return;
  for(var i=0;i<B.length;i++)if(B[i].hp>0&&Math.hypot(B[i].x-p.x,B[i].y-p.y)<B[i].r+14)return;
  elixir-=c;spawnU(P,PT[tsel],tsel,p.x,p.y,0);puff(p.x,p.y,8,0xe8e0c8);
}
function act(e){
  var p=worldPos(e);if(!p)return;
  if(phase==="battle"){deployP(p);return}
  if(phase!=="build"||!sel)return;
  if(sel==="sell"||sel==="up"){
    for(var i=0;i<B.length;i++){var b=B[i];
      if(b.t!=="hs"&&Math.hypot(b.x-p.x,b.y-p.y)<b.r+8){
        if(sel==="sell"){gold+=Math.floor(TY[b.t].c*.8*b.lvl);dyn.remove(b.g,b.bar);B.splice(i,1);return}
        if(b.lvl>=3){msg("Already max level!");return}
        var cost=Math.round(TY[b.t].c*.8*b.lvl);
        if(gold<cost){msg("Upgrade costs "+cost+" gold.");return}
        gold-=cost;b.lvl++;b.max=TY[b.t].hp*(1+.5*(b.lvl-1));b.hp=b.max;b.sc=1+.07*(b.lvl-1);
        dyn.remove(b.g,b.bar);build(b);msg("Upgraded to level "+b.lvl+"!");return;
      }}
    return;
  }
  var ty=TY[sel],x=snap25(p.x),y=snap25(p.y);
  if(gold<ty.c){msg("Not enough gold!");return}
  if(!canPlace(x,y,ty.r))return;
  gold-=ty.c;var nb=mkB(sel,x,y,1);B.push(nb);build(nb);puff(x,y,8,0xe8e0c8);
}
function deploy(e){down=true;act(e)}
function moved(e){
  if(phase!=="build"||!sel||!TY[sel]){ring.visible=false;return}
  var p=worldPos(e);if(!p)return;
  var ty=TY[sel],x=snap25(p.x),y=snap25(p.y);
  ring.visible=true;ring.position.set(x-GX,2,y-GZ);ring.scale.setScalar(ty.r/20);
  ring.material.color.setHex(canPlace(x,y,ty.r)&&gold>=ty.c?0x7cf06a:0xff5a4a);
  if(down&&sel==="wl")act(e);
}
window.addEventListener("pointerup",function(){down=false});
document.querySelectorAll("#shop .card").forEach(function(c){
  c.addEventListener("click",function(){
    sel=c.dataset.k;document.querySelectorAll("#shop .card").forEach(function(o){o.classList.toggle("sel",o===c)});
  });
});
document.querySelectorAll("#troops .card").forEach(function(c){
  c.addEventListener("click",function(){
    tsel=c.dataset.t;document.querySelectorAll("#troops .card").forEach(function(o){o.classList.toggle("sel",o===c)});
  });
});
$("#go").addEventListener("click",function(){
  if(phase!=="build")return;
  phase="battle";$("#shop").style.display="none";$("#troops").style.display="flex";ring.visible=false;
  msg("Enemies incoming! Tap the field to send your troops.");
});
function spawnWave(){
  var w=LV[level].w[wave++],side=Math.floor(Math.random()*4),c=.2+Math.random()*.6;
  w.forEach(function(g){for(var i=0;i<g[1];i++){
    var j=(Math.random()-.5)*160,x,y;
    if(side===0){x=c*W+j;y=14}else if(side===1){x=W-14;y=c*H+j}else if(side===2){x=c*W+j;y=H-14}else{x=14;y=c*H+j}
    spawnU(T,EN[g[0]],g[0],Math.max(14,Math.min(W-14,x)),Math.max(14,Math.min(H-14,y)),1);
  }});
  msg("Wave "+wave+" of "+LV[level].w.length+" is attacking!");
}
function nearest(list,x,y,fn){
  var best=null,bd=1e9;
  list.forEach(function(o){if(fn&&!fn(o))return;var d=Math.hypot(o.x-x,o.y-y);if(d<bd){bd=d;best=o}});
  return best?{o:best,d:bd}:null;
}
function addShot(x1,y1,h,x2,y2,arc,l,col,hit,sz){
  var m=new THREE.Mesh(new THREE.SphereGeometry(sz||(arc?8:4),12,10),new THREE.MeshBasicMaterial({color:col}));dyn.add(m);
  shots.push({m:m,x1:x1,y1:y1,h:h,x2:x2,y2:y2,arc:arc,l:l,L:l,hit:hit});
}
function puff(x,y,n,col){for(var i=0;i<n;i++){var m=box(6,6,6,col,x-GX,14,y-GZ,dyn);m.castShadow=false;parts.push({m:m,vx:(Math.random()-.5)*160,vy:100+Math.random()*160,vz:(Math.random()-.5)*160,l:.9})}}
function destroy(b){
  b.g.traverse(function(m){if(m.material){m.material.color.setHex(0x3a2f25);if(m.material.emissive)m.material.emissive.setHex(0)}});b.g.scale.set(1,.18,1);b.bar.visible=false;
  puff(b.x,b.y,16,0x9a8863);puff(b.x,b.y,8,0x555555);
}
function stepUnit(u,foes,dt,isE){
  var e=u.e,n=null,isB=false;
  if(isE){
    if(!e.fav){n=nearest(foes,u.x,u.y,function(f){return f.hp>0});if(n&&n.d>110)n=null}
    if(!n){isB=true;if(e.fav)n=nearest(B,u.x,u.y,function(b){return b.hp>0&&TY[b.t].rng});
      if(!n)n=nearest(B,u.x,u.y,function(b){return b.hp>0})}
  }else{n=nearest(foes,u.x,u.y,function(f){return f.hp>0});if(n&&n.d>230)n=null}
  if(!n){u.mv=false;u.atk=false;return}              /* no enemy: stand still, stop attacking */
  var o=n.o,a=Math.atan2(o.y-u.y,o.x-u.x),reach=e.rng?e.rng+(isB?o.r:0):(isB?o.r+6:10)+e.s*4;
  u.ang=Math.PI/2-a;
  if(n.d>reach){u.mv=true;u.atk=false;u.x+=Math.cos(a)*e.sp*dt;u.y+=Math.sin(a)*e.sp*dt;u.ph+=dt*12}
  else{u.mv=false;u.atk=true;u.cd-=dt;if(u.cd<=0){u.cd=e.cd;o.hp-=e.dmg;if(isB)o.flash=.1;if(e.rng)addShot(u.x,u.y,20,o.x,o.y,0,.2,0xfff0a0,null,4)}}
}
function update(dt){
  elixir=Math.min(15,elixir+dt*.9);
  B.forEach(function(b){
    if(b.hp<=0)return;
    if(b.t==="gm")gold+=3*dt*(1+.5*(b.lvl-1));
    if(b.t==="ec")elixir=Math.min(15,elixir+.7*dt*(1+.5*(b.lvl-1)));
  });
  T.forEach(function(u){stepUnit(u,P,dt,true)});
  P.forEach(function(u){stepUnit(u,T,dt,false)});
  B.forEach(function(b){
    if(b.flash>0)b.flash-=dt;
    if(b.kick>0)b.kick-=dt;
    if(b.hp<=0){if(!b.dead){b.dead=true;destroy(b)}return}
    var ty=TY[b.t];if(!ty.rng)return;
    var dm=ty.dmg*(1+.5*(b.lvl-1));b.cd-=dt;
    if(b.cd<=0){
      var n=nearest(T,b.x,b.y,function(t){var d=Math.hypot(t.x-b.x,t.y-b.y);return t.hp>0&&d<ty.rng&&d>(ty.min||0)});
      if(n){
        b.cd=ty.cd;var o=n.o;
        if(b.t==="mt"){addShot(b.x,b.y,50,o.x,o.y,90,.7,0x222222,function(){
          T.forEach(function(t){if(Math.hypot(t.x-o.x,t.y-o.y)<ty.spl)t.hp-=dm});puff(o.x,o.y,16,0xff8a3c);puff(o.x,o.y,8,0xffe27a)},10);b.kick=.25;puff(b.x,b.y,7,0xffa53c)}
        else if(b.t==="cn"){
          o.hp-=dm;
          var ang=Math.atan2(o.x-b.x,o.y-b.y),sc=b.sc||1,tx=b.x+Math.sin(ang)*50*sc,tz=b.y+Math.cos(ang)*50*sc;
          if(b.barrel)b.barrel.rotation.y=ang;
          b.kick=.18;                                            /* recoil */
          addShot(tx,tz,34*sc,o.x,o.y,0,.3,0x14161c,null,7);     /* big dark cannonball */
          puff(tx,tz,7,0xffa53c);puff(tx,tz,4,0xffe27a);          /* muzzle flash */
        }
        else if(b.t==="at"){
          o.hp-=dm;b.kick=.2;
          addShot(b.x,b.y,72,o.x,o.y,0,.26,0xfff0a0,null,5);      /* glowing arrow */
          puff(o.x,o.y,3,0xffffff);
        }
        else{o.hp-=dm;addShot(b.x,b.y,28,o.x,o.y,0,.2,0xffd447,null,5)}
      }
    }
  });
  [T,P].forEach(function(l,i){
    var k=l.filter(function(u){if(u.hp>0)return true;puff(u.x,u.y,5,0xffffff);dyn.remove(u.g,u.bar);return false});
    if(i===0)T=k;else P=k;
  });
  if(hs.hp<=0){finish(false);return}
  var tot=LV[level].w.length;
  if(T.length){waveT=2.5}else{waveT-=dt;if(waveT<=0){if(wave<tot){spawnWave();waveT=2.5}else finish(true)}}
}
function stepParts(dt){
  shots.forEach(function(s){s.l-=dt;if(s.l<=0){dyn.remove(s.m);if(s.hit){var f=s.hit;s.hit=null;f()}}});shots=shots.filter(function(s){return s.l>0});
  parts.forEach(function(p){p.vy-=700*dt;p.m.position.x+=p.vx*dt;p.m.position.y+=p.vy*dt;p.m.position.z+=p.vz*dt;p.m.rotation.x+=dt*6;p.l-=dt;if(p.l<=0||p.m.position.y<0){dyn.remove(p.m);p.dead=1}});
  parts=parts.filter(function(p){return !p.dead});
}
function finish(w){
  if(w){
    var r=B.filter(function(b){return b.hp>0}).length/B.length;
    lastStars=r>=.999?3:r>=.6?2:1;lastReward=700+400*lastStars;gold+=lastReward;
    P.forEach(function(u){dyn.remove(u.g,u.bar)});P=[];phase="building";bt=0;stg=completed+1;
    if(stg===1&&hs.plot)hs.plot.visible=false;
    anim=stage(hs.g,stg);if(stg===3)anim.position.y=140;else anim.scale.y=.001;
    $("#troops").style.display="none";msg("Victory! Building the "+STGN[stg-1].toLowerCase()+"…");
    return;
  }
  phase="end";$("#ot").textContent="Base destroyed!";$("#stars").textContent="☆☆☆";
  $("#orw").textContent="Don't give up. Try more defenses and upgrades!";
  $("#toGal").textContent="Retry level";ovAct=restore;$("#over").classList.add("on");
}
function buildAnim(dt){
  bt+=dt;setCam(Math.min(1,bt/1.2));
  var p=Math.max(0,Math.min(1,(bt-.9)/1.8)),eo=1-Math.pow(1-p,3);
  if(stg===3)anim.position.y=(1-eo)*140;else anim.scale.y=Math.max(.001,eo);
  if(p>0&&p<1&&Math.random()<dt*25)puff(hs.x+(Math.random()-.5)*110,hs.y+(Math.random()-.5)*90,1,0xd6d3d1);
  if(bt>3.6){
    completed++;phase="end";updSteps();anim=null;if(stg===3)battleDone=true;
    if(stg===3){renderer.render(scene,camera);try{homeSrc=renderer.domElement.toDataURL("image/jpeg",.9)}catch(e){}}
    $("#ot").textContent=stg===3?"Our home is complete!":STGN[stg-1]+" complete!";
    $("#stars").textContent="★".repeat(lastStars)+"☆".repeat(3-lastStars);
    $("#orw").textContent="+"+lastReward+" gold";
    if(stg<3){$("#toGal").textContent="Next level";ovAct=function(){level++;beginLevel()}}
    else{$("#toGal").textContent="See our home";ovAct=function(){
      if(homeSrc){$("#home").src=homeSrc;$("#home").hidden=false}show("s4")}}
    $("#over").classList.add("on");
  }
}
function draw(){
  var t=performance.now()/1000;
  B.forEach(function(b){
    if(b.hp<=0)return;
    if(b.barrel){var n=nearest(T,b.x,b.y);if(n)b.barrel.rotation.y=Math.atan2(n.o.x-b.x,n.o.y-b.y);b.barrel.scale.setScalar(1+Math.max(0,b.kick||0)*1.6)}
    var sc=(b.sc||1)*(b.flash>0?1.04:1)*(1+Math.max(0,b.kick||0)*.2);b.g.scale.setScalar(sc);
    b.bar.visible=b.hp<b.max;
    if(b.bar.visible){setBar(b.bar,b.hp/b.max,b.t==="wl"?26:b.t==="hs"?70:46);b.bar.position.set(b.x-GX,b.by,b.y-GZ);b.bar.quaternion.copy(camera.quaternion)}
  });
  [T,P].forEach(function(l){l.forEach(function(q){
    q.g.position.set(q.x-GX,q.mv?Math.abs(Math.sin(q.ph))*3:0,q.y-GZ);q.g.rotation.y=q.ang;
    q.sw.rotation.x=q.mv?-.3:q.atk?-.5+Math.sin(t*18)*1.1:-.5;   /* swing only while attacking */
    q.bar.visible=q.hp<q.max;
    if(q.bar.visible){setBar(q.bar,q.hp/q.max,16+q.e.s*4);q.bar.position.set(q.x-GX,36*q.e.s+12,q.y-GZ);q.bar.quaternion.copy(camera.quaternion)}
  })});
  shots.forEach(function(s){var k=1-s.l/s.L;s.m.position.set(s.x1+(s.x2-s.x1)*k-GX,s.h-(s.h-14)*k+s.arc*4*k*(1-k),s.y1+(s.y2-s.y1)*k-GZ)});
  renderer.render(scene,camera);
}
function hud(){
  var n=LV[level].w.length;
  $("#time").textContent="Level "+(level+1)+" – "+(phase==="build"?"Build":phase==="battle"?"Wave "+Math.min(wave,n)+"/"+n:phase==="building"?"Building…":"Done");
  $("#gold").textContent="🪙 "+Math.floor(gold);
  $("#elxf").style.width=(elixir/15*100)+"%";
  $("#elxt").textContent="💧 "+Math.floor(elixir)+" / 15";
  var a=0,m=0;B.forEach(function(b){m+=b.max;a+=Math.max(0,b.hp)});
  $("#pct").textContent="❤ "+Math.round(a/m*100)+"%";
}
function loop(now){
  var dt=Math.min(.05,(now-last)/1000);last=now;
  if(phase==="battle")update(dt);else if(phase==="building")buildAnim(dt);
  stepParts(dt);draw();hud();
  if(phase!=="end")raf=requestAnimationFrame(loop);
}
$("#toGal").addEventListener("click",function(){ovAct()});

/* ---------- 4: gallery ---------- */
var PHOTO_DIR="picture";
var icons=["🏰","⚔️","🛡️","👑","🎂","🎁"],labels=["Memory 1","Memory 2","Memory 3","Memory 4","Memory 5","Memory 6"],pick=null;
(function(){
  var g=$("#grid");
  icons.forEach(function(ic,i){
    var f=document.createElement("button");f.className="frame";f.type="button";
    f.innerHTML='<span class="em">'+ic+'</span><small>'+labels[i]+' – tap to add photo</small>';
    f.addEventListener("click",function(){pick=f;$("#file").click()});
    g.appendChild(f);
    (function(fr,src){var im=new Image();im.onload=function(){fr.style.backgroundImage="url("+src+")";fr.classList.add("has")};im.src=src})(f,PHOTO_DIR+"/pics"+(i+1)+".jpg");
  });
})();
$("#file").addEventListener("change",function(e){
  var file=e.target.files[0];if(!file||!pick)return;
  var r=new FileReader();
  r.onload=function(){pick.style.backgroundImage="url("+r.result+")";pick.classList.add("has")};
  r.readAsDataURL(file);e.target.value="";
});
/* camera: take a photo of the two of you */
var camStream=null,counting=false,cmod=$("#cmod"),cvideo=$("#cvideo");
function setFeat(d){var f=$("#feat");f.style.backgroundImage="url("+d+")";f.classList.add("has")}
function camStop(){if(camStream){camStream.getTracks().forEach(function(t){t.stop()});camStream=null}cvideo.srcObject=null}
function camClose(){camStop();counting=false;$("#ccd").hidden=true;cmod.classList.remove("on")}
function camFallback(){camClose();$("#cap").click()}
function camStart(){
  camStop();
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){camFallback();return}
  navigator.mediaDevices.getUserMedia({video:{facingMode:facing,width:{ideal:1280},height:{ideal:960}},audio:false}).then(function(s){
    camStream=s;cvideo.srcObject=s;cvideo.style.transform=facing==="user"?"scaleX(-1)":"none";
  }).catch(camFallback);
}
var facing="user";
$("#feat").addEventListener("click",function(){startMusic();cmod.classList.add("on");camStart()});
$("#cflip").addEventListener("click",function(){facing=facing==="user"?"environment":"user";camStart()});
$("#ccancel").addEventListener("click",camClose);
$("#csnap").addEventListener("click",function(){
  if(counting||!camStream)return;counting=true;var n=3,cd=$("#ccd");cd.hidden=false;cd.textContent=n;
  var iv=setInterval(function(){
    n--;
    if(n>0){cd.textContent=n;return}
    clearInterval(iv);cd.hidden=true;
    var c=document.createElement("canvas");c.width=cvideo.videoWidth||1280;c.height=cvideo.videoHeight||960;
    c.getContext("2d").drawImage(cvideo,0,0,c.width,c.height);
    setFeat(c.toDataURL("image/jpeg",.9));camClose();
  },1000);
});
$("#cap").addEventListener("change",function(e){
  var f=e.target.files[0];if(!f)return;var r=new FileReader();
  r.onload=function(){setFeat(r.result)};r.readAsDataURL(f);e.target.value="";
});
$("#msg").innerHTML="";FINAL_MESSAGE.forEach(function(t){var p=document.createElement("p");p.textContent=t;if(t===t.toUpperCase())p.className="hd";$("#msg").appendChild(p)});

makePuzzle();

/* ---------- 0: intro dialogue (after opening the link) ---------- */
var INTRO=[
"Welcome, Chief! The whole clan has been waiting for you.",
"Today is a very special day. Someone prepared a little quest just for you.",
"First, rebuild the Town Hall. Then defend your village, level by level.",
"Are you ready, Love?"
];
(function(){
  var i=0,typing=null,txt=$("#dtext"),ch=$("#choices"),nx=$("#dnext");
  function after(){if(i>=INTRO.length-1){ch.hidden=false;nx.hidden=true}else nx.hidden=false}
  function type(s){
    clearInterval(typing);var k=0;txt.textContent="";nx.hidden=true;
    typing=setInterval(function(){txt.textContent=s.slice(0,++k);if(k>=s.length){clearInterval(typing);typing=null;after()}},28);
  }
  $("#dbox").addEventListener("click",function(){
    startMusic();
    if(typing){clearInterval(typing);typing=null;txt.textContent=INTRO[i];after();return}
    if(i<INTRO.length-1){i++;type(INTRO[i])}
  });
  $("#cgo").addEventListener("click",function(){startMusic();show("s1")});
  function remind(){
    var t=!puzzleDone?"You need to solve the puzzle before playing the Clash of Clans game. Then finish the battle to unlock the letter.":"You need to finish the battle first. Win all three levels and build the Town Hall to unlock the letter.";
    $("#rtext").textContent=t;
    $("#rs1").className=puzzleDone?"done":"";$("#rs2").className=battleDone?"done":"";$("#rs3").className="";
    $("#rm").classList.add("on");
  }
  $("#clet").addEventListener("click",function(){
    startMusic();
    if(puzzleDone&&battleDone){window.openLetter()}else remind();
  });
  $("#rok").addEventListener("click",function(){$("#rm").classList.remove("on")});
  $("#chow").addEventListener("click",function(){startMusic();type("Slide the pieces to finish the picture. Then place buildings, tap the field to send troops, and protect your Town Hall!")});
  /* envelope -> write -> paper airplane flight */
  function startIntro(){i=0;ch.hidden=true;show("s0");type(INTRO[0])}
  var env=$("#env"),form=$("#wform"),wt=$("#wtext"),ws=$("#wsend");
  env.addEventListener("click",function(){
    if(env.classList.contains("open"))return;
    startMusic();env.classList.add("open");$("#se").classList.add("opened");
    $("#etitle").textContent="Write your message";$("#esub").textContent="";
    setTimeout(function(){form.hidden=false;wt.focus()},650);
  });
  var MAX_WORDS=1000,wc=$("#wcount");
  function words(){return wt.value.trim().split(/\s+/).filter(Boolean).length}
  function updCount(){
    var n=words();
    if(n>MAX_WORDS){                                   /* cap at 1000 words */
      var m=wt.value.match(new RegExp("^\\s*(\\S+\\s+){"+(MAX_WORDS-1)+"}\\S+"));
      if(m)wt.value=m[0];n=words();
    }
    wc.textContent=n+" / "+MAX_WORDS+" words"+(n>=MAX_WORDS?" (max)":"");
    wc.classList.toggle("ok",n>=MAX_WORDS);ws.disabled=n<1;   /* any letter is fine */
  }
  wt.addEventListener("input",updCount);updCount();
  ws.addEventListener("click",function(){
    var text=wt.value.trim();if(!text)return;
    window.clashTyped=text;
    try{localStorage.setItem("clashLetter",JSON.stringify({t:"txt",d:text}))}catch(e){}
    fly(text);
  });
  function fly(text){
    show("sf");
    var nodes=[].slice.call(document.querySelectorAll("#route .node")),plane=$("#plane"),k=0;
    nodes.forEach(function(n){n.className="node"});
    $("#landed").hidden=true;$("#ftitle").textContent="Your letter is flying…";
    plane.style.transition="none";plane.style.left="0px";
    setTimeout(function(){
      plane.style.transition="";
      (function hop(){
        var n=nodes[k];plane.style.left=(n.offsetLeft+n.offsetWidth/2)+"px";
        setTimeout(function(){
          n.classList.add("lit");k++;
          if(k<nodes.length)hop();
          else{$("#ftitle").textContent="Delivered!";$("#landed").hidden=false}
        },1300);
      })();
    },150);
  }
  $("#fletter").addEventListener("click",function(){$("#clet").click()});
  $("#fstart").addEventListener("click",function(){startMusic();startIntro()});
  /* a link that already carries the letter skips the envelope */
  if(/letter=/.test(location.hash))startIntro();else show("se");
})();
})();


/* ---------- letter on her phone ---------- */
/* Letter on her phone: loads from (1) a link with the text, (2) a file next to the site, (3) an upload/camera photo/PDF */
(function(){
"use strict";
var $=function(s){return document.querySelector(s)},scr=$("#lscreen"),KEY="clashLetter",loaded=false;
var edit=/(^|[#&])write\b/.test(location.hash);
if(edit){$("#lwrite").hidden=false;$(".ltools").hidden=false}else $(".ltools").hidden=true;

function clear(){scr.innerHTML="";scr.scrollTop=0}
function empty(){clear();scr.innerHTML='<div class="lempty">💌<br>Your letter will appear here.</div>'}
function showText(t){clear();var d=document.createElement("div");d.className="paper";
  t.split("\n").forEach(function(l){var p=document.createElement("p");p.textContent=l||"\u00a0";d.appendChild(p)});scr.appendChild(d)}
function showImg(src){clear();var i=new Image();i.className="limg";i.alt="Letter";i.src=src;scr.appendChild(i)}
function pdfLib(cb){
  if(window.pdfjsLib)return cb();
  var s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  s.onload=function(){pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";cb()};
  s.onerror=function(){scr.innerHTML='<div class="lempty">Could not load the PDF viewer. Check the internet.</div>'};
  document.head.appendChild(s);
}
function showPdf(buf){
  pdfLib(function(){
    pdfjsLib.getDocument({data:buf}).promise.then(function(pdf){
      clear();var n=1;
      (function next(){
        if(n>pdf.numPages)return;
        pdf.getPage(n++).then(function(pg){
          var vp=pg.getViewport({scale:2}),c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;c.className="lpage";
          scr.appendChild(c);pg.render({canvasContext:c.getContext("2d"),viewport:vp}).promise.then(next);
        });
      })();
    }).catch(function(){scr.innerHTML='<div class="lempty">That PDF could not be opened.</div>'});
  });
}
function readHash(){
  var m=location.hash.match(/letter=([^&]+)/);if(!m)return null;
  try{return decodeURIComponent(escape(atob(m[1].replace(/-/g,"+").replace(/_/g,"/"))))}catch(e){return null}
}
function makeLink(t){
  var b=btoa(unescape(encodeURIComponent(t))).replace(/\+/g,"-").replace(/\//g,"_");
  return location.origin+location.pathname+"#letter="+b;
}
/* look for a letter file placed in the same folder as index.html */
function probe(){
  var names=["letter.jpg","letter.jpeg","letter.png","letter.webp"],i=0,q="?t="+Date.now();
  (function tryImg(){
    if(i>=names.length)return tryDocs();
    var im=new Image();im.onload=function(){showImg(im.src)};im.onerror=function(){i++;tryImg()};im.src=names[i]+q;
  })();
  function tryDocs(){
    fetch("letter.pdf"+q).then(function(r){if(!r.ok)throw 0;return r.arrayBuffer()}).then(showPdf).catch(function(){
      fetch("letter.txt"+q).then(function(r){if(!r.ok)throw 0;return r.text()}).then(showText).catch(saved);
    });
  }
}
function saved(){
  try{var s=JSON.parse(localStorage.getItem(KEY)||"null");if(s){s.t==="img"?showImg(s.d):showText(s.d);return}}catch(e){}
  empty();
}
function load(){
  if(window.clashTyped){showText(window.clashTyped);return}   /* the message written on the first slide */
  var h=readHash();if(h){showText(h);return}
  probe();
}

/* photo / camera / upload */
function shrink(file,cb){
  var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){
    var k=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;
    c.getContext("2d").drawImage(im,0,0,c.width,c.height);cb(c.toDataURL("image/jpeg",.85))};im.src=r.result};r.readAsDataURL(file);
}
function onFile(e){
  var f=e.target.files[0];if(!f)return;e.target.value="";
  if(f.type==="application/pdf"){var r=new FileReader();r.onload=function(){showPdf(r.result)};r.readAsArrayBuffer(f)}
  else if(f.type.indexOf("image")===0){shrink(f,function(d){showImg(d);try{localStorage.setItem(KEY,JSON.stringify({t:"img",d:d}))}catch(x){}})}
  else{var t=new FileReader();t.onload=function(){showText(t.result);try{localStorage.setItem(KEY,JSON.stringify({t:"txt",d:t.result}))}catch(x){}};t.readAsText(f)}
}
$("#lcam").addEventListener("change",onFile);$("#lup").addEventListener("change",onFile);

/* link maker (open the site with #write on your own phone) */
$("#lmake").addEventListener("click",function(){
  var t=$("#ltext").value.trim();if(!t)return;
  var l=makeLink(t);$("#llink").value=l;showText(t);
  try{navigator.clipboard.writeText(l)}catch(e){$("#llink").select()}
});

/* open the letter (the red button is gone: only the blue "Open the letter" button + the intro button use this) */
function openLetter(){$("#lm").classList.add("on");load()}
window.openLetter=openLetter;
$("#letterBtn2").addEventListener("click",openLetter);

/* "HAPPY BIRTHDAY" closes the letter and starts the ending: confetti + birthday music */
$("#lclose").addEventListener("click",function(){
  $("#lm").classList.remove("on");
  if(window.endParty)window.endParty();
});
})();