# Verification of the local working draft

The local server is http://127.0.0.1:5180. No hosted deployment is claimed.

## Automated and browser checks

- PASS: 10 Node tests cover trusted-host routing, custom-domain/query isolation, reserved slugs, product validation, image URL validation, sample records, and minor-unit order totals.
- PASS: browser loads five sample stores without JavaScript errors.
- PASS: create store, reject an empty store name, add a product, preview without losing edits, save, and reload preserve the new record in browser storage.
- PASS: order bag add/increase/decrease/close and WhatsApp URL construction use the selected store's products and totals. No message was sent.
- PASS: a saved demo query address selects the correct store; an unknown slug shows not found.
- PASS: store search shows an empty result state and returns to all stores after clearing.
- PASS: light and dark toggles apply; desktop and mobile screenshots were captured.
- PASS: no horizontal overflow at 1440, 900, 720, 390 and 320 pixels. Editor, products, domains and storefront also fit at 320 pixels.
- PASS: setup page exposes the SQL, and the connected workspace requires sign-in.

## Design filter review

- PASS, honesty: local browser persistence is labelled, products are explicit samples, no fabricated revenue or performance claims. The screen is labelled a working design draft.
- PASS, structure: the register supports selecting a client and editing its catalogue; no decorative chart or invented activity feed.
- PASS, interaction: native inputs, buttons, links and disclosure controls, visible focus styles, validation messages, loading/error/empty states.
- PASS, design choices: palette, typography, numbered register, spacing and default ENERGY 1 / RHYTHM 1 / MOTION 1 are documented in DESIGN.md. Brand swatches represent each store's saved colour.
- PASS, responsive implementation: browser checks identified a 320px tab overflow; wrapping was added and the browser suite then passed.

## External verification limits

The supplied Supabase project answered a read-only request, but returned PGRST205: public.stores does not exist in the schema cache. Database schema installation, real admin login, RLS checks with separate users, shared persistence, production DNS and SSL remain unverified. No database password or privileged project token was provided. The public key cannot run the schema migration.

The first server initially failed after a new build constant was added without restarting its configuration. A guarded constant and server restart fixed the error. The complete browser suite subsequently passed.
