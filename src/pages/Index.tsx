import { useState, lazy, Suspense } from "react";
import { UploadPage } from "@/components/UploadPage";

// Adjust the lazy import to handle the named export
const ResultsPage = lazy(() =>
  import("@/components/ResultsPage").then(module => ({ default: module.ResultsPage }))
);

const Index = () => {
  const [showResults, setShowResults] = useState(false);

  return showResults ? (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ResultsPage onReset={() => setShowResults(false)} />
    </Suspense>
  ) : (
    <UploadPage onUpload={() => setShowResults(true)} />
  );
};

export default Index;