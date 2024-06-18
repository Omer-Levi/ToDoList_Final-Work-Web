# To-Do List Application

## Introduction

This project is a simple To-Do list application that allows users to register, login, and manage their tasks. It uses Node.js for the server, MongoDB for the database, and vanilla JavaScript for the client-side logic. The application also leverages JWT for authentication and local storage for task management on the client-side.

## Technologies Used

- **Node.js**: For building the server-side of the application.
- **Express.js**: A Node.js framework used for building the RESTful API.
- **MongoDB**: A NoSQL database used to store user data and tasks.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (Json Web Tokens)**: For secure user authentication.
- **HTML/CSS/JavaScript**: For the client-side of the application.

## Requirements

- Node.js and npm installed
- MongoDB installed and running
- An environment variable for `MONGO_URI` and `JWT_SECRET`

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/Omer-Levi/ToDoList_Final-Work-Web.git
    cd todo-app
    ```

2. **Install the server dependencies:**
    ```sh
    npm install
    ```

3. **Create a `.env` file in the root of the project and add your MongoDB URI and JWT secret:**
    ```env
    MONGO_URI=your-mongodb-uri
    JWT_SECRET=your-jwt-secret
    ```

4. **Run the server:**
    ```sh
    node server.js
    ```

## File Structure

- `server.js`: The main server file.
- `registarApp.js`: Handles the registration form logic.
- `loginUser.html`: The login page for users.
- `registerUser.html`: The registration page for new users.
- `appToDos.js`: Handles the To-Do list logic.
- `todos.html`: The To-Do list page.

## Usage

1. **Register a new user:**
   Open `registerUser.html` in your browser, fill in the form and submit.

2. **Login with an existing user:**
   After register in, you will be redirected to `loginUser.html`, fill in the login form and submit.

4. **Manage your To-Do list:**
   After logging in, you will be redirected to `todos.html` where you can add, remove, and save tasks.


