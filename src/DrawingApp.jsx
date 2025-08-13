import React, { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import AdColumn from "./AdColumn";


export default function DrawingApp() {
  const canvasRef = useRef(null);
  const [pointCount, setPointCount] = useState(6);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [lineColor, setLineColor] = useState("#0000ff"); // default line color blue
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  // Resize canvas dynamically on window resize
  useEffect(() => {
    function updateSize() {
      const maxWidth = window.innerWidth * 0.6; // 60% width max for canvas container
      const size = Math.min(maxWidth, 600);
      setCanvasSize({ width: size, height: size });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Draw Adsense ads once on mount
  useEffect(() => {
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      try {
        window.adsbygoogle.push({});
        window.adsbygoogle.push({});
      } catch (e) {
        // Fail silently
      }
    }
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [pointCount, bgColor, lineColor, canvasSize]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw axes in black
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, cy);
    ctx.lineTo(width - padding, cy);
    ctx.moveTo(cx, padding);
    ctx.lineTo(cx, height - padding);
    ctx.stroke();

    if (pointCount < 1) {
      ctx.fillStyle = "red";
      ctx.font = "16px sans-serif";
      ctx.fillText("Please enter number ≥ 1", 20, 30);
      return;
    }

    // Lengths for each axis side (distance from center to edge minus padding)
    const xPosLength = width - cx - padding;
    const xNegLength = cx - padding;
    const yPosLength = cy - padding;
    const yNegLength = height - cy - padding;

    // Generate points for each axis (coordinates only, no drawing)
    const generatePoints = (centerCoord, length, count, isHorizontal, positive) => {
      const pts = [];
      for (let i = 1; i <= count; i++) {
        const fraction = i / count;
        const offset = fraction * length;
        const pos = positive ? centerCoord + offset : centerCoord - offset;
        pts.push(isHorizontal ? { x: pos, y: cy } : { x: cx, y: pos });
      }
      return pts;
    };

    const posXPoints = generatePoints(cx, xPosLength, pointCount, true, true);
    const negXPoints = generatePoints(cx, xNegLength, pointCount, true, false);
    const posYPoints = generatePoints(cy, yPosLength, pointCount, false, false); // positive Y goes up, so negative offset
    const negYPoints = generatePoints(cy, yNegLength, pointCount, false, true);

    // Draw connecting lines with user-selected color
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;

    // Pos X <-> Neg Y
    for (let i = 0; i < pointCount; i++) {
      const p1 = posXPoints[i];
      const p2 = negYPoints[pointCount - 1 - i];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Pos Y <-> Neg X
    for (let i = 0; i < pointCount; i++) {
      const p1 = posYPoints[i];
      const p2 = negXPoints[pointCount - 1 - i];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Neg X <-> Neg Y
    for (let i = 0; i < pointCount; i++) {
      const p1 = negXPoints[i];
      const p2 = negYPoints[pointCount - 1 - i];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Pos X <-> Pos Y
    for (let i = 0; i < pointCount; i++) {
      const p1 = posXPoints[i];
      const p2 = posYPoints[pointCount - 1 - i];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  };

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
  );
}
