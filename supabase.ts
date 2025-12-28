import { createClient } from '@supabase/supabase-js';

/**
 * Lino Studio NG - Direct Supabase Connection
 * Hardcoded credentials to ensure immediate availability and zero runtime errors.
 */
const SUPABASE_URL = 'https://tzplqdwwcwyvdncpqdji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cGxxZHd3Y3d5dmRuY3BxZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODU2OTAsImV4cCI6MjA4MjQ2MTY5MH0.OMuKS-w03FNIWKTc82pgwg8oKYSq7Wfu-8x3AU7vtzc';

/**
 * Direct initialization of the Supabase client.
 * This guarantees that 'supabaseUrl' and 'supabaseKey' are never undefined.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
