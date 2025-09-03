import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PlayIcon, PauseIcon, PlusIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

// Mock data for time entries
const mockTimeEntries = [
  {
    id: '1',
    description: 'Research for motion to dismiss',
    duration: 5400, // 1.5 hours in seconds
    date: new Date(2023, 10, 1), // November 1, 2023
    matterId: '1',
    matterTitle: 'State v. Johnson',
    userId: '1',
    userName: 'James Smith',
    billable: true,
    billed: false,
  },
  {
    id: '2',
    description: 'Client meeting regarding divorce proceedings',
    duration: 3600, // 1 hour in seconds
    date: new Date(2023, 10, 2), // November 2, 2023
    matterId: '2',
    matterTitle: 'Smith Divorce Case',
    userId: '2',
    userName: 'Emily Johnson',
    billable: true,
    billed: false,
  },
  {
    id: '3',
    description: 'Trademark search and analysis',
    duration: 7200, // 2 hours in seconds
    date: new Date(2023, 10, 3), // November 3, 2023
    matterId: '3',
    matterTitle: 'ABC Corp Trademark Registration',
    userId: '1',
    userName: 'James Smith',
    billable: true,
    billed: false,
  },
  {
    id: '4',
    description: 'Contract review and markup',
    duration: 10800, // 3 hours in seconds
    date: new Date(2023, 10, 4), // November 4, 2023
    matterId: '4',
    matterTitle: 'XYZ Enterprises Contract Review',
    userId: '3',
    userName: 'Michael Brown',
    billable: true,
    billed: false,
  },
  {
    id: '5',
    description: 'Property title search',
    duration: 5400, // 1.5 hours in seconds
    date: new Date(2023, 10, 5), // November 5, 2023
    matterId: '5',
    matterTitle: 'Global Traders Property Acquisition',
    userId: '2',
    userName: 'Emily Johnson',
    billable: true,
    billed: false,
  },
];

// Mock data for matters
const mockMatters = [
  { id: '1', title: 'State v. Johnson' },
  { id: '2', title: 'Smith Divorce Case' },
  { id: '3', title: 'ABC Corp Trademark Registration' },
  { id: '4', title: 'XYZ Enterprises Contract Review' },
  { id: '5', title: 'Global Traders Property Acquisition' },
];

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function TimeTracking() {
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries);
  const [matters, setMatters] = useState(mockMatters);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [selectedMatterId, setSelectedMatterId] = useState('');
  const [description, setDescription] = useState('');
  const [billable, setBillable] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((seconds) => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTimer = () => {
    if (selectedMatterId) {
      setIsTimerRunning(true);
    } else {
      alert('Please select a matter before starting the timer.');
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setDescription('');
  };

  const saveTimeEntry = () => {
    if (!selectedMatterId || !description || timerSeconds === 0) {
      alert('Please fill in all fields and ensure the timer has run for at least 1 second.');
      return;
    }

    const selectedMatter = matters.find((matter) => matter.id === selectedMatterId);
    
    const newTimeEntry = {
      id: Date.now().toString(),
      description,
      duration: timerSeconds,
      date: new Date(),
      matterId: selectedMatterId,
      matterTitle: selectedMatter?.title || '',
      userId: '1', // Assuming current user
      userName: 'James Smith', // Assuming current user
      billable,
      billed: false,
    };

    setTimeEntries([newTimeEntry, ...timeEntries]);
    resetTimer();
  };

  const totalBillableHours = timeEntries
    .filter((entry) => entry.billable)
    .reduce((total, entry) => total + entry.duration, 0) / 3600;

  const totalUnbilledHours = timeEntries
    .filter((entry) => entry.billable && !entry.billed)
    .reduce((total, entry) => total + entry.duration, 0) / 3600;

  return (
    <Layout title="Time Tracking">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Billable Hours"
          value={totalBillableHours.toFixed(2)}
          color="primary"
          footer="This month"
        />
        <Card
          title="Unbilled Hours"
          value={totalUnbilledHours.toFixed(2)}
          color="secondary"
          footer="Ready to invoice"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Timer */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Timer</h3>
              <div className="mt-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">
                    {formatDuration(timerSeconds)}
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="matter" className="block text-sm font-medium text-gray-700">
                      Matter
                    </label>
                    <select
                      id="matter"
                      name="matter"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={selectedMatterId}
                      onChange={(e) => setSelectedMatterId(e.target.value)}
                      disabled={isTimerRunning}
                    >
                      <option value="">Select a matter</option>
                      {matters.map((matter) => (
                        <option key={matter.id} value={matter.id}>
                          {matter.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="What are you working on?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="billable"
                      name="billable"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={billable}
                      onChange={(e) => setBillable(e.target.checked)}
                    />
                    <label htmlFor="billable" className="ml-2 block text-sm text-gray-900">
                      Billable
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    {!isTimerRunning ? (
                      <button
                        type="button"
                        onClick={startTimer}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        <PlayIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                        Start
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={pauseTimer}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-danger-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
                      >
                        <PauseIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                        Pause
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={saveTimeEntry}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-success-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2"
                      disabled={isTimerRunning || timerSeconds === 0}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={resetTimer}
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent time entries */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Time Entries</h3>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                    Add Manual Entry
                  </button>
                </div>
              </div>
              <div className="mt-6 flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {timeEntries.map((entry) => (
                    <li key={entry.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {entry.description}
                          </p>
                          <p className="truncate text-sm text-gray-500">{entry.matterTitle}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatDuration(entry.duration)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(entry.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  View all
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

