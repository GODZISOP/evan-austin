import React, { useEffect, useState } from 'react';
import { findTemplate } from './website-templates.js';
import { foregroundFor, pageNames, safeWebsiteImage } from './website-model.js';

export function WebsiteImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || !safeWebsiteImage(src)) return null;
  return failed ? <div className={`image-unavailable ${className}`}>Image unavailable</div> : <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

export default function Website({ site, preview = false, initialPage = 'home' }) {
  const [page, setPage] = useState(initialPage);
  const template = findTemplate(site.template);
  const content = site.content;
  const pages = ['home', 'services', 'about', 'contact'].filter(key => content.pages.includes(key));
  const multiple = content.pageMode === 'pages';
  const current = multiple ? page : 'home';
  const brand = /^#[0-9a-f]{6}$/i.test(site.brand_color) ? site.brand_color : template.color;
  const enabled = key => pages.includes(key);
  function href(key) {
    if (!multiple) return `#${key}`;
    const params = new URLSearchParams(location.search);
    if (key === 'home') params.delete('page'); else params.set('page', key);
    return `${location.pathname}${params.size ? `?${params}` : ''}`;
  }
  function navigate(event, key) {
    if (preview && multiple) { event.preventDefault(); setPage(key); }
  }
  useEffect(() => { if (!preview) {
    document.title = `${site.name}${current !== 'home' && pageNames[current] ? ` | ${pageNames[current]}` : ''}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.heroText);
  } }, [site.name, content.heroText, current, preview]);
  const show = key => enabled(key) && (!multiple || current === key);
  const contactHref = enabled('contact') ? href('contact') : content.whatsapp ? `https://wa.me/${content.whatsapp.replace(/\D/g, '')}` : content.email ? `mailto:${content.email}` : content.phone ? `tel:${content.phone.replace(/[^+\d]/g, '')}` : null;
  const services = show('services') && <section className="web-services web-section" id="services" key="services"><div className="web-section-title"><span>Services</span><h2>{template.serviceLabel}</h2></div>{content.services.length ? <div className="web-service-list">{content.services.map((service, index) => <article className="web-service" key={service.id}><span className="web-number">{String(index + 1).padStart(2, '0')}</span><div><WebsiteImage src={service.image} alt={service.title} /><h3>{service.title}</h3>{service.description && <p>{service.description}</p>}</div></article>)}</div> : <p>Service details will appear here.</p>}</section>;
  const about = show('about') && <section className={`web-about web-section ${content.aboutImage ? 'has-image' : ''}`} id="about" key="about"><div className="web-section-title"><span>About</span><h2>{content.aboutTitle || `About ${site.name}`}</h2></div><div className="web-about-copy"><WebsiteImage src={content.aboutImage} alt={content.aboutImageAlt || `About ${site.name}`} />{content.about ? <p>{content.about}</p> : <p>Add the client’s story in the editor.</p>}</div></section>;
  return <div className={`client-website web-${template.layout}`} style={{ '--client-brand': brand, '--client-on-brand': foregroundFor(brand) }}>
    <a className="skip" href="#website-main">Skip to website content</a>
    <header className="web-header"><a className="web-brand" href={href('home')} onClick={event => navigate(event, 'home')}><WebsiteImage src={content.logo} alt="" />{site.name || 'Your business name'}</a><nav aria-label="Website pages">{pages.map(key => <a key={key} href={href(key)} onClick={event => navigate(event, key)} aria-current={multiple && current === key ? 'page' : undefined}>{pageNames[key]}</a>)}</nav></header>
    <main id="website-main">
      {(!multiple || current === 'home') && <section className={`web-hero ${content.heroImage ? 'has-image' : ''}`} id="home"><div className="web-hero-copy"><h1>{content.heroTitle || 'Your client’s headline goes here.'}</h1>{content.heroText && <p>{content.heroText}</p>}<div className="web-hero-actions">{contactHref && <a className="web-cta" href={contactHref} onClick={event => enabled('contact') && navigate(event, 'contact')}>Contact us</a>}{enabled('services') && <a className="web-text-link" href={href('services')} onClick={event => navigate(event, 'services')}>View services</a>}</div></div><WebsiteImage className="web-hero-image" src={content.heroImage} alt={content.heroImageAlt || site.name} /></section>}
      {multiple && current === 'home' && enabled('services') && content.services.length > 0 && <div className="web-home-index"><span>{template.serviceLabel}</span>{content.services.slice(0, 4).map(service => <a key={service.id} href={href('services')} onClick={event => navigate(event, 'services')}>{service.title}</a>)}</div>}
      {template.aboutFirst ? [about, services] : [services, about]}
      {show('contact') && <section className="web-contact web-section" id="contact"><div className="web-section-title"><span>Contact</span><h2>Let’s talk.</h2></div><div className="web-contact-details">{content.email && <a href={`mailto:${content.email}`}><small>Email</small>{content.email}</a>}{content.phone && <a href={`tel:${content.phone.replace(/[^+\d]/g, '')}`}><small>Phone</small>{content.phone}</a>}{content.whatsapp && <a href={`https://wa.me/${content.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><small>WhatsApp</small>Message us on WhatsApp</a>}{content.address && <div><small>Visit us</small><p>{content.address}</p></div>}{!content.email && !content.phone && !content.whatsapp && !content.address && <p>Add contact details in the editor.</p>}</div></section>}
      {multiple && !pages.includes(current) && <section className="web-section"><h1>Page not found</h1><a href={href('home')} onClick={event => navigate(event, 'home')}>Return home</a></section>}
    </main>
    <footer className="web-footer"><strong>{site.name || 'Your business'}</strong><span>© {new Date().getFullYear()} {site.name}</span>{enabled('contact') && <a href={href('contact')} onClick={event => navigate(event, 'contact')}>Contact</a>}</footer>
  </div>;
}
