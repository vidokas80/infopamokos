/* Klasių skirtukai (pvz., 7 ir 8 klasė viename puslapyje). Mygtukai [data-tabs] [data-go], skydeliai [data-tab].
   Adresas #7 / #8 atidaro skirtuką; nuoroda į vietą skydelio viduje (pvz., #kompiuteriu-daktaras) atidaro tą skydelį. */
(function(){
  var bar=document.querySelector("[data-tabs]"); if(!bar) return;
  var btns=[].slice.call(bar.querySelectorAll("[data-go]")), panels=[].slice.call(document.querySelectorAll("[data-tab]"));
  function open(id,scroll){
    var ok=panels.some(function(p){return p.dataset.tab===id;}); if(!ok) return false;
    panels.forEach(function(p){p.hidden=p.dataset.tab!==id;});
    btns.forEach(function(b){b.setAttribute("aria-selected",String(b.dataset.go===id));});
    if(scroll) window.dispatchEvent(new Event("resize")); // įterpti žaidimai persiskaičiuoja aukštį
    return true;
  }
  function route(){
    var h=decodeURIComponent((location.hash||"").slice(1)); if(!h) return;
    if(open(h,true)) return;
    var el=document.getElementById(h), p=el&&el.closest("[data-tab]");
    if(p){ open(p.dataset.tab,true); el.scrollIntoView(); }
  }
  btns.forEach(function(b){
    b.addEventListener("click",function(){ history.replaceState(null,"","#"+b.dataset.go); open(b.dataset.go,true); });
    b.addEventListener("keydown",function(e){
      var i=btns.indexOf(b), n=e.key==="ArrowRight"?i+1:e.key==="ArrowLeft"?i-1:-2; if(n===-2) return;
      var t=btns[(n+btns.length)%btns.length]; t.focus(); t.click(); e.preventDefault();
    });
  });
  window.addEventListener("hashchange",route);
  route();
})();

/* Pamokų puslapiai: įterptų žaidimų (iframe) aukštis prisitaiko prie turinio.
   Žaidimai yra toje pačioje svetainėje, todėl jų dokumentą galima matuoti.
   Pačių žaidimų failai nekeičiami – tik nuimamas jų puslapio paraštės fonas, kad įterptas žaidimas atrodytų kaip kortelė. */
(function(){
  document.querySelectorAll("iframe[data-auto-height]").forEach(function(fr){
    function fit(){
      try{
        var d=fr.contentDocument; if(!d||!d.body) return;
        d.body.style.padding="0"; d.body.style.background="transparent";
        var h=Math.ceil(d.body.getBoundingClientRect().height); // ne documentElement: jis ne žemesnis už patį iframe, todėl aukštis negalėtų sumažėti
        if(h>0) fr.style.height=h+"px";
      }catch(e){} // jei žaidimas būtų kitoje svetainėje – lieka CSS aukštis
    }
    fr.addEventListener("load",function(){
      fit();
      try{ new fr.contentWindow.ResizeObserver(fit).observe(fr.contentDocument.body); }catch(e){}
    });
    window.addEventListener("resize",fit);
  });
})();

/* Pamokos testas „Pasitikrink žinias“. Klausimai – JSON bloke testo skiltyje:
   choice (q, a – pirmas teisingas, img/alt nebūtina), tf (q, ok), match (q, p – poros), e – paaiškinimas.
   Viskas veikia naršyklėje, rezultatai niekur nesiunčiami. */
