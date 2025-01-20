# Chat App

A real-time chat application built using the MERN stack. This application allows users to send and receive messages instantly, leveraging the power of socket architecture for seamless communication.

## Features

- **Real-Time Messaging:** Instant communication between users using WebSocket technology.
- **Socket Architecture:**
  - **Socket Server:** Handles incoming connections, processes user requests, and sends responses.
  - **Socket API:** Provides tools and protocols to manage client-side socket connections.
- **Scalable Backend:** Built with Node.js and Express, ensuring performance and scalability.
- **Modern Frontend:** Developed using React, offering an intuitive and responsive user interface.
- **Database Integration:** MongoDB for storing user data and chat messages.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Socket Framework:** Socket.IO
- **Others:** MERN Stack (MongoDB, Express.js, React.js, Node.js)

## Installation and Setup

Follow these steps to set up and run the project locally:

### Prerequisites
- Node.js (v14+)
- MongoDB (local instance or Atlas)
- Git

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/hardikjoshi746/chat-app.git
   cd chat-app
Install Dependencies Navigate to the root directory and install backend dependencies:
npm install
Then, navigate to the client folder and install frontend dependencies:

cd client
npm install
Set Up Environment Variables Create a .env file in the root directory and add the following variables:
MONGO_URI=your_mongodb_connection_string
PORT=5000
SOCKET_PORT=4000
Start the Server In the root directory, start the backend server:
npm run server
In the client directory, start the React frontend:

npm start
Access the Application Open your browser and navigate to http://localhost:3000.
Project Structure

Contributions

Contributions are welcome! Feel free to fork the repository and submit a pull request with your enhancements or bug fixes.

Author

Hardik Joshi
GitHub Profile
