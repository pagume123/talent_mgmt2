-- Multi-tenant HR System Schema

-- 1. Helper Function (SECURITY DEFINER)
-- This function bypasses RLS to check the current user's profile.
-- It is the ONLY way to prevent "Infinite Recursion" when a policy 
-- needs to check the same table (profiles).
CREATE OR REPLACE FUNCTION get_my_profile() 
RETURNS TABLE (company_id UUID, role TEXT) AS $$
BEGIN
  RETURN QUERY SELECT p.company_id, p.role FROM profiles p WHERE p.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  archetype TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id),
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('admin', 'employee', 'supervisor')),
  telegram_id TEXT UNIQUE,
  supervisor_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Invitations Table (For linking TMA accounts)
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  token TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Policies Table
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  title_en TEXT NOT NULL,
  title_am TEXT,
  content_en TEXT,
  content_am TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Requests Table
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  type TEXT NOT NULL CHECK (type IN ('leave', 'expense', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Perks Table
CREATE TABLE IF NOT EXISTS perks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  title TEXT NOT NULL,
  description TEXT,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ENABLE RLS
-- ==========================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE perks ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES (NON-RECURSIVE)
-- ==========================================

-- ------------------------------------------
-- COMPANIES
-- ------------------------------------------
DROP POLICY IF EXISTS "companies_insert_auth" ON companies;
CREATE POLICY "companies_insert_auth" ON companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "companies_select_auth" ON companies;
CREATE POLICY "companies_select_auth" ON companies
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "companies_update_admin" ON companies;
CREATE POLICY "companies_update_admin" ON companies
  FOR UPDATE USING (
    id = (SELECT p.company_id FROM get_my_profile() p) AND
    (SELECT p.role FROM get_my_profile() p) = 'admin'
  );

-- ------------------------------------------
-- PROFILES
-- ------------------------------------------
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "profiles_select_company" ON profiles;
CREATE POLICY "profiles_select_company" ON profiles
  FOR SELECT USING (
    company_id = (SELECT p.company_id FROM get_my_profile() p)
  );

DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE USING (
    (SELECT p.role FROM get_my_profile() p) = 'admin' AND
    company_id = (SELECT p.company_id FROM get_my_profile() p)
  );

-- ------------------------------------------
-- ORG POLICIES (The content table)
-- ------------------------------------------
DROP POLICY IF EXISTS "policies_select_company" ON policies;
CREATE POLICY "policies_select_company" ON policies
  FOR SELECT USING (
    company_id = (SELECT p.company_id FROM get_my_profile() p)
  );

DROP POLICY IF EXISTS "policies_all_admin" ON policies;
CREATE POLICY "policies_all_admin" ON policies
  FOR ALL USING (
    (SELECT p.role FROM get_my_profile() p) = 'admin' AND
    company_id = (SELECT p.company_id FROM get_my_profile() p)
  );

-- ------------------------------------------
-- REQUESTS
-- ------------------------------------------
DROP POLICY IF EXISTS "requests_select_own" ON requests;
CREATE POLICY "requests_select_own" ON requests
  FOR SELECT USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "requests_select_supervisor" ON requests;
CREATE POLICY "requests_select_supervisor" ON requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = requests.profile_id AND p.supervisor_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "requests_select_admin" ON requests;
CREATE POLICY "requests_select_admin" ON requests
  FOR SELECT USING (
    (SELECT p.role FROM get_my_profile() p) = 'admin' AND
    company_id = (SELECT p.company_id FROM get_my_profile() p)
  );

DROP POLICY IF EXISTS "requests_update_authorized" ON requests;
CREATE POLICY "requests_update_authorized" ON requests
  FOR UPDATE USING (
    (SELECT p.role FROM get_my_profile() p) = 'admin' OR 
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = requests.profile_id AND p.supervisor_id = auth.uid())
  );

DROP POLICY IF EXISTS "requests_insert_own" ON requests;
CREATE POLICY "requests_insert_own" ON requests
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- ------------------------------------------
-- PERKS
-- ------------------------------------------
DROP POLICY IF EXISTS "perks_select_company" ON perks;
CREATE POLICY "perks_select_company" ON perks
  FOR SELECT USING (
    company_id = (SELECT p.company_id FROM get_my_profile() p)
  );

DROP POLICY IF EXISTS "perks_all_admin" ON perks;
CREATE POLICY "perks_all_admin" ON perks
  FOR ALL USING (
    (SELECT p.role FROM get_my_profile() p) = 'admin' AND
    company_id = (SELECT p.company_id FROM get_my_profile() p)
  );

-- ------------------------------------------
-- INVITATIONS
-- ------------------------------------------
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "invitations_all_admin" ON invitations;
CREATE POLICY "invitations_all_admin" ON invitations
  FOR ALL USING (
    (SELECT p.role FROM get_my_profile() p) = 'admin' AND
    company_id = (SELECT p.company_id FROM get_my_profile() p)
  );

-- Allow public lookup of pending tokens (used by TMA to start claim process)
DROP POLICY IF EXISTS "invitations_select_public" ON invitations;
CREATE POLICY "invitations_select_public" ON invitations
  FOR SELECT USING (status = 'pending');
