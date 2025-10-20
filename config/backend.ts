// Backend configuration for calling Cloud Functions HTTP endpoints
// Fill in your Firebase project ID below (the same one you deploy functions to).
export const CLOUD_REGION = 'us-central1';
export const FIREBASE_PROJECT_ID = 'stash-37011';
export const FUNCTION_BASE_URL = `https://${CLOUD_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;
