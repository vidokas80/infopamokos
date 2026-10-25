/* VBE skilties logika: testai, atvirieji klausimai, temų naršymas, egzaminų filtras.
   Duomenis (QUIZ, ADV, OPEN) sugeneruoja build.py į data.js. */
(function(){
  function el(t,c,txt){var e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e;}
  function shuffle(n){var a=[],i,j,t; for(i=0;i<n;i++)a.push(i); for(i=n-1;i>0;i--){j=Math.floor(Math.random()*(i+1)); t=a[i];a[i]=a[j];a[j]=t;} return a;}
  function build(id){
    var adv=ADV[id]||[], qs=QUIZ[id].map(function(q,k){var perm=shuffle(q[1].length); return [q[0], perm.map(function(x){return q[1][x];}), perm.indexOf(q[2]), q[3], adv.indexOf(k)>-1];}).sort(function(a,b){return a[4]-b[4];}), box=el("div","quiz"), head=el("div","quiz-head"), score=el("span","quiz-score");
    head.appendChild(el("h3",null,"Testas")); head.appendChild(score); box.appendChild(head); box.appendChild(el("p","quiz-hint","Pirmiausia atsakyk į pagrindinius klausimus, paskui bandyk aukštesniuosius."));
    var answered=0, right=0;
    function upd(){score.textContent="Teisingai: "+right+" iš "+qs.length+(answered<qs.length?" · atsakyta "+answered:"");}
    qs.forEach(function(q,i){
      var fs=el("fieldset","q"), lg=el("legend"), opts=el("div","opts"), ex=el("p","expl");
      lg.appendChild(el("span","lvl"+(q[4]?" adv":""),q[4]?"Aukštesnysis":"Pagrindinis")); lg.appendChild(document.createTextNode((i+1)+". "+q[0]));
      ex.hidden=true; fs.appendChild(lg);
      q[1].forEach(function(o,j){
        var lab=el("label"), inp=document.createElement("input");
        inp.type="radio"; inp.name=id+"-q"+i; inp.id=id+"-q"+i+"-"+j; inp.value=j;
        lab.appendChild(inp); lab.appendChild(el("span",null,o)); opts.appendChild(lab);
        inp.addEventListener("change",function(){
          var labs=opts.querySelectorAll("label");
          opts.querySelectorAll("input").forEach(function(x){x.disabled=true;});
          labs[q[2]].classList.add("right");
          var ok=j===q[2]; if(!ok) lab.classList.add("wrong");
          ex.innerHTML=""; var b=el("b",ok?"r":"w",ok?"Teisingai. ":"Neteisingai. "); ex.appendChild(b); ex.appendChild(document.createTextNode(q[3])); ex.hidden=false;
          answered++; if(ok) right++; upd();
        });
      });
      fs.appendChild(opts); fs.appendChild(ex); box.appendChild(fs);
    });
    var reset=el("button","quiz-reset","Pradėti testą iš naujo"); reset.type="button";
    reset.addEventListener("click",function(){ var nb=build(id); box.replaceWith(nb); });
    box.appendChild(reset); upd(); return box;
  }
  Object.keys(QUIZ).forEach(function(id){
    var sec=document.getElementById(id); if(!sec) return;
    var box=build(id), src=sec.querySelector(".sources"); if(src) sec.insertBefore(box,src); else sec.appendChild(box);
  });
  var hi=document.getElementById("hash-in"), ho=document.getElementById("hash-out");
  function hash(){
    try{
      if(!(window.crypto&&crypto.subtle)){ho.textContent="Ši naršyklė neleidžia apskaičiuoti santraukos.";return;}
      crypto.subtle.digest("SHA-256",new TextEncoder().encode(hi.value)).then(function(buf){
        ho.textContent=Array.prototype.map.call(new Uint8Array(buf),function(b){return ("0"+b.toString(16)).slice(-2);}).join("");
      }).catch(function(){ho.textContent="Santraukos apskaičiuoti nepavyko.";});
    }catch(e){ho.textContent="Santraukos apskaičiuoti nepavyko.";}
  }
  if(hi&&ho){hi.addEventListener("input",hash); hash();}
})();

(function(){
  function el(t,c,txt){var e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e;}
  Object.keys(OPEN).forEach(function(id){
    var sec=document.getElementById(id); if(!sec||!OPEN[id]) return;
    var box=el("div","open");
    box.appendChild(el("h3",null,"Atsakyk savais žodžiais"));
    box.appendChild(el("p","quiz-hint","Egzamine dalis klausimų yra atviri: atsakymą reikia parašyti pačiam. Pirmiausia parašyk, tada palygink su pavyzdžiu."));
    OPEN[id].forEach(function(q,i){
      var d=el("div","oq"), qp=el("p","oq-q");
      qp.appendChild(el("span","pts-badge",q[1]+" tšk.")); qp.appendChild(document.createTextNode((i+1)+". "+q[0]));
      var ta=document.createElement("textarea"); ta.id=id+"-open-"+i; ta.rows=3; ta.setAttribute("aria-label","Tavo atsakymas į "+(i+1)+" klausimą"); ta.placeholder="Tavo atsakymas…";
      var btn=el("button","quiz-reset","Rodyti pavyzdinį atsakymą"); btn.type="button";
      var ans=el("div","oq-a"); ans.hidden=true;
      var a1=el("p"); a1.appendChild(el("b",null,"Pavyzdinis atsakymas. ")); a1.appendChild(document.createTextNode(q[2]));
      var a2=el("p","oq-crit"); a2.appendChild(el("b",null,"Vertinimas. ")); a2.appendChild(document.createTextNode(q[3]));
      ans.appendChild(a1); ans.appendChild(a2);
      btn.addEventListener("click",function(){ans.hidden=!ans.hidden; btn.textContent=ans.hidden?"Rodyti pavyzdinį atsakymą":"Slėpti pavyzdinį atsakymą";});
      d.appendChild(qp); d.appendChild(ta); d.appendChild(btn); d.appendChild(ans); box.appendChild(d);
    });
    var src=sec.querySelector(".sources"); if(src) sec.insertBefore(box,src); else sec.appendChild(box);
  });
})();

