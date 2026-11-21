/** The same dirty item art is erased to reveal its clean state and engraved text. */
export function mountWiping(canvas:HTMLCanvasElement,onRub:()=>void,onDone:()=>void,interactive=true,imageSource:string){
  const ctx=canvas.getContext('2d',{willReadFrequently:true})!;
  const width=360,height=450;canvas.width=width;canvas.height=height;
  let ready=false,down=false,finished=false,last:{x:number;y:number}|null=null,moves=0;
  const sampleIndices:number[]=[];
  const dirt=new Image();
  const prepare=()=>{
    // Paired originals may have different transparent canvases; preserve their shape.
    const scale=Math.min(width/dirt.naturalWidth,height/dirt.naturalHeight);
    const dw=dirt.naturalWidth*scale,dh=dirt.naturalHeight*scale;
    ctx.drawImage(dirt,(width-dw)/2+width*.005,(height-dh)/2,dw,dh);
    const pixels=ctx.getImageData(0,0,width,height).data;
    // Only the inscribed wood face counts; transparent margins and rope do not.
    for(let y=180;y<356;y+=7)for(let x=112;x<238;x+=7){const i=(y*width+x)*4+3;if(pixels[i]>180)sampleIndices.push(i);}
    ready=true;canvas.parentElement?.classList.add('grime-ready');
  };
  dirt.src=imageSource;
  if(dirt.complete&&dirt.naturalWidth)prepare();else dirt.onload=prepare;
  if(!interactive)return;
  const checkComplete=()=>{
    if(!ready||finished||!sampleIndices.length)return;
    const pixels=ctx.getImageData(0,0,width,height).data;
    const clear=sampleIndices.filter(i=>pixels[i]<70).length;
    if(clear/sampleIndices.length>.56){finished=true;canvas.classList.add('cleared');setTimeout(onDone,360);}
  };
  const point=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*width/r.width,y:(e.clientY-r.top)*height/r.height};};
  const draw=(e:PointerEvent)=>{
    if(!ready||!down||finished)return;e.preventDefault();const p=point(e);
    ctx.globalCompositeOperation='destination-out';ctx.lineWidth=45;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(last?.x??p.x,last?.y??p.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;
    if(++moves%9===0)onRub();
    if(moves%12===0)checkComplete();
  };
  canvas.addEventListener('pointerdown',e=>{if(!ready)return;down=true;last=point(e);canvas.setPointerCapture(e.pointerId);canvas.classList.add('rubbing');draw(e);});
  canvas.addEventListener('pointermove',draw);
  const stop=()=>{down=false;last=null;canvas.classList.remove('rubbing');checkComplete();};
  canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
}
