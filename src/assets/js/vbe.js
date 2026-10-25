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
      if(sec.dataset.img){ // iliustracija iš temos antraštės (build.py); kortelėje dekoratyvinė, todėl alt=""
        var im=mk("img","card-img"); im.src=sec.dataset.img; im.alt=""; im.loading="lazy"; im.width=320; im.height=180;
        a.appendChild(im); a.classList.add("has-img");
      }
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

/* Vektorinės grafikos demonstracijos: Bezjė kreivė, didinimas, raiškos skaičiuoklė.
   Animacijų nėra – viskas keičiasi tik mokiniui tempiant ar įvedant. */
(function(){
  // Bezjė kreivė: 2 mazgai ir 2 rankenėlės, tempiami pele, pirštu ar rodyklėmis
  document.querySelectorAll("[data-bez]").forEach(function(box){
    var svg=box.querySelector("svg"), path=svg.querySelector(".acc-line"), code=box.querySelector(".bez-code code"),
        lines=svg.querySelectorAll("[data-l]"), gs=svg.querySelectorAll(".bez-pt"), vb=svg.viewBox.baseVal,
        names=["Pradžios mazgas","Pirmoji rankenėlė","Antroji rankenėlė","Pabaigos mazgas"],
        P=[].map.call(gs,function(g){var m=/translate\(([\d.-]+)[ ,]+([\d.-]+)\)/.exec(g.getAttribute("transform")); return [+m[1],+m[2]];});
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function draw(){
      var d="M "+P[0].join(" ")+" C "+P[1].join(" ")+", "+P[2].join(" ")+", "+P[3].join(" ");
      path.setAttribute("d",d); code.textContent='<path d="'+d+'"/>';
      [[0,1],[3,2]].forEach(function(p,k){lines[k].setAttribute("x1",P[p[0]][0]);lines[k].setAttribute("y1",P[p[0]][1]);lines[k].setAttribute("x2",P[p[1]][0]);lines[k].setAttribute("y2",P[p[1]][1]);});
      gs.forEach(function(g,i){
        g.setAttribute("transform","translate("+P[i][0]+" "+P[i][1]+")");
        // užrašas – priešingoje pusėje nei porinis taškas (mazgo rankenėlė ar rankenėlės mazgas), kad nesusikirstų
        var t=g.querySelector("text"), pair=P[[1,0,3,2][i]], below=P[i][1]>=pair[1];
        if(P[i][1]>vb.height-34) below=false; else if(P[i][1]<30) below=true;
        t.setAttribute("y",below?26:-14);
        t.setAttribute("text-anchor",P[i][0]<34?"start":P[i][0]>vb.width-34?"end":"middle");
        t.setAttribute("x",P[i][0]<34?-8:P[i][0]>vb.width-34?8:0);
        g.setAttribute("aria-label",names[i]+": x "+P[i][0]+", y "+P[i][1]+". Perkelk rodyklėmis.");
      });
    }
    function toSvg(e){var pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse());}
    gs.forEach(function(g,i){
      g.addEventListener("pointerdown",function(e){
        e.preventDefault(); g.focus({preventScroll:true}); g.setPointerCapture(e.pointerId); g.classList.add("drag");
        function move(ev){var p=toSvg(ev); P[i]=[Math.round(clamp(p.x,6,vb.width-6)),Math.round(clamp(p.y,6,vb.height-6))]; draw();}
        function up(){g.classList.remove("drag"); g.removeEventListener("pointermove",move); g.removeEventListener("pointerup",up); g.removeEventListener("pointercancel",up);}
        g.addEventListener("pointermove",move); g.addEventListener("pointerup",up); g.addEventListener("pointercancel",up);
      });
      g.addEventListener("keydown",function(e){
        var s=e.shiftKey?16:4, dx={ArrowLeft:-s,ArrowRight:s}[e.key]||0, dy={ArrowUp:-s,ArrowDown:s}[e.key]||0;
        if(!dx&&!dy) return;
        e.preventDefault(); P[i]=[clamp(P[i][0]+dx,6,vb.width-6),clamp(P[i][1]+dy,6,vb.height-6)]; draw();
      });
    });
    draw();
  });

  // Didinimas: tas pats apskritimas kaip SVG ir kaip 96 × 96 px taškinis vaizdas (be glotninimo)
  document.querySelectorAll("[data-zoom]").forEach(function(box){
    var svg=box.querySelector(".zoom-svg"), cv=box.querySelector(".zoom-cv"), range=box.querySelector("input[type=range]"),
        out=box.querySelector("output"), N=96, R=40, F=[48+R*Math.SQRT1_2,48-R*Math.SQRT1_2], src=document.createElement("canvas");
    src.width=src.height=N;
    function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}
    function raster(){
      var c=src.getContext("2d"); c.fillStyle=css("--surface"); c.fillRect(0,0,N,N);
      c.fillStyle=css("--accent"); c.beginPath(); c.arc(48,48,R,0,Math.PI*2); c.fill();
    }
    function view(z){var s=N/z; return [Math.max(0,Math.min(N-s,F[0]-s/2)),Math.max(0,Math.min(N-s,F[1]-s/2)),s];}
    function draw(){
      var z=+range.value, v=view(z), w=Math.round(cv.clientWidth*(window.devicePixelRatio||1))||192;
      out.textContent=z+"×";
      svg.setAttribute("viewBox",v[0]+" "+v[1]+" "+v[2]+" "+v[2]);
      if(cv.width!==w){cv.width=cv.height=w;}
      var c=cv.getContext("2d"); c.imageSmoothingEnabled=false; c.clearRect(0,0,w,w);
      c.drawImage(src,v[0],v[1],v[2],v[2],0,0,w,w);
    }
    raster(); draw();
    range.addEventListener("input",draw);
    window.addEventListener("resize",draw);
    window.addEventListener("hashchange",function(){setTimeout(draw,0);}); // tema buvo paslėpta – perpiešti tikru dydžiu
    if(window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(){raster();draw();});
  });

  // Raiškos skaičiuoklė: pikseliai = cm ÷ 2,54 × dpi
  document.querySelectorAll("[data-dpi]").forEach(function(box){
    var w=box.querySelector("[data-k=w]"), h=box.querySelector("[data-k=h]"), dpi=box.querySelector("[data-k=dpi]"), out=box.querySelector(".dpi-out");
    function num(s){var v=parseFloat(String(s).replace(",",".").trim()); return v>0&&v<10000?v:NaN;}
    function lt(v){return String(v).replace(".",",");}
    function line(lbl,cm,d){var px=Math.round(cm/2.54*d), s=document.createElement("span"), b=document.createElement("b");
      s.appendChild(document.createTextNode(lbl+": "+lt(cm)+" ÷ 2,54 × "+d+" ≈ ")); b.textContent=px+" px"; s.appendChild(b); out.appendChild(s); return px;}
    function calc(){
      var cw=num(w.value), ch=num(h.value), d=+dpi.value; out.textContent="";
      if(isNaN(cw)||isNaN(ch)){ out.appendChild(document.createTextNode("Įvesk teigiamą skaičių, pvz., 10 arba 12,5.")); return; }
      var pw=line("Plotis",cw,d), ph=line("Aukštis",ch,d), s=document.createElement("span");
      s.textContent="Iš viso: "+pw+" × "+ph+" px ≈ "+lt((pw*ph/1e6).toFixed(1))+" megapikselio"; out.appendChild(s);
    }
    [w,h,dpi].forEach(function(x){x.addEventListener("input",calc);});
    calc();
  });
})();
