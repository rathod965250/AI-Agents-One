// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uilnynmclpohscpsequg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);