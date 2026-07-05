-- ==========================================
-- Dijital Soyağacı - Supabase Database Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- ENUM Types
-- ==========================================

CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE relation_type AS ENUM ('Parent-Child', 'Spouse', 'Sibling');

-- ==========================================
-- PROFILES TABLE
-- ==========================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  email TEXT
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- TREES TABLE
-- ==========================================

CREATE TABLE trees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- NODES TABLE (Family Members)
-- ==========================================

CREATE TABLE nodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tree_id UUID REFERENCES trees(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  maiden_name TEXT,
  birth_date DATE,
  death_date DATE,
  is_alive BOOLEAN DEFAULT TRUE,
  birth_place TEXT,
  biography TEXT,
  profile_image_url TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  gender gender_type NOT NULL DEFAULT 'Other',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- EDGES TABLE (Relationships)
-- ==========================================

CREATE TABLE edges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tree_id UUID REFERENCES trees(id) ON DELETE CASCADE NOT NULL,
  source_node_id UUID REFERENCES nodes(id) ON DELETE CASCADE NOT NULL,
  target_node_id UUID REFERENCES nodes(id) ON DELETE CASCADE NOT NULL,
  relation_type relation_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent duplicate edges
  UNIQUE(source_node_id, target_node_id, relation_type)
);
