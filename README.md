# LegisFlow: CEMAC

Legal Practice Management SaaS for the CEMAC Region

## Overview

LegisFlow: CEMAC is a cloud-based, offline-first legal practice management SaaS platform specifically designed for small-to-medium law firms in Cameroon and the broader CEMAC region. It addresses critical pain points—document automation, deadline management, time tracking, and client communication—through a bilingual (French/English), affordable, and low-bandwidth-optimized interface.

## Features

- **Matter & Client Management**: Centralized dashboard for all cases/matters
- **Document Automation**: Generate legal documents from templates
- **Time Tracking & Billing**: Track billable hours and generate invoices
- **Smart Calendar & Deadline Manager**: Rule-based deadline calculator with alerts
- **Client Portal**: Secure access for clients to view matter status
- **Offline Support**: Continue working without internet connection
- **Mobile Optimized**: Progressive Web App (PWA) for mobile access

## Tech Stack

- **Backend**: Node.js with NestJS framework
- **Frontend**: React.js with Next.js
- **Mobile**: Progressive Web App (PWA)
- **Database**: PostgreSQL
- **Storage**: S3-Compatible Object Storage (MinIO)
- **Offline & Sync**: PouchDB/CouchDB replication protocol
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js (v16+)
- Docker and Docker Compose
- PostgreSQL (optional if using Docker)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/legisflow-cemac.git
   cd legisflow-cemac
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development environment:
   ```bash
   docker-compose up -d
   ```

5. Access the application:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000/api
   - API Documentation: http://localhost:3000/api/docs
   - MinIO Console: http://localhost:9001

## Development

### Project Structure

```
legisflow-cemac/
├── backend/           # NestJS backend
├── frontend/          # Next.js frontend
├── shared/            # Shared types and utilities
├── docker-compose.yml # Docker configuration
└── package.json       # Root package.json for workspaces
```

### Running in Development Mode

```bash
# Start all services
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend
```

### Building for Production

```bash
# Build all packages
npm run build

# Build specific packages
npm run build:shared
npm run build:backend
npm run build:frontend
```

## Deployment

### Using Docker (Recommended)

```bash
# Build and start containers
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the backend:
   ```bash
   cd backend
   npm run start:prod
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm run start
   ```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For more information, please contact [your-email@example.com](mailto:your-email@example.com).

