import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Card from '../components/Card';

// Mock data for the dashboard
const mockStats = {
  activeMatters: 12,
  upcomingDeadlines: 5,
  unbilledHours: 23.5,
  recentDocuments: 8,
};

const mockDeadlines = [
  { id: '1', title: 'File Appeal Brief', dueDate: new Date(Date.now() + 86400000 * 2), priority: 'high', matter: 'Smith v. Johnson' },
  { id: '2', title: 'Client Meeting', dueDate: new Date(Date.now() + 86400000 * 1), priority: 'medium', matter: 'ABC Corp Merger' },
  { id: '3', title: 'Submit Trademark Application', dueDate: new Date(Date.now() + 86400000 * 5), priority: 'medium', matter: 'XYZ Brand Protection' },
];

const mockRecentMatters = [
  { id: '1', title: 'Smith v. Johnson', status: 'active', client: 'John Smith', lastUpdated: new Date(Date.now() - 86400000 * 1) },
  { id: '2', title: 'ABC Corp Merger', status: 'active', client: 'ABC Corporation', lastUpdated: new Date(Date.now() - 86400000 * 2) },
  { id: '3', title: 'XYZ Brand Protection', status: 'pending', client: 'XYZ Inc.', lastUpdated: new Date(Date.now() - 86400000 * 3) },
];

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);
  const [deadlines, setDeadlines] = useState(mockDeadlines);
  const [recentMatters, setRecentMatters] = useState(mockRecentMatters);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard | LegisFlow: CEMAC</title>
      </Head>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card
              title="Active Matters"
              value={stats.activeMatters.toString()}
              icon="document"
              href="/matters"
            />
            <Card
              title="Upcoming Deadlines"
              value={stats.upcomingDeadlines.toString()}
              icon="calendar"
              href="/calendar"
              color="danger"
            />
            <Card
              title="Unbilled Hours"
              value={stats.unbilledHours.toString()}
              icon="clock"
              href="/time-tracking"
              color="success"
            />
            <Card
              title="Recent Documents"
              value={stats.recentDocuments.toString()}
              icon="folder"
              href="/documents"
              color="secondary"
            />
          </div>

          {/* Upcoming Deadlines */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Due Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Priority
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Matter
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {deadlines.map((deadline) => (
                    <tr key={deadline.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {deadline.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(deadline.dueDate)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          deadline.priority === 'high' 
                            ? 'bg-danger-100 text-danger-800' 
                            : deadline.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {deadline.priority}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {deadline.matter}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Matters */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Recent Matters</h2>
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Client
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentMatters.map((matter) => (
                    <tr key={matter.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {matter.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          matter.status === 'active' 
                            ? 'bg-success-100 text-success-800' 
                            : matter.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {matter.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {matter.client}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(matter.lastUpdated)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

