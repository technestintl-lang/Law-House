import React from 'react';
import Link from 'next/link';

interface CardProps {
  title: string;
  value: string;
  icon: string;
  href: string;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

const Card: React.FC<CardProps> = ({ title, value, icon, href, color = 'primary' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary-500 text-white';
      case 'secondary':
        return 'bg-secondary-500 text-white';
      case 'success':
        return 'bg-success-500 text-white';
      case 'danger':
        return 'bg-danger-500 text-white';
      case 'warning':
        return 'bg-warning-500 text-white';
      default:
        return 'bg-primary-500 text-white';
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'document':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'folder':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
    }
  };

  return (
    <Link href={href}>
      <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300">
        <div className="p-5">
          <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-md p-3 ${getColorClasses()}`}>
              {getIcon()}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{value}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-primary-600 hover:text-primary-500">
              View all
              <span className="sr-only"> {title}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;

