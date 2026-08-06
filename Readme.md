# 🎬 Jio-Clone

A full-stack streaming platform inspired by JioCinema, built with Next.js, Express.js, MongoDB, and TMDB API.
Users can browse movies/TV shows, manage watchlists, and enjoy a responsive streaming experience.

# 🚀 Features

Authentication: JWT-based login/signup with cookies

Browse Content: Fetch movies & TV shows from TMDB API

Search: Find movies/TV shows by title

Watchlist: Add/remove items to personalized watchlist

Responsive UI: Optimized for mobile and desktop

Backend API: Express.js server with MongoDB integration

# 🛠️ Tech Stack

Frontend: Next.js, React, Redux Toolkit

Backend: Node.js, Express.js

Database: MongoDB Atlas

API: TMDB (The Movie Database)

Auth: JWT + Cookies

# 📂 Project Structure

Code
jio-clone/
│── frontend/ # Next.js app
│ ├── pages/ # Routes
│ ├── components/ # UI components
│ └── redux/ # State management
│
│── backend/ # Express.js server
│ ├── routes/ # API endpoints
│ ├── models/ # MongoDB schemas
│ └── controllers/ # Business logic
│
└── README.md

# ⚙️ Setup Instructions

1. Clone the repo
   bash
   git clone https://github.com/your-username/jio-clone.git
   cd jio-clone
2. Backend Setup
   bash
   cd backend
   npm install
   Create a .env file:
