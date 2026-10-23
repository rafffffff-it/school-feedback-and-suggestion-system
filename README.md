# EDUVoice - School Feedback & Suggestion System

## 📌 Project Description
**EDUVoice** is a centralized web platform designed for educational institutions to collect, track, and manage student feedback and suggestions. The system streamlines campus communication by allowing students to submit categorized feedback with tracking codes, monitor ticket progress, and receive updates. Administrators gain access to a dedicated dashboard for reviewing incoming submissions, updating ticket statuses, and managing campus notices.

---

## 👥 Team Members
* **[Bricenio, Rafael]** - Backend / Routes / Business Logic /Database
* **[Lagatic, Aris Robert]** - Frontend / Pages / Forms / UI
* **[Morata, Luther John]** - Frontend/ Database / Authentication / Testing

---

## AI Disclosure
* For most of this project, this was created with the assistance of mostly just Google Gemini, 
Copilot being a second one for the branch feature/login-and-registration.

* In accordance with academic integrity guidelines, Generative AI tools (Gemini / Copilot) were utilized during the development of EDUVoice for the following scope:

* Refactoring & CSS Modularization: Decoupling navigation buttons into a standalone button.css component file (nav-btn-primary, nav-btn-secondary, nav-btn-danger).

* UI/UX Refinements: Solving container overflow and flex-shrink edge cases for high-contrast badge components in sidebar navigation.

* Workflow Standardization: Advising on clean Git branch naming conventions (feature/), pull requests, and atomic commit practices.

* Architectural Evaluation: Establishing soft status closures (Closed/Resolved) for feedback tickets rather than hard SQL deletion to preserve database auditability.

* All AI-generated code snippets and layout configurations were manually reviewed, tested, integrated, and verified by the development team.

## ✨ Features

### User / Student Portal
* **Role-Based Authentication:** Secure registration, login, profile management, and account settings update.
* **Feedback Submission:** Submit suggestions/complaints with automated unique tracking code generation.
* **Submission Tracking:** View complete feedback history and real-time status updates (`Pending`, `Under Review`, `In Progress`, `Resolved`, `Closed`).
* **Campus Notices:** Access official institutional announcements and updates.
* **Responsive Dashboard:** Integrated sidebar navigation with modularized CSS styling.

### Admin Panel
* **High-Contrast Admin Gateway:** Accessible conditionally via role-based access control (RBAC).
* **Feedback Management:** Filter, review, and transition ticket statuses across all student submissions.
* **Auditability & Data Integrity:** Implements soft status closures (`Closed`/`Resolved`) to maintain complete audit trails for academic accountability.
* **Campus Notices Management:** Publish and update institutional announcements.

---

## 🛠️ Tech Stack & Architecture
* **Backend:** Node.js, Express.js
* **Templating Engine:** EJS (Embedded JavaScript)
* **Database:** MySQL / MariaDB (via XAMPP)
* **Styling:** Modular CSS (`style.css`, `button.css`)
* **Version Control:** Git & GitHub

---

## 🚀 Installation & Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.x or higher)
* [XAMPP](https://www.apachefriends.org/) (Apache & MySQL Service)
* [Git](https://git-scm.com/)

## Installing via VSCode Terminal
1. a. git --version
   b. npm --version
   c. node --version
   d. For installing the repository, just type npm install
2. npm install express ejs mysql2
3. npm install --save-dev nodemon
### Step 1: Clone the Repository
```bash
git clone [https://github.com/your-username/school-feedback-and-suggestion-system.git](https://github.com/your-username/school-feedback-and-suggestion-system.git)
cd school-feedback-and-suggestion-system