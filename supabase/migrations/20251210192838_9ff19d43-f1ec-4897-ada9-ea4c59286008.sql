-- Add user_id column to link profiles to authenticated users
ALTER TABLE public.user_profiles 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique constraint to ensure one profile per user
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id);

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can create profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can read profiles by id" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.user_profiles;

-- Create secure RLS policies that restrict access to own data only
CREATE POLICY "Users can read own profile" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile" 
ON public.user_profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" 
ON public.user_profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);