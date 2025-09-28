# Dexa Group - Web Application Project (Back-end Nest.js)

## Overview

This project was built by **Aloysius Gonzaga Seto Galih D.** as part of the **Dexa Group Full-Stack Developer Skill Test**, designed to provide a **comprehensive attendance management system** for employees and HR staff. The application allows seamless **remote work tracking**, including **Work From Home (WFH)** scenarios, where employees can log their presence, upload proof of attendance, and track their daily work hours.

![Login Screenshot](./docs/screenshots/login.png)

![Login Screenshot](./docs/screenshots/dash-main.png)

## Key & Feature Highlights

- **Multi-role system**: Separate dashboards and functionalities for HR and Employee roles.
- **Attendance tracking**: Employees can check-in and check-out, with the system automatically tracking daily attendance status.
- **Photo proof**: Users can upload an image during check-in for validation purposes.
- **HR management dashboard**: HR can create, update, and monitor employee records and attendance data efficiently.
- **Clean and responsive UI design**: A modern, intuitive, beautiful, clean, and mobile-friendly interface built with Next.js and ShadCN UI.
- **Time-zone aware system**: All timestamps are stored in UTC, displayed in GMT+7 for consistency.
- **Secure authentication**: Access control is implemented via role-based guards and HTTP-only cookies to protect sensitive information.

## Use Cases

This web application is designed to address common HR and employee needs in a modern workplace. It focuses on **simplifying attendance tracking, monitoring employee activity, and providing actionable insights** for management. The system is particularly useful for organizations that support **remote work** or need a **digital attendance solution**.

1. ### **Work From Home (WFH) Employee Attendance**

   ![Dashboard Screenshot](./docs/screenshots/dash-dailypresence-clip.png)
   - A web application that allows employees to log in securely.
   - Record daily attendance, capturing **date & time**.
   - Upload a **photo** as proof of working from home.

2. ### **Employee Monitoring**

   ![Dashboard Screenshot](./docs/screenshots/dash-attendances-clip.png)
   - An admin (HR) dashboard for managing employee data, such as create and update employee records.
   - Monitor submitted attendance in a **view-only** mode.

---

## Table of Contents

