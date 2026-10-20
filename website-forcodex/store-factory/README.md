# Store Factory

One Vite/React application for client eCommerce stores and service-business websites. Each client has its own content, products, theme, pages and section library. The former website builder remains available at `/?workspace=legacy`; new clients should use the main commerce workspace.

## Local preview

```powershell
cd D:\Downloads\evan-austin\website-forcodex\store-factory
npm install
npm run dev
```

Open [http://127.0.0.1:5180/](http://127.0.0.1:5180/). The main workspace starts in a browser-only demo with three published sample stores. Use each client's **Preview** link, or open [fashion-demo](http://127.0.0.1:5180/?store=fashion-demo&demo=1) directly. Draft stores preview privately inside the editor. Changes in the editor preview appear immediately; Save draft persists privately, while Publish locally updates the demo's public snapshot.

The editor supports 12 page types, products/variants/stock, collections, theme settings, page section reorder, and a visual custom-section builder with 15 block types, responsive controls and a per-store reusable section library. Orders are requests awaiting payment; there is no card collection or payment provider.

## Supabase mode

The local `.env.local` already contains the provided public Supabase URL and publishable key. Do not put a database password, service-role key or hosting token in any `VITE_` variable.

In **Publishing setup**, copy and run the displayed SQL in Supabase SQL Editor. It contains `supabase/commerce.sql` followed by `supabase/migrations/002_section_library.sql`. Create an agency user in Supabase Authentication, then select **Open connected workspace** and sign in. Demo stores are not uploaded automatically. An operator must run the SQL; it has not been applied by this project.

Supabase stores private drafts and public publication snapshots separately. Publishing updates the snapshot without a frontend redeploy. Realtime subscriptions refresh open public stores and agency workspaces when the Supabase Realtime publication is enabled by the SQL.

## Deployment and domains

Deploy the `store-factory` directory to Vercel with `npm install`, `npm run build`, and output `dist`. Set the same public Supabase environment values on Vercel. The master app is deployed once; `?store=client-slug` selects a published client store. Custom domains require separate DNS, hosting-project verification, and an administrator-managed `commerce_domains` mapping. Saving a requested domain in the editor does not connect it automatically.

This repository has **not** deployed to Vercel or migrated the user's Supabase project. No production payment integration is present. Image uploads are compressed into the store JSON; for large catalogues use hosted HTTPS image URLs instead.

## Verification

`npm test` checks the original model, `npm run build` builds the current app, and `npm run qa` runs browser checks against a running local server. On low-memory Windows machines, set `$env:GOMAXPROCS='2'` before building. The browser QA writes screenshots to `qa-output/`.
