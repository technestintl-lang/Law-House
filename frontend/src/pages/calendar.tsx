import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { DeadlinePriority } from '@shared/types/deadline';

// Mock data for deadlines
const mockDeadlines = [
  {
    id: '1',
    title: 'Motion filing deadline',
    description: 'File motion to dismiss in State v. Johnson',
    dueDate: new Date(2023, 10, 15), // November 15, 2023
    priority: DeadlinePriority.HIGH,
    matterId: '1',
    matterTitle: 'State v. Johnson',
    assignedToId: '1',
    assignedToName: 'James Smith',
    completed: false,
  },
  {
    id: '2',
    title: 'Court hearing',
    description: 'Preliminary hearing in Smith Divorce Case',
    dueDate: new Date(2023, 10, 18), // November 18, 2023
    priority: DeadlinePriority.CRITICAL,
    matterId: '2',
    matterTitle: 'Smith Divorce Case',
    assignedToId: '2',
    assignedToName: 'Emily Johnson',
    completed: false,
  },
  {
    id: '3',
    title: 'Contract review deadline',
    description: 'Complete review of supply agreement for XYZ Enterprises',
    dueDate: new Date(2023, 10, 22), // November 22, 2023
    priority: DeadlinePriority.MEDIUM,
    matterId: '4',
    matterTitle: 'XYZ Enterprises Contract Review',
    assignedToId: '3',
    assignedToName: 'Michael Brown',
    completed: false,
  },
  {
    id: '4',
    title: 'Client meeting',
    description: 'Meeting with ABC Corp regarding trademark registration',
    dueDate: new Date(2023, 10, 25), // November 25, 2023
    priority: DeadlinePriority.LOW,
    matterId: '3',
    matterTitle: 'ABC Corp Trademark Registration',
    assignedToId: '1',
    assignedToName: 'James Smith',
    completed: false,
  },
  {
    id: '5',
    title: 'Property closing',
    description: 'Closing for Global Traders property acquisition',
    dueDate: new Date(2023, 10, 30), // November 30, 2023
    priority: DeadlinePriority.HIGH,
    matterId: '5',
    matterTitle: 'Global Traders Property Acquisition',
    assignedToId: '2',
    assignedToName: 'Emily Johnson',
    completed: false,
  },
];

const getPriorityClass = (priority: DeadlinePriority) => {
  switch (priority) {
    case DeadlinePriority.LOW:
      return 'bg-blue-100 text-blue-800';
    case DeadlinePriority.MEDIUM:
      return 'bg-yellow-100 text-yellow-800';
    case DeadlinePriority.HIGH:
      return 'bg-orange-100 text-orange-800';
    case DeadlinePriority.CRITICAL:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [deadlines, setDeadlines] = useState(mockDeadlines);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const getDeadlinesForDate = (date: Date) => {
    return deadlines.filter(
      (deadline) =>
        deadline.dueDate.getDate() === date.getDate() &&
        deadline.dueDate.getMonth() === date.getMonth() &&
        deadline.dueDate.getFullYear() === date.getFullYear()
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Layout title="Calendar & Deadlines">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div className="flex items-center">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <h2 className="mx-4 text-xl font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Add Deadline
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="grid grid-cols-7 gap-px border-b border-gray-200 bg-gray-200 text-center text-xs font-semibold text-gray-700">
              <div className="py-2">Sun</div>
              <div className="py-2">Mon</div>
              <div className="py-2">Tue</div>
              <div className="py-2">Wed</div>
              <div className="py-2">Thu</div>
              <div className="py-2">Fri</div>
              <div className="py-2">Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {monthDays.map((day, dayIdx) => {
                const dayDeadlines = getDeadlinesForDate(day);
                return (
                  <div
                    key={day.toString()}
                    className={`min-h-[100px] bg-white px-3 py-2 ${
                      !isSameMonth(day, currentMonth) ? 'bg-gray-50 text-gray-400' : ''
                    } ${isToday(day) ? 'bg-blue-50' : ''} ${
                      selectedDate &&
                      day.getDate() === selectedDate.getDate() &&
                      day.getMonth() === selectedDate.getMonth() &&
                      day.getFullYear() === selectedDate.getFullYear()
                        ? 'bg-primary-50'
                        : ''
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <time
                      dateTime={format(day, 'yyyy-MM-dd')}
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        isToday(day) ? 'bg-primary-600 text-white' : ''
                      }`}
                    >
                      {format(day, 'd')}
                    </time>
                    <ol className="mt-2">
                      {dayDeadlines.slice(0, 2).map((deadline) => (
                        <li key={deadline.id} className="mt-1">
                          <div
                            className={`flex items-center rounded px-2 py-1 text-xs font-semibold ${getPriorityClass(
                              deadline.priority
                            )}`}
                          >
                            <span className="truncate">{deadline.title}</span>
                          </div>
                        </li>
                      ))}
                      {dayDeadlines.length > 2 && (
                        <li className="mt-1 text-xs text-gray-500">
                          + {dayDeadlines.length - 2} more
                        </li>
                      )}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Upcoming Deadlines
              </h3>
              <div className="mt-6 flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {deadlines
                    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                    .slice(0, 5)
                    .map((deadline) => (
                      <li key={deadline.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${getPriorityClass(
                                deadline.priority
                              )}`}
                            >
                              {deadline.priority.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {deadline.title}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              {deadline.matterTitle}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="text-sm text-gray-500">
                              {format(deadline.dueDate, 'MMM d, yyyy')}
                            </div>
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

