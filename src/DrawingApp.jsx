import React, { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import AdColumn from "./AdColumn";

export default function DrawingApp() {
  const canvasRef = useRef(null);
  const [pointCount, setPointCount] = useState(10);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [lineColor, setLineColor] = useState("#000000");
  const [mode, setMode] = useState("center");
  const [gradientOn, setGradientOn] = useState(false);
  const [gradientColor2, setGradientColor2] = useState("#ff0000");
  const [gradientDir, setGradientDir] = useState("inside-out");
  const [lineWidth, setLineWidth] = useState(2);

  // Canvas resize and redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth * 0.6;
      canvas.height = window.innerHeight * 0.6;
      drawCanvas();
    };

    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, [pointCount, bgColor, lineColor, mode, gradientOn, gradientColor2, gradientDir, lineWidth]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    // Clear background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Determine stroke style
    let strokeStyle = lineColor;
    if (gradientOn) {
      let grad;
      if (gradientDir === "inside-out" || gradientDir === "outside-in") {
        grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/2);
        if (gradientDir === "inside-out") {
          grad.addColorStop(0, lineColor);
          grad.addColorStop(1, gradientColor2);
        } else {
          grad.addColorStop(0, gradientColor2);
          grad.addColorStop(1, lineColor);
        }
      } else if (gradientDir === "left-right") {
        grad = ctx.createLinearGradient(0,0,w,0);
        grad.addColorStop(0,lineColor);
        grad.addColorStop(1,gradientColor2);
      } else if (gradientDir === "top-bottom") {
        grad = ctx.createLinearGradient(0,0,0,h);
        grad.addColorStop(0,lineColor);
        grad.addColorStop(1,gradientColor2);
      }
      strokeStyle = grad;
    }

    ctx.lineWidth = lineWidth;

    // Draw center mode
    if (mode === "center" || mode === "both") {
      const cx = w/2;
      const cy = h/2;
      const radius = Math.min(w,h)/2 - 20;
      const points = [];
      for(let i=0;i<pointCount;i++){
        const angle = (i/pointCount) * Math.PI*2;
        points.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle)
        });
      }
      points.forEach((p,i)=>{
        const partnerIndex = (pointCount - i) % pointCount;
        const partner = points[partnerIndex];
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(partner.x,partner.y);
        ctx.stroke();
      });

      // Draw axes
      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.moveTo(cx,0);
      ctx.lineTo(cx,h);
      ctx.moveTo(0,cy);
      ctx.lineTo(w,cy);
      ctx.stroke();
    }

    // Draw corners mode (2 axes)
    if(mode === "corners" || mode === "both"){
      const stepX = w/(pointCount-1);
      const stepY = h/(pointCount-1);
      const corners = [
        {x:0,y:0},       // top-left
        {x:w,y:0},       // top-right
        {x:0,y:h},       // bottom-left
        {x:w,y:h}        // bottom-right
      ];
      corners.forEach(corner=>{
        for(let i=0;i<pointCount;i++){
          ctx.beginPath();
          ctx.strokeStyle = strokeStyle;
          // horizontal line from corner along top/bottom
          ctx.moveTo(corner.x,corner.y);
          ctx.lineTo(i*stepX, corner.y);
          ctx.stroke();
        }
        for(let j=0;j<pointCount;j++){
          ctx.beginPath();
          ctx.strokeStyle = strokeStyle;
          // vertical line from corner along left/right
          ctx.moveTo(corner.x,corner.y);
          ctx.lineTo(corner.x, j*stepY);
          ctx.stroke();
        }
      });
    }
  }

  const exportPNG = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold text-center my-4">Starz Drawing App</h1>
      <Toolbar
        pointCount={pointCount}
        setPointCount={setPointCount}
        bgColor={bgColor}
        setBgColor={setBgColor}
        lineColor={lineColor}
        setLineColor={setLineColor}
        mode={mode}
        setMode={setMode}
        gradientOn={gradientOn}
        setGradientOn={setGradientOn}
        gradientColor2={gradientColor2}
        setGradientColor2={setGradientColor2}
        gradientDir={gradientDir}
        setGradientDir={setGradientDir}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
      />
      <div className="flex w-full justify-center items-center gap-4">
        <AdColumn />
        <canvas ref={canvasRef} className="border rounded shadow" />
        <AdColumn />
      </div>
      <button
        onClick={exportPNG}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 my-4"
      >
        Export as PNG
      </button>
    </div>
  )
}
