-- 1. Create Tables for Images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  category TEXT
);

CREATE TABLE IF NOT EXISTS campus_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_images ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Read Policies
CREATE POLICY "Allow public read-only access to gallery_images"
ON gallery_images FOR SELECT
USING (true);

CREATE POLICY "Allow public read-only access to campus_images"
ON campus_images FOR SELECT
USING (true);

-- 4. Instructions for Storage:
-- - Create a public bucket named 'images' in Supabase Storage.
-- - Upload your images to the bucket.
-- - Insert the public URLs into the 'gallery_images' and 'campus_images' tables.
