# Task Manager 

## Overview
This is a full-stack Task Management Application where users can add, edit, delete, and reorder tasks using a drag-and-drop interface. Tasks are categorized into three sections: **To-Do, In Progress, and Done**. Changes are instantly saved in the database for persistence.

The app features authentication, real-time updates, and a modern, responsive UI.

## Live Demo
🔗 [Live Application](#) *(https://task-manager-app-b251b.web.app)*

## Features
- **User Authentication**: Only authenticated users can access the app (Google Sign-in via Firebase Authentication).
- **Task Management**:
  - Create, edit, delete, and reorder tasks.
  - Drag and drop tasks between categories.
  - Auto-save changes to the database.
- **Database & Real-Time Updates**:
  - MongoDB for task storage.
  - WebSockets or Change Streams for real-time updates.
- **Modern UI**:
  - Clean and minimalistic design.
  - Fully responsive for desktop & mobile.
- **Bonus Features (Optional)**:
  - Dark mode toggle.
  - Task due dates with color indicators.
  - Activity log to track task movements.

## Technologies Used
### Frontend (Client-Side)
- **React.js**
- **Tailwind CSS and ShadCN** (for styling)
- **react-beautiful-dnd** (for drag-and-drop functionality)
- **Firebase Authentication** (for user authentication)

### Backend (Server-Side)
- **Node.js + Express.js** (API backend)
- **MongoDB** (Database for storing tasks)
- **WebSockets** (for real-time updates)

## Installation & Setup
### Prerequisites
- Node.js installed (LTS version recommended)
- MongoDB Atlas account (or local MongoDB instance)
- Firebase project setup for authentication

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Samadsust71/task-manager-server.git
   cd task-manager-server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add your environment variables:
   ```env
   DB_USER = your username
   DB_PASS = your mongoDB collection pass
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd ../task-manager-client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_API_URL=http://localhost:3000
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```

## Folder Structure
```
/task-manager
│── backend/       # Express.js server
│   ├── models/    # Mongoose models
│   ├── routes/    # API routes
│   ├── config/    # Database & auth configuration
│   ├── server.js  # Main server file
│
│── frontend/      # React.js frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context API for state management
│   │   ├── App.js        # Main app entry point
│   │   ├── main.jsx      # Renders the app
```

## Contribution Guidelines
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m 'Added new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.


---

💡 If you have any questions, feel free to reach out! 🚀

