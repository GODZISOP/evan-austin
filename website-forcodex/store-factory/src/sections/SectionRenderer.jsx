import React from 'react';
import { blockStyle, effectiveStyle, safeLink, safeMedia, videoSource } from './sectionModel.js';

const iconShapes = {
  check: <path d="m5 12 4 4L19 6"/>,
  phone: <><path d="M7 3h10v18H7z"/><path d="M10 18h4"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 7 8 6 8-6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></>,
  location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,
  heart: <path d="M20.8 8.8c0 4.6-8.8 10.1-8.8 10.1S3.2 13.4 3.2 8.8a4.5 4.5 0 0 1 8.8-1.1 4.5 4.5 0 0 1 8.8 1.1Z"/>,
  briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18m-12 0v3h6v-3"/></>,
};

function styleForBlock(sectionStyle, block, device, kind) {
  const own = blockStyle(block, device);
  return {
    textAlign: own.textAlign || sectionStyle.textAlign,
    fontSize: own.fontSize || (kind === 'heading' ? sectionStyle.headingSize : sectionStyle.bodySize),
    fontWeight: own.fontWeight || sectionStyle.fontWeight,
    color: own.color || sectionStyle.color,
  };
}

function Icon({ name }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{iconShapes[name] || iconShapes.check}</svg>;
}

