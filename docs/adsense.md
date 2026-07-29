# AdSense launch checklist

WorldTime contains a deliberately gated AdSense integration. No Google advertising
script or ad request is emitted until every required value is valid and both safety
switches are enabled.

## Where ads are permitted

- Time guide pages: one unit after the sourced article.
- City-pair converter pages: one unit after working-hour, date-boundary and DST context.
- No units on the 404, privacy page or other low-value utility pages.

Google's inventory policy explicitly identifies error pages as unsuitable for
Google-served ads. Keep the 404 ad-free even though it contains useful recovery content.

## Before enabling

1. Add `universaltime.app` to AdSense and obtain the `ca-pub-...` publisher ID.
2. Create one responsive display unit for guides and one for converters.
3. In AdSense **Privacy & messaging**, configure Google's certified CMP for the EEA,
   United Kingdom and Switzerland (or use another Google-certified CMP).
4. Make sure `privacy@universaltime.app` forwards to a monitored mailbox, or set
   `PUBLIC_PRIVACY_EMAIL` to another monitored address.
5. Set the production build variables:

```text
PUBLIC_ADSENSE_CLIENT=ca-pub-YOUR_ID
PUBLIC_ADSENSE_GUIDE_SLOT=YOUR_GUIDE_SLOT
PUBLIC_ADSENSE_CONVERTER_SLOT=YOUR_CONVERTER_SLOT
PUBLIC_ADSENSE_CONSENT_READY=true
PUBLIC_ADSENSE_ENABLED=true
```

6. Set `ADSENSE_PUBLISHER_ID` in `wrangler.jsonc` to the matching `pub-...`
   value. The Worker publishes `/ads.txt` directly because Cloudflare static
   assets can treat extension-shaped Astro routes as HTML fallbacks.
7. Build and deploy. Confirm:
   - `/ads.txt` contains your `pub-...` entry.
   - the privacy page reports Advertising as active;
   - ad code appears on guide and converter pages;
   - ad code does not appear on `/404.html` or `/privacy`.

## Emergency stop

Set `PUBLIC_ADSENSE_ENABLED=false` and redeploy. This removes both the AdSense loader
and individual ad units while leaving the page layouts intact.
