"use client";
import React, { useState } from "react";
import { UserProfile } from "@/lib/type";
import { latexTemplate } from "./Latex";
type ResumeDownloadProps = {
  user: UserProfile;
};

const ResumeDownload: React.FC<ResumeDownloadProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const latexContent = latexTemplate(user);

      if (!latexContent) {
        throw new Error("Failed to generate LaTeX content");
      }

      const response = await fetch("/api/convert-latex-to-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latexContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Generated PDF is empty");
      }

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Cleanup the URL object after opening
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Download failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate PDF"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        className="download-button"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "View Resume"}
      </button>
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
    </div>
  );
};

export default ResumeDownload;
