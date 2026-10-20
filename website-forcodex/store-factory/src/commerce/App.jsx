import React,{useEffect,useRef,useState} from 'react';
import {resolveTenant} from '../model.js';
import {clone,newStore,pageLabels,slugify,themeById,themes,demoStores,newProduct} from './model.js';
import {configured,supabase,loadWorkspace,loadPublic,saveStore,unpublishStore} from './repository.js';
import Storefront,{Photo} from './Storefront.jsx';
import Editor,{Field} from './Editor.jsx';
import baseSql from '../../supabase/commerce.sql?raw';
import librarySql from '../../supabase/migrations/002_section_library.sql?raw';
import './commerce.css';

const sql = `${baseSql}\n\n${librarySql}`;

const route=resolveTenant({hostname:location.hostname,search:location.search,platformDomain:import.meta.env.VITE_PLATFORM_DOMAIN,deploymentHost:__DEPLOYMENT_HOST__});
const isLocal=['localhost','127.0.0.1','[::1]'].includes(location.hostname);

function getThemeSampleStore(themeId){
  const allDemos=demoStores();
  const existing=allDemos.find(s=>s.theme===themeId||(themeId==='tradehouse'&&s.slug==='abeer-trading'));
  if(existing)return existing;
  const t=themeById(themeId);
  const store=newStore(themeId);
  store.name=`${t.name} Sample`;
  store.slug=`${themeId}-preview`;
  store.sample=true;
  store.products=[
    {...newProduct(),name:'Signature Piece 01',sku:`${themeId.toUpperCase()}-01`,price:89,salePrice:75,stock:20,status:'published',images:[t.hero],category:'Featured',featured:true},
    {...newProduct(),name:'Everyday Essential 02',sku:`${themeId.toUpperCase()}-02`,price:45,stock:40,status:'published',images:['/commerce/fashion.webp'],category:'Daily',featured:true},
    {...newProduct(),name:'Classic Accent 03',sku:`${themeId.toUpperCase()}-03`,price:120,stock:15,status:'published',images:['/commerce/watch.webp'],category:'Top Picks',featured:true},
    {...newProduct(),name:'Modern Utility 04',sku:`${themeId.toUpperCase()}-04`,price:65,stock:25,status:'published',images:['/commerce/headphones.webp'],category:'Trending',featured:false}
  ];
  return store;
}

