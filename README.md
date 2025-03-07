# SummerTravel - Online Flight Ticket Booking Website

## Introduction
Full feature online flight booking app

## Key Features
### **For Customers**
- Register and log in using email or Google account.
- Search for flights by departure/arrival locations and travel dates.
- Filter tickets by stops, price, flight duration, and airlines.
- Select seats and complete payments via Momo, Stripe (credit, QR).
- View booking history, cancel tickets, or retry payments.
- Rate flights with comments, images, and emojis.

### **For Admins**
- Manage bookings, payments, users, and customers.
- Generate reports and statistics in `.csv` format.
- View revenue charts for the past 30 days.

### **Background task**
- Cronjob: Update completed flight

## Technologies Used
- **Frontend:** Next.js, TailwindCSS, NextUI, Framer Motion, ShadcnUI.
- **Backend:** Next.js Pages Router, Prisma ORM.
- **Authentication:** NextAuth (Google, Credentials).
- **Payments:** Stripe, Momo.
- **Database:** SQLite (development), PostgreSQL (production).
- **Cloud Services:** Google Cloud, SERP API.
- **Admin:** React-admin, Recharts.

## Installation & Running the Project
### 1. Clone the repository
```bash
git clone https://github.com/your-repo/summertravel.git
cd summertravel
```
### 2. Install dependencies
```bash
npm install
```
### 3. Set up environment variables `.env`
Create a `.env.local` file and fill in the following details:
```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_key
MOMO_SECRET_KEY=your_momo_key
```

### 4. Run the database and Prisma
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the project
```bash
yarn dev  # or npm run dev
```
Access the app at `http://localhost:3000`.


## Overview
**Home page**
![image](https://github.com/user-attachments/assets/fef8ab25-5e56-409c-8fe4-73957dba6fb8)
**Admin page**
![image](https://github.com/user-attachments/assets/c79cb61d-4494-46fa-8978-b0b174077a41)
**Flight search**
![image](https://github.com/user-attachments/assets/ffd43d64-1a94-4e75-a705-c5478efa0f36)
...and more


