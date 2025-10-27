// /api/_utils/types.ts

// Interface for clauses from control/governance and cashflow/economics prompts
export interface Clause {
  name: string;
  summary: string;
}

// Interface for the detailed security/investment calculation data
export interface PayoffDetails {
  securityType: string | null;
  preMoneyValuation: number | null;
  postMoneyValuation: number | null; // Often calculated, but extract if explicitly stated
  investmentAmountCurrentRound: number | null;
  liquidationPreferenceMultiple: number | null; // e.g., 1 for 1x
  isParticipatingPreferred: boolean | null;
  participationCapMultiple: number | null; // e.g., 3 for 3x cap
  dividendRatePercent: number | null; // e.g., 8 for 8%
  isDividendCumulative: boolean | null;
  antiDilutionType: string | null; // e.g., "Broad-Based Weighted Average", "Full Ratchet", "None"
  optionPoolPercent: number | null; // e.g., 15 for 15%
  optionPoolTiming: string | null; // "pre-money", "post-money"
  safeValuationCap: number | null; // For SAFEs/Notes
  safeDiscountPercent: number | null; // e.g., 20 for 20%
  noteInterestRatePercent: number | null; // e.g., 5 for 5%
  noteMaturityMonths: number | null;
  interestConvertsToEquity: boolean | null; // For Notes
}

// Consolidated result structure combining outputs from all prompts
export interface AnalysisResult {
  controlGovernanceClauses: Clause[];
  cashflowReturnsClauses: Clause[];
  payoffDetails: PayoffDetails;
}

// Default structure for PayoffDetails in case of errors
export const defaultPayoffDetails: PayoffDetails = {
    securityType: null,
    preMoneyValuation: null,
    postMoneyValuation: null,
    investmentAmountCurrentRound: null,
    liquidationPreferenceMultiple: null,
    isParticipatingPreferred: null,
    participationCapMultiple: null,
    dividendRatePercent: null,
    isDividendCumulative: null,
    antiDilutionType: null,
    optionPoolPercent: null,
    optionPoolTiming: null,
    safeValuationCap: null,
    safeDiscountPercent: null,
    noteInterestRatePercent: null,
    noteMaturityMonths: null,
    interestConvertsToEquity: null
};