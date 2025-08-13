import React from "react";

export default function Toolbar({
  pointCount,
  setPointCount,
  bgColor,
  setBgColor,
  lineColor,
  setLineColor,
  mode,
  setMode,
  gradientEnabled,
  setGradientEnabled,
  gradientStart,
  setGradientStart,
  gradientEnd,
  setGradientEnd,
  gradientDirection,
  setGradientDirection,
  lineWidth,
  setLineWidth
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-100 rounded shadow">
      <label>
        Points:
        <input
          type="number"
          min="2"
          value={pointCount}
          onChange={(e) => setPointCount(Number(e.target.value))}
          className="ml-2 border rounded px-2 py-1 w-20"
        />
      </label>

      <label>
        Background:
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="ml-2"
        />
      </label>

      <label>
        Line Color:
        <input
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
          className="ml-2"
        />
      </label>

      <label>
        Mode:
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="ml-2 border rounded px-2 py-1"
        >
          <option value="center">Graph</option>
          <option value="corners">Corners</option>
          <option value="both">Both</option>
        </select>
      </label>

      <label>
        Gradient:
        <input
          type="checkbox"
          checked={gradientEnabled}
          onChange={(e) => setGradientEnabled(e.target.checked)}
          className="ml-2"
        />
      </label>

      {gradientEnabled && (
        <>
          <label>
            Start:
            <input
              type="color"
              value={gradientStart}
              onChange={(e) => setGradientStart(e.target.value)}
              className="ml-2"
            />
          </label>
          <label>
            End:
            <input
              type="color"
              value={gradientEnd}
              onChange={(e) => setGradientEnd(e.target.value)}
              className="ml-2"
            />
          </label>
          <label>
            Direction:
            <select
              value={gradientDirection}
              onChange={(e) => setGradientDirection(e.target.value)}
              className="ml-2 border rounded px-2 py-1"
            >
              <option value="inside-out">Inside → Out</option>
              <option value="outside-in">Outside → In</option>
              <option value="left-right">Left → Right</option>
              <option value="right-left">Right → Left</option>
              <option value="top-bottom">Top → Bottom</option>
              <option value="bottom-top">Bottom → Top</option>
            </select>
          </label>
        </>
      )}

      <label>
        Line Width:
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="ml-2"
        />
      </label>
    </div>
  );
}
