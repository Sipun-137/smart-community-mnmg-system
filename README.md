This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
📦 smart-community-management
├── 📂 src
│   ├── 📂 app  # Next.js App Router
│   │   ├── 📂 api
│   │   │   ├── 📂 auth            # Authentication services (JWT, OAuth, etc.)
│   │   │   │   ├── login.ts
│   │   │   │   ├── register.ts
│   │   │   │   ├── logout.ts
│   │   │   │   ├── middleware.ts  # Protect routes
│   │   │   │   ├── session.ts     # Session validation
│   │   │   ├── 📂 admin           # Admin panel services
│   │   │   │   ├── users.ts       # Manage users
│   │   │   │   ├── properties.ts  # Manage apartments/houses
│   │   │   │   ├── payments.ts    # View transactions
│   │   │   │   ├── reports.ts     # Generate reports
│   │   │   ├── 📂 residents       # Resident-specific services
│   │   │   │   ├── profile.ts     # Resident profile management
│   │   │   │   ├── complaints.ts  # Submit complaints
│   │   │   │   ├── payments.ts    # View payment status
│   │   │   ├── 📂 security        # Security & visitor management
│   │   │   │   ├── visitors.ts    # Log visitor entries
│   │   │   │   ├── staff.ts       # Manage security personnel
│   │   │   │   ├── incidents.ts   # Report security incidents
│   │   │   ├── 📂 maintenance     # Maintenance & service requests
│   │   │   │   ├── requests.ts    # Submit and track maintenance requests
│   │   │   │   ├── vendors.ts     # Manage vendors
│   │   │   ├── 📂 events          # Events & community announcements
│   │   │   │   ├── create.ts      # Schedule events
│   │   │   │   ├── list.ts        # Fetch event list
│   │   │   │   ├── notices.ts     # Manage community notices
│   │   │   ├── 📂 parking         # Parking & vehicle management
│   │   │   │   ├── slots.ts       # Assign parking slots
│   │   │   │   ├── vehicles.ts    # Manage registered vehicles
│   ├── 📂 components              # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   ├── 📂 hooks                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   ├── 📂 lib                     # Utilities & helpers
│   │   ├── auth.ts                # JWT handling
│   │   ├── db.ts                  # MongoDB connection
│   │   ├── validate.ts            # Input validation functions
│   ├── 📂 models                  # MongoDB schema models
│   │   ├── User.ts
│   │   ├── Property.ts
│   │   ├── Complaint.ts
│   │   ├── Payment.ts
│   │   ├── Visitor.ts
│   │   ├── Maintenance.ts
│   │   ├── Event.ts
│   │   ├── Parking.ts
│   ├── 📂 services                # Business logic (separate from API)
│   │   ├── authService.ts         # Handles authentication
│   │   ├── userService.ts         # User management logic
│   │   ├── propertyService.ts     # Handles property-related logic
│   │   ├── complaintService.ts    # Handles complaints
│   │   ├── maintenanceService.ts  # Handles maintenance logic
│   │   ├── securityService.ts     # Handles security operations
│   ├── 📂 styles                  # Tailwind and global styles
│   ├── 📂 utils                    # Utility functions
│   │   ├── dateFormat.ts
│   │   ├── errorHandler.ts
│   ├── 📂 middleware               # Middleware functions
│   │   ├── authMiddleware.ts       # Protects routes
│   │   ├── roleMiddleware.ts       # Checks user roles
│   ├── 📂 pages                    # Page-based routing (if using pages router)
│   ├── 📜 next.config.js            # Next.js config
│   ├── 📜 tsconfig.json             # TypeScript config
│   ├── 📜 package.json              # Dependencies
│   ├── 📜 .env                      # Environment variables

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
