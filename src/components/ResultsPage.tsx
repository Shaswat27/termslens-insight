import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PrivacyStatement } from "./PrivacyStatement";
import { ClauseTable } from "./ClauseTable";
import { ReturnsChart } from "./ReturnsChart";

interface ResultsPageProps {
  onReset: () => void;
}

const controlGovernanceClauses = [
  {
    name: "Board Composition",
    summary: "Investors get 2 of 5 board seats, with founders retaining majority control"
  },
  {
    name: "Anti-Dilution",
    summary: "Broad-based weighted average protection for investors in down rounds"
  },
  {
    name: "Voting Rights",
    summary: "Major decisions require majority approval including investor consent"
  },
  {
    name: "Protective Provisions",
    summary: "Standard investor veto rights on asset sales, new equity issuance, and acquisitions"
  }
];

const cashflowReturnsClauses = [
  {
    name: "Type of Shares",
    summary: "Series A Preferred Stock with 1x liquidation preference, non-participating"
  },
  {
    name: "Option Pool",
    summary: "15% option pool created pre-money, diluting founders and common shareholders"
  },
  {
    name: "Dividends",
    summary: "8% cumulative dividends accrue annually, payable upon liquidation or at board discretion"
  },
  {
    name: "Conversion Rights",
    summary: "Automatic conversion to common upon IPO or at investor election with qualified majority"
  }
];

export const ResultsPage = ({ onReset }: ResultsPageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col items-center gap-4">
            <Button 
              variant="outline"
              size="lg"
              className="h-12 px-6 text-sm font-medium rounded-xl"
              onClick={onReset}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Erase Data & Start Over
            </Button>
            
            <PrivacyStatement />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <ClauseTable 
              title="Control and Governance" 
              clauses={controlGovernanceClauses}
            />
            
            <ClauseTable 
              title="Cashflow and Returns" 
              clauses={cashflowReturnsClauses}
            />
          </div>
          
          <ReturnsChart />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
