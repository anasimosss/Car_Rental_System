# Car Rental System Backend

## Setup

1. Install Node.js 18 or later and SQL Server.
2. Create a SQL Server database named `car_rental` and a SQL login with access to it.
3. Enable TCP/IP for the SQL Server instance. For a local Express instance, set `DB_INSTANCE=SQLEXPRESS`; for a fixed TCP port, set `DB_PORT` and remove `DB_INSTANCE`.
4. Copy `.env.example` to `.env` and set `DB_USER` and `DB_PASSWORD` along with the app credentials.
5. Run `npm install`, then `npm start`.

On startup, Sequelize connects to SQL Server and creates any missing application tables. It does not alter or delete existing tables. Existing MongoDB data is not migrated automatically.

Run `node src/seed/seedAdmin.js` to create the configured admin account. The sample data scripts are `node seedLocations.js` and `node seedVehicles.js`; they add missing records and do not clear existing data.

Access Swagger docs at `/api/docs`.

## Deployment

- Frontend is Vercel-ready.
- Backend deploy to Railway or Render.
- Stripe, SendGrid, Cloudinary: use test/demo keys in development, see `.env.example` for where to put live keys for production.

## Features

- Auth (register, login, JWT, email verification, password reset)
- Roles (Customer, Agent, Admin, Booking/Reservation Staff, Fleet Manager, Payment/Finance Staff, Manager; RBAC middleware)
- Booking/Reservation Staff can review booking details, view all and pending bookings, and approve or reject reservations.
- Fleet Manager can manage vehicles, locations, availability, and maintenance records; Admin retains full access.
- Payment/Finance Staff can view booking payment details and payment history, and confirm payments through the existing manual-confirmation flow.
- Manager can monitor read-only operational, booking, fleet, maintenance, and financial summaries; Admin retains full access.
- Vehicle, location, booking, payment, maintenance management
- Stripe payments (booking not confirmed until paid)
- Email notifications (mock in dev, SendGrid setup for prod)
- Cloudinary image upload (demo in dev, docs for prod)
- Swagger API docs
- Seed script for admin

## Essential Notes

- Admin seeding for dev; secure admin creation for prod.
- Booking is only confirmed after Stripe payment.
- All credentials are set in `.env`.
- See API docs for endpoint details.