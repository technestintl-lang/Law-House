import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';

// Mock data for clients
const mockClients = [
  {
    id: '1',
    name: 'ABC Corporation',
    email: 'contact@abccorp.com',
    phone: '+237 123 456 789',
    address: 'Douala, Cameroon',
    contactPerson: 'John Doe',
  },
  {
    id: '2',
    name: 'XYZ Enterprises',
    email: 'info@xyzent.com',
    phone: '+237 987 654 321',
    address: 'Yaoundé, Cameroon',
    contactPerson: 'Jane Smith',
  },
  {
    id: '3',
    name: 'Global Traders Ltd',
    email: 'contact@globaltraders.com',
    phone: '+237 456 789 123',
    address: 'Limbe, Cameroon',
    contactPerson: 'Robert Johnson',
  },
  {
    id: '4',
    name: 'Tech Innovations',
    email: 'info@techinnovations.com',
    phone: '+237 789 123 456',
    address: 'Buea, Cameroon',
    contactPerson: 'Sarah Williams',
  },
  {
    id: '5',
    name: 'Cameroon Exports',
    email: 'exports@cameroon.com',
    phone: '+237 234 567 890',
    address: 'Kribi, Cameroon',
    contactPerson: 'Michael Brown',
  },
];

export default function Clients() {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Clients">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="mt-4 sm:mt-0">
          <Link
            href="/clients/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Add Client
          </Link>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Search clients"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Contact Person
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {client.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {client.contactPerson}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {client.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {client.phone}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/clients/${client.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View<span className="sr-only">, {client.name}</span>
                        </Link>
                        <span className="text-gray-300 mx-2">|</span>
                        <Link
                          href={`/clients/${client.id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit<span className="sr-only">, {client.name}</span>
                        </Link>
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
}