(function(){
  function el(t,c,txt){var e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e;}
  function shuffle(a){a=a.slice(); for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t;} return a;}
  function verdict(s,n){
    var r=s/n;
    if(r===1) return "Puiku! Pažįsti visas kompiuterio vidaus dalis.";
    if(r>=.8) return "Labai gerai! Peržiūrėk paaiškinimus ten, kur suklydai.";
    if(r>=.6) return "Gerai, bet dar pakartok teoriją apie dalis, kuriose suklydai.";
    if(r>=.4) return "Pusiaukelėje. Perskaityk teoriją ir pažaisk žaidimą režimu „Tyrinėk“.";
    return "Verta pradėti iš naujo: perskaityk teoriją, pažaisk žaidimą ir bandyk dar kartą.";
  }
  document.querySelectorAll("[data-quiz]").forEach(function(sec,si){
    var data=JSON.parse(sec.querySelector('script[type="application/json"]').textContent), box=null;
    function build(){
      var qs=shuffle(data), n=qs.length, done=0, right=0;
      var wrap=el("div","quiz lesson-q"), head=el("div","quiz-head"), score=el("span","quiz-score"), res=el("div","quiz-result");
      res.hidden=true; res.setAttribute("aria-live","polite");
      head.appendChild(score); wrap.appendChild(head);
      function upd(){score.textContent="Atsakyta "+done+" iš "+n+" · teisingai "+right;}
      function answered(ok,ex,text){
        ex.innerHTML=""; ex.appendChild(el("b",ok?"r":"w",ok?"Teisingai. ":"Neteisingai. ")); ex.appendChild(document.createTextNode(text)); ex.hidden=false;
        done++; if(ok) right++; upd();
        if(done===n) finish();
      }
      function finish(){
        res.innerHTML="";
        res.appendChild(el("p","quiz-big",right+" / "+n));
        res.appendChild(el("p",null,verdict(right,n)));
        var again=el("button","quiz-reset","Bandyti dar kartą"); again.type="button"; again.addEventListener("click",restart);
        res.appendChild(again); res.hidden=false;
        wrap.querySelector(":scope > .quiz-reset").hidden=true; // apatinis mygtukas nebereikalingas – jis yra rezultate
      }
      qs.forEach(function(q,i){
        var fs=el("fieldset","q"), lg=el("legend"), ex=el("p","expl"), name="lq"+si+"-"+i;
        ex.hidden=true; lg.textContent=(i+1)+". "+q.q; fs.appendChild(lg);
        if(q.img){var fig=el("div","q-img"), im=el("img"); im.src=q.img; im.alt=q.alt||""; im.loading="lazy"; fig.appendChild(im); fs.appendChild(fig);}
        if(q.t==="match"){
          var rows=el("div","match"), sels=[], opts=shuffle(q.p.map(function(p){return p[1];})), chk=el("button","quiz-reset","Tikrinti");
          chk.type="button"; chk.disabled=true;
          shuffle(q.p).forEach(function(p,k){
            var r=el("label","mrow"), s=el("select");
            s.appendChild(new Option("– pasirink –",""));
            opts.forEach(function(o){s.appendChild(new Option(o,o));});
            s.dataset.ok=p[1];
            s.addEventListener("change",function(){chk.disabled=sels.some(function(x){return !x.value;});});
            r.appendChild(el("span","mname",p[0])); r.appendChild(s); rows.appendChild(r); sels.push(s);
          });
          chk.addEventListener("click",function(){
            var good=0;
            sels.forEach(function(s){
              var ok=s.value===s.dataset.ok, r=s.parentNode; s.disabled=true; if(ok) good++;
              r.classList.add(ok?"right":"wrong");
              if(!ok) r.appendChild(el("span","mfix","→ "+s.dataset.ok));
            });
            chk.remove();
            answered(good===sels.length,ex,"Teisingai sujungta "+good+" iš "+sels.length+". "+q.e);
          });
          fs.appendChild(rows); fs.appendChild(chk);
        } else {
          var list=q.t==="tf"?[["Teisinga",q.ok],["Neteisinga",!q.ok]]:shuffle(q.a.map(function(a,k){return [a,k===0];}));
          var box2=el("div","opts"+(q.t==="tf"?" tf":""));
          list.forEach(function(o,j){
            var lab=el("label"), inp=document.createElement("input");
            inp.type="radio"; inp.name=name; inp.value=j;
            lab.appendChild(inp); lab.appendChild(el("span",null,o[0])); box2.appendChild(lab);
            inp.addEventListener("change",function(){
              box2.querySelectorAll("input").forEach(function(x){x.disabled=true;});
              box2.querySelectorAll("label")[list.findIndex(function(x){return x[1];})].classList.add("right");
              if(!o[1]) lab.classList.add("wrong");
              answered(o[1],ex,q.e);
            });
          });
          fs.appendChild(box2);
        }
        fs.appendChild(ex); wrap.appendChild(fs);
      });
      wrap.appendChild(res);
      var reset=el("button","quiz-reset","Bandyti dar kartą"); reset.type="button"; reset.addEventListener("click",restart);
      wrap.appendChild(reset);
      upd(); return wrap;
    }
    function restart(){var nb=build(); box.replaceWith(nb); box=nb; sec.scrollIntoView({block:"start"});}
    box=build(); sec.appendChild(box);
  });
})();
