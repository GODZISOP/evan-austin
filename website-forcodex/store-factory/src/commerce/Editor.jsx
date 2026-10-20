import React, { useEffect, useState, useRef } from 'react';
import Storefront, { Photo } from './Storefront.jsx';
import { clone, newProduct, onColor, pageLabels, section, sectionLabels, slugify, themeById, themes, uid } from './model.js';
import SectionBuilder from '../sections/SectionBuilder.jsx';
import { createSection } from '../sections/sectionModel.js';
import {
  Undo2,
  Redo2,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  Sparkles,
  ExternalLink,
  Save,
  Check,
  X,
  Palette,
  Package,
  FolderTree,
  Settings,
  ShoppingBag,
  Sliders,
  Layers,
  ChevronRight,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

export function Field({ label, value, onChange, type = 'text', options, rows = 3, ...props }) {
  return (
    <label className="ce-field">
      <span>{label}</span>
      {options ? (
        <select value={value} onChange={event => onChange(event.target.value)} {...props}>
          {options.map(option => typeof option === 'string' ? (
            <option key={option} value={option}>{option}</option>
          ) : (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea rows={rows} value={value} onChange={event => onChange(event.target.value)} {...props} />
      ) : type === 'checkbox' ? (
        <input type="checkbox" checked={Boolean(value)} onChange={event => onChange(event.target.checked)} {...props} />
      ) : (
        <input
          type={type}
          value={value ?? ''}
          onChange={event => onChange(type === 'number' && event.target.value !== '' ? Number(event.target.value) : event.target.value)}
          {...props}
        />
      )}
    </label>
  );
}

export function ImageInput({ label, value, onChange, multiple = false, onBusy = () => {} }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState('');
  const images = multiple ? (Array.isArray(value) ? value : value ? [value] : []) : (value ? [value] : []);

  async function upload(event) {
    const files = [...event.target.files];
    event.target.value = '';
    setBusy(true);
    onBusy(true);
    setError('');
    try {
      const values = [];
      for (const file of files) {
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) {
          throw new Error('Use PNG, JPEG or WebP photos under 12 MB.');
        }
        const bitmap = await createImageBitmap(file);
        const ratio = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * ratio);
        canvas.height = Math.round(bitmap.height * ratio);
        canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        const result = canvas.toDataURL('image/webp', 0.76);
        if (result.length > 650000) throw new Error('Use a smaller photograph or a hosted image URL.');
        values.push(result);
      }
      onChange(multiple ? [...images, ...values] : values[0] || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }

  return (
    <div className="ce-image-input">
      <span className="ce-label">{label}</span>
      {images.length > 0 && (
        <div className="ce-image-list">
          {images.map((img, index) => (
            <div key={index}>
              <Photo src={img} alt={`${label} ${index + 1}`} />
              <button aria-label={`Remove ${label.toLowerCase()} ${index + 1}`} onClick={() => onChange(multiple ? images.filter((_, i) => i !== index) : '')}>×</button>
            </div>
          ))}
        </div>
      )}
      <label className="ce-upload">
        {busy ? 'Optimising...' : 'Upload image' + (multiple ? 's' : '')}
        <input aria-label={`Upload ${label.toLowerCase()}`} type="file" accept="image/png,image/jpeg,image/webp" multiple={multiple} disabled={busy} onChange={upload} />
      </label>
      <div className="ce-url-input">
        <input aria-label={`${label} URL`} placeholder="Or paste an HTTPS image URL" value={url} onChange={event => setUrl(event.target.value)} />
        <button onClick={() => {
          if (!/^https:\/\//i.test(url)) {
            setError('Use an HTTPS image URL.');
            return;
          }
          onChange(multiple ? [...images, url] : url);
          setUrl('');
          setError('');
        }}>Add</button>
      </div>
      {error && <p role="alert" className="ce-error">{error}</p>}
    </div>
  );
}

const PRESET_GALLERY = [
  { label: 'Skincare Hero Bottles', url: '/commerce/purelis-hero.jpg' },
  { label: 'Organic Promo Card', url: '/commerce/purelis-promo.jpg' },
  { label: 'Forest Landscape', url: '/commerce/trade-forest.png' },
  { label: 'Minimal Watch', url: '/commerce/watch.webp' },
  { label: 'Fashion Find', url: '/commerce/fashion.webp' },
  { label: 'Creator Tech Headphones', url: '/commerce/headphones.webp' },
  { label: 'Luxury Perfume', url: '/commerce/perfume.webp' },
  { label: 'Apothecary Cleanser', url: '/template-images/cleaning.webp' }
];

const COLOR_SWATCHES = [
  '#0c363d', '#0c8a74', '#111827', '#ffffff', '#f4f6f8',
  '#f59e0b', '#e11d48', '#2563eb', '#10b981', '#6b7280'
];

export default function Editor({
  initial,
  publication,
  demo,
  orders = [],
  onSave,
  onBack,
  onUnpublish,
  onDirty
}) {
  const [store, setStore] = useState(clone(initial));
  const [history, setHistory] = useState([clone(initial)]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [page, setPage] = useState('home');
  const [device, setDevice] = useState('desktop');
  const [railTab, setRailTab] = useState('sections');
  const [selectedTarget, setSelectedTarget] = useState({ type: 'section', id: initial.pages.home[0]?.id || '' });

  const [busy, setBusy] = useState(false);
  const [assetBusy, setAssetBusy] = useState(0);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [productId, setProductId] = useState(initial.products[0]?.id || '');

  const updateTimeoutRef = useRef(null);

  // Undo / Redo update handler
  const mutateStore = (fn, pushHistory = true) => {
    setStore(prev => {
      const next = clone(prev);
      fn(next);

      if (pushHistory) {
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = setTimeout(() => {
          setHistory(hist => {
            const trimmed = hist.slice(0, historyIndex + 1);
            return [...trimmed.slice(-30), clone(next)];
          });
          setHistoryIndex(idx => Math.min(idx + 1, 30));
        }, 180);
      }

      return next;
    });
    onDirty(true);
    setNotice('');
  };

  const undo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setStore(clone(history[nextIdx]));
      onDirty(true);
      setNotice('Action undone');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setStore(clone(history[nextIdx]));
      onDirty(true);
      setNotice('Action redone');
    }
  };

  // Keyboard shortcut listener: Ctrl+Z, Ctrl+Y, Ctrl+S
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        persist(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [historyIndex, history, store]);

  // Save / Publish
  async function persist(publish = false) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const saved = await onSave(store, publish);
      setStore(saved);
      onDirty(false);
      setNotice(
        publish
          ? (demo ? 'Local store published! Preview in a new tab.' : 'Store published successfully!')
          : `Draft saved successfully at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Section drag-and-drop
  function moveSection(from, to) {
    mutateStore(next => {
      const list = next.pages[page];
      const [item] = list.splice(from, 1);
      list.splice(to, 0, item);
    });
  }

  // Section actions
  function addSection(type) {
    const newSec = section(type, type === 'custom' ? { definition: createSection() } : {});
    mutateStore(next => {
      if (!next.pages[page]) next.pages[page] = [];
      next.pages[page].push(newSec);
    });
    setSelectedTarget({ type: 'section', id: newSec.id, label: sectionLabels[type] || 'New Section' });
    setAddModal(false);
    setNotice(`Added ${sectionLabels[type] || 'section'} to ${pageLabels[page] || page}`);
  }

  function duplicateSection(secId) {
    mutateStore(next => {
      const list = next.pages[page];
      const idx = list.findIndex(s => s.id === secId);
      if (idx !== -1) {
        const copy = { ...clone(list[idx]), id: uid() };
        list.splice(idx + 1, 0, copy);
        setSelectedTarget({ type: 'section', id: copy.id, label: copy.title || 'Duplicated Section' });
      }
    });
  }

  function removeSection(secId) {
    mutateStore(next => {
      next.pages[page] = next.pages[page].filter(s => s.id !== secId);
    });
    setSelectedTarget(null);
    setNotice('Section removed.');
  }

  function toggleSectionVisibility(secId) {
    mutateStore(next => {
      const s = next.pages[page].find(item => item.id === secId);
      if (s) s.visible = !s.visible;
    });
  }

  // Target element update helpers
  const currentSections = store.pages[page] || [];
  const currentSection = selectedTarget?.sectionId
    ? currentSections.find(s => s.id === selectedTarget.sectionId)
    : selectedTarget?.id
    ? currentSections.find(s => s.id === selectedTarget.id)
    : null;

  const editCurrentSection = (key, val) => {
    const secId = selectedTarget?.sectionId || selectedTarget?.id;
    if (!secId) return;
    mutateStore(next => {
      const s = next.pages[page]?.find(item => item.id === secId);
      if (s) s[key] = val;
    });
  };

  const editSettings = (key, val) => {
    mutateStore(next => {
      next.settings[key] = val;
    });
  };

  const uploadBusy = val => setAssetBusy(c => c + (val ? 1 : -1));

  // Handle element selection from preview click
  const handleInspectSelect = (target) => {
    if (!target) return;
    if (typeof target === 'string') {
      setSelectedTarget({ type: 'section', id: target, label: 'Section' });
      return;
    }
    setSelectedTarget(target);
  };

  const link = `${location.origin}/?store=${publication?.slug || store.slug}${demo ? '&demo=1' : ''}`;

  return (
    <div className="shopify-editor">
      {/* 1. TOP APP BAR */}
      <header className="se-topbar">
        <div className="se-topbar-left">
          <button type="button" className="se-back-btn" onClick={onBack}>
            ← All stores
          </button>
          <div className="se-store-badge">
            <span className="se-store-name" title={store.name}>{store.name || 'Store'}</span>
            <span className="se-tag-pill">{demo ? 'Local Workspace' : 'Supabase'}</span>
          </div>
        </div>

        <div className="se-topbar-center">
          {/* Page Picker */}
          <div className="se-page-picker">
            <span className="se-page-picker-label">Page:</span>
            <select
              value={page}
              onChange={e => {
                const newPage = e.target.value;
                setPage(newPage);
                const firstSec = store.pages[newPage]?.[0];
                setSelectedTarget(firstSec ? { type: 'section', id: firstSec.id, label: firstSec.title || 'Section' } : null);
              }}
            >
              {Object.entries(pageLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Undo / Redo */}
          <div className="se-history-btns" role="group" aria-label="Undo and Redo">
            <button
              type="button"
              className="se-history-btn"
              onClick={undo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              className="se-history-btn"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={15} />
            </button>
          </div>

          {/* Viewport Switcher */}
          <div className="se-viewport-switcher" role="group" aria-label="Device Preview">
            <button
              type="button"
              className={`se-viewport-btn ${device === 'desktop' ? 'is-active' : ''}`}
              onClick={() => setDevice('desktop')}
              title="Desktop View"
            >
              <Monitor size={14} /> Desktop
            </button>
            <button
              type="button"
              className={`se-viewport-btn ${device === 'tablet' ? 'is-active' : ''}`}
              onClick={() => setDevice('tablet')}
              title="Tablet View (768px)"
            >
              <Tablet size={14} /> Tablet
            </button>
            <button
              type="button"
              className={`se-viewport-btn ${device === 'mobile' ? 'is-active' : ''}`}
              onClick={() => setDevice('mobile')}
              title="Mobile View (390px)"
            >
              <Smartphone size={14} /> Mobile
            </button>
          </div>
        </div>

        <div className="se-topbar-right">
          <a href={link} target="_blank" rel="noreferrer" className="se-preview-tab-btn" title="Open public storefront preview in a new browser tab">
            Preview Store <ExternalLink size={12} />
          </a>
          <button
            type="button"
            className="se-save-btn"
            disabled={busy || assetBusy > 0}
            onClick={() => persist(false)}
            title="Save draft changes (Ctrl+S)"
          >
            <Save size={13} /> {busy ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            className="se-publish-btn"
            disabled={busy || assetBusy > 0}
            onClick={() => persist(true)}
          >
            <Sparkles size={13} /> {publication ? 'Publish Changes' : 'Publish Store'}
          </button>
        </div>
      </header>

      {/* 2. THREE-COLUMN SHOPIFY WORKSPACE */}
      <div className="se-workspace">
        {/* ===================================================================
            LEFT RAIL: PAGES & SECTIONS TREE + WORKSPACE TABS
           =================================================================== */}
        <aside className="se-left-rail" aria-label="Pages and Sections Tree">
          <div className="se-rail-header">
            <div className="se-rail-title">
              <span>Current Page</span>
              <strong>{pageLabels[page] || page}</strong>
            </div>
            {railTab === 'sections' && (
              <button
                type="button"
                className="se-add-sec-pill"
                onClick={() => setAddModal(true)}
              >
                <Plus size={13} /> Add section
              </button>
            )}
          </div>

          <div className="se-rail-content">
            {railTab === 'sections' && (
              <>
                {/* Header Group */}
                <div className="se-tree-group">
                  <div className="se-tree-group-label">
                    <span>Header</span>
                  </div>
                  <ul className="se-tree-list">
                    <li
                      className={`se-tree-item ${selectedTarget?.type === 'announcement' ? 'is-selected' : ''}`}
                      onClick={() => setSelectedTarget({ type: 'announcement', label: 'Announcement Bar' })}
                    >
                      <div className="se-tree-item-main">
                        <span className="se-tree-item-info">
                          <strong className="se-tree-item-title">Announcement Bar</strong>
                          <span className="se-tree-item-sub">{store.settings?.announcement ? 'Active ticker' : 'Disabled'}</span>
                        </span>
                      </div>
                    </li>
                    <li
                      className={`se-tree-item ${selectedTarget?.type === 'header' || selectedTarget?.type === 'logo' || selectedTarget?.type === 'navbar' ? 'is-selected' : ''}`}
                      onClick={() => setSelectedTarget({ type: 'header', label: 'Header & Navigation' })}
                    >
                      <div className="se-tree-item-main">
                        <span className="se-tree-item-info">
                          <strong className="se-tree-item-title">Header & Logo</strong>
                          <span className="se-tree-item-sub">{store.name || 'Store Brand'}</span>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Template Sections */}
                <div className="se-tree-group">
                  <div className="se-tree-group-label">
                    <span>Template Sections</span>
                    <span>{currentSections.length}</span>
                  </div>

                  <ul className="se-tree-list">
                    {currentSections.map((sec, index) => {
                      const isSelected = selectedTarget?.id === sec.id || selectedTarget?.sectionId === sec.id;
                      return (
                        <li
                          key={sec.id || index}
                          draggable
                          onDragStart={e => {
                            setDrag(index);
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', sec.id);
                          }}
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => {
                            e.preventDefault();
                            if (drag !== null && drag !== index) moveSection(drag, index);
                            setDrag(null);
                          }}
                          onDragEnd={() => setDrag(null)}
                          className={`se-tree-item ${isSelected ? 'is-selected' : ''} ${sec.visible === false ? 'is-hidden' : ''}`}
                          onClick={() => setSelectedTarget({ type: 'section', id: sec.id, label: sec.title || sectionLabels[sec.type] || 'Section' })}
                        >
                          <div className="se-tree-item-main">
                            <span className="se-grip-handle" title="Drag to reorder">⠿</span>
                            <div className="se-tree-item-info">
                              <strong className="se-tree-item-title">
                                {sectionLabels[sec.type] || 'Section'}
                              </strong>
                              <span className="se-tree-item-sub">
                                {sec.title || sec.eyebrow || 'Untitled section'}
                              </span>
                            </div>
                          </div>

                          <div className="se-tree-actions" onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              className="se-icon-btn"
                              title={sec.visible === false ? 'Show section' : 'Hide section'}
                              onClick={() => toggleSectionVisibility(sec.id)}
                            >
                              {sec.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                            <button
                              type="button"
                              className="se-icon-btn"
                              title="Move section up"
                              disabled={index === 0}
                              onClick={() => moveSection(index, index - 1)}
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              className="se-icon-btn"
                              title="Move section down"
                              disabled={index === currentSections.length - 1}
                              onClick={() => moveSection(index, index + 1)}
                            >
                              <ArrowDown size={13} />
                            </button>
                            <button
                              type="button"
                              className="se-icon-btn"
                              title="Duplicate section"
                              onClick={() => duplicateSection(sec.id)}
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              type="button"
                              className="se-icon-btn is-danger"
                              title="Delete section"
                              onClick={() => removeSection(sec.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Footer Group */}
                <div className="se-tree-group">
                  <div className="se-tree-group-label">
                    <span>Footer</span>
                  </div>
                  <ul className="se-tree-list">
                    <li
                      className={`se-tree-item ${selectedTarget?.type === 'footer' ? 'is-selected' : ''}`}
                      onClick={() => setSelectedTarget({ type: 'footer', label: 'Store Footer' })}
                    >
                      <div className="se-tree-item-main">
                        <span className="se-tree-item-info">
                          <strong className="se-tree-item-title">Store Footer</strong>
                          <span className="se-tree-item-sub">{store.settings?.footerText?.slice(0, 30) || 'Footer links & info'}</span>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {railTab === 'theme' && (
              <div className="se-prop-group">
                <span className="se-prop-group-title">Theme Presets</span>
                <Field
                  label="Preset Look"
                  value={store.theme}
                  options={themes.map(t => ({ value: t.id, label: t.name }))}
                  onChange={val => mutateStore(next => {
                    const t = themeById(val);
                    next.theme = val;
                    Object.assign(next.settings, {
                      color: t.color,
                      background: t.background,
                      font: t.font,
                      radius: t.radius,
                      card: t.card
                    });
                  })}
                />
                <span className="se-prop-group-title">Store Branding</span>
                <ImageInput
                  label="Store Logo"
                  value={store.settings.logo}
                  onChange={val => editSettings('logo', val)}
                  onBusy={uploadBusy}
                />
                <Field
                  label="Brand Primary Color"
                  type="color"
                  value={store.settings.color}
                  onChange={val => editSettings('color', val)}
                />
                <Field
                  label="Store Background Color"
                  type="color"
                  value={store.settings.background}
                  onChange={val => editSettings('background', val)}
                />
                <Field
                  label="Global Font Family"
                  value={store.settings.font}
                  options={[
                    { value: 'editorial', label: 'Editorial (Sans + Serif)' },
                    { value: 'serif', label: 'Classic Serif (Georgia)' },
                    { value: 'modern', label: 'Modern Sans (System)' },
                    { value: 'bold', label: 'Bold Display (Manrope)' }
                  ]}
                  onChange={val => editSettings('font', val)}
                />
                <Field
                  label={`Border Radius (${store.settings.radius}px)`}
                  type="range"
                  min="0"
                  max="30"
                  value={store.settings.radius}
                  onChange={val => editSettings('radius', Number(val))}
                />
              </div>
            )}

            {railTab === 'products' && (
              <div className="se-prop-group">
                <span className="se-prop-group-title">Product Catalog ({store.products.length})</span>
                <button
                  type="button"
                  className="se-add-sec-pill"
                  style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
                  onClick={() => {
                    const p = newProduct();
                    p.name = 'New Product';
                    mutateStore(next => next.products.push(p));
                    setProductId(p.id);
                    setSelectedTarget({ type: 'product', id: p.id, label: p.name });
                  }}
                >
                  <Plus size={13} /> Add new product
                </button>
                <ul className="se-tree-list">
                  {store.products.map(p => (
                    <li
                      key={p.id}
                      className={`se-tree-item ${selectedTarget?.id === p.id ? 'is-selected' : ''}`}
                      onClick={() => {
                        setProductId(p.id);
                        setSelectedTarget({ type: 'product', id: p.id, label: p.name });
                      }}
                    >
                      <div className="se-tree-item-main">
                        <Photo src={p.images[0]} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover' }} />
                        <div className="se-tree-item-info">
                          <strong className="se-tree-item-title">{p.name || 'Untitled'}</strong>
                          <span className="se-tree-item-sub">${p.price} · {p.category || 'No category'}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {railTab === 'catalogue' && (
              <div className="se-prop-group">
                <span className="se-prop-group-title">Store Categories</span>
                <Field
                  label="Categories (one per line)"
                  type="textarea"
                  rows={6}
                  value={store.categories.join('\n')}
                  onChange={val => mutateStore(next => { next.categories = val.split('\n'); })}
                />
                <span className="se-prop-group-title">Collections</span>
                {store.collections.map((c, i) => (
                  <div key={c.id} style={{ background: '#f8faf8', padding: 8, borderRadius: 6, marginBottom: 8, border: '1px solid #e2ece5' }}>
                    <Field label="Collection Name" value={c.name} onChange={val => mutateStore(next => { next.collections[i].name = val; })} />
                    <ImageInput label="Image" value={c.image} onChange={val => mutateStore(next => { next.collections[i].image = val; })} onBusy={uploadBusy} />
                  </div>
                ))}
              </div>
            )}

            {railTab === 'settings' && (
              <div className="se-prop-group">
                <span className="se-prop-group-title">Store Identity</span>
                <Field label="Store Name" value={store.name} onChange={val => mutateStore(next => { next.name = val; })} />
                <Field label="Store Slug / URL" value={store.slug} onChange={val => mutateStore(next => { next.slug = val; })} />
                <Field label="Currency" value={store.settings.currency} options={['USD', 'AED', 'PKR']} onChange={val => editSettings('currency', val)} />
                <Field label="Contact Email" value={store.settings.email} onChange={val => editSettings('email', val)} />
                <Field label="Phone Number" value={store.settings.phone} onChange={val => editSettings('phone', val)} />
                <Field label="WhatsApp Desk" value={store.settings.whatsapp} onChange={val => editSettings('whatsapp', val)} />
                <Field label="Announcement Text" value={store.settings.announcement} onChange={val => editSettings('announcement', val)} />
              </div>
            )}

            {railTab === 'orders' && (
              <div className="se-prop-group">
                <span className="se-prop-group-title">Customer Orders ({orders.length})</span>
                {orders.length ? orders.map(ord => (
                  <article key={ord.id} style={{ background: '#f8faf8', padding: 10, borderRadius: 6, marginBottom: 8, border: '1px solid #d9e2db' }}>
                    <strong style={{ fontSize: 13, color: '#13281c' }}>{ord.customer?.name}</strong>
                    <div style={{ fontSize: 11, color: '#526659' }}>{ord.customer?.email}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0c8a74', marginTop: 4 }}>
                      {(ord.total / 100).toFixed(2)} {ord.currency}
                    </div>
                  </article>
                )) : <p style={{ fontSize: 12, color: '#778' }}>No orders yet.</p>}
              </div>
            )}
          </div>

          {/* Bottom Tabs */}
          <nav className="se-rail-tabs" aria-label="Editor Sidebar Views">
            <button
              type="button"
              className={`se-rail-tab-btn ${railTab === 'sections' ? 'is-active' : ''}`}
              onClick={() => setRailTab('sections')}
            >
              <span>📑</span>
              Sections
            </button>
            <button
              type="button"
              className={`se-rail-tab-btn ${railTab === 'theme' ? 'is-active' : ''}`}
              onClick={() => setRailTab('theme')}
            >
              <span>🎨</span>
              Theme
            </button>
            <button
              type="button"
              className={`se-rail-tab-btn ${railTab === 'products' ? 'is-active' : ''}`}
              onClick={() => setRailTab('products')}
            >
              <span>📦</span>
              Products
            </button>
            <button
              type="button"
              className={`se-rail-tab-btn ${railTab === 'catalogue' ? 'is-active' : ''}`}
              onClick={() => setRailTab('catalogue')}
            >
              <span>🗂️</span>
              Catalog
            </button>
            <button
              type="button"
              className={`se-rail-tab-btn ${railTab === 'settings' ? 'is-active' : ''}`}
              onClick={() => setRailTab('settings')}
            >
              <span>⚙️</span>
              Settings
            </button>
            <button
              type="button"
              className={`se-rail-tab-btn ${railTab === 'orders' ? 'is-active' : ''}`}
              onClick={() => setRailTab('orders')}
            >
              <span>🛍️</span>
              Orders
            </button>
          </nav>
        </aside>

        {/* ===================================================================
            CENTER CANVAS: LIVE PREVIEW WITH RESPONSIVE FRAMES
           =================================================================== */}
        <main className="se-canvas-area" aria-label="Live Visual Website Canvas">
          <div className="se-canvas-bar">
            <div className="se-canvas-breadcrumb">
              <span>{pageLabels[page] || page}</span>
              <ChevronRight size={12} />
              <strong>{selectedTarget?.label || 'Click any element to edit'}</strong>
              {selectedTarget && (
                <button
                  type="button"
                  className="se-canvas-deselect-btn"
                  onClick={() => setSelectedTarget(null)}
                >
                  Clear Selection ✕
                </button>
              )}
            </div>

            <div className="se-canvas-live-tag">
              <span className="se-live-pulse-dot" />
              <span>Live Visual Preview</span>
            </div>
          </div>

          <div className="se-canvas-scroll">
            <div className={`se-preview-viewport-frame device-${device}`}>
              <Storefront
                key={store.id}
                store={store}
                preview={true}
                demo={demo}
                initialPage={page}
                initialProductId={productId}
                selectedSection={selectedTarget?.sectionId || selectedTarget?.id || null}
                selectedTarget={selectedTarget}
                activeTab={railTab}
                onSectionSelect={handleInspectSelect}
                isMobile={device === 'mobile'}
                device={device}
              />
            </div>
          </div>
        </main>

        {/* ===================================================================
            RIGHT INSPECTOR: CONTEXT-AWARE PROPERTIES & STYLING CONTROLS
           =================================================================== */}
        <aside className="se-right-inspector" aria-label="Properties and Element Inspector">
          {selectedTarget ? (
            <>
              <div className="se-inspector-top">
                <div className="se-inspector-badge">
                  <span className="se-inspector-icon">
                    {selectedTarget.element === 'text' ? '✍️' :
                     selectedTarget.element === 'button' ? '🔘' :
                     selectedTarget.element === 'image' ? '🖼️' :
                     selectedTarget.type === 'product' ? '📦' :
                     selectedTarget.type === 'header' ? '🔝' :
                     selectedTarget.type === 'footer' ? '🔻' : '📐'}
                  </span>
                  <div className="se-inspector-meta">
                    <small>
                      {selectedTarget.element ? `${selectedTarget.element.toUpperCase()} ELEMENT` : 'SECTION INSPECTOR'}
                    </small>
                    <strong title={selectedTarget.label}>{selectedTarget.label || 'Selected Item'}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="se-modal-close-btn"
                  onClick={() => setSelectedTarget(null)}
                  title="Close Inspector"
                >
                  ✕
                </button>
              </div>

              <div className="se-inspector-body">
                {/* 1. TEXT ELEMENT INSPECTOR */}
                {selectedTarget.element === 'text' && currentSection && (
                  <>
                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Text Content</span>
                      <Field
                        label="Content"
                        type="textarea"
                        rows={4}
                        value={currentSection[selectedTarget.field] || ''}
                        onChange={val => editCurrentSection(selectedTarget.field, val)}
                      />
                    </div>

                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Typography & Size</span>
                      <Field
                        label="Heading Size"
                        value={currentSection.titleSize || 'regular'}
                        options={[
                          { value: 'small', label: 'Small (20px)' },
                          { value: 'regular', label: 'Regular (28px)' },
                          { value: 'large', label: 'Large (42px)' },
                          { value: 'display', label: 'Display (56px)' }
                        ]}
                        onChange={val => editCurrentSection('titleSize', val)}
                      />
                      <Field
                        label="Font Weight"
                        value={currentSection.titleWeight || '700'}
                        options={[
                          { value: '400', label: 'Normal (400)' },
                          { value: '600', label: 'Semibold (600)' },
                          { value: '700', label: 'Bold (700)' },
                          { value: '800', label: 'Extra Bold (800)' }
                        ]}
                        onChange={val => editCurrentSection('titleWeight', val)}
                      />
                    </div>

                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Color & Alignment</span>
                      <div className="se-color-row">
                        <input
                          type="color"
                          className="se-color-picker-input"
                          value={currentSection.titleColor || '#0c363d'}
                          onChange={e => editCurrentSection('titleColor', e.target.value)}
                        />
                        <div className="se-color-swatches">
                          {COLOR_SWATCHES.map(hex => (
                            <button
                              key={hex}
                              type="button"
                              className="se-swatch-circle"
                              style={{ backgroundColor: hex }}
                              onClick={() => editCurrentSection('titleColor', hex)}
                              title={hex}
                            />
                          ))}
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>Text Alignment</span>
                        <div className="se-segmented-control">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              type="button"
                              className={`se-segment-btn ${(currentSection.align || 'left') === align ? 'is-active' : ''}`}
                              onClick={() => editCurrentSection('align', align)}
                            >
                              {align.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 2. BUTTON ELEMENT INSPECTOR */}
                {selectedTarget.element === 'button' && currentSection && (
                  <>
                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Button Content & Link</span>
                      <Field
                        label="Button Text"
                        value={currentSection[selectedTarget.field || 'button'] || ''}
                        onChange={val => editCurrentSection(selectedTarget.field || 'button', val)}
                      />
                      <Field
                        label="Destination Page"
                        value={currentSection[selectedTarget.targetField || 'target'] || 'shop'}
                        options={Object.entries(pageLabels).map(([k, lbl]) => ({ value: k, label: lbl }))}
                        onChange={val => editCurrentSection(selectedTarget.targetField || 'target', val)}
                      />
                    </div>

                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Button Colors</span>
                      <Field
                        label="Background Color"
                        type="color"
                        value={currentSection.buttonBg || '#0c8a74'}
                        onChange={val => editCurrentSection('buttonBg', val)}
                      />
                      <div className="se-color-swatches" style={{ marginBottom: 10 }}>
                        {COLOR_SWATCHES.map(hex => (
                          <button
                            key={hex}
                            type="button"
                            className="se-swatch-circle"
                            style={{ backgroundColor: hex }}
                            onClick={() => editCurrentSection('buttonBg', hex)}
                            title={hex}
                          />
                        ))}
                      </div>
                      <Field
                        label="Text Color"
                        type="color"
                        value={currentSection.buttonColor || '#ffffff'}
                        onChange={val => editCurrentSection('buttonColor', val)}
                      />
                    </div>

                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Border & Radius</span>
                      <Field
                        label={`Border Radius (${currentSection.buttonRadius ?? 8}px)`}
                        type="range"
                        min="0"
                        max="30"
                        value={currentSection.buttonRadius ?? 8}
                        onChange={val => editCurrentSection('buttonRadius', Number(val))}
                      />
                    </div>
                  </>
                )}

                {/* 3. IMAGE ELEMENT INSPECTOR */}
                {selectedTarget.element === 'image' && currentSection && (
                  <>
                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Current Image</span>
                      <ImageInput
                        label="Upload Image File"
                        value={currentSection[selectedTarget.field || 'image'] || ''}
                        onChange={val => editCurrentSection(selectedTarget.field || 'image', val)}
                        onBusy={uploadBusy}
                      />
                    </div>

                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Curated High-Res Presets</span>
                      <div className="se-preset-images-grid">
                        {PRESET_GALLERY.map(item => (
                          <div
                            key={item.url}
                            className="se-preset-thumb"
                            onClick={() => editCurrentSection(selectedTarget.field || 'image', item.url)}
                            title={`Use ${item.label}`}
                          >
                            <img src={item.url} alt={item.label} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Image Styling</span>
                      <Field
                        label="Object Fit"
                        value={currentSection.imageFit || 'cover'}
                        options={['cover', 'contain', 'fill']}
                        onChange={val => editCurrentSection('imageFit', val)}
                      />
                      <Field
                        label={`Corner Radius (${currentSection.imageRadius ?? 10}px)`}
                        type="range"
                        min="0"
                        max="30"
                        value={currentSection.imageRadius ?? 10}
                        onChange={val => editCurrentSection('imageRadius', Number(val))}
                      />
                    </div>
                  </>
                )}

                {/* 4. SECTION CONTAINER INSPECTOR */}
                {selectedTarget.type === 'section' && currentSection && (
                  <>
                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Section Content</span>
                      <Field
                        label="Heading"
                        value={currentSection.title || ''}
                        onChange={val => editCurrentSection('title', val)}
                      />
                      <Field
                        label="Eyebrow Subheading"
                        value={currentSection.eyebrow || ''}
                        onChange={val => editCurrentSection('eyebrow', val)}
                      />
                      <Field
                        label="Description / Body Text"
                        type="textarea"
                        rows={3}
                        value={currentSection.text || ''}
                        onChange={val => editCurrentSection('text', val)}
                      />
                    </div>

                    {currentSection.image !== undefined && (
                      <div className="se-prop-group">
                        <span className="se-prop-group-title">Section Media</span>
                        <ImageInput
                          label="Section Image"
                          value={currentSection.image || ''}
                          onChange={val => editCurrentSection('image', val)}
                          onBusy={uploadBusy}
                        />
                      </div>
                    )}

                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Layout & Appearance</span>
                      <Field
                        label="Section Spacing"
                        value={currentSection.spacing || 'regular'}
                        options={['compact', 'regular', 'airy']}
                        onChange={val => editCurrentSection('spacing', val)}
                      />
                      <Field
                        label="Background Style"
                        value={currentSection.background || 'default'}
                        options={['default', 'white', 'muted', 'brand', 'dark']}
                        onChange={val => editCurrentSection('background', val)}
                      />
                      <Field
                        label="Custom Hex Background (Optional)"
                        type="color"
                        value={currentSection.customBg || '#f4f6f8'}
                        onChange={val => editCurrentSection('customBg', val)}
                      />
                    </div>

                    <div className="se-prop-group">
                      <span className="se-prop-group-title">Section Actions</span>
                      <div className="se-action-row">
                        <button
                          type="button"
                          className="se-save-btn"
                          onClick={() => duplicateSection(currentSection.id)}
                        >
                          <Copy size={12} /> Duplicate
                        </button>
                        <button
                          type="button"
                          className="se-save-btn"
                          style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                          onClick={() => removeSection(currentSection.id)}
                        >
                          <Trash2 size={12} /> Delete Section
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* 5. HEADER & BRAND INSPECTOR */}
                {(selectedTarget.type === 'header' || selectedTarget.type === 'logo' || selectedTarget.type === 'navbar') && (
                  <div className="se-prop-group">
                    <span className="se-prop-group-title">Header & Store Branding</span>
                    <Field
                      label="Store Name / Wordmark"
                      value={store.name}
                      onChange={val => mutateStore(next => { next.name = val; })}
                    />
                    <ImageInput
                      label="Store Logo"
                      value={store.settings.logo || ''}
                      onChange={val => editSettings('logo', val)}
                      onBusy={uploadBusy}
                    />
                    <Field
                      label="Hotline / Telephone"
                      value={store.settings.phone || ''}
                      onChange={val => editSettings('phone', val)}
                    />
                  </div>
                )}

                {/* 6. ANNOUNCEMENT BAR INSPECTOR */}
                {selectedTarget.type === 'announcement' && (
                  <div className="se-prop-group">
                    <span className="se-prop-group-title">Announcement Bar</span>
                    <Field
                      label="Announcement Banner Text"
                      type="textarea"
                      rows={3}
                      value={store.settings.announcement || ''}
                      onChange={val => editSettings('announcement', val)}
                    />
                  </div>
                )}

                {/* 7. FOOTER INSPECTOR */}
                {selectedTarget.type === 'footer' && (
                  <div className="se-prop-group">
                    <span className="se-prop-group-title">Store Footer</span>
                    <Field
                      label="Footer Description"
                      type="textarea"
                      rows={3}
                      value={store.settings.footerText || ''}
                      onChange={val => editSettings('footerText', val)}
                    />
                    <Field
                      label="Business Address"
                      value={store.settings.address || ''}
                      onChange={val => editSettings('address', val)}
                    />
                  </div>
                )}

                {/* 8. PRODUCT INSPECTOR */}
                {selectedTarget.type === 'product' && (
                  (() => {
                    const prod = store.products.find(p => p.id === selectedTarget.id) || store.products[0];
                    if (!prod) return <p>Product not found.</p>;
                    const editProd = (k, v) => mutateStore(next => {
                      const p = next.products.find(item => item.id === prod.id);
                      if (p) p[k] = v;
                    });
                    return (
                      <div className="se-prop-group">
                        <span className="se-prop-group-title">Product Details</span>
                        <Field label="Product Name" value={prod.name} onChange={val => editProd('name', val)} />
                        <Field label="SKU" value={prod.sku} onChange={val => editProd('sku', val)} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <Field label="Price" type="number" step="0.01" value={prod.price} onChange={val => editProd('price', val)} />
                          <Field label="Sale Price" type="number" step="0.01" value={prod.salePrice} onChange={val => editProd('salePrice', val)} />
                        </div>
                        <Field label="Stock Count" type="number" value={prod.stock} onChange={val => editProd('stock', val)} />
                        <Field label="Category" value={prod.category} options={['', ...store.categories]} onChange={val => editProd('category', val)} />
                        <ImageInput multiple label="Product Photos" value={prod.images} onChange={val => editProd('images', val)} onBusy={uploadBusy} />
                        <Field label="Description" type="textarea" rows={3} value={prod.description} onChange={val => editProd('description', val)} />
                      </div>
                    );
                  })()
                )}
              </div>
            </>
          ) : (
            <div className="se-inspector-empty">
              <span className="se-empty-icon">🎯</span>
              <h3>Click Any Element to Edit</h3>
              <p>
                Every element in the live website preview is interactive.
                Click headings, buttons, images, or sections to customize content, typography, and styling.
              </p>
              <div className="se-quick-picks">
                <button
                  type="button"
                  className="se-quick-pick-btn"
                  onClick={() => {
                    const hero = currentSections.find(s => s.type === 'hero') || currentSections[0];
                    if (hero) setSelectedTarget({ type: 'section', id: hero.id, label: 'Hero Section' });
                  }}
                >
                  <span>Edit Hero Section</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  className="se-quick-pick-btn"
                  onClick={() => setSelectedTarget({ type: 'header', label: 'Header & Logo' })}
                >
                  <span>Edit Header & Logo</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  className="se-quick-pick-btn"
                  onClick={() => setRailTab('theme')}
                >
                  <span>Edit Theme Colors & Fonts</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* 3. ADD SECTION MODAL */}
      {addModal && (
        <div className="se-modal-backdrop" onClick={() => setAddModal(false)}>
          <div className="se-modal-box" onClick={e => e.stopPropagation()}>
            <div className="se-modal-header">
              <h3>Add Section to {pageLabels[page] || page}</h3>
              <button
                type="button"
                className="se-modal-close-btn"
                onClick={() => setAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="se-modal-grid">
              {[
                { type: 'hero', icon: '🌟', title: 'Hero Banner', desc: 'Prominent headline, description, button, and featured photography.' },
                { type: 'products', icon: '📦', title: 'Product Selection', desc: 'Showcase bestsellers, fresh arrivals, or featured items.' },
                { type: 'banner', icon: '🏷️', title: 'Promotional Banner', desc: 'Highlight seasonal discounts, limited offers, or campaigns.' },
                { type: 'collections', icon: '🗂️', title: 'Category Showcase', desc: 'Visual division cards to browse departments.' },
                { type: 'services', icon: '🛡️', title: 'Trust Pillars Strip', desc: 'Highlight guarantees, fast dispatch, and certified standards.' },
                { type: 'testimonials', icon: '⭐', title: 'Customer Reviews', desc: 'Approved testimonials with verified customer quotes.' },
                { type: 'faq', icon: '❓', title: 'Frequently Asked Questions', desc: 'Accordion knowledge base for policies and procurement.' },
                { type: 'richtext', icon: '📰', title: 'Editorial Story', desc: 'Brand story, craftsmanship, and verified trade mission.' },
                { type: 'contact', icon: '📞', title: 'Executive Contact Desk', desc: 'Direct corporate email, WhatsApp chat, and hotline.' },
                { type: 'custom', icon: '⚡', title: 'Custom Builder Section', desc: 'Build bespoke multi-column layouts with custom blocks.' }
              ].map(opt => (
                <div
                  key={opt.type}
                  className="se-template-option-card"
                  onClick={() => addSection(opt.type)}
                >
                  <span className="se-template-card-icon">{opt.icon}</span>
                  <div className="se-template-card-text">
                    <strong>{opt.title}</strong>
                    <p>{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notice && (
        <div className="se-toast" role="status">
          <Check size={16} color="#10b981" />
          <span>{notice}</span>
          <button
            type="button"
            style={{ background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer', marginLeft: 8 }}
            onClick={() => setNotice('')}
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="se-toast" style={{ background: '#7f1d1d' }} role="alert">
          <X size={16} color="#f87171" />
          <span>{error}</span>
          <button
            type="button"
            style={{ background: 'none', border: 0, color: '#ffffff', cursor: 'pointer', marginLeft: 8 }}
            onClick={() => setError('')}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
