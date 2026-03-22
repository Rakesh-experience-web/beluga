# Chat Application

A full-stack real-time chat application built with React, Vite, Zustand, Express, MongoDB, and Socket.IO.

It supports:
- User signup and login
- Cookie-based authentication
- Profile picture upload
- Contact list and chat partner list
- One-to-one messaging
- Image attachments in messages
- Real-time incoming messages
- Online user presence

## Tech Stack

**Frontend**
- React
- Vite
- Zustand
- Axios
- React Router
- Tailwind CSS
- DaisyUI

**Backend**
- Node.js
- Express
- MongoDB with Mongoose
- Socket.IO
- JWT authentication with cookies
- Multer for uploads

## Project Structure

```text
chat-application/
  client/        React frontend
  server/        Express + Socket.IO backend
  README.md
```

## Environment Variables

Create local env files from the included examples:

```bash
client/.env.example  -> client/.env
server/.env.example  -> server/.env
```

### Client

`client/.env`

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_ORIGIN=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### Server

`server/.env`

```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/chat-app
JWT_SECRET=replace-with-a-strong-secret
CLIENT_URLS=http://localhost:5173,http://localhost:5174
ARCJET_KEY=
RESEND_API=
EMAIL_FROM=
EMAIL_FROM_NAME=Chat App
```

Notes:
- `CLIENT_URLS` accepts a comma-separated list of allowed frontend origins.
- `JWT_SECRET` should be a strong private secret in production.
- `ARCJET_KEY` and `RESEND_API` are optional unless you enable those integrations.

## Installation

Install dependencies in both apps:

```bash
cd server
npm install
```

```bash
cd client
npm install
```

## Running Locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Default local URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Available Scripts

### Client

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Server

```bash
npm run dev
```

## API Overview

Base server URL: `http://localhost:3000/api`

### Auth Routes

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/check`
- `PUT /auth/updateProfile`

### Message Routes

- `GET /messages/contacts`
- `GET /messages/chats`
- `GET /messages/:id`
- `POST /messages/send/:id`

## Realtime Events

Socket.IO is used for live updates.

### Server emits

- `getOnlineUsers`: current online user ids
- `newMessage`: delivered to the receiver when a new message is created

## Authentication Flow

- User logs in or signs up
- Server sets a JWT cookie
- Client calls `/auth/check` on app load
- Socket connection uses the authenticated cookie
- Protected routes validate the JWT and load the current user

## File Uploads

- Profile images are uploaded through `updateProfile`
- Message images are uploaded through `sendMessage`
- Uploaded files are served from `/uploads`

`server/uploads` is ignored in git and should not be committed.

## Linting

Run frontend linting with:

```bash
cd client
npm run lint
```

## Push Safety

The repository is configured to ignore:
- `.env` files
- `node_modules`
- build output
- uploaded files
- common local editor files

Before pushing:
1. Make sure `server/.env` and `client/.env` are not tracked.
2. Make sure no secrets are hardcoded in source files.
3. Rotate secrets if they were ever committed previously.

## Current Notes

- The backend currently stores uploads locally in `server/uploads`.
- Some optional integrations such as Arcjet and Resend exist in the codebase but may not be active.
- The root `package.json` is minimal; most app commands are run from `client/` and `server/`.

## Future Improvements

- Add message read receipts
- Add typing indicators
- Add production deployment configuration
- Add tests for API and realtime flows
- Add cloud storage for uploaded files
