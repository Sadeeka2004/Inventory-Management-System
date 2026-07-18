# Enterprise Inventory Management System

A full-stack inventory application built for real-time tracking of stock movements, store management, and supplier records.

## 🚀 Technologies Used
- **Frontend:** React, React Router DOM, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL (Database)

## 📁 Project Structure
- `/frontend` - User interface, premium responsive sidebar navigation, and validation-secured business forms.
- `/backend` - Secure database connections, inventory ledger routing, and transactional API logic.

## 🛠️ How to Run Locally

### 1. Setup Backend
1. Go to the backend folder: `cd backend`
2. Install packages: `npm install`
3. Configure your local variables inside a `.env` file.
4. Run migrations: `npx prisma migrate dev`
5. Start server: `npm run dev`

### 2. Setup Frontend
1. Go to the frontend folder: `cd frontend`
2. Install packages: `npm install`
3. Start the UI dashboard: `npm run dev`