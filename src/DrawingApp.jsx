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
  }, [
    pointCount,
    bgColor,
    lineColor,
    mode,
    gradientOn,
    gradientColor2,
    gradientDir,
    lineWidth,
  ]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = lineWidth;

    let colorFn = () => lineColor;
    if (gradientOn) {
      const grad =
        gradientDir === "inside-out" || gradientDir === "outside-in"
          ? ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2)
          : gradientDir === "left-right"
          ? ctx.createLinearGradient(0, 0, w, 0)
          : ctx.createLinearGradient(0, 0, 0, h);

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

    // -------- Center / axis logic with mirrored connections --------
    if (mode === "center" || mode === "both") {
      const cx = w / 2;
      const cy = h / 2;
      const stepX = (w / 2) / pointCount;
      const stepY = (h / 2) / pointCount;

      const posXPoints = Array.from({ length: pointCount }, (_, i) => ({ x: cx + (i + 1) * stepX, y: cy }));
      const negXPoints = Array.from({ length: pointCount }, (_, i) => ({ x: cx - (i + 1) * stepX, y: cy }));
      const posYPoints = Array.from({ length: pointCount }, (_, i) => ({ x: cx, y: cy - (i + 1) * stepY }));
      const negYPoints = Array.from({ length: pointCount }, (_, i) => ({ x: cx, y: cy + (i + 1) * stepY }));

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
    }

    // -------- Corner mode logic with mirrored connections --------
    if (mode === "corners" || mode === "both") {
      const stepX = w / pointCount;
      const stepY = h / pointCount;

      const corners = [
        { x: 0, y: 0, horizontalDir: 1, verticalDir: 1 }, // top-left
        { x: w, y: 0, horizontalDir: -1, verticalDir: 1 }, // top-right
        { x: 0, y: h, horizontalDir: 1, verticalDir: -1 }, // bottom-left
        { x: w, y: h, horizontalDir: -1, verticalDir: -1 }, // bottom-right
      ];

      corners.forEach(corner => {
        const edgeXPoints = Array.from({ length: pointCount }, (_, i) => corner.x + corner.horizontalDir * (i + 1) * stepX);
        const edgeYPoints = Array.from({ length: pointCount }, (_, i) => corner.y + corner.verticalDir * (i + 1) * stepY);

        for (let i = 0; i < pointCount; i++) {
          const x = edgeXPoints[i];
          const y = edgeYPoints[pointCount - 1 - i];

          ctx.beginPath();
          ctx.moveTo(corner.x, corner.y);
          ctx.lineTo(x, corner.y); // horizontal
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(corner.x, corner.y);
          ctx.lineTo(corner.x, y); // vertical
          ctx.stroke();

          // Diagonal mirrored connection
          ctx.beginPath();
          ctx.moveTo(corner.x, corner.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
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