export default function CommerceApp(){
  const[demo,setDemo]=useState(true),[user,setUser]=useState(null),[workspace,setWorkspace]=useState({stores:[],publications:[],orders:[],subscribers:[]}),[site,setSite]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[view,setView]=useState('clients'),[editor,setEditor]=useState(null),[dirty,setDirty]=useState(false),[create,setCreate]=useState(false),[templateClient,setTemplateClient]=useState(null),[search,setSearch]=useState(''),[filter,setFilter]=useState('all'),[notice,setNotice]=useState(''),[revision,setRevision]=useState(0),[dark,setDark]=useState(false);
  const[previewTheme,setPreviewTheme]=useState(null),[previewDevice,setPreviewDevice]=useState('desktop');
  const publicDemo=isLocal&&(new URLSearchParams(location.search).get('demo')==='1'||!configured);
  useEffect(()=>{if(!supabase)return;let alive=true;supabase.auth.getSession().then(({data,error})=>{if(alive){setUser(data.session?.user||null);if(error)setNotice(error.message);}}).catch(error=>{if(alive)setNotice(error.message);});const{data}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user||null));return()=>{alive=false;data.subscription.unsubscribe();};},[]);
  useEffect(()=>{let cancelled=false;setError('');if(!site&&route.kind!=='platform')setLoading(true);const task=route.kind==='platform'?loadWorkspace(demo,user):loadPublic(route,publicDemo);task.then(data=>{if(!cancelled)route.kind==='platform'?setWorkspace(data):setSite(data);}).catch(error=>{if(!cancelled)setError(error.message);}).finally(()=>{if(!cancelled)setLoading(false);});return()=>{cancelled=true;};},[demo,user?.id,revision]);
  useEffect(()=>{document.documentElement.dataset.theme=route.kind==='platform'&&dark?'dark':'light';},[dark]);
  useEffect(()=>{const warn=event=>{if(dirty){event.preventDefault();event.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  useEffect(()=>{const changed=event=>{if(event.key==='store-factory:commerce:v1'){if(dirty)setNotice('Store data changed in another tab. Save may require reopening the latest draft.');else setRevision(value=>value+1);}};window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed);},[dirty]);
  useEffect(()=>{
    if(demo||!supabase||!user||route.kind!=='platform')return;
    const refresh=()=>setRevision(value=>value+1);
    const channel=supabase.channel(`commerce-workspace-${user.id}`)
      .on('postgres_changes',{event:'*',schema:'public',table:'commerce_stores',filter:`owner_id=eq.${user.id}`},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'commerce_publications'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'commerce_orders'},refresh)
      .subscribe();
    return()=>{supabase.removeChannel(channel);};
  },[demo,user?.id]);
  useEffect(()=>{
    if(!supabase||publicDemo||route.kind==='platform'||!site)return;
    const channel=supabase.channel(`commerce-public-${site.id}`).on('postgres_changes',{event:'*',schema:'public',table:'commerce_publications',filter:`id=eq.${site.id}`},()=>setRevision(value=>value+1)).subscribe();
    const refresh=()=>setRevision(value=>value+1);window.addEventListener('focus',refresh);
    return()=>{supabase.removeChannel(channel);window.removeEventListener('focus',refresh);};
  },[site?.id,publicDemo]);
  function navigate(next){if(dirty&&!window.confirm('Leave the editor and discard unsaved changes?'))return;setDirty(false);setEditor(null);setView(next);setNotice('');}
  async function persist(store,publish){const saved=await saveStore(store,demo,user,publish);const data=await loadWorkspace(demo,user);setWorkspace(data);return saved;}
  async function unpublish(id){await unpublishStore(id,demo);setWorkspace(await loadWorkspace(demo,user));}
  async function addClient(values){const store=newStore(values.type==='business'?'studio':'tradehouse');store.name=values.name;store.slug=values.slug;store.client={name:values.name,email:values.email,domain:values.domain.toLowerCase().trim(),type:values.type};const saved=await saveStore(store,demo,user);setWorkspace(await loadWorkspace(demo,user));setCreate(false);setTemplateClient(saved);setView('templates');setNotice('Client added. Choose a template to start their website.');}
  function chooseTheme(id){if(!templateClient){setCreate(true);setNotice('Add the client first, then choose their website template.');return;}const base=newStore(id);const next={...base,id:templateClient.id,name:templateClient.name,slug:templateClient.slug,client:{...templateClient.client,type:themeById(id).type||'ecommerce'},_revision:templateClient._revision};next.settings.email=templateClient.settings.email;next.settings.phone=templateClient.settings.phone;setEditor(next);setDirty(true);setView('editor');}
  function openEditor(store){setEditor(clone(store));setDirty(false);setView('editor');}
  if(route.kind!=='platform')return loading?<main className="fatal"><p role="status">Opening store...</p></main>:error?<main className="fatal"><h1>We couldn’t load this store.</h1><p role="alert">{error}</p><button onClick={()=>setRevision(value=>value+1)}>Try again</button></main>:site?<>{publicDemo&&<div className="ca-local-banner">Local store preview · Not a public deployment</div>}<Storefront store={site} demo={publicDemo} initialPage={new URLSearchParams(location.search).get('view')||'home'}/></>:<main className="fatal"><h1>Store not found.</h1><p>This address is not connected to a published store.</p></main>;
  if(editor&&view==='editor')return <Editor key={editor.id} initial={editor} publication={workspace.publications.find(p=>p.id===editor.id)} orders={workspace.orders.filter(order=>order.store_id===editor.id)} demo={demo} onSave={persist} onUnpublish={unpublish} onBack={()=>navigate('clients')} onDirty={setDirty}/>;
  const clients=workspace.stores.filter(store=>`${store.name} ${store.slug} ${store.client?.domain||''}`.toLowerCase().includes(search.toLowerCase())&&(filter==='all'||(filter==='published'?workspace.publications.some(p=>p.id===store.id):!workspace.publications.some(p=>p.id===store.id))));
  return <div className="commerce-admin"><aside className="ca-sidebar"><a href="/" className="ca-brand"><span className="ca-brand-mark">sf.</span><span>Store Factory<small>Your client workspace</small></span></a><p className="ca-nav-label">Workspace</p><nav aria-label="Main navigation">{[['clients','Clients','01'],['templates','Template library','02'],['setup','Publishing setup','03']].map(([id,label,num])=><button key={id} aria-current={view===id?'page':undefined} onClick={()=>navigate(id)}><span>{label}</span><small>{num}</small></button>)}</nav><div className="ca-sidebar-note"><span className="ca-note-line"/><h2>Build once.<br /><em>Make it theirs.</em></h2><p>A home for every client, without starting from scratch.</p></div><div className="ca-account"><span>{demo?'Local workspace':user?.email||'Agency account'}</span><small>{demo?'Browser-only demo':'Supabase connected mode'}</small><button onClick={()=>setDark(value=>!value)}>{dark?'Light appearance':'Dark appearance'}</button></div></aside>
    <div className="ca-workspace"><header className="ca-topbar"><span>{view==='clients'?'Workspace / Clients':view==='templates'?'Workspace / Templates':'Workspace / Publishing'}</span><div><span>{demo?'Local demo':user?'Connected workspace':'Sign in required'}</span><button onClick={()=>navigate('setup')}>{demo?'Connect Supabase':'Connection settings'}</button></div></header><main className="ca-main">
      {notice&&<p className="ca-notice" role="status">{notice}</p>}
      {view==='setup'?<Setup onConnect={()=>{setDemo(false);setView('clients');setRevision(value=>value+1);}} onDemo={()=>{setDemo(true);setView('clients');}}/>:!demo&&!user?<Login onDemo={()=>setDemo(true)}/>:loading?<p role="status">Loading your clients...</p>:error?<section className="ca-empty"><h1>Could not load clients.</h1><p role="alert">{error}</p><button onClick={()=>setRevision(value=>value+1)}>Try again</button><button onClick={()=>setView('setup')}>Open setup</button></section>:view==='templates'?<><div className="ca-heading"><div><p className="ca-eyebrow">A different point of view for every business</p><h1>The template <em>collection.</em></h1><p>{templateClient?`Choose a starting point for ${templateClient.name}.`:'Add a client, then choose their design. All templates can be customised.'}</p></div><button className="ca-primary" onClick={()=>setCreate(true)}>Add client +</button></div><div className="ca-template-client"><Field label="Choose client" value={templateClient?.id||''} options={[{value:'',label:'Select a client'},...workspace.stores.map(s=>({value:s.id,label:s.name}))]} onChange={id=>setTemplateClient(workspace.stores.find(s=>s.id===id)||null)}/><p>Applying a template starts a new page layout. Existing saved content stays unchanged until you save.</p></div><TemplateGallery onChoose={chooseTheme} onPreview={setPreviewTheme}/></>:<>
        <div className="ca-heading"><div><p className="ca-eyebrow">Your agency, organised.</p><h1>Every client.<br /><em>Their own world.</em></h1><p>Add a client, choose a template, make it theirs.</p></div><button className="ca-primary ca-create" onClick={()=>setCreate(true)}>Add client <span>+</span></button></div>
        <div className="ca-workflow"><div><span>01</span><strong>Add your client</strong><small>Name, business type & domain</small></div><div><span>02</span><strong>Choose a template</strong><small>Commerce or a business website</small></div><div><span>03</span><strong>Make it theirs</strong><small>Content, products & branding</small></div><div><span>04</span><strong>Publish</strong><small>One app, separate client sites</small></div></div>
        <div className="ca-register-toolbar"><div className="ca-filters" role="group" aria-label="Filter clients">{[['all','All clients'],['published',demo?'Local previews':'Published'],['draft','Drafts']].map(([id,label])=><button key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}{id==='all'&&<span>{workspace.stores.length}</span>}</button>)}</div><label><span className="sr-only">Search clients</span><input type="search" placeholder="Search name or domain" value={search} onChange={event=>setSearch(event.target.value)}/></label></div>
        <div className="ca-client-table"><div className="ca-table-head"><span>Client / website</span><span>Domain</span><span>Status</span><span>Workspace</span></div>{clients.map(store=>{const published=workspace.publications.find(p=>p.id===store.id),theme=themeById(store.theme);return <article key={store.id} className="ca-client-row"><div className="ca-client-name"><div className="ca-client-thumb"><Photo src={store.settings.logo||store.pages.home.find(s=>s.image)?.image||theme.hero} alt=""/></div><div><h2>{store.name}</h2><p>{store.sample?'Sample client · ':''}{store.client?.type==='business'?'Business website':'eCommerce'} · {theme.name}</p></div></div><div className="ca-domain"><span>{store.client?.domain||`${store.slug}`}</span><small>{store.client?.domain?'Requested · verification needed':'Platform address'}</small></div><span className={`ca-state ${published?'is-live':''}`}>{published?demo?'Local preview':'Published':'Draft'}</span><div className="ca-client-actions"><button onClick={()=>openEditor(store)}>Open editor ↗</button>{published?<a className="ca-preview-link" target="_blank" rel="noreferrer" href={`/?store=${encodeURIComponent(store.slug)}${demo?'&demo=1':''}`}>Preview ↗</a>:<button className="ca-text" onClick={()=>openEditor(store)}>Preview draft</button>}<button className="ca-text" onClick={()=>{setTemplateClient(store);setView('templates');}}>Templates</button></div></article>;})}{!clients.length&&<div className="ca-empty"><h2>{search||filter!=='all'?'No matching clients.':'Your first client starts here.'}</h2><p>Add a client with their business name and intended domain.</p><button onClick={()=>setCreate(true)}>Add client</button></div>}</div>
        <div className="ca-register-footer"><span>{workspace.stores.length} clients · {workspace.publications.length} {demo?'local previews':'published sites'}</span><button className="ca-text" onClick={()=>setRevision(value=>value+1)}>Refresh workspace</button></div>
        <section className="ca-template-teaser"><div><p className="ca-eyebrow">Designs with a point of view</p><h2>A good beginning.<br /><em>In twelve different ways.</em></h2><p>Trading. Fashion. Interiors. Technology. Services.<br />The same engine, a different identity.</p><button onClick={()=>setView('templates')}>Browse template library ↗</button></div><div className="ca-teaser-cards">{['tradehouse','atelier','circuit'].map(id=><ThemeCard key={id} theme={themeById(id)} onChoose={chooseTheme} onPreview={setPreviewTheme}/>)}</div></section>
        {!demo&&<button className="ca-text" onClick={async()=>{const{error}=await supabase.auth.signOut();if(error)setNotice(error.message);}}>Sign out</button>}
      </>}
    </main><footer className="ca-footer"><span>Store Factory / Client website workspace</span><span>{demo?'Local changes stay in this browser.':'Private drafts. Separate public websites.'}</span></footer></div>
    {create&&<ClientDialog onClose={()=>setCreate(false)} onCreate={addClient}/>}
    {previewTheme&&<ThemePreviewModal theme={previewTheme} device={previewDevice} onDeviceChange={setPreviewDevice} onClose={()=>setPreviewTheme(null)} onChoose={chooseTheme}/>}
  </div>;
}

