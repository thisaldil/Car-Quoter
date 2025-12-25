function getEnvString(key) {
  const value = import.meta.env?.[key];
  return typeof value === "string" ? value : "";
}

export function getBackendUrl() {
  const configured = getEnvString("VITE_BACKEND_URL").trim();
  return configured || "https://car-quoter-server.vercel.app";
}

export function getGoogleClientId() {
  return getEnvString("VITE_GOOGLE_CLIENT_ID").trim();
}

export function getCloudinaryCloudName() {
  return getEnvString("VITE_CLOUDINARY_CLOUD_NAME").trim();
}

export function getCloudinaryUploadPreset() {
  const imagePreset = getEnvString("VITE_CLOUDINARY_IMAGE_UPLOAD_PRESET").trim();
  if (imagePreset) return imagePreset;
  return getEnvString("VITE_CLOUDINARY_UPLOAD_PRESET").trim();
}
