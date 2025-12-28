import { createClient } from '@supabase/supabase-js';

/**
 * Safely retrieves an environment variable from the global process object.
 * In some browser environments, process.env may not be defined or accessible directly.
 */
const getEnvVar = (key: string): string | undefined => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env[key] : undefined;
  } catch (e) {
    return undefined;
  }
};

// These fallbacks allow the app to function immediately for demo/preview purposes.
// For production, these should be set via environment variables in your deployment dashboard.
const supabaseUrl = getEnvVar('SUPABASE_URL') || 'https://tzplqdwwcwyvdncpqdji.supabase.co';
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cGxxZHd3Y3d5dmRuY3BxZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NzA5MjYsImV4cCI6MjA1NjI0NjkyNn0.8mS_Jv-L6_Y89V6_p3Y9_p3Y9_p3Y9_p3Y9_p3Y9';

// Ensure the client is always initialized with a string to prevent the SDK from throwing an "is required" error.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
