do $$ begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Public read media campaigns') then
    create policy "Public read media campaigns" on storage.objects for select using (bucket_id = 'media' and (storage.foldername(name))[1] = 'campaigns');
  end if;
end $$;