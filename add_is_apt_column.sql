-- Migration: Add is_apt column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_apt BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN public.profiles.is_apt IS 'Indicates if the member is spiritualy apt for privileges.';

-- Sync is_apt with can_manage_prayers if it exists
UPDATE public.profiles 
SET is_apt = can_manage_prayers 
WHERE can_manage_prayers IS NOT NULL;
