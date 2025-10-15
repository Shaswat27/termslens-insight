import { useState } from "react";
import { UploadPage } from "@/components/UploadPage";
import { ResultsPage } from "@/components/ResultsPage";

const Index = () => {
  const [showResults, setShowResults] = useState(false);

  return showResults ? (
    <ResultsPage onReset={() => setShowResults(false)} />
  ) : (
    <UploadPage onUpload={() => setShowResults(true)} />
  );
};

export default Index;
