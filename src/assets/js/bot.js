/* Bitukas – puslapio personažas. Seka žymeklį, reaguoja į testų atsakymus. */
(function(){
  var bot=document.getElementById("bot"), btn=document.getElementById("bot-btn"), head=document.getElementById("bot-head"),
      eyes=document.getElementById("bot-eyes"), pl=document.getElementById("bot-pl"), pr=document.getElementById("bot-pr"),
      mouth=document.getElementById("bot-mouth"), light=document.getElementById("bot-light"),
      bubble=document.getElementById("bot-bubble"), text=document.getElementById("bot-text"),
      hideBtn=document.getElementById("bot-hide"), restore=document.getElementById("bot-restore");
  if(!bot) return;
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MOUTH={neutral:"M41 61 Q50 65 59 61",happy:"M39 58 Q50 70 61 58",sad:"M41 64 Q50 57 59 64",oh:"M47 62 Q50 58 53 62 Q50 66 47 62"};
  function setMouth(k){mouth.setAttribute("d",MOUTH[k]);}
  // paslėpimas
  function setHidden(h){bot.hidden=h; restore.hidden=!h; try{localStorage.setItem("vbe-bot-hidden",h?"1":"0");}catch(e){}}
  var wasHidden=false; try{wasHidden=localStorage.getItem("vbe-bot-hidden")==="1";}catch(e){}
  setHidden(wasHidden);
  hideBtn.addEventListener("click",function(){bubble.hidden=true; setHidden(true);});
  restore.addEventListener("click",function(){setHidden(false); say("Aš vėl čia!",2200,"happy");});
  // kalbos debesėlis
  var sayT=null;
  function say(msg,ms,mood){
    text.textContent=msg; bubble.hidden=false; hideBtn.hidden=!!ms;
    if(mood){setMouth(mood);}
    clearTimeout(sayT);
    if(ms) sayT=setTimeout(function(){bubble.hidden=true; setMouth("neutral"); light.classList.remove("ok","bad");},ms);
  }
  btn.addEventListener("click",function(){
    if(!bubble.hidden&&hideBtn&&!hideBtn.hidden){bubble.hidden=true; setMouth("neutral"); return;}
    var t=document.querySelector("section.topic:not([hidden]) h2");
    var msg=t?"Labas! Aš Bitukas. Dabar skaitai „"+t.textContent+"“. Pradėk nuo langelio „Svarbiausia“, o pabaigoje išbandyk testą.":"Labas! Aš Bitukas. Pasirink klasę ir temą, o aš stebėsiu, kaip sekasi testuose.";
    say(msg,0,"happy");
  });
  // reakcija į testo atsakymus
  document.addEventListener("change",function(e){
    var inp=e.target; if(!inp.closest||!inp.closest(".q")||bot.hidden) return;
    var wrong=inp.closest("label").classList.contains("wrong");
    light.classList.remove("ok","bad"); light.classList.add(wrong?"bad":"ok");
    var good=["Puiku!","Teisingai!","Šaunu!","Taip ir yra!"], bad=["Nieko tokio – perskaityk paaiškinimą.","Beveik! Pažiūrėk, kodėl.","Ne visai. Pabandyk įsiminti paaiškinimą."];
    var arr=wrong?bad:good; say(arr[Math.floor(Math.random()*arr.length)],2200,wrong?"sad":"happy");
  });
  // akių ir galvos sekimas
  var tx=0,ty=0,cx=0,cy=0,lastMove=0;
  function aim(px,py){
    var r=btn.getBoundingClientRect(); if(!r.width) return;
    var ox=r.left+r.width/2, oy=r.top+r.height*0.45;
    var dx=px-ox, dy=py-oy, d=Math.sqrt(dx*dx+dy*dy)||1, k=Math.min(1,d/180);
    tx=dx/d*k; ty=dy/d*k; lastMove=Date.now();
  }
  window.addEventListener("pointermove",function(e){aim(e.clientX,e.clientY);},{passive:true});
  window.addEventListener("pointerdown",function(e){aim(e.clientX,e.clientY);},{passive:true});
  document.addEventListener("mouseleave",function(){tx=0;ty=0;});
  function frame(){
    var f=reduce?1:0.18; cx+=(tx-cx)*f; cy+=(ty-cy)*f;
    pl.setAttribute("cx",(38+cx*4.5).toFixed(2)); pl.setAttribute("cy",(46+cy*4.5).toFixed(2));
    pr.setAttribute("cx",(62+cx*4.5).toFixed(2)); pr.setAttribute("cy",(46+cy*4.5).toFixed(2));
    if(!reduce) head.setAttribute("transform","translate("+(cx*3).toFixed(2)+" "+(cy*2).toFixed(2)+") rotate("+(cx*9).toFixed(2)+" 50 78)");
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  if(!reduce){
    (function blink(){
      setTimeout(function(){eyes.classList.add("blink"); setTimeout(function(){eyes.classList.remove("blink"); blink();},130);},2500+Math.random()*3500);
    })();
    setInterval(function(){
      if(Date.now()-lastMove>5000){ tx=(Math.random()*2-1)*0.8; ty=(Math.random()*2-1)*0.5; lastMove=Date.now()-3000; }
    },1500);
  }
})();
