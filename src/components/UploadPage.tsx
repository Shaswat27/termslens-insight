import { Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PrivacyStatement } from "./PrivacyStatement";

interface UploadPageProps {
  onUpload: () => void;
}

export const UploadPage = ({ onUpload }: UploadPageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
            Understand Your Term Sheet in Seconds
          </h1>

          <div className="space-y-4 flex flex-col items-center">
            {/* --- PRIMARY BUTTON (h-14) --- */}
            <Button
              size="lg"
              className="h-14 w-64 px-8 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              onClick={onUpload}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Document
            </Button>

            {/* --- DARKER GREY "EXAMPLE" BUTTON (h-13) --- */}
            <Button
              variant="secondary"
              size="lg"
              className="h-[3.25rem] w-64 px-8 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow brightness-95 hover:brightness-90"
              onClick={onUpload}
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