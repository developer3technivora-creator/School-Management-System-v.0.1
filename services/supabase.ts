import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zzvvoeceiocwhaofobiw.supabase.co';
// This is the public Supabase anon key provided by the user. 
// It is safe to be exposed in a client-side application.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dnZvZWNlaW9jd2hhb2ZvYml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMzQ3NzMsImV4cCI6MjA3NTcxMDc3M30.BtnJpv-NUhy11OPZGGQGhO1ZE71FbZubTDrx8qORUjI';


export const supabase = createClient(supabaseUrl, supabaseKey);