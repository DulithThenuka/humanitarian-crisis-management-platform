# Humanitarian Crisis Management Platform

A full-stack web application for coordinating humanitarian crisis response, featuring AI-driven decision support, real-time resource allocation, shelter management, and volunteer coordination.

## Architecture

This project follows **Clean Architecture** principles with four backend layers:

| Layer | Project | Responsibility |
|-------|---------|---------------|
| **Domain** | `HumanitarianCrisisPlatform.Domain` | Core entities, enums, and domain exceptions |
| **Application** | `HumanitarianCrisisPlatform.Application` | Business logic, DTOs, service interfaces, validators |
| **Infrastructure** | `HumanitarianCrisisPlatform.Infrastructure` | EF Core, external APIs, security, notifications |
| **API** | `HumanitarianCrisisPlatform.API` | REST controllers, middleware, DI configuration |

The **frontend** is built with React + Vite and communicates via Axios HTTP client.

## Tech Stack

### Backend
- ASP.NET Core 8 Web API
- Entity Framework Core (SQL Server)
- JWT Authentication & Role-Based Access Control
- OpenAI Integration for crisis classification
- Polly for resilience & retry policies
- FluentValidation for request validation

### Frontend
- React 18 with Vite
- React Router v6 for navigation
- Leaflet.js for interactive crisis maps
- Chart.js / Recharts for analytics dashboards
- Axios with Bearer token interceptor

### Database
- Microsoft SQL Server
- Code-first migrations via EF Core

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- SQL Server (local or Docker)

### Backend Setup
```bash
cd backend
dotnet restore
dotnet ef database update --project HumanitarianCrisisPlatform.Infrastructure --startup-project HumanitarianCrisisPlatform.API
dotnet run --project HumanitarianCrisisPlatform.API
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
cd backend
dotnet test
```

## User Roles

| Role | Access Level |
|------|-------------|
| **Citizen** | Submit assistance requests, track status, find shelters |
| **Coordinator** | Triage requests, review AI decisions, manage crisis events |
| **LogisticsManager** | Manage resource inventory, dispatch allocations |
| **Volunteer** | View assignments, update availability |
| **Admin** | Full system access, user management |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Authenticate user |
| `/api/auth/register` | POST | Register new user |
| `/api/assistancerequests` | GET/POST | Manage assistance requests |
| `/api/aireview/override` | POST | Override AI decision |
| `/api/aireview/approve` | POST | Approve AI suggestion |
| `/api/shelters` | GET/POST | Manage shelters |
| `/api/shelters/allocate` | POST | Allocate evacuees to shelters |
| `/api/resources` | GET/POST | Manage resources |
| `/api/resources/dispatch` | POST | Dispatch resource allocation |
| `/api/volunteers` | GET/POST | Manage volunteers |
| `/api/volunteers/assign` | POST | Assign volunteer tasks |
| `/api/analytics/operational-kpis` | GET | Operational analytics |

## License

This project is developed for academic coursework purposes.
