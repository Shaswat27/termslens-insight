// src/components/UploadPage.tsx
import { useRef } from 'react';
import { Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PrivacyStatement } from "./PrivacyStatement";

interface UploadPageProps {
  onUpload: (file: File) => void;
  onShowExample: () => void; // Add prop for showing example
}

export const UploadPage = ({ onUpload, onShowExample }: UploadPageProps) => { // Destructure new prop
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        // accept=".pdf,.doc,.docx,.txt" // Optional: filter file types
      />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
            Understand Your Term Sheet in Seconds
          </h1>
          <div className="space-y-4 flex flex-col items-center">
            <Button
              size="lg"
              className="h-14 w-64 px-8 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              onClick={handleUploadClick}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Document
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="h-[3.25rem] w-64 px-8 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow brightness-95 hover:brightness-90"
              onClick={onShowExample} // Use the onShowExample handler
            >
              <Eye className="mr-2 h-5 w-5" />
              See an Example
            </Button>
            <PrivacyStatement />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};