- [Overview](#overview)
- [Key & Feature Highlights](#key--feature-highlights)
- [Use Cases](#use-cases)
- [Tech Stacks](#tech-stacks)
- [Front-end Tech & Features](#front-end-tech--features)
- [Back-end Tech & Features](#back-end-tech--features)
- [API Endpoints](#api-endpoints)
- [Usage/Project Setup](#usage--project-setup)
- [Dummy Data for Testing (Login)](#dummy-data-for-testing-login)
- [Usage](#usage)
- [Notes](#notes)

---

## Tech Stacks

- ### Front-end
  - **Next.js (TypeScript)** – The React Framework for the Web. Used by some of the world's largest companies, Next.js enables you to create **high-quality web applications** with the power of React components, server-side rendering, and static generation.

- ### Back-end
  - **Nest.js (TypeScript)** – A progressive Node.js framework. Nest.js provides **scalable, maintainable, and testable architecture** for building back-end applications with TypeScript.

- ### Database
  - **MySQL** – Relational database for storing employee and attendance data.

---

## Front-end Tech & Features

- **Next.js (TS)** – App router, server/client components
- **TanStack Query** – Data fetching & caching
- **ShadCN UI & Hero UI** – UI components & form handling
- **React Hook Form + Zod** – Form validation
- **Axios** – API client
- **date-fns + date-fns-tz** – Date & timezone handling
- **React Dropzone** – Drag & drop image upload

---

## Back-end Tech & Features

- **Nest.js (TS)** – Modular architecture, dependency injection
- **Prisma ORM** – Type-safe database queries
- **HTTP Only Cookie Authentication** – UUID token wrapped inside cookie for authentication
- **Multer** – File upload (check-in image)
- **DateTime handling** – Store in UTC, display in GMT+7
- **Guards** – Middleware for role-based authentication & authorization

---

## API Endpoints

### Auth

| Method | Endpoint             | Description                         | Roles           |
| ------ | -------------------- | ----------------------------------- | --------------- |
| POST   | `/api/auth/login`    | User login                          | (Guest)         |
| DELETE | `/api/auth/logout`   | User logout                         | (Authenticated) |
| GET    | `/api/users/current` | Get current authenticated user info | (Authenticated) |

### Attendance

| Method | Endpoint                         | Description                             | Roles        |
| ------ | -------------------------------- | --------------------------------------- | ------------ |
| GET    | `/api/attendances/current`       | Get current attendance for current user | Employee, HR |
| POST   | `/api/attendances/check-in`      | Check in for current user               | Employee, HR |
| PATCH  | `/api/attendances/check-out/:id` | Check out for current user              | Employee, HR |
| GET    | `/api/attendances`               | List attendances for a specific date    | HR           |
| GET    | `/api/attendances/:id`           | Get single attendance detail by ID      | HR           |

### Employee

| Method | Endpoint             | Description               | Roles |
| ------ | -------------------- | ------------------------- | ----- |
| POST   | `/api/employees`     | Create a new employee     | HR    |
| GET    | `/api/employees`     | Get all employees         | HR    |
| GET    | `/api/employees/:id` | Get single employee by ID | HR    |
| PATCH  | `/api/employees/:id` | Update employee by ID     | HR    |
| DELETE | `/api/employees/:id` | Delete employee by ID     | HR    |

### Upload

| Method | Endpoint            | Description           | Roles        |
| ------ | ------------------- | --------------------- | ------------ |
| POST   | `/api/upload/image` | Upload check-in image | Employee, HR |

### Main Dashboard Content

| Method | Endpoint                 | Description                                 | Roles        |
| ------ | ------------------------ | ------------------------------------------- | ------------ |
| GET    | `/api/dashboard/current` | Get main dashboard content for current user | Employee, HR |

---

## Usage / Project Setup

### Back-end

Clone the repository:

```bash
git clone https://github.com/AloysiussG/backend-dexa.git
cd backend-dexa
```

Install dependencies:

```bash
npm install
```

Create MySQL database:

```bash
CREATE DATABASE dexagroup_seto;
```

Setup **.env** or environment variables for database URL (MySQL):

```env
DATABASE_URL="mysql://root:@localhost:3306/dexagroup_seto"
```

**(Optional)** Add environment variables for URL. For temporary quick test, the URL endpoints are already stored in the files. The default port of the back-end are set to 8000. Please see the **project directories**.

```env
DATABASE_URL="mysql://root:@localhost:3306/dexagroup_seto"

NEXT_PUBLIC_FRONTEND_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_APP_URL=http://localhost:8000
```

Run the migration:

```bash
npx prisma migrate dev
```

Run database seeder. You can see all the data that will be generated inside **src/seeder/data** folder, with the name of **users.json** and **attendances.json**.

```bash
npm run seed
```

Run the project:

```bash
npm run start:dev
```

### Front-end

Clone the repository:

```bash
git clone https://github.com/AloysiussG/frontend-dexa.git
cd frontend-dexa
```

Install dependencies:

```bash
npm install
```

**(Optional)** Setup environment variables. For temporary quick test, the URL endpoints are already stored in the files. The default port of the front-end are set to 3000. Please see the **project directories**.

```env
NEXT_PUBLIC_FRONTEND_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_APP_URL=http://localhost:8000
```

Run the project:

```bash
npm run dev
```

Open the browser:

```arduino
http://localhost:3000
```

You will see the login page and continue to use the app with some of these provided credentials for testing. The data are shown in the next section below.

---

## Dummy Data for Testing (Login)

For quick testing of the application, you can use the following **dummy users**. These users are pre-seeded in the back-end database from the file **after you run the seeder from the Usage/Project Setup section**. The full users data are shown inside **src/seeder/data** folder, with the name of **users.json**.

You can log in using the **email** and **password** provided below. All passwords are set to `password` for testing purposes.

| Name          | Email                     | Password | Role     |
| ------------- | ------------------------- | -------- | -------- |
| Alice HR      | alice.hr@company.com      | password | HR       |
| David HR      | david.hr@company.com      | password | HR       |
| Bob Worker    | bob.worker@company.com    | password | Employee |
| Charlie Staff | charlie.staff@company.com | password | Employee |

### How to Use the App

1. Start the back-end and front-end servers as described in the **Usage/Project Setup** section.
2. Open the login page:

   ```arduino
   http://localhost:3000
   ```

3. Enter the email and password of any dummy user from the table above.
4. You will be redirected to the appropriate dashboard based on the role:
5. HR users will access employee and attendance management features, as well as daily presence dashboard.
6. Employee users will access the daily attendance dashboard.
7. You can use these accounts to test check-in, check-out, attendance viewing, and employee management features.

---

## Notes

- **Timezone**: Back-end stores all dates in UTC; front-end displays in Asia/Jakarta (GMT+7).
- **React Query**: Caches user and attendance data to reduce API calls.
- **React Hook Form + Zod**: Validates forms including file uploads.
- **Loading States**: Delays can be added to simulate UX feedback for buttons.
- **Token**: Authentication uses UUID tokens & HTTP Only cookie, instead of JWT. Token stored inside **users** table.
