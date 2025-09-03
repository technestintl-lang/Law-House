import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { MatterStatus, MatterType } from '@shared/types/matter';

// Mock data for matters
const mockMatters = [
  {
    id: '1',
    title: 'State v. Johnson',
    description: 'Criminal defense case for assault charges',
    status: MatterStatus.ACTIVE,
    type: MatterType.CRIMINAL,
    clientId: '1',
    clientName: 'John Johnson',
    responsibleAttorneyId: '1',
    responsibleAttorneyName: 'James Smith',
    ohadaCaseNumber: 'CR-2023-001',
    courtDetails: 'Douala High Court',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    title: 'Smith Divorce Case',
    description: 'Divorce proceedings and asset division',
    status: MatterStatus.ACTIVE,
    type: MatterType.FAMILY,
    clientId: '2',
    clientName: 'Sarah Smith',
    responsibleAttorneyId: '2',
    responsibleAttorneyName: 'Emily Johnson',
    courtDetails: 'Yaoundé Family Court',
    createdAt: new Date('2023-02-20'),
  },
  {
    id: '3',
    title: 'ABC Corp Trademark Registration',
    description: 'Trademark registration for new product line',
    status: MatterStatus.PENDING,
    type: MatterType.INTELLECTUAL_PROPERTY,
    clientId: '3',
    clientName: 'ABC Corporation',
    responsibleAttorneyId: '1',
    responsibleAttorneyName: 'James Smith',
    ohadaCaseNumber: 'TM-2023-042',
    createdAt: new Date('2023-03-10'),
  },
  {
    id: '4',
    title: 'XYZ Enterprises Contract Review',
    description: 'Review and negotiation of supply agreement',
    status: MatterStatus.ACTIVE,
    type: MatterType.CORPORATE,
    clientId: '4',
    clientName: 'XYZ Enterprises',
    responsibleAttorneyId: '3',
    responsibleAttorneyName: 'Michael Brown',
    createdAt: new Date('2023-04-05'),
  },
  {
    id: '5',
    title: 'Global Traders Property Acquisition',
    description: 'Commercial property purchase in Douala',
    status: MatterStatus.ACTIVE,
    type: MatterType.REAL_ESTATE,
    clientId: '5',
    clientName: 'Global Traders Ltd',
    responsibleAttorneyId: '2',
    responsibleAttorneyName: 'Emily Johnson',
    ohadaCaseNumber: 'RE-2023-015',
    createdAt: new Date('2023-05-12'),
  },
];

export default function Matters() {
  const [matters, setMatters] = useState(mockMatters);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MatterStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<MatterType | 'all'>('all');

  const filteredMatters = matters.filter((matter) => {
    const matchesSearch =
      matter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matter.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (matter.ohadaCaseNumber &&
        matter.ohadaCaseNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || matter.status === statusFilter;
    const matchesType = typeFilter === 'all' || matter.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeClass = (status: MatterStatus) => {
    switch (status) {
      case MatterStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case MatterStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case MatterStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      case MatterStatus.ARCHIVED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Matters">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="mt-4 sm:mt-0">
          <Link
            href="/matters/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Add Matter
          </Link>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Search matters"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            id="status-filter"
            name="status-filter"
            className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as MatterStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value={MatterStatus.ACTIVE}>Active</option>
            <option value={MatterStatus.PENDING}>Pending</option>
            <option value={MatterStatus.CLOSED}>Closed</option>
            <option value={MatterStatus.ARCHIVED}>Archived</option>
          </select>
          <select
            id="type-filter"
            name="type-filter"
            className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MatterType | 'all')}
          >
            <option value="all">All Types</option>
            <option value={MatterType.LITIGATION}>Litigation</option>
            <option value={MatterType.CORPORATE}>Corporate</option>
            <option value={MatterType.REAL_ESTATE}>Real Estate</option>
            <option value={MatterType.INTELLECTUAL_PROPERTY}>Intellectual Property</option>
            <option value={MatterType.FAMILY}>Family</option>
            <option value={MatterType.CRIMINAL}>Criminal</option>
            <option value={MatterType.OTHER}>Other</option>
          </select>
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
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Client
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Case Number
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
                  {filteredMatters.map((matter) => (
                    <tr key={matter.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {matter.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {matter.clientName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {matter.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(
                            matter.status
                          )}`}
                        >
                          {matter.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {matter.ohadaCaseNumber || '-'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/matters/${matter.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View<span className="sr-only">, {matter.title}</span>
                        </Link>
                        <span className="text-gray-300 mx-2">|</span>
                        <Link
                          href={`/matters/${matter.id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit<span className="sr-only">, {matter.title}</span>
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

