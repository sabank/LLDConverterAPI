
import React, { useState, useCallback } from 'react';
import { LLDData, Coordinates, QuarterSection, Meridian, ConversionError } from './types';
import LLDInputForm from './components/LLDInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import InfoPanel from './components/InfoPanel';
import { convertLLDToCoordinates } from './services/conversionService';

const initialLLDData: LLDData = {
  quarterSection: '',
  section: null,
  township: null,
  range: null,
  meridian: null,
};

const App: React.FC = () => {
  const [lldData, setLldData] = useState<LLDData>(initialLLDData);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [errors, setErrors] = useState<ConversionError[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLLDChange = useCallback(<K extends keyof LLDData>(field: K, value: LLDData[K]) => {
    setLldData(prev => ({ ...prev, [field]: value }));
    setErrors(prevErrors => prevErrors.filter(e => e.field !== field && e.field !== 'general'));
    setCoordinates(null); // Clear previous results on input change
  }, []);

  const validateLLDData = (): boolean => {
    const newErrors: ConversionError[] = [];
    if (!lldData.quarterSection) newErrors.push({ field: 'quarterSection', message: 'Quarter Section is required.' });
    if (lldData.section === null || lldData.section < 1 || lldData.section > 36) newErrors.push({ field: 'section', message: 'Section must be 1-36.' });
    if (lldData.township === null || lldData.township < 1 || lldData.township > 126) newErrors.push({ field: 'township', message: 'Township must be 1-126.' });
    if (lldData.range === null || lldData.range < 1 || lldData.range > 34) newErrors.push({ field: 'range', message: 'Range must be 1-34 (approx).' }); // Typical max range.
    if (lldData.meridian === null) newErrors.push({ field: 'meridian', message: 'Meridian is required.' });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = useCallback(async () => {
    setCoordinates(null);
    if (!validateLLDData()) {
      return;
    }
    setIsLoading(true);
    setErrors([]);

    // Simulate API call delay for better UX of loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Ensure all parts are present for the conversion function
      if (lldData.quarterSection && lldData.section && lldData.township && lldData.range && lldData.meridian) {
        const result = convertLLDToCoordinates({
            quarterSection: lldData.quarterSection as QuarterSection, // Already validated
            section: lldData.section,
            township: lldData.township,
            range: lldData.range,
            meridian: lldData.meridian as Meridian, // Already validated
        });
        setCoordinates(result);
      } else {
        // This case should ideally be caught by validateLLDData, but as a fallback:
        setErrors([{field: 'general', message: 'Incomplete LLD data. Please fill all fields.'}]);
      }
    } catch (error: any) {
      console.error("Conversion error:", error);
      setErrors([{ field: 'general', message: error.message || "An unexpected error occurred during conversion." }]);
    } finally {
      setIsLoading(false);
    }
  }, [lldData]);

  const handleClear = useCallback(() => {
    setLldData(initialLLDData);
    setCoordinates(null);
    setErrors([]);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <div className="inline-block p-3 bg-sky-600 rounded-lg shadow-md mb-2">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0 0L6.75 12.75M9 15l2.25-2.25M12 18.75h-.75a2.25 2.25 0 01-2.25-2.25v-6a2.25 2.25 0 012.25-2.25h.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25h-.75m0-3l3-3m0 0l3 3m-3-3v11.25" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Alberta LLD to Lat/Long Converter
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Convert Legal Land Descriptions to geographic coordinates.
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <LLDInputForm
            lldData={lldData}
            onLLDChange={handleLLDChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
            errors={errors}
            isLoading={isLoading}
          />
          <ResultsDisplay coordinates={coordinates} isLoading={isLoading && errors.length === 0} />
        </div>
        <div className="lg:col-span-1">
          <InfoPanel />
        </div>
      </main>
      
      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} LLD Converter. For informational purposes only.</p>
        <p>Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
    