export function BlockView({ block, sectionStyle, device = 'desktop', interactive = false }) {
  const c = block.content;
  const style = styleForBlock(sectionStyle, block, device, ['heading', 'stats'].includes(block.type) ? 'heading' : 'body');
  const imageStyle = { width: `${blockStyle(block, device).imageWidth || sectionStyle.imageWidth}%`, maxWidth: '100%', borderRadius: `${blockStyle(block, device).imageRadius ?? sectionStyle.imageRadius}px`, objectPosition: blockStyle(block, device).imagePosition || sectionStyle.imagePosition };
  const image = safeMedia(c.url);
  let content;
  switch (block.type) {
    case 'heading': {
      const Heading = ['h2','h3','h4'].includes(c.level) ? c.level : 'h2';
      content = <Heading className="custom-heading" style={style}>{c.text}</Heading>; break;
    }
    case 'paragraph': content = <p className="custom-paragraph" style={style}>{c.text}</p>; break;
    case 'button': {
      const href = safeLink(c.url);
      const buttonStyle = sectionStyle.buttonStyle === 'text' ? 'text' : sectionStyle.buttonStyle;
      content = href ? <a className={`custom-button custom-button--${buttonStyle}`} href={href} style={{ '--button-color': sectionStyle.buttonColor, '--button-text': sectionStyle.buttonTextColor }} target={c.newTab && /^https?:/.test(href) ? '_blank' : undefined} rel={c.newTab && /^https?:/.test(href) ? 'noreferrer' : undefined} onClick={interactive ? e => e.preventDefault() : undefined}>{c.text}</a> : <span className="custom-link-missing">{c.text} <small>Set a link in the block settings</small></span>;
      break;
    }
    case 'image': content = image ? <img className="custom-image" src={image} alt={c.alt} style={imageStyle} loading="lazy" onError={e => { e.currentTarget.hidden = true; e.currentTarget.nextElementSibling.hidden = false; }} /> : null; content = <>{content}<div className="custom-image-placeholder" hidden={Boolean(image)}>{c.alt || 'Add an image URL in the block settings'}</div></>; break;
    case 'icon': content = <div className="custom-icon" style={style}><Icon name={c.icon}/><span>{c.label}</span></div>; break;
    case 'badge': content = <span className="custom-badge" style={style}>{c.text}</span>; break;
    case 'stats': content = <div className="custom-stat" style={style}><strong>{c.value || 'Add a verified statistic'}</strong><span>{c.label}</span></div>; break;
    case 'service': { const href = safeLink(c.url); content = <article className="custom-service" style={{ textAlign: style.textAlign }}><Icon name={c.icon}/><h3>{c.title}</h3><p>{c.text}</p>{href ? <a href={href} onClick={interactive ? e => e.preventDefault() : undefined}>{c.linkText}</a> : <small>Set a destination in the block settings</small>}</article>; break; }
    case 'testimonial': content = <blockquote className="custom-quote" style={style}><p>{c.quote || 'Add a real customer quote in the block settings.'}</p><footer>{c.author || 'Add a customer name'}{c.role ? ` · ${c.role}` : ''}</footer></blockquote>; break;
    case 'logo': content = image ? <a className="custom-logo" href={safeLink(c.link) || undefined} onClick={interactive ? e => e.preventDefault() : undefined}><img src={image} alt={c.alt || 'Company logo'} style={imageStyle} loading="lazy" onError={e => { e.currentTarget.hidden = true; e.currentTarget.nextElementSibling.hidden = false; }}/><span hidden>{c.alt || 'Add a logo image URL'}</span></a> : <div className="custom-image-placeholder">{c.alt || 'Add a logo image URL in the block settings'}</div>; break;
    case 'divider': content = <hr className="custom-divider"/>; break;
    case 'spacer': content = <div aria-hidden="true" style={{ height: `${Math.min(240, Math.max(0, Number(c.height) || 0))}px` }} />; break;
    case 'video': { const source = videoSource(c.url); content = source ? source.type === 'file' ? <video className="custom-video" src={source.url} title={c.title} poster={safeMedia(c.poster) || undefined} controls preload="metadata"/> : <iframe className="custom-video" src={source.url} title={c.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/> : <div className="custom-image-placeholder">Add a supported HTTPS video URL</div>; break; }
    case 'list': { const Tag = c.ordered ? 'ol' : 'ul'; content = <Tag className="custom-list" style={style}>{c.items.split('\n').filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}</Tag>; break; }
    case 'contact': { const href = c.kind === 'email' ? safeLink(`mailto:${c.value}`) : c.kind === 'phone' ? safeLink(`tel:${c.value.replace(/[^+\d]/g, '')}`) : c.kind === 'web' ? safeLink(c.value) : ''; content = <div className="custom-contact" style={style}><span>{c.label}</span>{href ? <a href={href}>{c.value}</a> : <strong>{c.value || 'Add contact details in block settings'}</strong>}</div>; break; }
    default: content = null;
  }
  return <div className={`section-block section-block--${block.type}`} style={{ '--block-align': style.textAlign }}>{content}</div>;
}

export function CustomSection({ section, device = 'desktop', interactive = false }) {
  const style = effectiveStyle(section.styles, device);
  const columns = style.columns ? Math.min(4, Math.max(1, style.columns)) : section.layout === 'grid' ? 3 : section.layout === 'split' ? 2 : section.columns.length;
  return <section className={`custom-section custom-section--${section.layout}`} style={{ '--section-width': `${style.width}%`, '--section-max': `${style.maxWidth}px`, '--section-pt': `${style.paddingTop}px`, '--section-pb': `${style.paddingBottom}px`, '--section-px': `${style.paddingX}px`, '--column-gap': `${style.columnGap}px`, '--row-gap': `${style.rowGap}px`, '--section-background': style.background, '--section-image': style.backgroundImage ? `url("${safeMedia(style.backgroundImage)}")` : 'none', '--section-color': style.color, '--section-border': `${style.borderWidth}px solid ${style.borderColor}`, '--section-radius': `${style.radius}px`, '--section-align': style.align, '--section-shadow': style.shadow === 'none' ? 'none' : `0 ${style.shadow === 'soft' ? 4 : style.shadow === 'medium' ? 10 : 20}px ${style.shadow === 'soft' ? 14 : style.shadow === 'medium' ? 26 : 48}px #122018${style.shadow === 'soft' ? '18' : '28'}`, '--section-columns': columns }} hidden={style.hidden}>
    <div className="custom-section__inner">{section.columns.map(column => <div className="custom-section__column" key={column.id}>{column.blocks.map(block => <BlockView key={block.id} block={block} sectionStyle={style} device={device} interactive={interactive}/>)}</div>)}</div>
  </section>;
}
