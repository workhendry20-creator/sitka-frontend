// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Masukkan URL dan Anon Key yang Senior lihat di Safari tadi
const supabaseUrl = 'https://higkyyqaveqemxuqjqyk.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZ2t5eXFhdmVxZW14dXFqcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODc1MjMsImV4cCI6MjA5NDc2MzUyM30.JVX6nge7rqC3-an9WmSTKURIbct77Ms_dVI6dG2M8vM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);