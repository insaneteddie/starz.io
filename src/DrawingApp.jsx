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

  // Responsive canvas size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth * 0.6;
        canvas.height = window.innerHeight * 0.6;
        drawCanvas();
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [pointCount, bgColor, lineColor, mode, gradientOn, gradientColor2, gradientDir, lineWidth]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = lineWidth;

    // Set color (gradient or solid)
    let colorFn = () => lineColor;
    if (gradientOn) {
      let grad;
      if (gradientDir === "inside-out" || gradientDir === "outside-in") {
        grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
      } else if (gradientDir === "left-right") {
        grad = ctx.createLinearGradient(0, 0, w, 0);
      } else {
        grad = ctx.createLinearGradient(0, 0, 0, h);
      }

      if (gradientDir === "outside-in") {
        grad.addColorStop(0, gradientColor2);
        grad.addColorStop(1, lineColor);
      } else {
        grad.addColorStop(0, lineColor);
        grad.addColorStop(1, gradientColor2);
      }
      colorFn = () => grad;
    }

    ctx.strokeStyle = colorFn();

    // --- Center Mode ---
    if (mode === "center" || mode === "both") {
      const cx = w / 2;
      const cy = h / 2;
      const stepX = (w / 2) / pointCount;
      const stepY = (h / 2) / pointCount;

      const xPoints = [];
      const yPoints = [];

      for (let i = 1; i <= pointCount; i++) {
        xPoints.push(cx + i * stepX); // right
        xPoints.push(cx - i * stepX); // left
        yPoints.push(cy + i * stepY); // down
        yPoints.push(cy - i * stepY); // up
      }

      // Connect X points to Y points
      xPoints.forEach(x => {
        yPoints.forEach(y => {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();
        });
      });
    }

    // --- Corners Mode ---
    if (mode === "corners" || mode === "both") {
      const corners = [
        { x: 0, y: 0 },       // top-left
        { x: w, y: 0 },       // top-right
        { x: 0, y: h },       // bottom-left
        { x: w, y: h }        // bottom-right
      ];

      corners.forEach(corner => {
        const stepX = w / (pointCount - 1);
        const stepY = h / (pointCount - 1);
        const xPoints = [];
        const yPoints = [];

        if (corner.x === 0) {
          for (let i = 1; i < pointCount; i++) xPoints.push(corner.x + i * stepX);
        } else {
          for (let i = 1; i < pointCount; i++) xPoints.push(corner.x - i * stepX);
        }

        if (corner.y === 0) {
          for (let i = 1; i < pointCount; i++) yPoints.push(corner.y + i * stepY);
        } else {
          for (let i = 1; i < pointCount; i++) yPoints.push(corner.y - i * stepY);
        }

        xPoints.forEach(x => {
          yPoints.forEach(y => {
            ctx.beginPath();
            ctx.moveTo(corner.x, corner.y);
            ctx.lineTo(x, y);
            ctx.stroke();
          });
        });
      });
    }
  };

  const exportPNG = () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
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
