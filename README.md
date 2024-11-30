# Query Verse: Finance Q&A Platform

**Query Verse** is an interactive platform that connects finance enthusiasts, professionals, and learners, allowing users to ask questions, share answers, and discuss various financial topics to foster collaboration and learning.

---

### User Features

- **User Authentication:**
  - Sign up/Login with email and password (no email verification).
  - Google Sign-In integration (bonus).
  - Logout option.
- **Question Management:**
  - Post finance-related questions with tags.
  - Edit or delete your own posts.
  - View a feed of all admin-approved questions.
  - View your pending questions in a separate tab.
- **Commenting:**
  - Comment on your own or admin-approved posts.
- **Google Sign-In (Bonus):**
  - Users can sign in using their Google accounts.
- **Likes and Dislikes (Bonus):**
  - Like or dislike questions for better user engagement.
- **Tag Search/Filter (Bonus):**
  - Search or filter posts by tags.

### Admin Features

- Admin accounts created from the backend.
- Approve or reject user-posted questions.
- Delete any post.
- Comment on any post.
- Dark mode support

---

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose ORM)
- JSON Web Tokens (JWT)
- Google OAuth

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or above)
- [MongoDB](https://www.mongodb.com/) (locally or via MongoDB Atlas)
- A Google OAuth client ID and secret (for authentication)

---

## Setup Instructions

### Client Setup

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:

   ```env
    VITE_GOOGLE_CLIENT_ID=<client-id>.googleusercontent.com
    VITE_BACKEND_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Server Setup

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:

   ```env
   PORT=3000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

---

## Running the Application

1. Start the backend server (from the `server` directory):

   ```bash
   npm run dev
   ```

2. Start the frontend development server (from the `client` directory):

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` to access the application.

4. To access the backend http://localhost:3000

---

## License

This project is licensed under the MIT License.
