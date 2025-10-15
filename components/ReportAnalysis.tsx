import React from 'react';
import { type AnalysisResult, type KeyFinding } from '../types';

const SectionCard: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div className="p-5 md:p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-lg p-3">
          {icon}
        </div>
        <h3 className="ml-4 text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
      </div>
      <div className="mt-4 text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </div>
  </div>
);

const SummaryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>);
const FindingsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>);
const ProblemsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>);
const ActionsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>);

export const ReportAnalysis: React.FC<{ analysis: AnalysisResult, onReset: () => void }> = ({ analysis, onReset }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">Analysis Results</h2>

      <SectionCard title="Simplified Summary" icon={<SummaryIcon />}>
        <p className="text-base">{analysis.summary}</p>
      </SectionCard>

      <SectionCard title="Key Findings Explained" icon={<FindingsIcon />}>
        <ul className="space-y-4">
          {analysis.keyFindings.map((finding: KeyFinding, index: number) => (
            <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="font-semibold text-gray-800 dark:text-gray-100">{finding.term}</p>
              <p className="mt-1 text-sm">{finding.explanation}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Potential Concerns" icon={<ProblemsIcon />}>
        <ul className="list-disc list-inside space-y-2">
          {analysis.potentialProblems.map((problem: string, index: number) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Recommended Next Steps" icon={<ActionsIcon />}>
        <ul className="list-disc list-inside space-y-2">
          {analysis.recommendedActions.map((action: string, index: number) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </SectionCard>

      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
        >
          Analyze Another Report
        </button>
      </div>
    </div>
  );
};