/* Case page shell (DESIGN.md §4.17): Kyiv clock in the header chip (§4.7), same as prototype/index.html. */
(()=>{
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
function tick(){let d;try{d=new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Kyiv'}));}catch(e){d=new Date();}
  const h=d.getHours(),m=String(d.getMinutes()).padStart(2,'0');const t=(h%12||12)+':'+m+(h<12?'am':'pm');
  document.querySelectorAll('[data-time]').forEach(n=>n.textContent=t);
  document.querySelectorAll('[data-date]').forEach(n=>n.textContent=d.getDate()+' '+months[d.getMonth()]+', '+d.getFullYear());}
tick();setInterval(tick,1000);
})();
