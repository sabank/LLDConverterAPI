
import React, { useState } from 'react';

const InfoPanel: React.FC = () => {
  const [showDeployment, setShowDeployment] = useState(false);
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [showPythonNote, setShowPythonNote] = useState(false);

  const DisclosureButton: React.FC<{onClick: () => void; isOpen: boolean; children: React.ReactNode}> = ({ onClick, isOpen, children }) => (
    <button
      onClick={onClick}
      className="flex justify-between items-center w-full text-left px-4 py-2 text-sm font-medium text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-gray-700 hover:bg-sky-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75"
    >
      {children}
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  );

  const PanelContent: React.FC<{isVisible: boolean; children: React.ReactNode}> = ({ isVisible, children }) => (
    <div className={`mt-2 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700_ rounded-b-lg ${isVisible ? 'block' : 'hidden'}`}>
      {children}
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Alberta Township Survey (ATS) System</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          The Alberta Township Survey system is a grid network used to divide land into equal-sized parcels. A Legal Land Description (LLD) uniquely identifies a parcel. Example: <strong className="text-sky-600 dark:text-sky-400">NE-36-87-18-W4</strong> (QS-Sec-Twp-Rge-Mer).
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
          <li><strong>Meridian (Mer):</strong> Designated west of the 4th (110°W), 5th (114°W), or 6th (118°W) Meridians.</li>
          <li><strong>Range (Rge):</strong> Six-mile-wide columns, numbered W to E between meridians. Range 1 is immediately west of a meridian.</li>
          <li><strong>Township (Twp):</strong> Six-mile-wide rows, numbered N from Twp 1 at the Montana border (49°N) to Twp 126.</li>
          <li><strong>Section (Sec):</strong> A township is divided into 36 one-mile-square sections.</li>
          <li><strong>Quarter Section (QS):</strong> Sections are often divided into NE, NW, SE, SW quarter sections. This tool calculates to QS centroid.</li>
        </ul>
      </div>

      <div>
        <DisclosureButton onClick={() => setShowAccuracy(!showAccuracy)} isOpen={showAccuracy}>
          Centroid vs. Survey-Grade Accuracy
        </DisclosureButton>
        <PanelContent isVisible={showAccuracy}>
          <p className="mb-2">This tool calculates the <strong>centroid</strong> (geometric center) of the specified Quarter Section based on an idealized grid system.</p>
          <p className="mb-2"><strong>Survey-grade accuracy</strong> provides much higher precision by:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Using precise ground measurements with specialized GPS and survey equipment.</li>
              <li>Referencing official survey monuments and geodetic control networks.</li>
              <li>Accounting for local terrain variations, actual boundary evidence, and historical survey data.</li>
            </ul>
          </p>
          <p>Obtaining survey-grade coordinates requires hiring a licensed Alberta Land Surveyor. The results from this tool are for informational and planning purposes only and should not be used for legal boundary determination or precise navigation.</p>
        </PanelContent>
      </div>
      
      <div>
        <DisclosureButton onClick={() => setShowPythonNote(!showPythonNote)} isOpen={showPythonNote}>
          Backend API and Python Implementation
        </DisclosureButton>
        <PanelContent isVisible={showPythonNote}>
          <p className="mb-2">The conversion logic in this application (found in `services/conversionService.ts`) is implemented in TypeScript for client-side execution.</p>
          <p className="mb-2">For use in other systems (e.g., ArcGIS, backend services), this logic can be readily ported to Python. A Python implementation would involve:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Defining similar constants for meridians, base latitude, and dimensions.</li>
              <li>Implementing the mathematical formulas for coordinate calculation based on LLD components.</li>
              <li>Exposing this logic via a Python web framework (like Flask or FastAPI) to create an API endpoint that accepts LLDs and returns coordinates.</li>
            </ul>
          </p>
          <p>This approach is recommended if you need to integrate LLD conversion into a larger Python-based GIS workflow or backend system.</p>
        </PanelContent>
      </div>

      <div>
        <DisclosureButton onClick={() => setShowDeployment(!showDeployment)} isOpen={showDeployment}>
          Project Deployment (GitHub Pages)
        </DisclosureButton>
        <PanelContent isVisible={showDeployment}>
          <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Storing, Building, and Deploying this React App using GitHub Pages:</h4>
          <p className="mb-2">This application is a static React app, suitable for deployment on GitHub Pages.</p>
          <strong className="text-gray-700 dark:text-gray-200">Initial Setup (if not already done):</strong>
          <ol className="list-decimal list-inside ml-4 space-y-1 my-2">
            <li>Ensure you have Node.js and npm (or yarn) installed.</li>
            <li>Initialize a Git repository in your project folder: `git init`</li>
            <li>Create a GitHub repository and link your local repository to it:
              <ul className="list-disc list-inside ml-6">
                  <li>`git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git`</li>
                  <li>`git branch -M main`</li>
              </ul>
            </li>
             <li>Install project dependencies (if a `package.json` with dependencies like Vite is used for building): `npm install` (or `yarn install`). For this standalone set of files, you might be using a simple build step or direct deployment. Assuming a build step is desired for optimization/bundling:</li>
          </ol>

          <strong className="text-gray-700 dark:text-gray-200">Using Vite for Building (Recommended for React):</strong>
           <ol className="list-decimal list-inside ml-4 space-y-1 my-2">
            <li>If not already set up, install Vite: `npm create vite@latest my-lld-app -- --template react-ts` (then move these generated files into that structure, or adapt).</li>
            <li>Install `gh-pages` package: `npm install gh-pages --save-dev`</li>
            <li>In your `package.json`, add `homepage` (e.g., `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`) and update scripts:
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs my-1 overflow-x-auto">{`
"scripts": {
  // ... other scripts
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
},
"homepage": "https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/"
              `}</pre>
            </li>
            <li>In `vite.config.ts`, set the `base` option for correct asset pathing on GitHub Pages:
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs my-1 overflow-x-auto">{`
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/YOUR_REPOSITORY_NAME/' // Important!
})
              `}</pre>
            </li>
          </ol>
          
          <strong className="text-gray-700 dark:text-gray-200">Deployment Steps:</strong>
          <ol className="list-decimal list-inside ml-4 space-y-1 my-2">
            <li>Commit your changes to the `main` branch:
              <ul className="list-disc list-inside ml-6">
                <li>`git add .`</li>
                <li>`git commit -m "Deploy to GitHub Pages"`</li>
                <li>`git push origin main`</li>
              </ul>
            </li>
            <li>Run the deploy script (if using Vite and `gh-pages` as above): `npm run deploy`. This will build the app and push the contents of the `dist` folder to a `gh-pages` branch on GitHub.</li>
            <li>Go to your GitHub repository settings, navigate to the "Pages" section.</li>
            <li>Select the `gh-pages` branch as the source and `/ (root)` folder. Save.</li>
            <li>Your site should be live at the URL specified in `homepage` after a few minutes.</li>
          </ol>
          <p className="mt-2"><strong>Note:</strong> If not using a build tool like Vite, you would manually push your static files (HTML, JS bundles, assets) to the `gh-pages` branch or configure GitHub Pages to serve from your `main` branch's `/docs` folder or `/ (root)` if your `index.html` is at the root.</p>
        </PanelContent>
      </div>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-8">
        LLD Information based on Alberta Township Survey System. Source: Government of Alberta.
      </p>
    </div>
  );
};

export default InfoPanel;
    