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
