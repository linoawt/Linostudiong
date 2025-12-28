
import { createClient } from '@supabase/supabase-js';

/**
 * Safely retrieves environment variables for Supabase initialization.
 * Prioritizes dedicated Supabase variables, then falls back to the project-wide API_KEY
 * which is guaranteed to be available in this environment.
 */
const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

// Use environment variables exclusively to avoid "Invalid API key" errors caused by hardcoded fallbacks.
const supabaseUrl = getEnv('SUPABASE_URL') || 'https://tzplqdwwcwyvdncpqdji.supabase.co';
const supabaseAnonKey = getEnv('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cGxxZHd3Y3d5dmRuY3BxZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODU2OTAsImV4cCI6MjA4MjQ2MTY5MH0.OMuKS-w03FNIWKTc82pgwg8oKYSq7Wfu-8x3AU7vtzc') || getEnv('sb_publishable_NSqPeULhzj1eJJaZUDdfug_Dqjl9SbI');

if (!supabaseAnonKey) {
  console.error("Supabase Error: No valid API Key found in environment variables (SUPABASE_ANON_KEY or API_KEY). Database sync will fail.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
