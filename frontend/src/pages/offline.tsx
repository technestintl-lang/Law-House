import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const OfflinePage: React.FC = () => {
  const router = useRouter();

  const handleRetry = () => {
    // Try to navigate to the dashboard or home page
    if (navigator.onLine) {
      router.push('/dashboard');
    } else {
      // If still offline, show a message
      alert('Still offline. Please check your internet connection and try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Offline | LegisFlow: CEMAC</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              You&apos;re Offline
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Don&apos;t worry, you can still access some features offline.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <p className="text-gray-700">
                LegisFlow: CEMAC works offline, allowing you to:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>View your recent matters</li>
                <li>Check upcoming deadlines</li>
                <li>Track time (will sync when you&apos;re back online)</li>
                <li>Access previously viewed documents</li>
              </ul>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  onClick={handleRetry}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Try again
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={handleRetry}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfflinePage;

