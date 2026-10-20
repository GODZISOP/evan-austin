# Store Factory deployment

These are setup instructions. No deployment, database migration, DNS change, or domain verification has been performed.

## Demo and hosted data

The local demo is browser-only. Its data is local to that browser and is not shared with customers, other browsers, or devices. Real hosted stores need Supabase for shared persistence and authentication.

## Supabase setup

1. Create a Supabase project.
2. Run `store-factory/supabase/schema.sql` in the project's SQL editor as an administrator. This is an initial schema for a fresh database; it is not a rerunnable migration. If these tables already exist, review and migrate them separately.
3. In the Supabase dashboard, open **Authentication > Users** and create the owner's user account with an email and password. Complete email confirmation if required by your authentication settings. The application has no signup UI; owners sign in with their provisioned accounts.
4. Configure the production site URL and any required redirect URLs in Supabase Auth for the deployed application.
5. Set the public frontend variables below before building.

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key |
| `VITE_PLATFORM_DOMAIN` | Optional base hostname for platform store addresses, without a scheme, path, or trailing slash |

`VITE_` variables are embedded in the browser bundle. Never use that prefix for secrets, including a Supabase service-role key, secret API key, database password, or Vercel token. Keep administrative credentials in trusted server-side or operator environments. Rebuild after changing frontend variables.

## Vercel build settings

Import the repository into Vercel and use:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root Directory | `store-factory` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add the environment variables to the intended Vercel environments before deploying. For a local production build, run `npm install` followed by `npm run build` from `store-factory`. Configure a fallback to `index.html` if the application uses client-side routes that must work on direct navigation.

Setting `VITE_PLATFORM_DOMAIN` alone does not configure DNS or hosting. Configure any platform hostname, wildcard routing, and TLS separately in the hosting project before advertising those addresses.

## Data and access rules

`public.stores` contains store settings and a `products` JSON array. Save changed settings and the complete products array in one store INSERT or UPDATE so they commit or roll back together. Separate browser requests are separate transactions. Concurrent full-array saves can overwrite earlier edits; this schema does not implement conflict detection or validate individual product fields.

Anonymous visitors can select published stores. Authenticated owners can read, insert, update, and delete their own stores, including drafts. Inserts and updates require `owner_id` to match `auth.uid()`; an owner cannot transfer a store to another user through an update. Published rows expose all their columns, so store records must contain only intended storefront data and no secrets. See the [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security).

Domains live only in `public.store_domains`; there is no domain column in `public.stores`. Anyone can read verified mappings, and owners can also read unverified mappings for their stores. Domain mapping visibility does not grant access to an unpublished store. Browser roles have no domain INSERT, UPDATE, or DELETE permissions or policies. Deleting a store cascades to its domain mappings.

## Connect a custom domain

Only a trusted service operator may register or verify a mapping. A hostname typed into the application is a request, not proof of ownership or a live connection.

1. Authenticate the requester and confirm that their user ID is the target store's `owner_id`. Independently verify control of the requested hostname using a DNS ownership challenge or the hosting provider's verification process. Routing an address to Vercel alone is not proof of ownership.
2. Add the exact hostname to the correct Vercel project under **Settings > Domains**. At the domain's DNS provider, enter the exact record types, names, and values shown by that project, including any ownership-verification records. Do not substitute guessed or copied generic DNS targets. Follow [Vercel's domain setup guide](https://vercel.com/docs/domains/set-up-custom-domain).
3. Wait for DNS propagation, successful Vercel verification, and a valid HTTPS certificate. Confirm that the hostname reaches the intended project.
4. Normalize the hostname to lowercase ASCII (punycode for an internationalized domain), remove whitespace and a trailing DNS dot, and omit any scheme, port, or path. The database rejects non-normalized hostnames. Register each hostname separately, including `www` when used.
5. Only after ownership and hosting checks succeed, insert the verified mapping through the Supabase SQL editor as an administrator or a trusted service using server-side credentials. The example below also checks the target store's owner; replace the example hostname and UUIDs with the verified values:

   ```sql
   insert into public.store_domains (hostname, store_id, verified)
   select 'shop.example.com', id, true
   from public.stores
   where id = '00000000-0000-0000-0000-000000000001'::uuid
     and owner_id = '00000000-0000-0000-0000-000000000002'::uuid;
   ```

   Confirm exactly one row was inserted. Zero rows means the store/owner pair did not match. A duplicate-hostname error requires operator investigation; do not overwrite another store's mapping. The SQL owner check does not replace DNS ownership verification.
6. Confirm the store is published and test its public page over HTTPS while signed out. Mark the connection live only after this succeeds. Reverify ownership before any reassignment, and revoke mappings when domain control is lost.

The schema does not automate Vercel registration, DNS updates, ownership verification, or connection-status checks. A `verified` flag records an operator's completed checks; it does not perform them.

## Verify before launch

Using real anon and owner sessions rather than the administrator SQL session, check that visitors can read published stores but not drafts; the owner can save their own store; another user cannot modify it; and attempts to change its owner fail. Confirm both browser roles cannot write domain mappings, owners can read their own unverified mappings, and the public can read verified mappings. Test a saved products array from a second browser against Supabase to confirm persistence is shared.
