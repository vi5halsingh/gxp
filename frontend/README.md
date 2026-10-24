# Role-Based Dynamic Profile Form

A MERN stack web application with three roles: **Admin, User, and Seller**. The Admin manages user roles and configures the profile form fields available for each role.

## Features

- **First-Time Admin Setup:** The first registered user automatically becomes the Admin if the database is empty.
- **User Registration:** All subsequent users receive the `pending` role by default.
- **Role Assignment:** The Admin can assign registered users either the `user` or `seller` role.
- **Dynamic Profile Forms:** The Admin controls which fields are available for User and Seller profiles.
- **Role-Based Forms:** Users see only the profile fields enabled by the Admin for their assigned role.
- **Profile Submission:** Users can complete and save their profiles to MongoDB.

## Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT

## User Roles

| Role | Description |
|---|---|
| `admin` | Manages users, assigns roles, and configures profile form fields. |
| `pending` | Assigned to newly registered users awaiting role assignment. |
| `user` | Completes a profile using the fields configured for the User role. |
| `seller` | Completes a profile using the fields configured for the Seller role. |

## Application Workflow

### 1. First-Time Admin Setup

- When the database contains no users, the first person to register automatically receives the `admin` role.
- The Admin can log in and access the Admin Dashboard.

### 2. Configure Profile Form Fields

The Admin configures the fields available for each role.

**Example — User Fields**
- Mobile Number
- City
- Address

**Example — Seller Fields**
- Shop Name
- GST Number
- Business Category

### 3. User Registration

- A new user registers with their name, email, and password.
- If users already exist in the database, the new user receives the `pending` role.
- The user waits for the Admin to assign a role.

### 4. Admin Assigns a Role

- The Admin opens the Users & Roles section.
- The Admin selects either `user` or `seller` for the registered user.
- The user's role is updated in the database.

### 5. Complete Profile

- After role assignment, the user refreshes their status.
- The application identifies the assigned role.
- The profile form displays only the fields enabled by the Admin for that role.

### 6. Save Profile

- The user completes the displayed fields.
- The application validates the submitted data.
- The profile information is saved to MongoDB.

## Project Structure

```text
project/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.jsx
│
├── backend/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       ├── config/
│       └── server.js
│
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

Start the backend server:

```bash
npm run dev
```

Ensure the backend's `package.json` defines the `dev` script.

### 3. Frontend Setup

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend development URL will be displayed in the terminal.

## Security Considerations

- Hash passwords before saving them to MongoDB.
- Use JWT authentication for protected routes.
- Restrict role assignment and form configuration to Admin users.
- Never allow users to assign themselves the `admin` role.
- Validate profile submissions on the backend against the configured fields.
- Do not rely solely on frontend field visibility for authorization or validation.

## Future Enhancements

- Edit and update profile information.
- Add or remove dynamic form fields.
- Configure required and optional fields.
- Add form field types such as text, email, number, and dropdown.
- Track profile completion status.

## License

This project is intended for learning and development purposes.
```