/* v508: 카메라 UI 이벤트 연결. 상태 소유/갱신은 RACamera 단일 경로, 타이머 없음. */
(function(){
  'use strict';
  const api=window.RACamera;
  const byId=id=>document.getElementById(id);
  if(!api||!byId('camera-controls')) return;
  const modeNames={auto:'자동',manual:'고정',overview:'전체'};
  for(const button of document.querySelectorAll('#camera-controls button,#camera-details button'))button.setAttribute('data-camera-control','1');
  let settingsOpen=false, latest=api.snapshot();
  function text(el,value){if(el&&el.textContent!==value) el.textContent=value;}
  function pressed(el,value){if(el) el.setAttribute('aria-pressed',String(value));}
  function details(){
    byId('camera-details').classList.toggle('hidden',!settingsOpen);
    byId('camera-settings').setAttribute('aria-expanded',String(settingsOpen));
  }
  function render(state){
    latest=state;
    for(const mode of ['auto','manual','overview']) pressed(byId('camera-mode-'+mode),state.mode===mode);
    text(byId('camera-status'),Number(state.z||1).toFixed(1)+'배 · '+(modeNames[state.mode]||'자동'));
    byId('camera-zoom-out').disabled=state.z<=1.005;
    byId('camera-zoom-in').disabled=state.z>=2.995;
    byId('camera-intensity').value=state.intensity||'normal';
    pressed(byId('camera-map-toggle'),!!state.mapOpen);
    text(byId('camera-map-toggle'),state.mapOpen?'미니맵 닫기':'미니맵 열기');
    byId('camera-map-wrap').classList.toggle('hidden',!state.mapOpen);
    const alert=byId('camera-alert');
    text(alert,state.alert?state.alert.text:'');
    alert.classList.toggle('hidden',!state.alert);
    if(state.over || state.scene==='title'){settingsOpen=false;details();}
    if(typeof __raPlaceDps==='function') __raPlaceDps();
  }
  for(const mode of ['auto','manual','overview']) byId('camera-mode-'+mode).addEventListener('click',()=>api.setMode(mode));
  byId('camera-zoom-out').addEventListener('click',()=>api.zoomBy(1/1.2));
  byId('camera-zoom-in').addEventListener('click',()=>api.zoomBy(1.2));
  byId('camera-settings').addEventListener('click',()=>{settingsOpen=!settingsOpen;details();render(api.snapshot());});
  byId('camera-intensity').addEventListener('change',event=>api.setIntensity(event.target.value));
  byId('camera-map-toggle').addEventListener('click',()=>api.toggleMap());
  byId('camera-alert').addEventListener('click',()=>{if(latest.alert)api.jumpTo(latest.alert.x,latest.alert.y);});
  const map=byId('camera-minimap');
  map.addEventListener('click',event=>{const r=map.getBoundingClientRect();api.jumpTo(Math.max(0,Math.min(1,(event.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(event.clientY-r.top)/r.height)));});
  map.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();const s=api.snapshot();
    api.jumpTo((s.nx == null ? .5 : s.nx)+(event.key==='ArrowLeft'?-.08:event.key==='ArrowRight'?.08:0),(s.ny == null ? .5 : s.ny)+(event.key==='ArrowUp'?-.08:event.key==='ArrowDown'?.08:0));
  });
  document.addEventListener('pointerdown',event=>{if(settingsOpen&&!event.target.closest('#camera-details,#camera-settings')){settingsOpen=false;details();}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&settingsOpen){settingsOpen=false;details();byId('camera-settings').focus();}});
  if(typeof api.subscribe==='function')api.subscribe(render);
  render(api.snapshot());
})();
