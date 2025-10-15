
export interface KeyFinding {
  term: string;
  explanation: string;
}

export interface AnalysisResult {
  summary: string;
  keyFindings: KeyFinding[];
  potentialProblems: string[];
  recommendedActions: string[];
}
