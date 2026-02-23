
-- follow up date
alter table public.applications
add column if not exists follow_up_date date;