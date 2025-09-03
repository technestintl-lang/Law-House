import { useState } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  DocumentDuplicateIcon,
  DocumentIcon,
  DocumentChartBarIcon,
  EnvelopeIcon,
  ScaleIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { DocumentType } from '@shared/types/document';

// Mock data for documents
const mockDocuments = [
  {
    id: '1',
    name: 'Motion to Dismiss.docx',
    description: 'Motion to dismiss charges in State v. Johnson',
    type: DocumentType.PLEADING,
    matterId: '1',
    matterTitle: 'State v. Johnson',
    fileSize: 245760, // 240 KB
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedById: '1',
    uploadedByName: 'James Smith',
    isTemplate: false,
    createdAt: new Date(2023, 10, 1), // November 1, 2023
  },
  {
    id: '2',
    name: 'Divorce Settlement Agreement.docx',
    description: 'Draft settlement agreement for Smith divorce',
    type: DocumentType.CONTRACT,
    matterId: '2',
    matterTitle: 'Smith Divorce Case',
    fileSize: 368640, // 360 KB
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedById: '2',
    uploadedByName: 'Emily Johnson',
    isTemplate: false,
    createdAt: new Date(2023, 10, 2), // November 2, 2023
  },
  {
    id: '3',
    name: 'Trademark Application.pdf',
    description: 'Completed trademark application for ABC Corp',
    type: DocumentType.PLEADING,
    matterId: '3',
    matterTitle: 'ABC Corp Trademark Registration',
    fileSize: 512000, // 500 KB
    fileType: 'application/pdf',
    uploadedById: '1',
    uploadedByName: 'James Smith',
    isTemplate: false,
    createdAt: new Date(2023, 10, 3), // November 3, 2023
  },
  {
    id: '4',
    name: 'Supply Agreement - Marked Up.docx',
    description: 'Reviewed and marked up supply agreement',
    type: DocumentType.CONTRACT,
    matterId: '4',
    matterTitle: 'XYZ Enterprises Contract Review',
    fileSize: 409600, // 400 KB
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedById: '3',
    uploadedByName: 'Michael Brown',
    isTemplate: false,
    createdAt: new Date(2023, 10, 4), // November 4, 2023
  },
  {
    id: '5',
    name: 'Property Title Search Results.pdf',
    description: 'Title search results for commercial property',
    type: DocumentType.EVIDENCE,
    matterId: '5',
    matterTitle: 'Global Traders Property Acquisition',
    fileSize: 1048576, // 1 MB
    fileType: 'application/pdf',
    uploadedById: '2',
    uploadedByName: 'Emily Johnson',
    isTemplate: false,
    createdAt: new Date(2023, 10, 5), // November 5, 2023
  },
  {
    id: '6',
    name: 'Power of Attorney Template.docx',
    description: 'Standard power of attorney template',
    type: DocumentType.TEMPLATE,
    fileSize: 153600, // 150 KB
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedById: '1',
    uploadedByName: 'James Smith',
    isTemplate: true,
    createdAt: new Date(2023, 9, 15), // October 15, 2023
  },
  {
    id: '7',
    name: 'OHADA Compliant Articles of Incorporation.docx',
    description: 'Template for OHADA compliant articles of incorporation',
    type: DocumentType.TEMPLATE,
    fileSize: 204800, // 200 KB
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedById: '3',
    uploadedByName: 'Michael Brown',
    isTemplate: true,
    createdAt: new Date(2023, 9, 20), // October 20, 2023
  },
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
};

const getDocumentTypeIcon = (type: DocumentType) => {
  switch (type) {
    case DocumentType.CONTRACT:
      return <DocumentTextIcon className="h-6 w-6 text-primary-600" />;
    case DocumentType.PLEADING:
      return <ScaleIcon className="h-6 w-6 text-danger-600" />;
    case DocumentType.CORRESPONDENCE:
      return <EnvelopeIcon className="h-6 w-6 text-secondary-600" />;
    case DocumentType.COURT_ORDER:
      return <DocumentChartBarIcon className="h-6 w-6 text-success-600" />;
    case DocumentType.EVIDENCE:
      return <ArchiveBoxIcon className="h-6 w-6 text-yellow-600" />;
    case DocumentType.TEMPLATE:
      return <DocumentDuplicateIcon className="h-6 w-6 text-purple-600" />;
    default:
      return <DocumentIcon className="h-6 w-6 text-gray-600" />;
  }
};

export default function Documents() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [showTemplatesOnly, setShowTemplatesOnly] = useState(false);

  const filteredDocuments = documents.filter((document) => {
    const matchesSearch =
      document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (document.matterTitle && document.matterTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || document.type === typeFilter;
    const matchesTemplate = showTemplatesOnly ? document.isTemplate : true;

    return matchesSearch && matchesType && matchesTemplate;
  });

  return (
    <Layout title="Documents">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="mt-4 sm:mt-0">
          <Link
            href="/documents/upload"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Upload Document
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
              placeholder="Search documents"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            id="type-filter"
            name="type-filter"
            className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'all')}
          >
            <option value="all">All Types</option>
            <option value={DocumentType.CONTRACT}>Contracts</option>
            <option value={DocumentType.PLEADING}>Pleadings</option>
            <option value={DocumentType.CORRESPONDENCE}>Correspondence</option>
            <option value={DocumentType.COURT_ORDER}>Court Orders</option>
            <option value={DocumentType.EVIDENCE}>Evidence</option>
            <option value={DocumentType.TEMPLATE}>Templates</option>
            <option value={DocumentType.OTHER}>Other</option>
          </select>
          <div className="flex items-center">
            <input
              id="templates-only"
              name="templates-only"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              checked={showTemplatesOnly}
              onChange={(e) => setShowTemplatesOnly(e.target.checked)}
            />
            <label htmlFor="templates-only" className="ml-2 block text-sm text-gray-900">
              Templates Only
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((document) => (
          <div
            key={document.id}
            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow"
          >
            <div className="flex flex-1 flex-col p-8">
              <div className="flex items-center space-x-3">
                {getDocumentTypeIcon(document.type)}
                <h3 className="truncate text-sm font-medium text-gray-900">{document.type}</h3>
                {document.isTemplate && (
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    Template
                  </span>
                )}
              </div>
              <div className="mt-4 flex-grow">
                <h3 className="text-lg font-medium text-gray-900 truncate">{document.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{document.description}</p>
              </div>
              {document.matterTitle && (
                <p className="mt-2 text-sm text-gray-500">
                  <span className="font-medium">Matter:</span> {document.matterTitle}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                <span className="font-medium">Size:</span> {formatFileSize(document.fileSize)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-medium">Uploaded by:</span> {document.uploadedByName}
              </p>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <Link
                    href={`/documents/${document.id}`}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    View
                  </Link>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <Link
                    href={`/documents/${document.id}/download`}
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    Download
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

