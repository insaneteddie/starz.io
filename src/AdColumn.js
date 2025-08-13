import React, { useEffect } from "react";

export default function AdColumn() {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn("AdSense not loaded yet");
    }
  }, []);

  return (
    <div className="w-40 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9132155293089442"
        data-ad-slot="1936554075"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
