import { useState, lazy, Suspense } from "react";
import { UploadPage } from "@/components/UploadPage";

// 1. Lazily import the ResultsPage component
const ResultsPage = lazy(() => 
  import("@/components/ResultsPage").then(module => ({ default: module.ResultsPage }))
);

const Index = () => {
  const [showResults, setShowResults] = useState(false);

  return showResults ? (
    // 2. Wrap the lazy component in a Suspense fallback
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ResultsPage onReset={() => setShowResults(false)} />
    </Suspense>
  ) : (
    <UploadPage onUpload={() => setShowResults(true)} />
  );
};

export default Index;