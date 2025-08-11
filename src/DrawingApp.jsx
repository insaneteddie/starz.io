import React, { useRef, useState, useEffect } from "react";

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

  const exportPNG = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      style={{
        display: "flex",
        maxWidth: 900,
        margin: "auto",
        padding: 16,
        gap: 16,
        minHeight: "100vh",
        boxSizing: "border-box",
        alignItems: "flex-start",
      }}
    >
      {/* Left Ad column */}
      <div style={{ width: 120, minWidth: 120 }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "120px", height: "600px" }}
          data-ad-client="ca-pub-9132155293089442"
          data-ad-slot="3293582365"
          data-ad-format="vertical"
          data-full-width-responsive="false"
        />
      </div>

      {/* Center content: controls + canvas + button */}
      <div
        style={{
          flexGrow: 1,
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <h1 className="text-2xl font-bold text-center" style={{ marginBottom: 0 }}>
          Starz
        </h1>

        {/* Toolbar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Number of Points (≥ 1):
            <input
              type="number"
              min="1"
              value={pointCount}
              onChange={(e) => setPointCount(Number(e.target.value))}
              style={{ width: 60 }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Background Color:
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{ width: 40, height: 30, padding: 0, border: "none" }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Line Color:
            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              style={{ width: 40, height: 30, padding: 0, border: "none" }}
            />
          </label>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{ border: "1px solid #ccc", borderRadius: 8, maxWidth: "100%" }}
        />

        {/* Export button */}
        <button
          onClick={exportPNG}
          style={{
            backgroundColor: "#2563EB",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            width: "100%",
            maxWidth: 600,
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
        >
          Export as PNG
        </button>
      </div>

      {/* Right Ad column */}
      <div style={{ width: 120, minWidth: 120 }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "120px", height: "600px" }}
          data-ad-client="ca-pub-9132155293089442"
          data-ad-slot="3293582365"
          data-ad-format="vertical"
          data-full-width-responsive="false"
        />
      </div>
    </div>
  );
}
