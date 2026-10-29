# Car Quoter

Car Quoter is a full-stack web application for creating, managing, and sending
professional vehicle service invoices. Users can sign in, enter or upload
invoice information, apply reusable templates, review generated invoices, and
send invoices by email.

## Features

- Local registration and login with JWT authentication
- Google sign-in and registration
- Dashboard with recent invoices and revenue summaries
- Manual vehicle and service invoice entry
- PDF invoice upload and OCR-assisted data extraction
- Reusable invoice templates with a rich-text editor
- Invoice preview, PDF generation, download, and email delivery
- Invoice history, deletion, and detail views
- CRM and user settings pages
- Light, dark, and system theme support
- Cloudinary image uploads for business or vehicle assets

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, React Router, Vite, Tailwind-compatible CSS, Framer Motion |
| Backend | Node.js, Express, Multer, JWT, bcrypt |
| Database | MongoDB with Mongoose |
| Document processing | `pdf-parse`, Tesseract.js, Google Document AI, Mindee, OpenRouter |
| Documents | `@react-pdf/renderer`, PDF.js, jsPDF, html2canvas |
| Deployment | Vercel-compatible frontend and server configuration |

## Repository structure

```text
Car-Quoter/
├── client/                 # React/Vite frontend
│   ├── src/components/     # Pages and reusable UI components
│   ├── src/utils/          # API and environment helpers
│   └── package.json
├── server/                 # Express API
│   ├── api/server.js       # API entry point
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose models
│   ├── routes/             # API route definitions
│   ├── services/           # OCR and external service integrations
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB database (local MongoDB or MongoDB Atlas)
- API credentials for the optional integrations you enable

## Local development

### 1. Clone the repository

```bash
git clone https://github.com/thisaldil/Car-Quoter.git
cd Car-Quoter
```

### 2. Install dependencies

Install dependencies independently for the client and server:

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure the server

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000

# MongoDB connection string
URI=mongodb://127.0.0.1:27017/car-quoter

# JWT signing secret
JWT_SECRET=replace-with-a-long-random-secret

# Google authentication
GOOGLE_CLIENT_ID=your-google-oauth-client-id

# Cloudinary signature generation
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Optional invoice email delivery
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password

# Optional Mindee invoice processing
MINDEE_API_KEY=your-mindee-api-key
```

The server also uses the Google Document AI service configuration in
`server/services/googleDocAiService.js`. Provide the required service account
credentials securely; do not commit private keys or other credentials to Git.

### 4. Configure the client

Create `client/.env`:

```env
# Use the local API during development
VITE_BACKEND_URL=http://localhost:5000

VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset
```

`VITE_CLOUDINARY_IMAGE_UPLOAD_PRESET` can be used instead of
`VITE_CLOUDINARY_UPLOAD_PRESET`. Only variables prefixed with `VITE_` are
exposed to the browser, so never put private secrets in the client `.env`.

### 5. Start the applications

Open two terminals:

```bash
# Terminal 1
cd server
npm run dev
```

```bash
# Terminal 2
cd client
npm run dev
```

The API is available at `http://localhost:5000` and the Vite development
server normally runs at `http://localhost:5173`.

Useful checks:

```text
GET http://localhost:5000/       API status message
GET http://localhost:5000/health Health check
```

## Available scripts

### Client

Run these commands from `client/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm start` | Start Vite |
| `npm run build` | Create a production build in `client/dist` |
| `npm run preview` | Preview the production build |
| `npm test` | Run the Vitest test suite |

### Server

Run these commands from `server/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Express API with Node |
| `npm start` | Start the API with Nodemon |

## API overview

The server exposes these route groups:

| Route group | Purpose |
| --- | --- |
| `/auth` | Local and Google authentication |
| `/user` | User profile and account operations |
| `/invoice` | Invoice upload, storage, retrieval, deletion, and email |
| `/template` | Create, update, list, and delete invoice templates |
| `/ocr` | Extract structured invoice data from uploaded PDFs |

Protected endpoints require the JWT returned during login or registration:

```http
Authorization: Bearer <token>
```

Example authentication request:

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "use-a-strong-password"
}
```

PDF upload endpoints accept `multipart/form-data`. Invoice uploads use the
`invoice` field; OCR analysis uses the `ticket` field. Uploaded PDFs are
limited to 5 MB on the invoice upload route.

## Deployment

### Client

Build the client from `client/`:

```bash
npm install
npm run build
```

Deploy the resulting `client/dist` directory to a static host such as Vercel.
Set `VITE_BACKEND_URL` to the deployed API URL before building.

### Server

The server includes `server/vercel.json` for Vercel's Node runtime. When
deploying elsewhere, use `server/api/server.js` as the application entry point,
configure the environment variables above, and ensure the deployment platform
can connect to MongoDB.

Update the allowed frontend origins in `server/api/server.js` when deploying
the client to a domain other than the configured production URL.

## Security notes

- Keep `.env` files, JWT secrets, API keys, email passwords, and service-account
  keys out of source control.
- Use a separate MongoDB database and credentials for development and
  production.
- Configure Google OAuth authorized origins and redirect settings for each
  deployed frontend URL.
- Restrict Cloudinary upload presets and MongoDB network access in production.

## License

No license file is currently included in this repository. Add a `LICENSE` file
before distributing the project under a specific open-source license.
