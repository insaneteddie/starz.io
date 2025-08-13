import React, { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import DrawingApp from "./DrawingApp";

export default function App() {
  // Global UI state
  const [pointCount, setPointCount] = useState(12);
  const [bgColor, setBgColor] = useState("#ffffff");

  // Color mode
  const [colorMode, setColorMode] = useState("solid"); // "solid" | "gradient"
  const [solidColor, setSolidColor] = useState("#0f172a"); // slate-900
  const [gradientStart, setGradientStart] = useState("#ef4444"); // red-500
  const [gradientEnd, setGradientEnd] = useState("#3b82f6");   // blue-500
  const [gradientDirection, setGradientDirection] = useState("inside-out");

  // Drawing mode & thickness
  const [drawMode, setDrawMode] = useState("center"); // "center" | "corners" | "both"
  const [lineThickness, setLineThickness] = useState(2);

  // Background image (store as object URL)
  const [bgImageUrl, setBgImageUrl] = useState(null);
  const onBackgroundFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };
  const clearBackground = () => {
    if (bgImageUrl) URL.revokeObjectURL(bgImageUrl);
    setBgImageUrl(null);
  };

  // Responsive canvas container & size
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(500);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const isMobile = window.innerWidth < 768; // Tailwind md breakpoint
      // Reserve ~120px per side for ads on desktop, 0 on mobile (ads hidden)
      const adSpace = isMobile ? 0 : 240;
      const available = Math.max(200, containerRef.current.offsetWidth - adSpace - 16 /*gap*/);
      const maxByHeight = Math.max(200, window.innerHeight * 0.65);
      const size = Math.min(available, maxByHeight);
      setCanvasSize(Math.floor(size));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Load AdSense script once (you must have your site approved for ads to render) ---
  useEffect(() => {
    // Avoid loading twice
    if (document.querySelector('script[data-adsbygoogle-loaded="true"]')) return;

    const s = document.createElement("script");
    s.setAttribute("data-adsbygoogle-loaded", "true");
    s.async = true;
    s.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9132155293089442";
    s.crossOrigin = "anonymous";
    document.body.appendChild(s);
  }, []);

  // Ask AdSense to fill any new <ins> tags when layout changes
  useEffect(() => {
    // This push is safe even before script loads; it’s no-op until adsbygoogle exists
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [canvasSize]);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Title */}
      <header className="py-6">
        <h1 className="text-3xl font-extrabold text-center">Starz Drawing App</h1>
      </header>

      {/* Toolbar */}
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <Toolbar
          // points & background
          pointCount={pointCount}
          setPointCount={setPointCount}
          bgColor={bgColor}
          setBgColor={setBgColor}
          // line thickness & draw mode
          lineThickness={lineThickness}
          setLineThickness={setLineThickness}
          drawMode={drawMode}
          setDrawMode={setDrawMode}
          // color mode & options
          colorMode={colorMode}
          setColorMode={setColorMode}
          solidColor={solidColor}
          setSolidColor={setSolidColor}
          gradientStart={gradientStart}
          setGradientStart={setGradientStart}
          gradientEnd={gradientEnd}
          setGradientEnd={setGradientEnd}
          gradientDirection={gradientDirection}
          setGradientDirection={setGradientDirection}
          // background image handling
          onBackgroundFile={onBackgroundFile}
          clearBackground={clearBackground}
          hasBackground={!!bgImageUrl}
        />
      </div>

      {/* Main content: Left Ad | Canvas | Right Ad */}
      <main className="max-w-6xl mx-auto px-2 md:px-4">
        <div
          ref={containerRef}
          className="w-full flex items-center justify-center gap-4"
        >
          {/* Left Ad (hidden on small screens) */}
          <div className="hidden md:block w-[120px]">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-9132155293089442"
              data-ad-slot="1936554075"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          {/* Canvas */}
          <DrawingApp
            size={canvasSize}
            pointCount={pointCount}
            bgColor={bgColor}
            colorMode={colorMode}
            solidColor={solidColor}
            gradientStart={gradientStart}
            gradientEnd={gradientEnd}
            gradientDirection={gradientDirection}
            lineThickness={lineThickness}
            drawMode={drawMode}
            bgImageUrl={bgImageUrl}
          />

          {/* Right Ad (hidden on small screens) */}
          <div className="hidden md:block w-[120px]">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-9132155293089442"
              data-ad-slot="3293582365"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-center py-6">
          <button
            onClick={() => {
              const canvas = document.getElementById("starz-canvas");
              if (!canvas) return;
              const link = document.createElement("a");
              link.download = "starz-drawing.png";
              link.href = canvas.toDataURL("image/png");
              link.click();
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 active:scale-[0.99]"
          >
            Export as PNG
          </button>
        </div>
      </main>
    </div>
  );
}