(function(){
  var grades=["iii","iv","egz"], NAMES={iii:"III klasė",iv:"IV klasė"};
  var secs=[].slice.call(document.querySelectorAll("section.topic"));
  var main=document.querySelector("main");
  function gOf(sec){return sec.closest("[data-grade]").getAttribute("data-grade");}
  function list(g){return secs.filter(function(x){return gOf(x)===g;});}
  function mk(t,c,txt){var e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e;}
  // temų kortelės
  var homes={};
  ["iii","iv"].forEach(function(g){
    var h=mk("div","home"); h.setAttribute("data-home",g);
    h.appendChild(mk("h2","home-title",NAMES[g]+": "+list(g).length+" temos"));
    var grid=mk("div","cards");
    list(g).forEach(function(sec,i){
      var a=mk("a","card"); a.href="#"+sec.id;
      var top=mk("span","card-top"); top.appendChild(mk("span","code",sec.querySelector(".topic-head .code").textContent));
      top.appendChild(mk("span","card-n",String(i+1).padStart(2,"0")));
      a.appendChild(top);
      a.appendChild(mk("span","card-title",sec.querySelector("h2").textContent));
      a.appendChild(mk("span","card-area",sec.querySelector(".topic-head .eyebrow").textContent));
      var q=sec.querySelectorAll(".quiz .q").length; if(q) a.appendChild(mk("span","card-meta","Testas: "+q+" kl."));
      grid.appendChild(a);
    });
    h.appendChild(grid); main.insertBefore(h,main.firstChild); homes[g]=h;
  });
  // puslapiavimas kiekvienoje temoje
  ["iii","iv"].forEach(function(g){
    var L=list(g);
    L.forEach(function(sec,i){
      var crumb=mk("a","crumb","← Visos "+NAMES[g]+"s temos"); crumb.href="#"+g;
      sec.insertBefore(crumb,sec.firstChild);
      var pg=mk("nav","pager"); pg.setAttribute("aria-label","Temų puslapiai");
      if(i>0){var a=mk("a","prev"); a.href="#"+L[i-1].id; a.appendChild(mk("small",null,"← Ankstesnė")); a.appendChild(mk("span",null,L[i-1].querySelector("h2").textContent)); pg.appendChild(a);} else pg.appendChild(mk("span"));
      if(i<L.length-1){var b=mk("a","next"); b.href="#"+L[i+1].id; b.appendChild(mk("small",null,"Kita tema →")); b.appendChild(mk("span",null,L[i+1].querySelector("h2").textContent)); pg.appendChild(b);}
      else {var c=mk("a","next"); c.href="#"+g; c.appendChild(mk("small",null,"Pabaiga")); c.appendChild(mk("span",null,"Grįžti į temų sąrašą")); pg.appendChild(c);}
      sec.appendChild(pg);
    });
  });
  function render(g,id,scroll){
    document.querySelectorAll("[data-grade]").forEach(function(el){el.hidden=el.getAttribute("data-grade")!==g;});
    grades.forEach(function(k){ if(homes[k]) homes[k].hidden=(k!==g)||!!id;});
    secs.forEach(function(x){x.hidden=x.id!==id;});
    document.body.classList.toggle("in-topic",!!id);
    document.querySelectorAll(".switch button").forEach(function(b){b.setAttribute("aria-selected",b.dataset.go===g?"true":"false");});
    document.querySelectorAll("nav.toc a").forEach(function(a){ if(a.getAttribute("href")==="#"+id) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");});
    try{localStorage.setItem("vbe-grade",g);}catch(e){}
    if(scroll) window.scrollTo(0,0);
  }
  function route(scroll){
    var h=(location.hash||"").slice(1);
    if(grades.indexOf(h)>-1) return render(h,null,scroll);
    var el=h&&document.getElementById(h);
    if(el){var sec=el.closest("section.topic"); if(sec){render(gOf(sec),sec.id,false); if(el!==sec) el.scrollIntoView(); else if(scroll) window.scrollTo(0,0); return;}
      var gb=el.closest("main [data-grade]"); if(gb){render(gb.getAttribute("data-grade"),null,false); el.scrollIntoView(); return;}}
    var g=null; try{g=localStorage.getItem("vbe-grade");}catch(e){}
    render(grades.indexOf(g)>-1?g:"iv",null,scroll);
  }
  document.querySelectorAll(".switch button").forEach(function(b){
    b.addEventListener("click",function(){ if(location.hash==="#"+b.dataset.go) route(true); else location.hash=b.dataset.go; });
  });
  window.addEventListener("hashchange",function(){route(true);});
  route(false);
})();

(function(){
  var btns=document.querySelectorAll(".egz-filter button");
  function apply(f){
    btns.forEach(function(b){b.setAttribute("aria-pressed",b.dataset.f===f?"true":"false");});
    document.querySelectorAll("article.exam").forEach(function(a){a.hidden=!(f==="all"||a.dataset.part===f);});
    document.querySelectorAll("h2.egz-year").forEach(function(h){
      var n=h.nextElementSibling, any=false;
      while(n&&n.tagName==="ARTICLE"){ if(!n.hidden) any=true; n=n.nextElementSibling; }
      h.hidden=!any;
    });
  }
  btns.forEach(function(b){b.addEventListener("click",function(){apply(b.dataset.f);});});
})();
