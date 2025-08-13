import React, { useState } from "react";
import Toolbar from "./Toolbar";
import DrawingApp from "./DrawingApp";
import AdColumn from "./AdColumn";

export default function App() {
  const [pointCount, setPointCount] = useState(10);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [lineColor, setLineColor] = useState("#000000");
  const [mode, setMode] = useState("circle");
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientStart, setGradientStart] = useState("#ff0000");
  const [gradientEnd, setGradientEnd] = useState("#0000ff");
  const [gradientDirection, setGradientDirection] = useState("inside-out");
  const [lineWidth, setLineWidth] = useState(2);

  const exportPNG = () => {
    const canvas = document.querySelector("canvas");
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-4">Starz Drawing App</h1>
      <Toolbar
        pointCount={pointCount}
        setPointCount={setPointCount}
        bgColor={bgColor}
        setBgColor={setBgColor}
        lineColor={lineColor}
        setLineColor={setLineColor}
        mode={mode}
        setMode={setMode}
        gradientEnabled={gradientEnabled}
        setGradientEnabled={setGradientEnabled}
        gradientStart={gradientStart}
        setGradientStart={setGradientStart}
        gradientEnd={gradientEnd}
        setGradientEnd={setGradientEnd}
        gradientDirection={gradientDirection}
        setGradientDirection={setGradientDirection}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
      />
      <div className="flex w-full justify-center mt-4 gap-4">
        <AdColumn />
        <DrawingApp
          pointCount={pointCount}
          bgColor={bgColor}
          lineColor={lineColor}
          mode={mode}
          gradientEnabled={gradientEnabled}
          gradientStart={gradientStart}
          gradientEnd={gradientEnd}
          gradientDirection={gradientDirection}
          lineWidth={lineWidth}
        />
        <AdColumn />
      </div>
      <button
        onClick={exportPNG}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Export as PNG
      </button>
    </div>
  );
}
