# School Feedback and Suggestion System

This is a group project for Application Development & Emerging Technologies.

## Run locally with XAMPP

1. Start **MySQL** from the XAMPP Control Panel.
2. In phpMyAdmin, create a database named `school_feedback_db`, select it, and import `config/school_feedback_db.sql`.
3. Copy `.env.example` to `.env`. Set `DB_PORT` to the MySQL port shown in XAMPP (for example, `3307` if XAMPP is configured to use that port). Set `DB_PASSWORD` to your MySQL root password; it is often blank in a default local XAMPP installation.
4. Install the Node.js dependencies and start the app:

   ```powershell
   npm install
   npm start
   ```

5. Open http://localhost:3000.

The provided SQL dump includes a sample admin account (`admin@school.edu` / `admin123`). Change that password before using this application beyond local development.

Added: Corrected the port and package
Added: Improved Admin Dashboard and Navigation