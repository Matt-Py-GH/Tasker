# Tasker 🧩

*Organize your tasks easily with Tasker. A simple and modern task management app for daily productivity.*

**Tasker** is a simple web application demonstrating user authentication using Node.js, Express, and PostgreSQL.
It features user registration, login, session handling with JWT and cookies, and protected routes with middleware authorization.

## 📁 Project Structure


## 🚀 Features

- User registration and login
- Password hashing with **bcryptjs**
- Token-based authentication using **JWT**
- Route protection with middleware (`Admin`, `Public`)
- PostgreSQL database integration
- Cookie-based session management
- Organized folder structure following an MVC-like pattern

## 🧪 Technologies Used

- **Node.js** & **Express** – Server and routing
- **PostgreSQL** – User data storage
- **pg** – PostgreSQL client for Node.js
- **bcryptjs** – Password hashing
- **jsonwebtoken** – Token creation and verification
- **cookie-parser** – Cookie handling
- **dotenv** – Environment variable management


## Create a .env file in the root directory with the following content (replace values accordingly):

PORT=4000

PG_HOST=localhost

PG_PORT=5432

PG_DATABASE=your_database_name

PG_USER=your_username

PG_PASSWORD=your_password

JWT_SIGN=your_jwt_secret

JWT_EXPIRE=1d

COOKIE_EXPIRE=1

# Create the usuarios table in PostgreSQL

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);



## 🔧 Setup

### Clone the project

```bash
git clone https://github.com/yourusername/tasker.git
cd tasker
npm install
```

## Finally

```bash
npm run dev -y
