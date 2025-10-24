// src/pages/Index.tsx
import { useState, lazy, Suspense } from "react";
import { UploadPage } from "@/components/UploadPage";

// Define or import your AnalysisData interface
interface Clause { name: string; summary: string };
interface AnalysisData {
  controlGovernanceClauses: Clause[];
  cashflowReturnsClauses: Clause[];
  // chartData?: any; // If chart data becomes dynamic
}

const ResultsPage = lazy(() =>
  import("@/components/ResultsPage").then(module => ({ default: module.ResultsPage }))
);

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  // State ONLY for results from actual uploads
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);

  // Handler for ACTUAL file uploads
  const handleUpload = async (file: File) => {
    console.log("File uploaded:", file.name); // Placeholder for API call trigger

    // --- TODO: Replace with actual backend API call ---
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const mockResults: AnalysisData = { // Replace with actual API response
      controlGovernanceClauses: [
          { name: "Board Comp (Actual)", summary: "Dynamic summary from LLM for board..." },
          { name: "Anti-Dilution (Actual)", summary: "Dynamic summary from LLM for dilution..." },
          // ... other dynamic clauses
        ],
      cashflowReturnsClauses: [
          { name: "Liquidation Pref (Actual)", summary: "Dynamic summary from LLM for preference..." },
          { name: "Dividends (Actual)", summary: "Dynamic summary from LLM for dividends..." },
          // ... other dynamic clauses
        ],
    };
    setAnalysisResults(mockResults); // Store the fetched results
    // --- End API call simulation ---

    setShowResults(true); // Show the results page
  };

  // Handler for the "See an Example" button
  const handleShowExample = () => {
    setAnalysisResults(null); // Ensure no dynamic results are passed for example view
    setShowResults(true);   // Show the results page (which will default to example)
  };

  // Handler for resetting the view
  const handleReset = () => {
    setAnalysisResults(null); // Clear any dynamic results
    setShowResults(false);  // Go back to upload page
  };

  return showResults ? (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      {/* Pass analysisResults (null for example, data for real upload) */}
      <ResultsPage results={analysisResults} onReset={handleReset} />
    </Suspense>
  ) : (
    // Pass both handlers to UploadPage
    <UploadPage onUpload={handleUpload} onShowExample={handleShowExample} />
  );
};

export default Index;