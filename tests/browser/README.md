# Browser regression tests

Run with the dev server up on `http://localhost:8080`:

```bash
python3 tests/browser/learn-apply-resume.py
```

## learn-apply-resume.py

Simulates returning from the Google OAuth full-page redirect on `/learn`:

1. Seeds `sessionStorage['pyecso.bridge.token']` (student JWT stand-in) and
   `sessionStorage['pyecso.pendingApplyId'] = 'eng-b1'`.
2. Mocks `GET /pyecso-api/auth/me` to resolve as a `student` user.
3. Loads `/learn` and asserts the Apply modal opens for the exact program
   that was pending, and that `pendingApplyId` is cleared afterwards.

Fails if the resume effect regresses (wrong storage key, missing cleanup,
or the modal not reopening for the correct program).
