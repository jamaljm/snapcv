import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { UserProfile } from "@/lib/type";

interface DownloadProps {
  profile: UserProfile;
}

export default function Download({ profile }: DownloadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const resumeElement = document.getElementById("resume-content");
      if (!resumeElement) {
        throw new Error("Resume content not found");
      }

      const canvas = await html2canvas(resumeElement);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Use profile data in the filename
      pdf.save(`vvvxc.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {isLoading ? "Generating PDF..." : "Download PDF"}
    </button>
  );
}
