import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  EyeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { InvoiceStatus } from '@shared/types/invoice';

// Mock data for invoices
const mockInvoices = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    clientId: '1',
    clientName: 'ABC Corporation',
    matterId: '3',
    matterTitle: 'ABC Corp Trademark Registration',
    issueDate: new Date(2023, 10, 1), // November 1, 2023
    dueDate: new Date(2023, 10, 15), // November 15, 2023
    status: InvoiceStatus.SENT,
    subtotal: 500000, // 500,000 XAF
    tax: 95000, // 95,000 XAF (19% VAT)
    total: 595000, // 595,000 XAF
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-002',
    clientId: '2',
    clientName: 'XYZ Enterprises',
    matterId: '4',
    matterTitle: 'XYZ Enterprises Contract Review',
    issueDate: new Date(2023, 10, 5), // November 5, 2023
    dueDate: new Date(2023, 10, 19), // November 19, 2023
    status: InvoiceStatus.VIEWED,
    subtotal: 750000, // 750,000 XAF
    tax: 142500, // 142,500 XAF (19% VAT)
    total: 892500, // 892,500 XAF
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-003',
    clientId: '5',
    clientName: 'Global Traders Ltd',
    matterId: '5',
    matterTitle: 'Global Traders Property Acquisition',
    issueDate: new Date(2023, 10, 10), // November 10, 2023
    dueDate: new Date(2023, 10, 24), // November 24, 2023
    status: InvoiceStatus.DRAFT,
    subtotal: 1200000, // 1,200,000 XAF
    tax: 228000, // 228,000 XAF (19% VAT)
    total: 1428000, // 1,428,000 XAF
  },
  {
    id: '4',
    invoiceNumber: 'INV-2023-004',
    clientId: '1',
    clientName: 'John Johnson',
    matterId: '1',
    matterTitle: 'State v. Johnson',
    issueDate: new Date(2023, 9, 15), // October 15, 2023
    dueDate: new Date(2023, 9, 29), // October 29, 2023
    status: InvoiceStatus.PAID,
    subtotal: 350000, // 350,000 XAF
    tax: 66500, // 66,500 XAF (19% VAT)
    total: 416500, // 416,500 XAF
  },
  {
    id: '5',
    invoiceNumber: 'INV-2023-005',
    clientId: '2',
    clientName: 'Sarah Smith',
    matterId: '2',
    matterTitle: 'Smith Divorce Case',
    issueDate: new Date(2023, 9, 20), // October 20, 2023
    dueDate: new Date(2023, 10, 3), // November 3, 2023
    status: InvoiceStatus.OVERDUE,
    subtotal: 600000, // 600,000 XAF
    tax: 114000, // 114,000 XAF (19% VAT)
    total: 714000, // 714,000 XAF
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusIcon = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return <ClockIcon className="h-5 w-5 text-gray-400" />;
    case InvoiceStatus.SENT:
      return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
    case InvoiceStatus.VIEWED:
      return <EyeIcon className="h-5 w-5 text-purple-500" />;
    case InvoiceStatus.PAID:
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case InvoiceStatus.OVERDUE:
      return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
    case InvoiceStatus.CANCELLED:
      return <XCircleIcon className="h-5 w-5 text-gray-500" />;
    default:
      return null;
  }
};

const getStatusBadgeClass = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return 'bg-gray-100 text-gray-800';
    case InvoiceStatus.SENT:
      return 'bg-blue-100 text-blue-800';
    case InvoiceStatus.VIEWED:
      return 'bg-purple-100 text-purple-800';
    case InvoiceStatus.PAID:
      return 'bg-green-100 text-green-800';
    case InvoiceStatus.OVERDUE:
      return 'bg-red-100 text-red-800';
    case InvoiceStatus.CANCELLED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function Invoices() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.matterTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = filteredInvoices
    .filter((invoice) => invoice.status !== InvoiceStatus.PAID && invoice.status !== InvoiceStatus.CANCELLED)
    .reduce((total, invoice) => total + invoice.total, 0);

  const totalOverdue = filteredInvoices
    .filter((invoice) => invoice.status === InvoiceStatus.OVERDUE)
    .reduce((total, invoice) => total + invoice.total, 0);

  return (
    <Layout title="Invoices">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="mt-4 sm:mt-0">
          <Link
            href="/invoices/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Create Invoice
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
              placeholder="Search invoices"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            id="status-filter"
            name="status-filter"
            className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value={InvoiceStatus.DRAFT}>Draft</option>
            <option value={InvoiceStatus.SENT}>Sent</option>
            <option value={InvoiceStatus.VIEWED}>Viewed</option>
            <option value={InvoiceStatus.PAID}>Paid</option>
            <option value={InvoiceStatus.OVERDUE}>Overdue</option>
            <option value={InvoiceStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Outstanding</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(totalOutstanding)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Overdue</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(totalOverdue)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
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
                      Invoice Number
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
                      Matter
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Issue Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Due Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
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
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {invoice.clientName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {invoice.matterTitle}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(invoice.issueDate, 'MMM d, yyyy')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(invoice.dueDate, 'MMM d, yyyy')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center">
                          {getStatusIcon(invoice.status)}
                          <span
                            className={`ml-1.5 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View<span className="sr-only">, {invoice.invoiceNumber}</span>
                        </Link>
                        <span className="text-gray-300 mx-2">|</span>
                        <Link
                          href={`/invoices/${invoice.id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit<span className="sr-only">, {invoice.invoiceNumber}</span>
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

