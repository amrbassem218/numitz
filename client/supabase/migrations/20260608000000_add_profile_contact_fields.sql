alter table public.profiles
  add column if not exists middle_name text,
  add column if not exists phone_number text,
  add column if not exists address text,
  add column if not exists city text;
