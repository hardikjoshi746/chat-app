# Chat App

A real-time chat application built using the MERN stack. The Chat App enables users to send and receive messages instantly, leveraging a robust socket architecture for seamless communication. Designed to be fast, responsive, and scalable, it ensures a great user experience and smooth operation.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Contributions](#contributions)

---

## Overview

The Chat App provides a platform for real-time communication with features such as instant messaging, user authentication, and chat creation. The app is designed for scalability, responsiveness, and reliability, making it suitable for both small and large groups.

---

## Key Features

### For Users:
- **Real-Time Messaging:** Instant two-way communication powered by Socket.IO.
- **User Authentication:** Secure user accounts with JWT-based authentication.
- **Responsive Design:** Optimized for mobile and desktop users.

### General Features:
- **Socket Architecture:** Efficient management of connections for real-time messaging.
- **Secure Communication:** Encrypted passwords and secure authentication mechanisms.
- **Error Handling:** Robust error messages and notifications for a smooth user experience.
- **Scalable Design:** Ready to support large user bases.

---

## Tech Stack

### Frontend:
- **React.js:** Dynamic and responsive user interface.
- **CSS Framework:** Tailwind CSS for seamless and responsive designs.

### Backend:
- **Node.js** and **Express.js:** Scalable and efficient server framework.

### Database:
- **MongoDB:** NoSQL database for user and message storage.
- **Mongoose:** ODM library for MongoDB.

### Socket Technology:
- **Socket.IO:** Real-time, bidirectional communication.

### Authentication & Security:
- **JWT (JSON Web Tokens):** Secure and scalable user authentication.
- **bcrypt:** For password encryption.

### Deployment & Tooling:
- **npm:** Dependency management.
- **GitHub:** Version control and collaboration.

---

## Installation & Setup

### Prerequisites:
- **Node.js** and **npm** installed on your system.
- **MongoDB** (local or cloud-based instance).

### Steps:

1. **Clone the Repository:**
```bash
   git clone https://github.com/hardikjoshi746/chat-app.git
   cd chat-app
```
2. Install Backend Dependencies:
```bash
  npm install
```

3. Navigate to Frontend Directory and Install Dependencies:
```bash
   cd client
    npm install
```
4. Set Up Environment Variables: Create a .env file in the root directory and add the following:
```
     MONGO_URI=<Your MongoDB URI>
    JWT_SECRET=<Your JWT Secret>
    PORT=5000
```
5. Run the Application:
  Start the backend server:
```bash
  npm run server
```
  Start the frontend:
```bash
  npm start
```
6. Access the Application: Open a browser and navigate to
```bash
   http://localhost:3000
```
   

## Contributions

Contributions are welcome! Feel free to fork the repository and submit a pull request for improvements or new features.

## Author
Hardik Joshi
