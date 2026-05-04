# Tayseer

Tayseer is an AI-powered management dashboard designed to streamline operations for freelancers and agencies. It provides a centralized platform to manage clients, projects, milestones, invoices, and cashflow, enhanced by an intelligent agent.

## Features

- Dashboard Overview: Unified view of activities and financial metrics.
- Client Management: Track client details and interactions.
- Project Tracking: Manage projects, milestones, and contracts.
- Financial Operations: Automate invoicing and monitor cashflow.
- AI Agent Integration: Includes an intelligent agent powered by the Mastra framework to automate tasks like invoice generation and project management.

## Tech Stack

- Framework: Next.js (App Router)
- Database: PostgreSQL with Prisma ORM
- Backend/Auth: Supabase
- AI Framework: Mastra
- Styling: Tailwind CSS

## Getting Started

### Prerequisites

Ensure you have Node.js and a package manager like pnpm installed.

### Setup

1. Install the dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and configure the required environment variables (e.g., database connection strings, Supabase credentials, and AI API keys).

3. Set up the database:
   ```bash
   pnpm dlx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
