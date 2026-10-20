import React, { useEffect, useRef, useState } from 'react';
import Website, { WebsiteImage } from './Website.jsx';
import { websiteTemplates, findTemplate, templateExample } from './website-templates.js';
import { newWebsite, slugify, validateWebsite, websiteRoute, websiteUrl, pageNames } from './website-model.js';
import { configured, configError, supabase, listWebsites, saveWebsite, publishWebsite, unpublishWebsite, publicWebsite, websiteDomains } from './website-repository.js';
import databaseSQL from '../supabase/website-builder.sql?raw';
import './builder.css';

const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const route = websiteRoute({ hostname: location.hostname, search: location.search, platformDomain: import.meta.env.VITE_PLATFORM_DOMAIN, deploymentHost: __DEPLOYMENT_HOST__ });
const urlFor = (site, demo) => websiteUrl(site, { origin: location.origin, hostname: location.hostname, platformDomain: import.meta.env.VITE_PLATFORM_DOMAIN, demo });

export default function Builder() {
  const [demo, setDemo] = useState(true);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [workspace, setWorkspace] = useState({ drafts: [], publications: [] });
  const [activeSite, setActiveSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [screen, setScreen] = useState('dashboard');
  const [editor, setEditor] = useState(null);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [dark, setDark] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setUser(data.session?.user || null); setAuthReady(true);
      if (error) setMessage(error.message);
    }).catch(error => { if (active) { setAuthReady(true); setMessage(error.message); } });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user || null); setAuthReady(true); });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError('');
    const localPreview = isLocal && new URLSearchParams(location.search).get('demo') === '1';
    const task = route.kind === 'platform' ? listWebsites(user, demo) : publicWebsite(route, localPreview || (!configured && isLocal));
    task.then(data => { if (!cancelled) route.kind === 'platform' ? setWorkspace(data) : setActiveSite(data); })
      .catch(error => { if (!cancelled) setError(error.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [demo, user?.id, revision]);

  useEffect(() => { document.documentElement.dataset.theme = route.kind === 'platform' && dark ? 'dark' : 'light'; }, [dark]);
  useEffect(() => {
    const warn = event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function navigate(target) {
    if (dirty && !window.confirm('Leave the editor and discard unsaved changes?')) return;
    setDirty(false); setEditor(null); setScreen(target); setMessage('');
  }
  function start(template) {
    setEditor(newWebsite(template)); setDirty(false); setScreen('editor'); setMessage('');
  }
  async function save(site, publish = false) {
    if (publish) {
      const result = await publishWebsite(site, user, demo);
      setWorkspace(old => ({ drafts: [result.saved, ...old.drafts.filter(item => item.id !== site.id)], publications: [result.publication, ...old.publications.filter(item => item.id !== site.id)] }));
      setDirty(false);
      return result.saved;
    }
    const saved = await saveWebsite(site, user, demo);
    setWorkspace(old => ({ ...old, drafts: [saved, ...old.drafts.filter(item => item.id !== saved.id)] }));
    setDirty(false);
    return saved;
  }
  async function unpublish(id) {
    await unpublishWebsite(id, demo);
    setWorkspace(old => ({ ...old, publications: old.publications.filter(item => item.id !== id) }));
  }

  if (route.kind !== 'platform') {
    if (loading) return <main className="fatal"><p role="status">Opening website...</p></main>;
    if (error) return <main className="fatal"><h1>Could not open this website</h1><p role="alert">{error}</p><button onClick={() => setRevision(value => value + 1)}>Try again</button></main>;
    return activeSite ? <>{isLocal && <div className="mode-note">Local website preview · This address is not a public deployment.</div>}<Website site={activeSite} initialPage={new URLSearchParams(location.search).get('page') || 'home'} /></> : <main className="fatal"><h1>Website not found</h1><p>This address is not connected to a published website.</p></main>;
  }

  const filtered = workspace.drafts.filter(site => `${site.name} ${site.slug}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="builder-shell">
    <a className="skip" href="#builder-main">Skip to workspace</a>
    <header className="builder-header"><button className="builder-wordmark quiet" onClick={() => navigate('dashboard')}>Website<span>Factory</span><small>Client websites, in one place.</small></button><nav aria-label="Workspace navigation">{[['dashboard', 'Websites'], ['templates', 'Templates'], ['setup', 'Connection']].map(([id, label]) => <button key={id} aria-current={screen === id ? 'page' : undefined} onClick={() => navigate(id)}>{label}</button>)}</nav><button className="quiet theme-toggle" onClick={() => setDark(value => !value)}>{dark ? 'Light theme' : 'Dark theme'}</button></header>
    <div className="builder-mode"><span>{demo ? 'Local workspace' : 'Connected workspace'}</span><p>{demo ? 'Saved in this browser. Connect Supabase to publish shared websites.' : user ? user.email : 'Sign in with your agency account.'}</p>{demo ? <button className="quiet" onClick={() => navigate('setup')}>Set up publishing</button> : <button className="quiet" onClick={async () => { if (dirty && !window.confirm('Discard unsaved changes and sign out?')) return; const { error } = await supabase.auth.signOut(); if (error) setMessage(error.message); else { setDirty(false); setEditor(null); setScreen('dashboard'); } }}>Sign out</button>}</div>
    <main className="builder-main" id="builder-main">
      {message && <p role="status" className="builder-notice">{message}</p>}
      {screen === 'setup' ? <Connection onConnect={() => { setDemo(false); setScreen('dashboard'); }} onDemo={() => { setDemo(true); setScreen('dashboard'); }} /> : !demo && !authReady ? <p role="status">Checking your session...</p> : !demo && !user ? <SignIn onDemo={() => setDemo(true)} /> : loading ? <p role="status">Loading your websites...</p> : error ? <section className="builder-empty"><h1>We couldn’t load your websites.</h1><p role="alert">{error}</p><button onClick={() => setRevision(value => value + 1)}>Try again</button><button onClick={() => setScreen('setup')}>Connection settings</button></section> : screen === 'editor' && editor ? <WebsiteEditor key={editor.id} initial={editor} publication={workspace.publications.find(item => item.id === editor.id)} demo={demo} onSave={save} onUnpublish={unpublish} onBack={() => navigate('dashboard')} onDirty={setDirty} /> : screen === 'templates' ? <TemplateLibrary onChoose={start} onPreview={site => setPreview(site)} /> : <>
        <div className="builder-heading"><div><p className="section-kicker">Your client workspace</p><h1>Good websites.<br /><em>Ready for your clients.</em></h1><p>Choose a design. Make it theirs. Publish when it’s ready.</p></div><button className="primary" onClick={() => setScreen('templates')}>Create website <span aria-hidden="true">+</span></button></div>
        <div className="website-list-heading"><h2>Your websites <span>{workspace.drafts.length.toString().padStart(2, '0')}</span></h2><label className="search-label"><span className="sr-only">Search websites</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search client or address" /></label></div>
        {filtered.length ? <div className="website-register">{filtered.map(site => {
          const publication = workspace.publications.find(item => item.id === site.id);
          return <article key={site.id} className="website-list-row"><div className="website-row-image"><WebsiteImage src={site.content.heroImage || findTemplate(site.template).image} alt="" /></div><div className="website-row-name"><h3>{site.name}</h3><p>{site.slug} · {findTemplate(site.template).name}</p></div><span className={`website-status ${publication ? 'is-published' : ''}`}>{publication ? demo ? 'Local preview saved' : 'Published' : 'Draft'}</span><div className="row-actions"><button onClick={() => { setEditor(structuredClone(site)); setScreen('editor'); }}>Edit website</button><button className="quiet" onClick={() => setPreview(site)}>Preview</button>{publication && <a className="button quiet" href={urlFor(publication.snapshot, demo)} target="_blank" rel="noreferrer">Open {demo ? 'local' : 'published'} site</a>}</div></article>;
        })}</div> : <section className="builder-empty"><span className="empty-index">{search ? '0 results' : 'Your next project starts here'}</span><h2>{search ? 'No websites match that search.' : 'One template. A new identity.'}</h2><p>{search ? 'Try a different business name or website address.' : 'Start with one of ten service-business designs, then add your client’s words, photos and contact details.'}</p><button onClick={() => search ? setSearch('') : setScreen('templates')}>{search ? 'Clear search' : 'Browse the templates'}</button></section>}
        <section className="library-intro"><div><p className="section-kicker">The template collection</p><h2>A different starting point<br />for every kind of business.</h2><button className="quiet" onClick={() => setScreen('templates')}>View all 10 templates</button></div><div className="featured-templates">{['agency', 'restaurant', 'construction'].map(id => <TemplateCard key={id} template={findTemplate(id)} onChoose={() => start(id)} onPreview={() => setPreview(templateExample(id))} compact />)}</div></section>
      </>}
    </main>
    <footer className="builder-footer"><span>Website Factory</span><span>Build once. Make it theirs.</span><span>1–4 pages · Service businesses</span></footer>
    {preview && <PreviewDialog site={preview} onClose={() => setPreview(null)} />}
  </div>;
}

function TemplateCard({ template, onChoose, onPreview, compact = false }) {
  return <article className={`template-card ${compact ? 'compact' : ''}`}>
    <button className={`template-art art-${template.layout}`} onClick={onPreview} aria-label={`Preview ${template.name} template`} style={{ '--tile-brand': template.color }}><div className="tile-top" aria-hidden="true"><strong>{template.name}</strong><span>About / Services / Contact</span></div><div className="tile-content" aria-hidden="true"><h3>{template.title}</h3><img src={template.image} alt="" loading="lazy" width="720" height="480" /></div><span className="tile-caption">Preview design</span></button>
    <div className="template-card-copy"><div><span>{template.category}</span><h3>{template.name}</h3></div><button className="quiet" onClick={onChoose} aria-label={`Use ${template.name} template`}>Use template</button></div>{!compact && <p>{template.description}</p>}
  </article>;
}

function TemplateLibrary({ onChoose, onPreview, selected }) {
  const [category, setCategory] = useState('All templates');
  return <section><div className="builder-heading"><div><p className="section-kicker">10 designs. Your client’s identity.</p><h1>Start with <em>a good foundation.</em></h1><p>Every layout includes editable services, an About section and contact details.</p></div></div><div className="template-filters" role="group" aria-label="Filter templates">{['All templates', ...new Set(websiteTemplates.map(template => template.category))].map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>{selected && <p role="status">Selected: {findTemplate(selected).name}. Switching templates keeps your client content.</p>}<div className="template-grid">{websiteTemplates.filter(template => category === 'All templates' || template.category === category).map(template => <TemplateCard key={template.id} template={template} onChoose={() => onChoose(template.id)} onPreview={() => onPreview(templateExample(template.id))} />)}</div><p className="template-footnote">Template previews use sample text and stock photography. Replace them with approved client content before publishing.</p></section>;
}

function PreviewDialog({ site, onClose }) {
  const dialog = useRef(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => { dialog.current.showModal(); }, []);
  return <dialog ref={dialog} className="website-preview-dialog" onClose={onClose}><div className="preview-toolbar"><span>{site.id.startsWith('example-') ? 'Template preview · Example content' : 'Draft preview · Changes are not published'}</span><div className="row-actions"><button aria-pressed={mobile} onClick={() => setMobile(value => !value)}>{mobile ? 'Desktop preview' : 'Mobile preview'}</button><button autoFocus onClick={() => dialog.current.close()}>Close preview</button></div></div><div className={`preview-canvas ${mobile ? 'is-mobile' : ''}`}><Website key={site.id} site={site} preview /></div></dialog>;
}

function WebsiteEditor({ initial, publication, demo, onSave, onUnpublish, onBack, onDirty }) {
  const [site, setSite] = useState(initial);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [mobile, setMobile] = useState(false);
  const [preview, setPreview] = useState(null);
  const [domains, setDomains] = useState([]);
  const [domainError, setDomainError] = useState('');
  const [assetBusy, setAssetBusy] = useState(0);
  const steps = ['Template', 'Client details', 'Pages & content', 'Preview', 'Publish'];
  function update(key, value) { setSite(old => ({ ...old, [key]: value })); onDirty(true); setStatus(''); }
  function updateContent(key, value) { setSite(old => ({ ...old, content: { ...old.content, [key]: value } })); onDirty(true); setStatus(''); }
  function serviceUpdate(id, key, value) { setSite(old => ({ ...old, content: { ...old.content, services: old.content.services.map(service => service.id === id ? { ...service, [key]: value } : service) } })); onDirty(true); setStatus(''); }
  function changeStep(index) { setStep(index); setError(''); }
  async function persist(publish = false) {
    setBusy(true); setError(''); setStatus('');
    try { const saved = await onSave(site, publish); setSite(saved); setStatus(publish ? demo ? 'Local preview saved. Connect Supabase and hosting for a public website.' : 'Published to Supabase. Open the website to check its hosted address.' : 'Draft saved. The published version has not changed.'); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    let current = true;
    if (!demo && step === 4) websiteDomains(site.id).then(data => { if (current) setDomains(data); }).catch(error => { if (current) setDomainError(error.message); });
    return () => { current = false; };
  }, [demo, step, site.id]);
  function textField(key, label, { content = false, area = false, type = 'text', placeholder = '' } = {}) {
    const props = { value: content ? site.content[key] : site[key], onChange: event => content ? updateContent(key, event.target.value) : update(key, event.target.value), placeholder };
    return <label>{label}{area ? <textarea rows={4} {...props} /> : <input type={type} {...props} />}</label>;
  }
  const locked = busy || assetBusy > 0;
  return <section className="website-editor" aria-busy={locked}><button className="quiet back-button" disabled={locked} onClick={onBack}>Back to websites</button><div className="editor-heading"><div><p className="section-kicker">{findTemplate(site.template).name} template</p><h1>{site.name || 'Your next client website'}</h1></div><button disabled={locked} onClick={() => persist(false)}>{busy ? 'Saving...' : 'Save draft'}</button></div><ol className="editor-steps">{steps.map((label, index) => <li key={label}><button disabled={locked} aria-current={step === index ? 'step' : undefined} onClick={() => changeStep(index)}><span>{index + 1}</span>{label}</button></li>)}</ol>
    {error && <p className="error" role="alert">{error}</p>}{status && <p className="builder-notice" role="status">{status}</p>}
    <fieldset className="editor-fields" disabled={locked}>
      {step === 0 && <TemplateLibrary selected={site.template} onChoose={template => { update('template', template); setStep(1); }} onPreview={setPreview} />}
      {step === 1 && <div className="editor-columns"><section className="editor-panel"><div className="panel-title"><span>01</span><div><h2>Make it theirs.</h2><p>The client’s identity, address and visual signature.</p></div></div><div className="form-grid"><label>Business name<input value={site.name} maxLength={120} placeholder="Client’s business name" onChange={event => { const name = event.target.value; setSite(old => ({ ...old, name, slug: !old.slug || old.slug === slugify(old.name) ? slugify(name) : old.slug })); onDirty(true); setStatus(''); }} /></label>{textField('slug', 'Website address', { placeholder: 'client-name' })}</div><p className="field-hint">{import.meta.env.VITE_PLATFORM_DOMAIN ? `${site.slug || 'client-name'}.${import.meta.env.VITE_PLATFORM_DOMAIN}` : `Website handle: ${site.slug || 'client-name'}`}</p><div className="brand-settings"><label>Brand colour<input type="color" value={site.brand_color} onChange={event => update('brand_color', event.target.value)} /></label>{textField('brand_color', 'Colour code')}<button onClick={() => update('brand_color', findTemplate(site.template).color)}>Use template colour</button></div><ImageField label="Client logo" value={site.content.logo} onChange={value => updateContent('logo', value)} onBusy={value => setAssetBusy(count => count + (value ? 1 : -1))} /></section><section className="editor-panel"><div className="panel-title"><span>02</span><div><h2>A direct connection.</h2><p>Visitors can contact your client by phone, email or WhatsApp.</p></div></div><div className="form-grid">{textField('email', 'Email', { content: true, type: 'email' })}{textField('phone', 'Phone', { content: true, type: 'tel' })}{textField('whatsapp', 'WhatsApp with country code', { content: true, type: 'tel', placeholder: '+923001234567' })}{textField('address', 'Business address', { content: true, area: true })}</div></section></div>}
      {step === 2 && <div className="content-editor"><section className="editor-panel"><div className="panel-title"><span>01</span><div><h2>A single page, or room to browse.</h2><p>Use sections on a landing page or give each section its own page.</p></div></div><div className="page-mode" role="group" aria-label="Website structure"><button aria-pressed={site.content.pageMode === 'landing'} onClick={() => updateContent('pageMode', 'landing')}><strong>One landing page</strong><span>Everything in one scroll</span></button><button aria-pressed={site.content.pageMode === 'pages'} onClick={() => updateContent('pageMode', 'pages')}><strong>Separate pages</strong><span>Home plus up to three pages</span></button></div><div className="page-options">{Object.entries(pageNames).map(([key, label]) => <label className="checkbox" key={key}><input type="checkbox" disabled={key === 'home'} checked={site.content.pages.includes(key)} onChange={event => updateContent('pages', event.target.checked ? [...site.content.pages, key] : site.content.pages.filter(page => page !== key))} />{label}{key === 'home' && ' (required)'}</label>)}</div></section><section className="editor-panel"><div className="panel-title"><span>02</span><div><h2>The first impression.</h2><p>A clear headline and a photograph that belongs to the business.</p></div></div><div className="form-grid">{textField('heroTitle', 'Hero headline', { content: true, area: true, placeholder: findTemplate(site.template).title })}{textField('heroText', 'Introduction', { content: true, area: true, placeholder: 'What does the business do, and who does it help?' })}</div><ImageField label="Hero photograph" value={site.content.heroImage} onChange={value => updateContent('heroImage', value)} onBusy={value => setAssetBusy(count => count + (value ? 1 : -1))} />{textField('heroImageAlt', 'Photo description for accessibility', { content: true })}</section>
        {site.content.pages.includes('services') && <section className="editor-panel"><div className="section-heading"><div><h2>Services, in their own words.</h2><p>Add the client’s actual services. Change their order with the move controls.</p></div><button disabled={site.content.services.length >= 30} onClick={() => updateContent('services', [...site.content.services, { id: crypto.randomUUID(), title: '', description: '', image: '' }])}>Add service +</button></div>{!site.content.services.length && <p className="service-empty">No services yet. Add the first service to give visitors a reason to get in touch.</p>}{site.content.services.map((service, index) => <div className="service-editor" key={service.id}><div className="section-heading"><h3>Service {index + 1}</h3><div className="row-actions"><button disabled={index === 0} aria-label={`Move service ${index + 1} up`} onClick={() => { const next = [...site.content.services]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; updateContent('services', next); }}>Move up</button><button className="quiet" aria-label={`Remove service ${index + 1}`} onClick={() => updateContent('services', site.content.services.filter(item => item.id !== service.id))}>Remove</button></div></div><div className="form-grid"><label>Service title<input value={service.title} onChange={event => serviceUpdate(service.id, 'title', event.target.value)} /></label><label>Service description<textarea value={service.description} onChange={event => serviceUpdate(service.id, 'description', event.target.value)} rows={3} /></label></div><ImageField label={`Service ${index + 1} image`} value={service.image} onChange={value => serviceUpdate(service.id, 'image', value)} onBusy={value => setAssetBusy(count => count + (value ? 1 : -1))} /></div>)}</section>}
        {site.content.pages.includes('about') && <section className="editor-panel"><h2>A little more about the business.</h2><div className="form-grid">{textField('aboutTitle', 'About heading', { content: true })}{textField('about', 'About the business', { content: true, area: true })}</div><ImageField label="About photograph" value={site.content.aboutImage} onChange={value => updateContent('aboutImage', value)} onBusy={value => setAssetBusy(count => count + (value ? 1 : -1))} />{textField('aboutImageAlt', 'About photo description', { content: true })}</section>}
      </div>}
      {step === 3 && <section><div className="section-heading"><div><h2>See it as your client will.</h2><p>This is an unsaved preview. Use the website navigation to check every page.</p></div><button aria-pressed={mobile} onClick={() => setMobile(value => !value)}>{mobile ? 'Desktop preview' : 'Mobile preview'}</button></div><div className={`preview-canvas embedded-preview ${mobile ? 'is-mobile' : ''}`}><Website key={`${site.template}-${site.content.pageMode}`} site={site} preview /></div></section>}
      {step === 4 && <div className="editor-columns publish-columns"><section className="editor-panel"><p className="section-kicker">Ready when you are</p><h2>{demo ? 'Save a local preview.' : publication ? 'Publish your latest changes.' : 'Publish this website.'}</h2><p>{demo ? 'Test the complete website here. A local preview stays in this browser; it is not a public client link.' : 'Publishing copies your saved content into the public website. Future draft edits stay private until you publish again.'}</p><dl className="publish-summary"><div><dt>Business</dt><dd>{site.name || 'Name needed'}</dd></div><div><dt>Template</dt><dd>{findTemplate(site.template).name}</dd></div><div><dt>Structure</dt><dd>{site.content.pageMode === 'landing' ? 'One landing page' : `${site.content.pages.length} pages`}</dd></div><div><dt>Address</dt><dd>{urlFor(site, demo)}</dd></div></dl><button className="primary" onClick={() => persist(true)}>{demo ? 'Save local preview' : publication ? 'Publish changes' : 'Publish website'}</button>{publication && <div className="publication-result"><p>{demo ? 'A local preview is available.' : 'A published version is saved in Supabase.'}</p><a className="button" target="_blank" rel="noreferrer" href={urlFor(publication.snapshot, demo)}>Open {demo ? 'local preview' : 'published website'}</a><button className="quiet" onClick={async () => { if (!window.confirm('Unpublish this website? The saved draft will remain.')) return; setBusy(true); setError(''); try { await onUnpublish(site.id); setStatus('Website unpublished. Your draft is still saved.'); } catch (error) { setError(error.message); } finally { setBusy(false); } }}>Unpublish</button></div>}{!demo && isLocal && <p className="field-hint">You are running on localhost. Public sharing also requires the application to be deployed.</p>}</section><section className="editor-panel"><h2>A domain of their own.</h2><p>Platform subdomains work once wildcard hosting and DNS are configured. A custom domain needs an operator to verify ownership and connect it.</p>{domainError && <p role="alert">{domainError}</p>}{domains.length > 0 && <ul>{domains.map(domain => <li key={domain.hostname}>{domain.hostname} · {domain.verified ? 'Verified mapping' : 'Verification pending'}</li>)}</ul>}<ol className="domain-instructions"><li>Add the client’s hostname to the Vercel project.</li><li>Use the exact DNS records provided by that project.</li><li>Verify domain control and the client’s ownership of this website.</li><li>Register the verified mapping as an administrator.</li></ol><p className="field-hint">A domain is not connected automatically when you publish. Setup details are in the Connection screen.</p></section></div>}
    </fieldset>
    <div className="editor-bottom"><span>{step + 1} / {steps.length} · {steps[step]}</span><div className="row-actions">{step > 0 && <button disabled={locked} onClick={() => changeStep(step - 1)}>Previous</button>}{step < 4 && <button className="primary" disabled={locked} onClick={() => changeStep(step + 1)}>Continue to {steps[step + 1].toLowerCase()}</button>}</div></div>
    {preview && <PreviewDialog site={preview} onClose={() => setPreview(null)} />}
  </section>;
}

function ImageField({ label, value, onChange, onBusy }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Choose a PNG, JPEG or WebP image.'); return; }
    if (file.size > 12 * 1024 * 1024) { setError('Choose an image smaller than 12 MB.'); return; }
    setBusy(true); onBusy(true);
    try {
      const bitmap = await createImageBitmap(file);
      const ratio = Math.min(1, 1440 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * ratio)); canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
      const data = canvas.toDataURL('image/webp', .78);
      if (data.length > 700000) throw new Error('This image is still too large. Choose a smaller image or use a hosted URL.');
      onChange(data);
    } catch (error) { setError(error.message || 'This image could not be opened. Try another file.'); }
    finally { setBusy(false); onBusy(false); }
  }
  return <div className="image-field"><div className="image-field-controls"><label>{label} URL<input type="url" placeholder="https://..." value={value.startsWith('data:') || value.startsWith('/template-images/') ? '' : value} onChange={event => { setError(''); onChange(event.target.value); }} /></label><label className="upload-label">Or upload a photo<input type="file" accept="image/png,image/jpeg,image/webp" aria-label={`Upload ${label.toLowerCase()}`} onChange={upload} /></label>{busy && <p role="status">Optimising image...</p>}{value && <button className="quiet" onClick={() => onChange('')}>Remove {label.toLowerCase()}</button>}</div>{value && <WebsiteImage className="image-field-preview" src={value} alt={`${label} preview`} />}{error && <p role="alert" className="error">{error}</p>}</div>;
}

function Connection({ onConnect, onDemo }) {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  return <section className="connection-page"><div className="builder-heading"><div><p className="section-kicker">From your browser to your clients</p><h1>A shared home<br /><em>for every website.</em></h1></div></div><div className="editor-columns"><section className="editor-panel"><h2>1. Connect Supabase</h2><p>{configured ? 'Public Supabase credentials are configured. Apply the website-builder SQL, then check the connection.' : configError ? 'One Supabase environment value is missing. Set both values before restarting.' : 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the development server.'}</p><p>Use the new website-builder SQL below. It creates private drafts, published snapshots and domain mappings without modifying the original store tables.</p><div className="row-actions"><button onClick={async () => { try { await navigator.clipboard.writeText(databaseSQL); setStatus('Website-builder SQL copied. Paste it into a new Supabase SQL Editor query and run once.'); } catch { setStatus('Clipboard is unavailable. Expand the SQL below and copy it manually.'); } }}>Copy website-builder SQL</button>{configured && <button disabled={busy} onClick={async () => { setBusy(true); setStatus('Checking database tables...'); try { for (const table of ['websites', 'website_publications', 'website_domains']) { const { error } = await supabase.from(table).select('id' === table ? 'id' : '*').limit(0); if (error) throw error; } setStatus('Tables are reachable. Sign in with the user created in Supabase Authentication.'); } catch (error) { setStatus(`Database setup needed: ${error.message}`); } finally { setBusy(false); } }}>{busy ? 'Checking...' : 'Check connection'}</button>}</div><p role="status">{status}</p><details><summary>View SQL to add in Supabase</summary><textarea aria-label="Website-builder database SQL" readOnly value={databaseSQL} rows={18} onFocus={event => event.target.select()} /></details><h3>Create your agency account</h3><p>In Supabase, open Authentication → Users and create your user. This workspace has no signup UI. Use your email and password to sign in.</p>{configured && <button className="primary" onClick={onConnect}>Open connected workspace</button>}<button className="quiet" onClick={onDemo}>Use local workspace</button></section><section className="editor-panel"><h2>2. Host the frontend once</h2><dl className="publish-summary"><div><dt>Vercel root</dt><dd>store-factory</dd></div><div><dt>Install</dt><dd>npm install</dd></div><div><dt>Build</dt><dd>npm run build</dd></div><div><dt>Output</dt><dd>dist</dd></div></dl><p>Add the public Supabase environment values to Vercel. Set VITE_PLATFORM_DOMAIN for your platform hostname and configure the hostname and wildcard DNS in Vercel.</p><h3>3. Connect custom domains</h3><p>Verify domain ownership, add the hostname to the project, follow its exact DNS instructions, then register it in website_domains using an administrator account.</p><p>Frontend environment values are public. Never add service-role keys, database passwords or hosting tokens to a VITE_ variable.</p><p className="field-hint">No deployment or database migration has been performed by this implementation.</p></section></div></section>;
}

function SignIn({ onDemo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <section className="builder-signin"><p className="section-kicker">Your agency workspace</p><h1>Welcome back.</h1><p>Sign in with the user you created in Supabase Authentication.</p><form className="editor-panel" onSubmit={async event => { event.preventDefault(); setBusy(true); setError(''); try { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; } catch (error) { setError(error.message); } finally { setBusy(false); setPassword(''); } }}><label>Email<input required type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} /></label><label>Password<input required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} /></label>{error && <p role="alert" className="error">{error}</p>}<button disabled={busy} className="primary">{busy ? 'Signing in...' : 'Sign in'}</button></form><button className="quiet" onClick={onDemo}>Use local workspace</button></section>;
}
