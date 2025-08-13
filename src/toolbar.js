import React from "react";

export default function Toolbar({
  pointCount,
  setPointCount,
  bgColor,
  setBgColor,

  lineThickness,
  setLineThickness,

  drawMode,
  setDrawMode,

  colorMode,
  setColorMode,
  solidColor,
  setSolidColor,
  gradientStart,
  setGradientStart,
  gradientEnd,
  setGradientEnd,
  gradientDirection,
  setGradientDirection,

  onBackgroundFile,
  clearBackground,
  hasBackground,
}) {
  return (
    <div className="w-full rounded-xl bg-white shadow p-4 flex flex-col gap-3">
      {/* Row 1: Points, Thickness, Draw Mode */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Points</span>
          <input
            type="number"
            min="2"
            value={pointCount}
            onChange={(e) => setPointCount(Number(e.target.value))}
            className="border rounded px-2 py-1 w-20"
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Line Thickness</span>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={lineThickness}
            onChange={(e) => setLineThickness(Number(e.target.value))}
          />
          <span className="text-xs text-gray-600 w-6 text-right">{lineThickness}</span>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Mode</span>
          <select
            value={drawMode}
            onChange={(e) => setDrawMode(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="center">Center Axis</option>
            <option value="corners">Corner Axis</option>
            <option value="both">Both</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Background</span>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-10 h-7 p-0 border-0"
          />
        </label>
      </div>

      {/* Row 2: Color Mode & Options */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Color Mode</span>
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="solid">Solid</option>
            <option value="gradient">Gradient</option>
          </select>
        </label>

        {colorMode === "solid" && (
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium">Line Color</span>
            <input
              type="color"
              value={solidColor}
              onChange={(e) => setSolidColor(e.target.value)}
              className="w-10 h-7 p-0 border-0"
            />
          </label>
        )}

        {colorMode === "gradient" && (
          <>
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium">Start</span>
              <input
                type="color"
                value={gradientStart}
                onChange={(e) => setGradientStart(e.target.value)}
                className="w-10 h-7 p-0 border-0"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium">End</span>
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                className="w-10 h-7 p-0 border-0"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium">Direction</span>
              <select
                value={gradientDirection}
                onChange={(e) => setGradientDirection(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="inside-out">Center → Out</option>
                <option value="outside-in">Outside → Center</option>
                <option value="left-right">Left → Right</option>
                <option value="right-left">Right → Left</option>
                <option value="top-bottom">Top → Bottom</option>
                <option value="bottom-top">Bottom → Top</option>
              </select>
            </label>
          </>
        )}
      </div>

      {/* Row 3: Background image upload */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Background Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onBackgroundFile(e.target.files?.[0] || null)}
            className="block"
          />
        </label>
        {hasBackground && (
          <button
            type="button"
            onClick={clearBackground}
            className="px-3 py-1 rounded border text-sm hover:bg-gray-50"
          >
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}
