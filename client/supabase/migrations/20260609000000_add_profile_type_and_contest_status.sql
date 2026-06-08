ALTER TABLE profiles ADD COLUMN type TEXT NOT NULL DEFAULT 'user' CHECK (type IN ('user', 'developer'));
ALTER TABLE contests ADD COLUMN status TEXT NOT NULL DEFAULT 'public' CHECK (status IN ('public', 'private'));
