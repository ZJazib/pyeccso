import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).parent / "screenshots"
OUT.mkdir(exist_ok=True)

FAKE_USER = {
    "id": 1, "email": "s@example.com", "full_name": "Test Student",
    "role": "student", "created_at": "2026-01-01T00:00:00Z",
    "google_linked": True,
}

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()

        # Intercept bridge /auth/me so usePortalUser resolves as a student.
        async def route_me(route):
            await route.fulfill(status=200, content_type="application/json",
                                body=json.dumps({"user": FAKE_USER}))
        # Later routes win in Playwright, so register the fallback first.
        await ctx.route("**/pyecso-api/**", lambda r: r.fulfill(status=500, body="unexpected"))
        await ctx.route("**/pyecso-api/auth/me", route_me)

        # Seed token + pending apply id as if returning from a Google redirect.
        await page.goto("http://localhost:8080/", wait_until="domcontentloaded")
        await page.evaluate("""() => {
          sessionStorage.setItem('pyecso.bridge.token', 'fake-jwt');
          sessionStorage.setItem('pyecso.pendingApplyId', 'eng-b1');
        }""")

        page.on("console", lambda m: print("CONSOLE", m.type, m.text[:200]))
        page.on("request", lambda r: print("REQ", r.url) if "pyecso" in r.url or "auth" in r.url else None)
        await page.goto("http://localhost:8080/learn", wait_until="domcontentloaded")
        # Wait for the Apply modal (heading contains program title).
        modal_title = page.locator("div.fixed.inset-0 h3")
        await modal_title.first.wait_for(timeout=8000)
        await page.screenshot(path=str(OUT / "1_resumed.png"))

        # Assert: modal is the Apply form for eng-b1, sessionStorage cleared.
        title_text = await modal_title.first.inner_text()
        pending = await page.evaluate("() => sessionStorage.getItem('pyecso.pendingApplyId')")
        has_submit = await page.locator("div.fixed.inset-0 form button[type=\"submit\"]").count()
        print(json.dumps({"title": title_text, "pending_after": pending, "has_form": bool(has_submit)}))

        assert pending is None, f"pending id should be cleared, got {pending}"
        assert has_submit, "apply form did not render"
        print("PASS")
        await browser.close()

asyncio.run(main())
