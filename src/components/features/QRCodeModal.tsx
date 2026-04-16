"use client";

import { useEffect, useRef } from "react";

interface QRCodeModalProps {
  linkId: string;
  slug: string;
  shortUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ linkId, slug, shortUrl, isOpen, onClose }: QRCodeModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const qrUrl = `/api/links/${linkId}/qr`;

  async function downloadPng() {
    const res = await fetch(qrUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sniplink-${slug}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadSvg() {
    const res = await fetch(`${qrUrl}?format=svg`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sniplink-${slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-5">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">QR Code</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* QR Image */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt={`QR code for ${shortUrl}`}
            width={280}
            height={280}
            className="block"
          />
        </div>

        {/* Short URL label */}
        <p className="text-sm text-slate-500 text-center truncate w-full px-2">
          {shortUrl}
        </p>

        {/* Download buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={downloadPng}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PNG
          </button>
          <button
            onClick={downloadSvg}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-violet-200 text-violet-700 text-sm font-medium hover:bg-violet-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}
