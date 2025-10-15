import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { ReportAnalysis } from './components/ReportAnalysis';
import { Loader } from './components/Loader';
import { Disclaimer } from './components/Disclaimer';
import { analyzeMedicalReport } from './services/geminiService';
import { type AnalysisResult } from './types';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("FileReader result is not a string"));
      }
      const result = reader.result;
      const mimeType = result.substring(5, result.indexOf(';'));
      const base64Data = result.substring(result.indexOf(',') + 1);
      resolve({ mimeType, data: base64Data });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const Hero: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => (
  <div className="text-center py-16 md:py-24 animate-fade-in">
    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
      Understand Your Medical Reports.
      <span className="block text-indigo-600 dark:text-indigo-400 mt-2">Instantly & Securely.</span>
    </h1>
    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
      Upload your medical report, and our AI will simplify complex terms, highlight key findings, and suggest next steps. It's fast, confidential, and easy to use.
    </p>
    <div className="mt-8">
      <button
        onClick={onGetStarted}
        className="inline-flex items-center justify-center px-10 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
      >
        Get Started Now
      </button>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  const steps = [
    { title: "Upload Report", description: "Securely upload an image or PDF of your medical report.", icon: '📤' },
    { title: "AI Analysis", description: "Our advanced AI analyzes the document to extract and simplify key information.", icon: '🔬' },
    { title: "Get Clarity", description: "Receive a clear, easy-to-understand summary and explanation of your results.", icon: '💡' },
  ];
  return (
    <div className="py-16 md:py-24 bg-white dark:bg-gray-800/50 rounded-3xl">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <div key={step.title} className="p-6 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const [appState, setAppState] = useState<'landing' | 'analyzer'>('landing');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setError(null);
  };

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { mimeType, data: base64Data } = await fileToBase64(imageFile);
      const result = await analyzeMedicalReport(base64Data, mimeType);
      setAnalysis(result);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze the report. The model may be unable to process this file or there might be an API error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {appState === 'landing' ? (
          <>
            <Hero onGetStarted={() => setAppState('analyzer')} />
            <HowItWorks />
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Disclaimer />
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mt-8 animate-fade-in">
              <ImageUploader onImageUpload={handleImageUpload} imageUrl={imageUrl} file={imageFile} />
              
              {imageFile && !analysis && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Report'}
                  </button>
                </div>
              )}
            </div>

            {isLoading && <Loader />}
            
            {error && (
              <div className="mt-8 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md shadow-md animate-fade-in" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {analysis && !isLoading && (
              <div className="mt-8">
                <ReportAnalysis analysis={analysis} onReset={handleReset} />
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}