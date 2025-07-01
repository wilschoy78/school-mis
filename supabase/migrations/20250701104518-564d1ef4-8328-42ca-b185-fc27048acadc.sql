
-- Add default UUID generation to the profiles table id column
ALTER TABLE public.profiles 
ALTER COLUMN id SET DEFAULT gen_random_uuid();
