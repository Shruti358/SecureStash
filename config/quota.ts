// Configure per-user storage quota here. Keep it conservative to align with Supabase free tier constraints.
// You can raise this later if you upgrade your plan.

export const DEFAULT_USER_STORAGE_LIMIT_GB = 1; // per-user cap (GB)
export const BYTES_IN_GB = 1024 * 1024 * 1024;
export const DEFAULT_USER_STORAGE_LIMIT_BYTES = DEFAULT_USER_STORAGE_LIMIT_GB * BYTES_IN_GB;
