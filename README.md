# Internee Management System Backend (Node.js + Express)

A Learning Management System (LMS) backend built using **Node.js**, **Express**, and **MongoDB** with role-based access control (Admin, Team Lead, Internee). This backend supports course management, task tracking, user progress, and authentication.

## 📁 Project Structure

├── controllers/

├── middleware/

├── models/

├── routes/

│ ├── adminRoutes.js

│ ├── authRoutes.js

│ ├── courseRoutes.js

│ ├── progressRoutes.js

│ ├── taskRoutes.js

│ └── userRoutes.js

├── config/

├── app.js

└── package.json


## 🚀 Features

- **Authentication**
  - JWT-based login/signup
  - Role-based access control

- **User Roles**
  - `Admin`: Full access (manage users, courses, tasks)
  - `Team Lead`: Manage assigned internees, track progress
  - `Internee`: View courses, submit tasks, track own progress

- **Modules**
  - `authRoutes.js`: Register/Login/Logout
  - `adminRoutes.js`: Admin dashboard, manage users and roles
  - `userRoutes.js`: Profile management, role-based user data
  - `courseRoutes.js`: Create/read/update/delete courses
  - `taskRoutes.js`: Assign/submit tasks
  - `progressRoutes.js`: Update and track learning progress

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (JSON Web Token)
- **Validation**: Express Validator or custom middleware

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js v14+
- MongoDB local or cloud instance

### Installation

```bash
git clone https://github.com/thenumanahmed/internee-management-system-backend.git
cd internee-management-system-backend
npm install
