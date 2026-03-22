// BINARY QUEST MAX - PHONE TOUCH ONLY
const W=300,H=300,canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d');
const player=new Float32Array(8),camera=new Float32Array(1),particleBuffer=new Float32Array(2048*5);
let particleCount=0,frames=0,lastTime=performance.now(),inputState=new Uint8Array(1),metrics={pfr:0,fps:0,particles:0};
const FULL_PATTERNS=new Uint8Array(256);for(let i=0;i<256;i++)FULL_PATTERNS[i]=i;

function updatePlayer(){  
  if(inputState[0]&1){player[2]-=0.4;player[6]=-1;}  
  if(inputState[0]&2){player[2]+=0.4;player[6]=1;}  
  player[2]*=0.85;
  if((inputState[0]&4)&&(player[1]+player[5]>=240)){player[3]=-9;spawnParticles(player[0]+12,player[1]+32,24);}
  player[3]+=0.5;player[0]+=player[2];player[1]+=player[3];
  if(player[1]+player[5]>=240){player[1]=240-player[5];player[3]=0;}
  camera[0]+=(player[0]-100-camera[0])*0.1;if(camera[0]<0)camera[0]=0;
}

function spawnParticles(x,y,count){
  for(let i=0;i<count&&particleCount<2048;i++,particleCount++){
    const idx=particleCount*5;
    particleBuffer[idx+0]=x;particleBuffer[idx+1]=y;
    particleBuffer[idx+2]=(Math.random()-0.5)*6;
    particleBuffer[idx+3]=(Math.random()-0.5)*6;
    particleBuffer[idx+4]=45+Math.random()*15;
  }
}

function updateParticles(){
  for(let i=particleCount-1;i>=0;i--){
    const idx=i*5;
    particleBuffer[idx+0]+=particleBuffer[idx+2];
    particleBuffer[idx+1]+=particleBuffer[idx+3];
    particleBuffer[idx+2]*=0.98;particleBuffer[idx+3]+=0.08;
    particleBuffer[idx+4]--;
    if(particleBuffer[idx+4]<=0){particleCount--;particleBuffer.copyWithin(idx*5,(idx+1)*5);}
  }
  metrics.particles=particleCount;
}

function draw(){
  ctx.fillStyle='#5c94fc';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(-camera[0],0);
  ctx.fillStyle='#6b8c42';ctx.fillRect(0,240,3000,60);
  
  for(let x=0;x<500;x+=10){
    const patternId=(x+frames*0.5)%256,pattern=FULL_PATTERNS[patternId];
    for(let bit=0;bit<8;bit++){
      ctx.fillStyle=(pattern&(1<<bit))?'#8b4513':'#5c94fc';
      ctx.fillRect(x+bit*4,232,4,8);
    }
  }
  
  const px=player[0],py=player[1];
  ctx.save();
  if(player[6]<0){ctx.translate(px+player[4],py);ctx.scale(-1,1);}else{ctx.translate(px,py);}
  ctx.fillStyle='#2e8b57';ctx.fillRect(2,8,20,20);
  ctx.fillStyle='#ffff00';ctx.fillRect(2,0,8,8);ctx.fillRect(14,0,8,8);
  ctx.fillStyle='#ffdead';ctx.fillRect(10,4,12,10);
  ctx.fillStyle='#ff4500';ctx.fillRect(12,2,8,4);
  ctx.restore();ctx.restore();
  
  for(let i=0;i<particleCount;i++){
    const idx=i*5;
    ctx.fillStyle='#ffff88';ctx.globalAlpha=particleBuffer[idx+4]/60;
    ctx.fillRect(particleBuffer[idx+0],particleBuffer[idx+1],3,3);
  }
  ctx.globalAlpha=1;
  
  ctx.fillStyle='white';ctx.font='bold 12px monospace';
  ctx.textAlign='left';
  ctx.fillText(`PFR:${metrics.pfr.toFixed(1)}ms`,8,18);
  ctx.fillText(`FPS:${metrics.fps.toFixed(0)}`,8,32);
  ctx.fillText(`PART:${metrics.particles}`,8,46);
}

function updateMetrics(now){
  metrics.pfr=now-lastTime;metrics.fps=1000/metrics.pfr;lastTime=now;
  if(frames%120===0){
    console.table([{'PFR':metrics.pfr.toFixed(1)+'ms','FPS':metrics.fps.toFixed(0),'PARTICLES':metrics.particles,'X':player[0].toFixed(1)}]);
  }
}

function loop(now){
  updateMetrics(now);updatePlayer();updateParticles();draw();frames++;requestAnimationFrame(loop);
}

function setupTouch(){
  ['dpadLeft','dpadRight','btnA','btnB'].forEach((id,i)=>{
    const el=document.getElementById(id),bit=1<<i;
    if(!el)return;
    el.addEventListener('touchstart',(e)=>{e.preventDefault();inputState[0]|=bit;},{passive:false});
    el.addEventListener('touchend',(e)=>{e.preventDefault();inputState[0]&=~bit;},{passive:false});
  });
}

player[0]=50;player[1]=208;player[4]=24;player[5]=32;player[6]=1;
setupTouch();spawnParticles(80,240,64);requestAnimationFrame(loop);
console.log("BINARY QUEST MAX LOADED - 255 PATTERNS - TOUCH");
