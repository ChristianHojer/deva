import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ttryzuhvnngrdswnsshd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0cnl6dWh2bm5ncmRzd25zc2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNTU2MTUsImV4cCI6MjA1MjYzMTYxNX0.F6W6WG_EoSywYAdLv6MwICbvgKSqa1KSj8m8Sh8mElk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);