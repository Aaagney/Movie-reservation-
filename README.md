# Movie-reservation-
## Database Setup (PostgreSQL)

This project's authentication module uses PostgreSQL. Follow these steps to set it up locally:

### 1. Install PostgreSQL
Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/) if not already installed. pgAdmin 4 comes bundled with it for easy database management.

### 2. Create the database
Open pgAdmin (or psql terminal) and create a new database:
```sql
CREATE DATABASE cinevault_auth;
```

### 3. Run the schema
Connect to the `cinevault_auth` database and run the schema file to create the `users` table:
```bash
psql -U your_username -d cinevault_auth -f backend/db/schema.sql
```
Or open `backend/db/schema.sql` in pgAdmin's Query Tool (connected to `cinevault_auth`) and execute it.

### 4. Configure environment variables
Copy `.env.example` to `.env` in the `backend` folder and update it with your local PostgreSQL credentials:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinevault_auth
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password


### 5. Start the backend
```bash
cd backend
npm install
npm run dev
```
Check the console for a successful database connection message.
