import React, { useEffect, useRef } from "react";

export default function DrawingApp({
  size,
  pointCount,
  bgColor,
  colorMode,
  solidColor,
  gradientStart,
  gradientEnd,
  gradientDirection,
  lineThickness,
  drawMode, // "center" | "corners" | "both"
  bgImageUrl,
}) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Load/clear background image
  useEffect(() => {
    if (!bgImageUrl) {
      imageRef.current = null;
      draw();
      return;
    }
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      draw();
    };
    img.src = bgImageUrl;
  }, [bgImageUrl, size]); // re-draw when size changes too

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    size,
    pointCount,
    bgColor,
    colorMode,
    solidColor,
    gradientStart,
    gradientEnd,
    gradientDirection,
    lineThickness,
    drawMode,
  ]);

  const getGradient = (ctx, width, height) => {
    let grad;
    const cx = width / 2;
    const cy = height / 2;
    switch (gradientDirection) {
      case "inside-out":
        grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) / 2);
        break;
      case "outside-in":
        grad = ctx.createRadialGradient(cx, cy, Math.min(width, height) / 2, cx, cy, 0);
        break;
      case "left-right":
        grad = ctx.createLinearGradient(0, 0, width, 0);
        break;
      case "right-left":
        grad = ctx.createLinearGradient(width, 0, 0, 0);
        break;
      case "top-bottom":
        grad = ctx.createLinearGradient(0, 0, 0, height);
        break;
      case "bottom-top":
        grad = ctx.createLinearGradient(0, height, 0, 0);
        break;
      default:
        grad = ctx.createLinearGradient(0, 0, width, 0);
    }
    grad.addColorStop(0, gradientStart);
    grad.addColorStop(1, gradientEnd);
    return grad;
  };

  const adjustColor = (hex, factor = 0.5) => {
    // lighten towards white by factor
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rn = Math.min(255, Math.round(r + (255 - r) * factor));
    const gn = Math.min(255, Math.round(g + (255 - g) * factor));
    const bn = Math.min(255, Math.round(b + (255 - b) * factor));
    return `rgb(${rn}, ${gn}, ${bn})`;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // Background (color)
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Background image (if any) scaled to cover
    if (imageRef.current) {
      const img = imageRef.current;
      // cover: scale uniformly to cover entire canvas
      const scale = Math.max(width / img.width, height / img.height);
      const iw = img.width * scale;
      const ih = img.height * scale;
      const ix = (width - iw) / 2;
      const iy = (height - ih) / 2;
      ctx.drawImage(img, ix, iy, iw, ih);
    }

    // Axis color: solid or gradientStart
    const axisColor = colorMode === "solid" ? solidColor : gradientStart;

    // Draw axes for center mode visibility (even if corners selected, keep axes consistent)
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    // Prepare stroke style(s)
    const mainStroke =
      colorMode === "solid" ? solidColor : getGradient(ctx, width, height);
    // If "both", make a second tone to differentiate corner vs center drawings
    const secondaryStroke =
      colorMode === "solid"
        ? adjustColor(solidColor, 0.55)
        : getGradient(ctx, width, height); // gradient stays same for simplicity

    // Drawing helpers
    const drawCenterAxis = (strokeStyle) => {
      const radius = Math.min(width, height) / 2 - 20;
      const pts = [];
      for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        pts.push({ x, y });
      }
      ctx.lineWidth = lineThickness;
      ctx.strokeStyle = strokeStyle;
      pts.forEach((p, i) => {
        const j = (pointCount - i) % pointCount;
        const q = pts[j];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      });
    };

    const drawCornerAxis = (strokeStyle) => {
      ctx.lineWidth = lineThickness;
      ctx.strokeStyle = strokeStyle;

      const corners = [
        { ox: 0, oy: 0 },           // top-left
        { ox: width, oy: 0 },       // top-right
        { ox: 0, oy: height },      // bottom-left
        { ox: width, oy: height },  // bottom-right
      ];

      corners.forEach(({ ox, oy }) => {
        const pts = [];
        const xStep = width / (pointCount - 1);
        const yStep = height / (pointCount - 1);

        // Points along the horizontal edge from this corner
        for (let i = 0; i < pointCount; i++) {
          pts.push({ x: ox === 0 ? i * xStep : width - i * xStep, y: oy });
        }
        // Points along the vertical edge from this corner
        for (let i = 0; i < pointCount; i++) {
          pts.push({ x: ox, y: oy === 0 ? i * yStep : height - i * yStep });
        }

        // Connect corner to each edge point (L-shaped axes only)
        pts.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        });
      });
    };

    // Draw according to mode
    if (drawMode === "center") {
      drawCenterAxis(mainStroke);
    } else if (drawMode === "corners") {
      drawCornerAxis(mainStroke);
    } else {
      // both
      drawCenterAxis(mainStroke);
      drawCornerAxis(secondaryStroke);
    }
  };

  return (
    <canvas
      id="starz-canvas"
      ref={canvasRef}
      className="border rounded shadow"
      style={{ width: size + "px", height: size + "px" }}
    />
  );
}
