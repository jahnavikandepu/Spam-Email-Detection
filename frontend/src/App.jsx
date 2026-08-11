import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EmailAnalyzer from './components/EmailAnalyzer';
import ResultCard from './components/ResultCard';
import ExampleEmails from './components/ExampleEmails';
import HistoryTable from './components/HistoryTable';
import AboutSection from './components/AboutSection';

import { predictEmail } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' | 'history' | 'about'
  const [emailText, setEmailText] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzerRef = useRef(null);

  // Focus/scroll to Email Analyzer card
  const scrollToAnalyzer = () => {
    if (analyzerRef.current) {
      analyzerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Run spam analysis via Node.js Express REST API -> Python FastAPI ML Service
  const handleAnalyze = async () => {
    if (!emailText || !emailText.trim()) {
      setError('Please enter or paste email content to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const result = await predictEmail(emailText);
      setPredictionResult(result);
    } catch (err) {
      console.error('Error analyzing email:', err);
      setError(err.message || 'An error occurred while analyzing the email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Example click handler: populates textarea ONLY without auto-predicting
  const handleSelectExample = (content) => {
    setEmailText(content);
    setPredictionResult(null);
    setError(null);
    scrollToAnalyzer();
  };

  // Load history item back into analyzer
  const handleSelectHistoryItem = (fullContent) => {
    setEmailText(fullContent);
    setPredictionResult(null);
    setError(null);
    setActivePage('home');
    setTimeout(() => {
      scrollToAnalyzer();
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      {/* Top Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage}
        onCheckEmailClick={scrollToAnalyzer}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <>
            {/* Hero Banner */}
            <Hero />

            {/* Email Analyzer Form Card */}
            <EmailAnalyzer
              ref={analyzerRef}
              emailText={emailText}
              setEmailText={setEmailText}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              error={error}
              setError={setError}
            />

            {/* Prediction Result Card */}
            {predictionResult && (
              <ResultCard 
                result={predictionResult} 
                onReset={() => setPredictionResult(null)}
              />
            )}

            {/* Example Emails Preset Buttons */}
            <ExampleEmails 
              onSelectExample={handleSelectExample} 
            />
          </>
        )}

        {activePage === 'history' && (
          <HistoryTable 
            onSelectHistoryItem={handleSelectHistoryItem}
          />
        )}

        {activePage === 'about' && (
          <AboutSection />
        )}
      </main>
    </div>
  );
}
