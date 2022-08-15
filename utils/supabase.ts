import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://qucxmvpxawxfhcaefzyb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1Y3htdnB4YXd4ZmhjYWVmenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjA0MTE1MjksImV4cCI6MTk3NTk4NzUyOX0.YrwTBgfi-PPPYJJnkdDBUdq87AOj8dxY4N2JTcfdC5w",
);
