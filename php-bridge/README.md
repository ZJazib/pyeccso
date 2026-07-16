# PYECSO PHP API Bridge

This folder is the cPanel bridge for connecting the TanStack website to a hosting database over HTTPS.

## Important hosting notes

- **phpMyAdmin is for MySQL/MariaDB.** Use `schema.mysql.sql` in phpMyAdmin.
- PostgreSQL is included as `schema.postgresql.sql`, but it requires PostgreSQL hosting tools such as pgAdmin/Adminer, not phpMyAdmin.
- Because the PHP files run on the same cPanel account as the database, you normally do **not** need to keep `%` remote database access open. Use `localhost` in `config.php` where possible.

## Upload steps

1. Create this folder on cPanel: `public_html/pyecso-api/`.
2. Upload everything inside `php-bridge/api/` into that folder.
3. Rename `config.example.php` to `config.php`.
4. Edit `config.php` with your cPanel database name, user, password, allowed website origin, setup token and JWT secret.
5. In phpMyAdmin, select your database and import `schema.mysql.sql`.
6. Visit `https://www.pyecso.org.af/pyecso-api/health`. It should return JSON with `"ok": true`.
7. Create the first admin user:

```bash
curl -X POST "https://www.pyecso.org.af/pyecso-api/setup/admin" \
  -H "Content-Type: application/json" \
  -H "X-Setup-Token: CHANGE_THIS_SETUP_TOKEN" \
  -d '{"username":"admin","email":"admin@pyecso.org.af","full_name":"PYECSO Admin","password":"CHANGE_THIS_PASSWORD"}'
```

8. Open the site admin panel at `/admin` and sign in.

## Google login

Google login support is prepared in the PHP bridge at `/auth/google`. To activate it, create a Google OAuth Web Client ID and put it in `config.php` under `google.client_id`. The frontend button can then be enabled against the same client ID.

## API routes

- `GET /health`
- `POST /setup/admin`
- `POST /auth/login`
- `POST /auth/google`
- `GET /auth/me`
- `GET /content?resource=pages&language=en`
- `POST /content?resource=pages`
- `PUT /content?resource=pages&id=1`
- `DELETE /content?resource=pages&id=1`
- `GET /applications`
- `POST /applications`
- `PUT /applications?id=1`
