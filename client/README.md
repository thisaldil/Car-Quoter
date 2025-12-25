# Client (Vite + React)

## Available Scripts

In the project directory, you can run:

### `npm run dev` (or `npm start`)

Runs the app in development mode.\
Open the URL shown in the terminal (usually http://localhost:5173).

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Runs unit tests with Vitest.

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run preview`

Serves the production build locally.


## Environment variables

Vite exposes env vars on `import.meta.env` and only variables prefixed with `VITE_` are available to the client.

- `VITE_BACKEND_URL`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET` (or `VITE_CLOUDINARY_IMAGE_UPLOAD_PRESET`)
