# Full-Stack URL Shortener Service (Short.ly)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A feature-rich, full-stack URL shortening service built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to shorten long URLs, track click analytics, and manage their links through a private, authenticated dashboard.

**Live Demo:** [Link to your deployed application]

---

### Screenshot / Demo GIF

![A GIF or screenshot showing the application in action. For example, a user shortening a URL and then seeing it on their dashboard.](placeholder.gif)

*A short GIF demonstrating the core user flow: shortening a URL, logging in, and viewing the link on the personal dashboard.*

---

## Features

-   **Anonymous URL Shortening:** Any visitor can quickly shorten a URL without needing an account.
-   **User Authentication:** A complete JWT-based authentication system for user registration and login.
-   **Password Hashing:** User passwords are securely hashed using `bcryptjs` before being stored.
-   **Protected Routes:** A secure, private dashboard is only accessible to logged-in users.
-   **Personalized Dashboard:** Authenticated users can view a history of all the links they've created.
-   **Click Tracking:** The service tracks and displays the number of clicks for each shortened URL in real-time.
-   **Automatic Redirection:** Short links seamlessly redirect to their original destination.
-   **Responsive UI:** The application is styled with Tailwind CSS for a modern, responsive experience on all devices.
-   **Robust Error Handling:** Features a full-stack error handling pipeline with client-side validation and consistent server responses.

---

## Tech Stack

### Backend

-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Web framework for Node.js.
-   **MongoDB:** NoSQL database for storing user and URL data.
-   **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
-   **JSON Web Tokens (JWT):** For secure user authentication.
-   **bcryptjs:** For hashing user passwords.
-   **nanoid:** For generating unique and short URL codes.

### Frontend

-   **React.js:** A JavaScript library for building user interfaces.
-   **React Router:** For client-side routing and navigation.
-   **Tailwind CSS:** A utility-first CSS framework for styling.
-   **Axios:** For making HTTP requests to the backend API.
-   **React Context API:** For global state management (authentication).

---

## Installation and Setup

Follow these steps to get the project running on your local machine.

### Prerequisites

-   Node.js (v14 or higher)
-   npm (Node Package Manager)
-   MongoDB (You can use a local installation or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

### 1. Clone the Repository

```bash
git clone https://github.com/[Your-GitHub-Username]/[Your-Repo-Name].git
cd [Your-Repo-Name]