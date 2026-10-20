# Campus System Requirements Document

## 1. Users

The system is designed for the following user types:

- Student: submits feedback, reports issues, and tracks updates.
- Faculty: submits campus feedback and views relevant updates.
- Staff: submits concerns, monitors service requests, and uses the campus support workflow.
- Administrator: reviews submissions, updates ticket status, adds remarks, and manages the system.

## 2. Stakeholders

- Students and employees of the campus community
- Academic and administrative offices
- Campus facilities and maintenance teams
- IT support and service management teams
- School administrators and department heads

## 3. Functional Requirements

- Users can create accounts and log in securely.
- Users can submit campus feedback or suggestion tickets with a category, title, location, description, and optional file attachment.
- The system stores submitted records in a persistent database.
- Users can track a ticket using a generated tracking code.
- Administrators can view all submitted tickets in a dashboard.
- Administrators can update ticket status and official remarks.
- The system prevents unauthorized access to protected admin areas.
- The system validates required form fields and credential inputs before saving or processing data.

## 4. Non-Functional Requirements

- The application should be reliable and responsive while processing requests.
- Input validation should provide clear error messages to users.
- The system should securely manage sessions and user authentication.
- Pages should be easy to navigate and use across desktop and mobile screens.
- Code should be organized into routes, views, middleware, and configuration files for maintainability.

## 5. Use Cases

### Use Case 1: Register Account
- Actor: Student or Staff member
- Precondition: User has not created an account
- Steps:
  1. User opens registration page.
  2. User enters full name, email, password, and role.
  3. System validates the information.
  4. System saves the account and redirects to login.
- Expected Result: The user can log in with the new account.

### Use Case 2: Log In
- Actor: Registered user
- Precondition: User has an existing account
- Steps:
  1. User enters email and password.
  2. System checks the account.
  3. System starts a secure session.
  4. User is redirected to the proper dashboard or home page.
- Expected Result: Only valid accounts can access the system.

### Use Case 3: Submit Feedback
- Actor: Student, Faculty, or Staff
- Precondition: User is logged in or using the public ticket form
- Steps:
  1. User enters category, title, location, and description.
  2. Optional supporting file is attached.
  3. System validates the input.
  4. System stores the submission and generates a tracking code.
- Expected Result: Ticket is saved and tracking details are available.

### Use Case 4: Track Ticket Status
- Actor: User or Administrator
- Precondition: A ticket has been created
- Steps:
  1. User enters the tracking code.
  2. System queries the database.
  3. System displays the current status and remarks.
- Expected Result: User sees the latest status of the request.

### Use Case 5: Update Ticket Status
- Actor: Administrator
- Precondition: Administrator is authenticated
- Steps:
  1. Administrator opens the admin dashboard.
  2. Administrator selects a ticket and updates its status.
  3. System saves the status and remarks.
- Expected Result: The ticket reflects the latest progress.

## 6. Acceptance Criteria

The project is considered complete when it demonstrates:

- Multiple functional pages and forms
- Persistent storage in a database
- Login and logout flow
- Access control for admin routes
- Form validation and error handling
- Clear route structure and maintainable project layout
