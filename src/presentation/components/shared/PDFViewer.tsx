import React, { useEffect, useState } from "react";

interface PDFViewerProps {
  file: string;
  height?: number;
}

const PDFViewer = ({ file, height }: PDFViewerProps) => {
  return (
    <embed
      src={file}
      width="100%"
      height={height ?? 600}
      type="application/pdf"
      className="h-dvh"
    />
  );
};

export default PDFViewer;
