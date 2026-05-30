// src/components/CVBuilder/CvBuilderClient.tsx
"use client";

import { useState } from "react";
import AddCv, { CvData } from "./AddCv";
import BuildCv from "./BuildCv";

export default function CvBuilderClient() {
  const [view, setView] = useState<"form" | "preview">("form");
  const [cvData, setCvData] = useState<CvData | undefined>(undefined);

  const handlePreview = (data: CvData) => {
    setCvData(data);
    setView("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return view === "form" ? (
    <AddCv onPreview={handlePreview} />
  ) : (
    <BuildCv data={cvData} onBack={handleBack} />
  );
}
