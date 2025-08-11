# AskIt

AskIt is a full-stack web application for Q&A-style interactions, built with Node.js (Express) for the backend and Next.js (React/TypeScript) for the frontend.

## Project Structure

```
AskIt/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
└── frontend/
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── public/
    ├── services/
    ├── store/
    ├── types/
    ├── package.json
    ├── .env.local
    └── README.md
```

## Features

- User registration and authentication (email verification)
- Question and answer posting
- Voting system
- Admin controls
- RESTful API (Express)
- Modern frontend (Next.js, React, TypeScript)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to the backend folder:
    ```sh
    cd backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file based on `.env.example` and set your environment variables (MongoDB URI, SMTP credentials, etc.).
4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend Setup

1. Navigate to the frontend folder:
    ```sh
    cd frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env.local` file and set your frontend environment variables.
4. Start the frontend development server:
    ```sh
    npm run dev
    ```

## Environment Variables

Both backend and frontend require environment variables for proper operation. See `.env.example` in each directory for required keys.

## Scripts

### Backend

- `npm start` — Start the Express server
- `npm run dev` — Start with nodemon for development

### Frontend

- `npm run dev` — Start Next.js development server
- `npm run build` — Build for production
- `npm start` — Start production server


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

Made with ❤️ by