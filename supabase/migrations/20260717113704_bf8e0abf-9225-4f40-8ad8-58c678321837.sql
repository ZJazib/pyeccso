
-- Scheduled publishing for content_items
ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS publish_at timestamptz,
  ADD COLUMN IF NOT EXISTS unpublish_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_content_items_publish_at ON public.content_items(publish_at) WHERE publish_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_content_items_unpublish_at ON public.content_items(unpublish_at) WHERE unpublish_at IS NOT NULL;

-- Function that flips statuses based on schedule
CREATE OR REPLACE FUNCTION public.apply_content_schedule()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto-publish scheduled items whose publish time has arrived
  UPDATE public.content_items
     SET status = 'published',
         published_at = COALESCE(published_at, publish_at, now()),
         updated_at = now()
   WHERE status = 'draft'
     AND publish_at IS NOT NULL
     AND publish_at <= now()
     AND (unpublish_at IS NULL OR unpublish_at > now());

  -- Auto-unpublish (archive) items whose unpublish time has passed
  UPDATE public.content_items
     SET status = 'archived',
         updated_at = now()
   WHERE status = 'published'
     AND unpublish_at IS NOT NULL
     AND unpublish_at <= now();
END;
$$;

-- Ensure pg_cron is enabled and schedule the job every minute
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'apply-content-schedule') THEN
    PERFORM cron.unschedule('apply-content-schedule');
  END IF;
  PERFORM cron.schedule(
    'apply-content-schedule',
    '* * * * *',
    $cron$ SELECT public.apply_content_schedule(); $cron$
  );
END $$;