function ThemeCard({theme,onChoose,onPreview}){
  return <article className="ca-theme-card">
    <div className={`ca-theme-preview preview-${theme.id} preview-layout-${theme.layout}`} style={{'--tile-bg':theme.background,'--tile-brand':theme.color}}>
      <div className="ca-mini-header">
        <strong>{theme.name}</strong>
        <span>Shop / About / Contact</span>
      </div>
      <div className="ca-mini-hero">
        <h3>{theme.title}</h3>
        <Photo src={theme.hero} alt=""/>
      </div>
      <div className="ca-theme-hover-actions">
        <button type="button" className="ca-preview-pill" onClick={()=>onPreview(theme)}>👁️ Live Preview</button>
      </div>
    </div>
    <div className="ca-theme-meta">
      <div>
        <h3>{theme.name}</h3>
        <p>{theme.niche}</p>
      </div>
      <div className="ca-theme-card-btns">
        <button type="button" className="ca-card-preview-btn" onClick={()=>onPreview(theme)}>Preview</button>
        <button type="button" className="ca-card-use-btn" onClick={()=>onChoose(theme.id)}>Use ↗</button>
      </div>
    </div>
  </article>;
}

function ThemePreviewModal({theme,device,onDeviceChange,onClose,onChoose}){
  const sampleStore=getThemeSampleStore(theme.id);
  const directLink=`/?store=${encodeURIComponent(sampleStore.slug)}&demo=1`;

  useEffect(()=>{
    const onKey=(e)=>{if(e.key==='Escape')onClose();};
    window.addEventListener('keydown',onKey);
    const prevOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{
      window.removeEventListener('keydown',onKey);
      document.body.style.overflow=prevOverflow;
    };
  },[onClose]);

  return (
    <div className="ca-preview-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Preview of ${theme.name}`}>
      <div className="ca-preview-modal-window" onClick={e=>e.stopPropagation()}>
        <div className="ca-preview-modal-topbar">
          <div className="ca-preview-modal-info">
            <span className="ca-badge">{theme.type==='business'?'Business':'eCommerce'}</span>
            <strong>{theme.name}</strong>
            <small>{theme.niche}</small>
          </div>
          <div className="ca-device-switcher" role="group" aria-label="Device preview switcher">
            <button type="button" className={device==='desktop'?'is-active':''} onClick={()=>onDeviceChange('desktop')} title="Desktop view">🖥️ Desktop</button>
            <button type="button" className={device==='tablet'?'is-active':''} onClick={()=>onDeviceChange('tablet')} title="Tablet view">📱 Tablet</button>
            <button type="button" className={device==='mobile'?'is-active':''} onClick={()=>onDeviceChange('mobile')} title="Mobile view">📱 Mobile</button>
          </div>
          <div className="ca-preview-modal-actions">
            <a href={directLink} target="_blank" rel="noreferrer" className="ca-preview-newtab-btn">Open in new tab ↗</a>
            <button type="button" className="ca-primary" onClick={()=>{onChoose(theme.id);onClose();}}>Use this template</button>
            <button type="button" className="ca-close-btn" onClick={onClose} aria-label="Close preview">✕</button>
          </div>
        </div>
        <div className="ca-preview-modal-body">
          <div className={`ca-preview-viewport device-${device}`}>
            <Storefront store={sampleStore} preview={true} demo={true} initialPage="home" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateGallery({onChoose,onPreview}){
  const[type,setType]=useState('all');
  return <>
    <div className="ca-template-filters" role="group" aria-label="Template types">
      {[['all','All 12 templates'],['ecommerce','eCommerce'],['business','Business & services']].map(([id,label])=><button key={id} aria-pressed={type===id} onClick={()=>setType(id)}>{label}</button>)}
    </div>
    <div className="ca-theme-grid">
      {themes.filter(theme=>type==='all'||(theme.type||'ecommerce')===type).map(theme=><ThemeCard key={theme.id} theme={theme} onChoose={()=>onChoose(theme.id)} onPreview={onPreview}/>)}
    </div>
    <p className="ca-library-note">Previews use sample copy and stock photography. Your client’s content, products and branding replace them.</p>
  </>;
}
function ClientDialog({onClose,onCreate}){const ref=useRef(null);const[values,setValues]=useState({name:'',slug:'',email:'',domain:'',type:'ecommerce'}),[busy,setBusy]=useState(false),[error,setError]=useState('');useEffect(()=>ref.current.showModal(),[]);return <dialog ref={ref} className="ca-dialog" onCancel={event=>{if(busy)event.preventDefault();}} onClose={onClose}><div className="ca-dialog-heading"><span>01 / Add your client</span><button disabled={busy} onClick={()=>ref.current.close()} aria-label="Close add client">×</button></div><h1>Who are we<br /><em>building for?</em></h1><p>Add the client first. Their design comes next.</p><form onSubmit={async event=>{event.preventDefault();setBusy(true);setError('');try{await onCreate(values);}catch(error){setError(error.message);setBusy(false);}}}><fieldset disabled={busy}><Field label="Client / business name" value={values.name} required onChange={name=>setValues(old=>({...old,name,slug:old.slug===slugify(old.name)||!old.slug?slugify(name):old.slug}))}/><Field label="Website type" value={values.type} options={[{value:'ecommerce',label:'eCommerce / trading store'},{value:'business',label:'Business / service website'}]} onChange={type=>setValues(old=>({...old,type}))}/><div className="ce-pair"><Field label="Website address (slug)" value={values.slug} required onChange={slug=>setValues(old=>({...old,slug}))}/><Field label="Client email (optional)" type="email" value={values.email} onChange={email=>setValues(old=>({...old,email}))}/></div><Field label="Client’s domain (optional)" value={values.domain} placeholder="clientbusiness.com" onChange={domain=>setValues(old=>({...old,domain}))}/><p className="ce-help">This saves the requested domain. Hosting and ownership verification are completed separately before it can go live.</p>{error&&<p className="ce-error" role="alert">{error}</p>}<button className="ca-primary" disabled={busy}>{busy?'Adding client...':'Add client & choose template'}</button></fieldset></form></dialog>;}

function Setup({onConnect,onDemo}){const[message,setMessage]=useState(''),[busy,setBusy]=useState(false);return <section><div className="ca-heading"><div><p className="ca-eyebrow">One deployment. Many clients.</p><h1>From local<br /><em>to live.</em></h1><p>The master frontend is deployed once. Client content comes from Supabase.</p></div></div><div className="ca-setup-grid"><article><h2>01 / Supabase</h2><p>{configured?'Public Supabase configuration is present. The new eCommerce schema must be installed before using this workspace.':'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the environment, then restart the app.'}</p><button onClick={async()=>{try{await navigator.clipboard.writeText(sql);setMessage('eCommerce SQL copied. Paste into a new Supabase SQL Editor query and run once.');}catch{setMessage('Expand the SQL below and copy it manually.');}}}>Copy eCommerce SQL</button><details><summary>Show SQL to add in Supabase</summary><textarea rows={18} value={sql} readOnly aria-label="eCommerce SQL" onFocus={event=>event.target.select()}/></details><p>Create an agency user in Supabase → Authentication → Users. This app has no signup UI.</p>{configured&&<div className="ca-setup-actions"><button disabled={busy} onClick={async()=>{setBusy(true);try{const{error}=await supabase.from('commerce_publications').select('id').limit(0);if(error)throw error;setMessage('Public eCommerce table is reachable. Sign in to manage your clients.');}catch(error){setMessage(`Database setup needed: ${error.message}`);}finally{setBusy(false);}}}>{busy?'Checking...':'Check connection'}</button><button className="ca-primary" onClick={onConnect}>Open connected workspace</button></div>}<p role="status">{message}</p><button className="ca-text" onClick={onDemo}>Return to local workspace</button></article><article><h2>02 / Vercel</h2><dl><div><dt>Root directory</dt><dd>store-factory</dd></div><div><dt>Install command</dt><dd>npm install</dd></div><div><dt>Build command</dt><dd>npm run build</dd></div><div><dt>Output directory</dt><dd>dist</dd></div></dl><p>Set the same public Supabase values on Vercel. VITE_PLATFORM_DOMAIN is optional for platform subdomains. Configure wildcard hosting and DNS separately.</p><h2>03 / Client domains</h2><p>Add the exact domain to the project, copy its DNS instructions, verify ownership, then insert an administrator-only mapping into commerce_domains. A saved domain request is not a live connection.</p><h2>04 / Payments & orders</h2><p>The checkout records an order request and reserves stock when the eCommerce SQL is installed. Payment is a placeholder. No card details are collected.</p><p>Keep service-role keys, database passwords and hosting tokens out of VITE_ variables. No deployment or database migration has been run by this implementation.</p></article></div></section>;}
function Login({onDemo}){const[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);return <section className="ca-login"><p className="ca-eyebrow">Your agency account</p><h1>Welcome <em>back.</em></h1><form onSubmit={async event=>{event.preventDefault();setBusy(true);setError('');try{const{error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;}catch(error){setError(error.message);}finally{setBusy(false);setPassword('');}}}><Field label="Email" type="email" required autoComplete="username" value={email} onChange={setEmail}/><Field label="Password" type="password" required autoComplete="current-password" value={password} onChange={setPassword}/>{error&&<p className="ce-error" role="alert">{error}</p>}<button className="ca-primary" disabled={busy}>{busy?'Signing in...':'Sign in'}</button></form><button className="ca-text" onClick={onDemo}>Use local workspace</button></section>;}
