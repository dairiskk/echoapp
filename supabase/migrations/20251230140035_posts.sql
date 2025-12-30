-- Create posts table
create table if not exists public.posts (
  id bigserial primary key,
  created_at timestamptz default timezone('utc'::text, now()),
  sentence text not null,
  user_id uuid references auth.users(id)
);