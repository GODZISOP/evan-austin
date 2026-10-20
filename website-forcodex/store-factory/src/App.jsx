import React, { useEffect, useState } from 'react';
import { blankStore, validateStore, resolveTenant, money, orderSummary } from './model.js';
import { configured, configError, supabase, listStores, saveStore, getStore, getDomains } from './repository.js';
import schema from '../supabase/schema.sql?raw';

export default function App() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editor, setEditor] = useState(null);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState('');
  const [section, setSection] = useState('stores');
  const [message, setMessage] = useState('');
  const [dark, setDark] = useState(false);
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [revision, setRevision] = useState(0);
  const route = resolveTenant({ hostname: location.hostname, search: location.search, platformDomain: import.meta.env.VITE_PLATFORM_DOMAIN, deploymentHost: typeof __DEPLOYMENT_HOST__ === 'undefined' ? '' : __DEPLOYMENT_HOST__ });
  const [activeStore, setActiveStore] = useState(null);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError('');
    const demo = route.kind === 'slug' && new URLSearchParams(location.search).get('demo') === '1' && ['localhost', '127.0.0.1'].includes(location.hostname);
    const task = route.kind === 'platform' ? listStores(user, !connected) : getStore(route, demo);
    task.then(data => { if (!cancelled) route.kind === 'platform' ? setStores(data) : setActiveStore(data); }).catch(e => { if (!cancelled) setError(e.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [connected, user?.id, revision]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  async function save(value) {
    const saved = await saveStore(value, user, !connected);
    setStores(old => old.some(s => s.id === saved.id) ? old.map(s => s.id === saved.id ? saved : s) : [saved, ...old]);
    setEditor(null); setMessage(`${saved.name} saved ${connected ? 'to Supabase' : 'in this browser'}.`);
  }
  if (loading) return <main className="fatal"><p role="status">Loading your stores...</p></main>;
  if (error) return <main className="fatal"><h1>Could not load your stores</h1><p role="alert">{error}</p><button onClick={() => setRevision(r => r + 1)}>Try again</button>{route.kind === 'platform' && <><button onClick={() => { setConnected(false); setError(''); }}>Return to local demo</button><Setup /></>}</main>;
  if (route.kind !== 'platform') {
    return activeStore ? <Storefront store={activeStore} local={!configured || new URLSearchParams(location.search).get('demo') === '1'} /> : <main className="fatal"><h1>Store not found</h1><p>This address is not connected to a published store.</p></main>;
  }
  if (preview) return <><div className="preview-bar"><span>Unsaved preview · visible only to you</span><button onClick={() => setPreview(null)}>Back to workspace</button></div><Storefront key={preview.id} store={preview} /></>;
  return <div className="workspace">
    <a className="skip" href="#content">Skip to content</a>
    <header className="top"><a className="wordmark" href="/">Store Factory<span>Agency workspace</span></a><button className="quiet" onClick={() => setDark(!dark)}>{dark ? 'Light theme' : 'Dark theme'}</button></header>
    <div className="mode-note">{connected ? `Supabase workspace · ${user ? user.email : 'Sign in to manage your stores'}` : 'Local demo · Changes stay in this browser. Stores are not publicly live yet.'}</div>
    <div className="workspace-body"><aside className="sidebar"><p className="small-label">Workspace</p><nav>{[['stores', 'Your stores'], ['setup', 'Connection setup']].map(([id, label]) => <button key={id} aria-current={section === id ? 'page' : undefined} onClick={() => { setSection(id); setEditor(null); }}>{label}</button>)}</nav><div className="sidebar-note"><strong>One workspace.<br />Each store, its own identity.</strong><p>Create a store, add its catalogue, then connect its domain.</p><span>Working design draft</span></div></aside>
    <main id="content" className="main">
      {section === 'setup' ? <Setup onConnect={() => { setConnected(true); setSection('stores'); }} /> : connected && !user ? <Login onDemo={() => setConnected(false)} /> : editor ? <Editor key={editor.id} initial={editor} connected={connected} onSave={save} onCancel={() => setEditor(null)} onPreview={value => { setEditor(value); setPreview(value); }} /> : <>
        <div className="page-heading"><div><p className="small-label">Store register / {String(stores.length).padStart(2, '0')}</p><h1>Your stores</h1><p>Give each client a place of their own.</p></div><button className="primary" onClick={() => { setEditor(blankStore()); setMessage(''); }}>+ Create store</button></div>
        <p className="status" role="status">{message}</p>
        <div className="register-tools"><label>Find a store<input type="search" placeholder="Search name or store address" value={search} onChange={e => setSearch(e.target.value)} /></label><span>{stores.filter(s => s.published).length} preview-ready · {stores.filter(s => !s.published).length} drafts</span></div>
        <div className="store-register">{stores.filter(s => `${s.name} ${s.slug}`.toLowerCase().includes(search.toLowerCase())).map((s, i) => <article className="store-row" key={s.id}><span className="row-number">{String(i + 1).padStart(2, '0')}</span><div className="store-identity"><span className="swatch" style={{ backgroundColor: s.brand_color }} aria-hidden="true" /><div><h2>{s.name}</h2><p>/?store={s.slug}</p></div></div><div className="store-meta"><span>{s.products.length} products</span><span>{s.template} / {s.currency}</span></div><span className="state">{s.published ? 'Preview ready' : 'Draft'}</span><div className="row-actions"><button onClick={() => setEditor(structuredClone(s))}>Manage</button><button className="quiet" onClick={() => setPreview(s)}>Preview</button></div></article>)}</div>
        {!stores.some(s => `${s.name} ${s.slug}`.toLowerCase().includes(search.toLowerCase())) && <div className="empty"><h2>No matching stores</h2><p>Try another search or create your first store.</p></div>}
        <div className="register-footer"><p>{connected ? 'Showing stores owned by your account.' : <>The five starting stores are examples from your brief.<br />Sample products and prices are for testing only.</>}</p><button className="quiet" onClick={() => setSection('setup')}>How to make a store live</button></div>
        {connected && <div className="row-actions"><button onClick={() => setConnected(false)}>Return to local demo</button><button onClick={async () => { const { error } = await supabase.auth.signOut(); if(error) setMessage(error.message); }}>Sign out</button></div>}
      </>}
    </main></div></div>;
}

function Editor({ initial, connected, onSave, onCancel, onPreview }) {
  const [form, setForm] = useState(initial);
  const [tab, setTab] = useState('details');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (field, value) => setForm(s => ({ ...s, [field]: value }));
  function product(index, field, value) { setForm(s => ({ ...s, products: s.products.map((p, i) => i === index ? { ...p, [field]: value } : p) })); }
  async function submit(e) { e.preventDefault(); setSaving(true); setError(''); try { await onSave(form); } catch (e) { setError(e.message); } finally { setSaving(false); } }
  function field(name, label, type = 'text', required = false) { return <label key={name}>{label}<input name={name} type={type} required={required} value={form[name]} onChange={e => update(name, e.target.value)} /></label>; }
  return <form onSubmit={submit} noValidate aria-busy={saving}>
    <button type="button" className="quiet" onClick={onCancel}>Back to stores</button><div className="page-heading"><div><p className="small-label">Store editor</p><h1>{initial.name || 'Create a store'}</h1><p>Brand details, catalogue and order requests in one place.</p></div><button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save store'}</button></div>
    <div className="tabs" role="group" aria-label="Editor sections">{['details', 'products', 'domain'].map(t => <button type="button" key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</div>
    {error && <p className="error" role="alert">{error}</p>}
    {tab === 'details' && <div className="editor-grid"><section className="panel"><h2>Store identity</h2><div className="form-grid">{field('name', 'Store name', 'text', true)}{field('slug', 'Store address', 'text', true)}{field('tagline', 'Tagline')}{field('announcement', 'Announcement')}<label>Template<select value={form.template} onChange={e => update('template', e.target.value)}><option value="essentials">Essentials</option><option value="editorial">Editorial</option><option value="wholesale">Wholesale</option></select></label><label>Currency<select value={form.currency} onChange={e => update('currency', e.target.value)}>{['USD', 'AED', 'PKR'].map(v => <option key={v}>{v}</option>)}</select></label>{field('brand_color', 'Brand colour', 'color')}</div><label className="checkbox"><input type="checkbox" checked={form.published} onChange={e => update('published', e.target.checked)} />{connected ? 'Publish this store when saved (anyone with its address can view it)' : "Enable this store's local preview link"}</label></section><section className="panel"><h2>Contact & orders</h2><p>Use your client's real details. An empty WhatsApp field disables checkout.</p><div className="form-grid">{field('email', 'Contact email', 'email')}{field('phone', 'Phone', 'tel')}{field('whatsapp', 'WhatsApp with country code', 'tel')}{field('address', 'Business address')}</div></section></div>}
    {tab === 'products' && <section><div className="section-heading"><div><h2>Product catalogue</h2><p>Prices use {form.currency}. Images are optional HTTPS URLs.</p></div><button type="button" onClick={() => update('products', [...form.products, { id: crypto.randomUUID(), name: '', sku: '', category: '', price: '', description: '', image: '' }])}>+ Add product</button></div>{!form.products.length && <div className="empty"><h3>Your catalogue is empty</h3><p>Add your first product to show it in the storefront.</p></div>}{form.products.map((p, i) => <article className="panel product-editor" key={p.id}><div className="section-heading"><h3>Product {i + 1}</h3><button type="button" className="quiet" onClick={() => update('products', form.products.filter(item => item.id !== p.id))}>Remove product {i + 1}</button></div><div className="form-grid">{[['name', 'Product name'], ['sku', 'SKU'], ['category', 'Category'], ['price', `Price (${form.currency})`], ['image', 'Image URL'], ['description', 'Description']].map(([key, label]) => <label key={key}>{label}<input type={key === 'price' ? 'number' : key === 'image' ? 'url' : 'text'} min={key === 'price' ? '0' : undefined} step={key === 'price' ? '.01' : undefined} value={p[key]} onChange={e => product(i, key, e.target.value)} /></label>)}</div></article>)}</section>}
    {tab === 'domain' && <section className="panel prose"><h2>Your store address</h2><code>{location.origin}/?store={form.slug || 'your-store'}{!connected && '&demo=1'}</code><p>{connected ? 'Save and publish the store to make it available at this address. Public access also requires a deployment.' : 'This demo link works in this browser after you save and enable the store. It is not yet a shared public website.'}</p>{connected && <Domains storeId={initial.id} />}<h3>Connect a custom domain after deployment</h3><ol><li>Deploy the master application and connect Supabase.</li><li>Add the client's domain to the same Vercel project.</li><li>Copy the DNS records Vercel provides into the domain provider.</li><li>Verify ownership and save the domain-to-store mapping in the database.</li></ol><p>Custom domain registration and verification are not automated in this version.</p></section>}
    <div className="form-footer"><button type="button" onClick={() => { try { onPreview(validateStore(form)); } catch(e) { setError(e.message); } }}>Preview changes</button><button type="button" className="quiet" onClick={onCancel}>Cancel</button><button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save store'}</button></div>
  </form>;
}

function Setup({ onConnect }) {
  const [status, setStatus] = useState('');
  const [checking, setChecking] = useState(false);
  async function check() {
    setChecking(true); setStatus('Checking the stores table...');
    try {
      const { error } = await supabase.from('stores').select('id').limit(0);
      setStatus(error ? `Database setup needed: ${error.message}` : 'Connection ready. Sign in with a Supabase Auth user to manage stores.');
    } catch (e) { setStatus(`Could not connect: ${e.message}`); }
    finally { setChecking(false); }
  }
  return <><div className="page-heading"><div><p className="small-label">From local to live</p><h1>Connection setup</h1><p>Your stores need a shared database before customers can visit.</p></div></div><section className="panel prose"><h2>Supabase</h2><p>{configured ? 'Project URL and public key are configured. Check that the database tables exist before signing in.' : configError ? 'One environment value is missing. Set both the project URL and the public key.' : 'Add the project URL and public key to .env.local to connect your database.'}</p><ol><li>Run <code>supabase/schema.sql</code> once in your Supabase SQL Editor.</li><li>Create your admin user in Supabase Authentication. Disable public signups if this workspace is only for your agency.</li><li>Check the connection, then sign in to the connected workspace.</li></ol><div className="row-actions"><button onClick={async () => { try { await navigator.clipboard.writeText(schema); setStatus('SQL copied. Paste it into Supabase SQL Editor and run it once.'); } catch { setStatus('Clipboard unavailable. Select the SQL below and copy it.'); } }}>Copy database SQL</button>{configured && <button disabled={checking} onClick={check}>{checking ? 'Checking...' : 'Check connection'}</button>}{configured && onConnect && <button className="primary" onClick={onConnect}>Open connected workspace</button>}</div><p role="status">{status}</p><details><summary>View database SQL</summary><textarea aria-label="Database SQL" value={schema} readOnly rows={14} /></details><h2>Vercel</h2><p>Use <code>store-factory</code> as the project root. Build with <code>npm run build</code> and serve <code>dist</code>.</p><p>Add the same public environment variables in Vercel. Domain verification and DNS setup are required for each custom domain.</p><p>The full guide is in <code>docs/DEPLOYMENT.md</code>. No deployment has been performed.</p></section></>;
}

function Login({ onDemo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; }
    catch (e) { setError(e.message); }
    finally { setBusy(false); setPassword(''); }
  }
  return <section className="login"><h1>Sign in to your workspace</h1><p>Use the user you created in Supabase Authentication.</p><form className="panel" onSubmit={submit}><label>Email<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>{error && <p role="alert" className="error">{error}</p>}<button className="primary" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button></form><button className="quiet" onClick={onDemo}>Return to local demo</button></section>;
}

function Domains({ storeId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    getDomains(storeId).then(d => { if (!cancelled) setData(d); }).catch(e => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [storeId]);
  return <div><h3>Domain mappings</h3>{error ? <p role="alert">{error}</p> : data === null ? <p role="status">Loading domains...</p> : data.length ? <ul>{data.map(d => <li key={d.hostname}>{d.hostname}: {d.verified ? 'Ownership verified' : 'Verification pending'}</li>)}</ul> : <p>No custom domain is connected to this store.</p>}</div>;
}

function Storefront({ store, local = true }) {
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState(false);
  const order = orderSummary(store, quantities);
  const count = order.lines.reduce((n, p) => n + p.quantity, 0);
  function add(id, delta) { setQuantities(q => ({ ...q, [id]: Math.max(0, Math.min(99, (q[id] || 0) + delta)) })); }
  return <div className={`storefront template-${store.template}`} style={{ '--brand': store.brand_color }}>
    <div className="store-announcement">{store.announcement || 'Browse the catalogue and request your order.'}</div>
    <header className="shop-header"><strong>{store.name}</strong><button onClick={() => setCart(!cart)} aria-expanded={cart}>Order bag ({count})</button></header>
    <main className="shop-main"><section className="shop-intro"><p className="small-label">The {store.name} collection</p><h1>{store.tagline || store.name}</h1><p>Browse products. Build your order. Confirm the details with us.</p></section>
    <div className="catalogue-toolbar"><label>Search products<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Product name or SKU" /></label><label>Category<select value={category} onChange={e => setCategory(e.target.value)}>{['All', ...new Set(store.products.map(p => p.category).filter(Boolean))].map(c => <option key={c}>{c}</option>)}</select></label></div>
    <div className="catalogue">{store.products.filter(p => `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase()) && (category === 'All' || p.category === category)).map((p, i) => <article className="product-card" key={p.id}>{p.image ? <img src={p.image} alt={p.name} loading="lazy" onError={e => { e.currentTarget.style.display = 'none'; }} /> : <div className="product-placeholder"><span>{String(i + 1).padStart(2, '0')}</span><p>Product image not added</p></div>}<div className="product-copy"><p className="small-label">{p.category || 'Catalogue'} · {p.sku}</p><h2>{p.name}</h2><p>{p.description}</p><div className="product-bottom"><strong>{money(p.price, store.currency)}</strong><button onClick={() => add(p.id, 1)}>Add to bag</button></div></div></article>)}</div>
    {!store.products.some(p => `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase()) && (category === 'All' || p.category === category)) && <div className="empty"><h2>No products to show</h2><p>Try another search or check back when the catalogue is updated.</p></div>}
    <p role="status" className="status">{count ? `${count} item${count === 1 ? '' : 's'} in your order bag.` : ''}</p>
    {cart && <section className="panel order-bag" aria-label="Order bag"><div className="section-heading"><h2>Your order bag</h2><button onClick={() => setCart(false)}>Close bag</button></div>{order.lines.length ? <>{order.lines.map(p => <div className="cart-line" key={p.id}><div><strong>{p.name}</strong><p>{money(p.price, store.currency)} each</p></div><div className="quantity"><button aria-label={`Decrease ${p.name}`} onClick={() => add(p.id, -1)}>-</button><span>{p.quantity}</span><button aria-label={`Increase ${p.name}`} onClick={() => add(p.id, 1)}>+</button></div></div>)}<h3>Subtotal: {money(order.total, store.currency)}</h3><p>Delivery and payment will be confirmed by the store. This is an order request, not a completed purchase.</p>{store.whatsapp ? <a className="button primary" href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(order.message)}`} target="_blank" rel="noreferrer">Request order on WhatsApp</a> : <p>WhatsApp checkout is unavailable until the store adds its number.</p>}</> : <p>Your bag is empty. Add a product from the catalogue.</p>}</section>}
    </main><footer className="shop-footer"><strong>{store.name}</strong><div>{store.address && <p>{store.address}</p>}{store.email && <a href={`mailto:${store.email}`}>{store.email}</a>}{store.phone && <a href={`tel:${store.phone.replace(/[^+\d]/g, '')}`}>{store.phone}</a>}</div>{local && <span>Local storefront preview</span>}</footer>
  </div>;
}
