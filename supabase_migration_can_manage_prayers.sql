-- Migration: Add granular privilege control for prayer management
-- Target Table: profiles

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS can_manage_prayers BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN public.profiles.can_manage_prayers IS 'Flag to allow/deny participation in prayer and preaching schedules.';

-- Update existing records to ensure they have the privilege by default
UPDATE public.profiles 
SET can_manage_prayers = TRUE 
WHERE can_manage_prayers IS NULL;
