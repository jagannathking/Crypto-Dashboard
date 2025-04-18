# C4Scale Crypto Dashboard

A full-stack web application built for the C4Scale assignment. It displays cryptocurrency data fetched via a custom backend API that wraps the CoinGecko API.

## Objective

Build an interactive cryptocurrency dashboard featuring:
1.  A detailed analysis panel with historical price/volume charts.
2.  A panel showing the day's top gaining and losing cryptocurrencies.
3.  A backend API (Node.js) acting as a wrapper for CoinGecko API calls.

## Features

*   **Detailed Analysis Panel:**
    *   Select cryptocurrency via dropdown.
    *   Select time frame (7, 14, 30 days).
    *   Interactive chart showing Price (Line) and Trading Volume (Bar) using Recharts.
*   **Top Movers Panel:**
    *   Displays the Top Gainer and Top Loser based on 24h price change.
    *   Includes name, symbol, image, current price, and 24h percentage change.
    *   Refreshes data periodically.
*   **Backend API:**
    *   Built with Node.js and Express.js.
    *   Wraps required CoinGecko endpoints.
    *   Implements caching using MongoDB (via Mongoose) to reduce external API calls and handle rate limits.
*   **User Interface:**
    *   Built with React (using Vite).
    *   Styled with Tailwind CSS.
    *   Includes loading states (skeletons) for better UX.

## Tech Stack

*   **Frontend:**
    *   React.js (Vite)
    *   Tailwind CSS
    *   Recharts (Charting)
    *   Axios (HTTP Client)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   Mongoose (MongoDB ODM)
    *   Axios
    *   Dotenv
    *   CORS
*   **Database:**
    *   MongoDB (Used primarily for caching API responses and storing the coin list)

## Prerequisites

*   Node.js (v18.x or later recommended)
*   npm or yarn
*   Git
*   MongoDB (A running instance - local or a connection string like MongoDB Atlas)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jagannathking/Crypto-Dashboard.git
    cd Crypto-Dashboard
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    # or yarn install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    # or yarn install
    ```

## Environment Variables

You need to create `.env` files for both the backend and frontend.

1.  **Backend (`backend/.env`):**
    Create a file named `.env` in the `backend` directory and add the following variables:
    ```dotenv
    PORT=5000
    MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority # Replace with your MongoDB connection string
    COINGECKO_API_BASE_URL=https://api.coingecko.com/api/v3
    CACHE_TTL_SECONDS=60 # Cache duration in seconds (e.g., 60)
    API_KEYS=CG-xxxxxxxxxxxxxxxxxxxxxxx # Your CoinGecko API Key (optional for some free endpoints, required for others/rate limits)
    JWT_SCRETE=your_jwt_secret_key # If using the user auth features
    ```

2.  **Frontend (`frontend/.env`):**
    Create a file named `.env` in the `frontend` directory and add the following variable:
    ```dotenv
    VITE_API_BASE_URL=http://localhost:5000/api # URL of your running backend API
    ```
    *(Note: Vite requires the `VITE_` prefix for client-side environment variables)*

## Running the Application

1.  **Start the Backend Server:**
    Open a terminal in the `backend` directory and run:
    ```bash
    npm run dev
    ```
    The backend should start, typically on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    Open a *separate* terminal in the `frontend` directory and run:
    ```bash
    npm run dev
    ```
    The frontend should start, typically on `http://localhost:5173` (Vite will show the exact URL).

3.  **Open the Frontend URL** in your browser (e.g., `http://localhost:5173`).

## Backend API Endpoints

The backend exposes the following main endpoints under the `/api/crypto` prefix:

*   `GET /api/crypto/markets/top-gainer`: Gets the top gaining coin.
*   `GET /api/crypto/markets/top-loser`: Gets the top losing coin.
*   `GET /api/crypto/coins/list`: Gets the list of available coins for the selector.
*   `GET /api/crypto/coins/:coinId/market-chart?days=<7|14|30>`: Gets historical price/volume data for a specific coin.

*(User authentication endpoints exist under `/api/users` if implemented)*

## Deployment

The backend is intended for deployment on platforms like Vercel or Render. Ensure environment variables are set correctly in the deployment platform's settings. A `vercel.json` file is included for Vercel deployment configuration.

*(Add the live deployed URL here if available)*
*   Live URL: [Link to your deployed app]
