
import React from 'react';
import { LLDData, QuarterSection, Meridian, ConversionError } from '../types';

interface LLDInputFormProps {
  lldData: LLDData;
  onLLDChange: <K extends keyof LLDData>(field: K, value: LLDData[K]) => void;
  onSubmit: () => void;
  onClear: () => void;
  errors: ConversionError[];
  isLoading: boolean;
}

const LLDInputForm: React.FC<LLDInputFormProps> = ({ lldData, onLLDChange, onSubmit, onClear, errors, isLoading }) => {
  
  const getErrorForField = (field: keyof LLDData | 'general'): string | undefined => {
    return errors.find(e => e.field === field)?.message;
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const errorClass = "mt-1 text-xs text-red-500 dark:text-red-400";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6 p-4 md:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="quarterSection" className={labelClass}>Quarter Section (QS)</label>
          <select
            id="quarterSection"
            name="quarterSection"
            value={lldData.quarterSection || ''}
            onChange={(e) => onLLDChange('quarterSection', e.target.value as QuarterSection)}
            className={inputClass}
            disabled={isLoading}
          >
            <option value="" disabled>Select QS</option>
            {Object.values(QuarterSection).map(qs => (
              <option key={qs} value={qs}>{qs}</option>
            ))}
          </select>
          {getErrorForField('quarterSection') && <p className={errorClass}>{getErrorForField('quarterSection')}</p>}
        </div>

        <div>
          <label htmlFor="section" className={labelClass}>Section (Sec)</label>
          <input
            type="number"
            id="section"
            name="section"
            value={lldData.section === null ? '' : lldData.section}
            onChange={(e) => onLLDChange('section', e.target.value === '' ? null : parseInt(e.target.value))}
            min="1"
            max="36"
            placeholder="1-36"
            className={inputClass}
            disabled={isLoading}
          />
          {getErrorForField('section') && <p className={errorClass}>{getErrorForField('section')}</p>}
        </div>

        <div>
          <label htmlFor="township" className={labelClass}>Township (Twp)</label>
          <input
            type="number"
            id="township"
            name="township"
            value={lldData.township === null ? '' : lldData.township}
            onChange={(e) => onLLDChange('township', e.target.value === '' ? null : parseInt(e.target.value))}
            min="1"
            max="126"
            placeholder="1-126"
            className={inputClass}
            disabled={isLoading}
          />
          {getErrorForField('township') && <p className={errorClass}>{getErrorForField('township')}</p>}
        </div>

        <div>
          <label htmlFor="range" className={labelClass}>Range (Rge)</label>
          <input
            type="number"
            id="range"
            name="range"
            value={lldData.range === null ? '' : lldData.range}
            onChange={(e) => onLLDChange('range', e.target.value === '' ? null : parseInt(e.target.value))}
            min="1"
            max="34" // Max typical range
            placeholder="1-34"
            className={inputClass}
            disabled={isLoading}
          />
          {getErrorForField('range') && <p className={errorClass}>{getErrorForField('range')}</p>}
        </div>
        
        <div className="sm:col-span-2">
          <label htmlFor="meridian" className={labelClass}>Meridian (Mer)</label>
          <select
            id="meridian"
            name="meridian"
            value={lldData.meridian === null ? '' : lldData.meridian}
            onChange={(e) => onLLDChange('meridian', e.target.value === '' ? null : parseInt(e.target.value) as Meridian)}
            className={inputClass}
            disabled={isLoading}
          >
            <option value="" disabled>Select Meridian</option>
            <option value={Meridian.W4}>W4M (West of 4th)</option>
            <option value={Meridian.W5}>W5M (West of 5th)</option>
            <option value={Meridian.W6}>W6M (West of 6th)</option>
          </select>
          {getErrorForField('meridian') && <p className={errorClass}>{getErrorForField('meridian')}</p>}
        </div>
      </div>

      {getErrorForField('general') && <p className={`text-center ${errorClass}`}>{getErrorForField('general')}</p>}

      <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-500 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:bg-sky-400"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          Convert to Lat/Long
        </button>
      </div>
    </form>
  );
};

export default LLDInputForm;
    