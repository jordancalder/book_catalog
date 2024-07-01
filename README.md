# Book Catalog

## Description

This project is a web application designed to demonstrate a full-stack development setup. It includes a backend API server and a frontend interface. The backend is built with Node.js and Express, serving data to a React-based frontend.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed (version 12.x or higher recommended)
- npm (Node Package Manager) installed
- A modern web browser

## Installation

To install the project, follow these steps:

1. Clone the repository to your local machine: `git clone https://github.com/jordancalder/book_catalog.git`
2. Navigate into the project directory: `cd book_catalog`
3. Install backend dependencies: `cd server && npm install`
4. Install frontend dependencies: `cd ../client && npm install`

## Configuration

Before running the project, ensure you have postgres installed and running: `brew install postgresql@16 && brew services start postgresql@16`

## Running the Project

To run the project, you need to start both the backend server and the frontend application:

1. Start the backend server:
- Navigate to the `server` directory:
  ```
  cd server
  ```
- Run the server:
  ```
  npm start
  ```

2. Start the frontend application:
- Open a new terminal window or tab.
- Navigate to the `client` directory:
  ```
  cd client
  ```
- Run the React app:
  ```
  npm start
  ```

After starting both the backend and frontend, you should be able to access the web application by navigating to `http://localhost:3000` in your web browser.
