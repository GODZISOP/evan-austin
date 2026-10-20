import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  BASE_STYLE, BLOCKS, DEVICES, LAYOUTS, blockStyle, changeLayout,
  cloneSection, createBlock, createSection, effectiveStyle, moveBlock,
  reorder, safeLink, safeMedia, uid, validateSections, videoSource,
} from './sectionModel.js';
import { BlockView, CustomSection } from './SectionRenderer.jsx';
import './sections.css';

const ICONS = ['check', 'phone', 'mail', 'clock', 'location', 'heart', 'briefcase'];
const DEVICE_WIDTHS = { desktop: 1200, tablet: 768, mobile: 390 };
const EMPTY = [];
const DRAG_TYPE = 'application/x-store-factory-section-builder';
const TEXT_BLOCKS = new Set(['heading', 'paragraph', 'icon', 'badge', 'stats', 'testimonial', 'list', 'contact']);

const CONTENT_FIELDS = {
  heading: [['text', 'Heading', 'textarea'], ['level', 'Heading level', ['h2', 'h3', 'h4']]],
  paragraph: [['text', 'Paragraph', 'textarea']],
  button: [['text', 'Button label'], ['url', 'Destination URL'], ['newTab', 'Open external link in a new tab', 'checkbox']],
  image: [['url', 'Image URL'], ['alt', 'Image description / alt text']],
  icon: [['icon', 'Icon', ICONS], ['label', 'Visible label']],
  badge: [['text', 'Badge text']],
  stats: [['value', 'Verified value'], ['label', 'What this value measures']],
  service: [['title', 'Service name'], ['text', 'Service description', 'textarea'], ['icon', 'Service icon', ICONS], ['url', 'Service link'], ['linkText', 'Link label']],
  testimonial: [['quote', 'Approved customer quote', 'textarea'], ['author', 'Customer attribution'], ['role', 'Role / company (optional)']],
  logo: [['url', 'Logo image URL'], ['alt', 'Brand name / alt text'], ['link', 'Brand link (optional)']],
  divider: [],
  spacer: [['height', 'Spacer height (px)', 'number', 0, 240]],
  video: [['url', 'Video URL'], ['title', 'Accessible video title'], ['poster', 'Poster image URL (optional)']],
  list: [['items', 'List items (one per line)', 'textarea'], ['ordered', 'Numbered list', 'checkbox']],
  contact: [['label', 'Contact label'], ['kind', 'Contact type', ['email', 'phone', 'web', 'text']], ['value', 'Contact value']],
};

function readable(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
function describeBlock(block) {
  const content = block.content;
  return content.text || content.title || content.label || content.alt || content.quote || content.value || BLOCKS[block.type].label;
}
function gridTemplate(section, device) {
  const style = effectiveStyle(section.styles, device);
  const columns = Math.min(4, Math.max(1, style.columns || LAYOUTS[section.layout].count));
  return section.layout === 'split' && columns === 2 ? 'minmax(0, 0.9fr) minmax(0, 1.2fr)' : `repeat(${columns}, minmax(0, 1fr))`;
}
function analyse(value) {
  try { return { sections: validateSections(value), error: '' }; }
  catch (error) { return { sections: [], error: error.message }; }
}

/**
 * Controlled definitions, not commerce page wrappers. All writes are emitted to the parent.
 * Library records: { id, name, section, updated_at }. The parent saves them in store JSON.
 */
export default function SectionBuilder({
  value, sections: sectionsAlias, onChange, singleSection = false,
  library = EMPTY, onLibraryChange, store, className = '', disabled = false,
  initialDevice = 'desktop',
}) {
  const input = value ?? sectionsAlias ?? EMPTY;
  const analysed = useMemo(() => analyse(input), [input]);
  const sections = analysed.sections;
  const [selectedId, setSelectedId] = useState(() => input[0]?.id || '');
  const [blockId, setBlockId] = useState('');
  const [device, setDevice] = useState(DEVICES.includes(initialDevice) ? initialDevice : 'desktop');
  const [view, setView] = useState('build');
  const [panel, setPanel] = useState('content');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [libraryName, setLibraryName] = useState('');
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryBusy, setLibraryBusy] = useState(false);
  const [drag, setDrag] = useState(null);
  const [dropTarget, setDropTarget] = useState('');
  const [pickerColumn, setPickerColumn] = useState('');
  const [blockSearch, setBlockSearch] = useState('');
  const pickerRef = useRef(null);
  const pickerTriggerRef = useRef(null);
  const mounted = useRef(true);
  const instanceId = useId();
  const section = sections.find(item => item.id === selectedId) || sections[0];
  const column = section?.columns.find(item => item.blocks.some(block => block.id === blockId));
  const block = column?.blocks.find(item => item.id === blockId);
  const style = section ? effectiveStyle(section.styles, device) : BASE_STYLE;
  const editable = !disabled && typeof onChange === 'function' && !analysed.error && !libraryBusy;
  const libraryEditable = editable && typeof onLibraryChange === 'function';
  const records = Array.isArray(library) ? library : EMPTY;

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (!sections.some(item => item.id === selectedId)) { setSelectedId(sections[0]?.id || ''); setBlockId(''); }
  }, [input, selectedId]);
  useEffect(() => { setLibraryName(section?.name || ''); }, [section?.id]);
  useEffect(() => {
    if (pickerColumn && pickerRef.current && !pickerRef.current.open) pickerRef.current.showModal();
  }, [pickerColumn]);

  function emit(next, notice) {
    if (!editable) return;
    try {
      const clean = validateSections(next);
      onChange(clean);
      setError('');
      if (notice) setMessage(notice);
    } catch (error) { setError(error.message); }
  }
  function selectSection(id) { setSelectedId(id); setBlockId(''); setPanel('content'); }
  function selectBlock(sectionId, id) { setSelectedId(sectionId); setBlockId(id); setPanel('content'); }
  function updateSection(transform, notice) {
    if (!section) return;
    emit(sections.map(item => item.id === section.id ? transform(structuredClone(item)) : item), notice);
  }
  function updateBlock(transform, notice) {
    if (!block) return;
    updateSection(next => ({ ...next, columns: next.columns.map(item => ({ ...item, blocks: item.blocks.map(entry => entry.id === block.id ? transform(entry) : entry) })) }), notice);
  }
  function setStyle(key, nextValue) {
    const change = target => ({ ...target, styles: { ...target.styles, [device]: { ...target.styles?.[device], [key]: nextValue } } });
    if (block) updateBlock(change); else updateSection(change);
  }
  function resetStyle(key) {
    const reset = target => {
      const nextDevice = { ...target.styles?.[device] };
      if (key) delete nextDevice[key]; else Object.keys(nextDevice).forEach(name => delete nextDevice[name]);
      return { ...target, styles: { ...target.styles, [device]: nextDevice } };
    };
    if (block) updateBlock(reset); else updateSection(reset);
  }
  function addSection(layout = 'one') {
    const added = changeLayout(createSection(), layout);
    emit([...sections, added], 'Section added. Add blocks to build its content.');
    selectSection(added.id);
  }
  function moveSection(id, delta) {
    const index = sections.findIndex(item => item.id === id);
    const target = index + delta;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections]; const [moved] = next.splice(index, 1); next.splice(target, 0, moved);
    emit(next, `Section moved to position ${target + 1}.`);
  }
  function moveSelectedBlock(sectionId, columnId, id, delta) {
    const parent = sections.find(item => item.id === sectionId);
    const col = parent?.columns.find(item => item.id === columnId);
    const index = col?.blocks.findIndex(item => item.id === id) ?? -1;
    if (index < 0 || index + delta < 0 || index + delta >= col.blocks.length) return;
    const next = structuredClone(parent);
    const nextColumn = next.columns.find(item => item.id === columnId);
    const [moved] = nextColumn.blocks.splice(index, 1); nextColumn.blocks.splice(index + delta, 0, moved);
    emit(sections.map(item => item.id === sectionId ? next : item), `Block moved to position ${index + delta + 1}.`);
  }
  function transferBlock(sourceSectionId, id, targetSectionId, targetColumnId, beforeId = null) {
    const source = sections.find(item => item.id === sourceSectionId);
    const target = sections.find(item => item.id === targetSectionId);
    const sourceBlock = source?.columns.flatMap(item => item.blocks).find(item => item.id === id);
    const targetColumn = target?.columns.find(item => item.id === targetColumnId);
    if (!sourceBlock || !targetColumn || id === beforeId) return;
    if (!targetColumn.blocks.some(item => item.id === id) && targetColumn.blocks.length >= 100) { setError('A column supports up to 100 blocks.'); return; }
    if (source.id === target.id) emit(sections.map(item => item.id === target.id ? moveBlock(item, id, targetColumnId, beforeId) : item), 'Block moved.');
    else {
      const next = structuredClone(sections);
      const from = next.find(item => item.id === source.id);
      from.columns.forEach(item => { item.blocks = item.blocks.filter(entry => entry.id !== id); });
      const to = next.find(item => item.id === target.id).columns.find(item => item.id === targetColumnId);
      const index = to.blocks.findIndex(item => item.id === beforeId);
      to.blocks.splice(index < 0 ? to.blocks.length : index, 0, sourceBlock);
      emit(next, 'Block moved to the selected section and column.');
    }
    setSelectedId(targetSectionId); setBlockId(id);
  }
  function startDrag(event, payload) {
    if (!editable) { event.preventDefault(); return; }
    event.stopPropagation();
    const scoped = { ...payload, instanceId };
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(DRAG_TYPE, JSON.stringify(scoped));
    setDrag(scoped);
  }
  function stopDrag() { setDrag(null); setDropTarget(''); }
  function receiveDrop(event, target) {
    event.preventDefault(); event.stopPropagation();
    let payload = drag;
    try { const raw = event.dataTransfer.getData(DRAG_TYPE); if (raw) payload = JSON.parse(raw); } catch { stopDrag(); return; }
    if (!editable || payload?.instanceId !== instanceId) { stopDrag(); return; }
    if (payload.kind === 'section' && target.kind === 'section' && !singleSection) {
      emit(reorder(sections, payload.id, target.id || null), 'Section order updated.');
    } else if (payload.kind === 'block' && target.kind === 'block') {
      transferBlock(payload.sectionId, payload.id, target.sectionId, target.columnId, target.beforeId);
    }
    stopDrag();
  }
  function dropProps(target, id) {
    return {
      onDragOver: event => { if (editable && drag?.kind === target.kind) { event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = 'move'; setDropTarget(id); } },
      onDrop: event => receiveDrop(event, target),
    };
  }
  function openPicker(columnId, trigger) { pickerTriggerRef.current = trigger; setPickerColumn(columnId); setBlockSearch(''); }
  function closePicker() { setPickerColumn(''); requestAnimationFrame(() => pickerTriggerRef.current?.focus()); }
  function addBlock(type) {
    if (!section || !pickerColumn) return;
    const added = createBlock(type);
    updateSection(next => ({ ...next, columns: next.columns.map(item => item.id === pickerColumn ? { ...item, blocks: [...item.blocks, added] } : item) }), `${BLOCKS[type].label} added.`);
    setBlockId(added.id); setPanel('content');
    pickerRef.current?.close();
  }
  async function saveToLibrary(existingId = null) {
    if (!section || !libraryEditable) return;
    const name = libraryName.trim();
    if (!name) { setError('Give the library section a name.'); return; }
    if (!existingId && records.length >= 100) { setError('This store’s library supports up to 100 sections.'); return; }
    setLibraryBusy(true); setError('');
    try {
      const saved = { id: existingId || uid(), name: name.slice(0, 120), section: cloneSection({ ...section, name }), updated_at: new Date().toISOString() };
      const next = existingId ? records.map(item => item.id === existingId ? saved : item) : [saved, ...records];
      await onLibraryChange(next);
      if (mounted.current) setMessage('Section added to this store’s library. Save the store to persist your changes.');
    } catch (error) { if (mounted.current) setError(error.message || 'Could not update the section library.'); }
    finally { if (mounted.current) setLibraryBusy(false); }
  }
  function reuse(record) {
    try {
      const copy = cloneSection(validateSections([record.section])[0]);
      if (singleSection) {
        if (section?.columns.some(item => item.blocks.length) && !window.confirm('Replace this section with the saved library design?')) return;
        emit([copy], 'Saved design applied. Its blocks are independent of the library original.');
      } else emit([...sections, copy], 'Saved section inserted with independent block identifiers.');
      selectSection(copy.id);
    } catch (error) { setError(error.message); }
  }
  async function removeLibrary(id) {
    if (!libraryEditable || !window.confirm('Remove this saved section from this store’s library? Sections already on pages will remain.')) return;
    setLibraryBusy(true);
    try { await onLibraryChange(records.filter(item => item.id !== id)); if (mounted.current) setMessage('Saved section removed. Existing page sections are unchanged.'); }
    catch (error) { if (mounted.current) setError(error.message || 'Could not remove the saved section.'); }
    finally { if (mounted.current) setLibraryBusy(false); }
  }

  return <div className={`section-builder ${className}`} aria-label="Visual section builder">
    <header className="sb-header"><div><span className="sb-kicker">{store?.name ? `${store.name} / ` : ''}Section studio</span><h2>Make room for your content.</h2></div><div className="sb-header-actions"><button type="button" disabled={!editable || sections.length >= 50 || (singleSection && sections.length > 0)} onClick={() => addSection()}>Add section +</button><button type="button" onClick={() => setPanel('library')}>Section library <span>{records.length}</span></button></div></header>
    {analysed.error && <p className="sb-error" role="alert">The supplied section data is invalid: {analysed.error}</p>}
    {!Array.isArray(library) && <p className="sb-error" role="alert">The library prop must be an array of saved section records.</p>}
    {typeof onChange !== 'function' && <p className="sb-note">Read-only view. Provide onChange to enable editing.</p>}
    {singleSection && sections.length > 1 && <p className="sb-error" role="alert">singleSection expects one definition. Pass a one-item value array or disable singleSection.</p>}
    <div className="sb-toolbar"><div className="sb-toggle" role="group" aria-label="Canvas mode"><button type="button" aria-pressed={view === 'build'} onClick={() => setView('build')}>Edit layout</button><button type="button" aria-pressed={view === 'preview'} onClick={() => setView('preview')}>Live preview</button></div><div className="sb-toggle" role="group" aria-label="Responsive device">{DEVICES.map(item => <button type="button" key={item} aria-pressed={device === item} onClick={() => setDevice(item)}>{readable(item)}</button>)}</div><span className="sb-preview-size">{DEVICE_WIDTHS[device]}px target · fits available space</span></div>
    <div className="sb-workspace">
      <aside className="sb-section-list" aria-label="Page section order"><div className="sb-panel-heading"><h3>Sections</h3><span>{sections.length.toString().padStart(2, '0')}</span></div><ol>{sections.map((item, index) => <li key={item.id} className={`${item.id === section?.id ? 'is-selected' : ''} ${dropTarget === item.id ? 'is-drop-target' : ''}`} {...dropProps({ kind: 'section', id: item.id }, item.id)}>
        <div className="sb-section-row"><button type="button" className="sb-drag-handle" draggable={editable && !singleSection} disabled={!editable || singleSection} aria-label={`Reorder section ${index + 1}: ${item.name}. Use up and down arrows.`} onDragStart={event => startDrag(event, { kind: 'section', id: item.id })} onDragEnd={stopDrag} onKeyDown={event => { if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); moveSection(item.id, event.key === 'ArrowUp' ? -1 : 1); } }}>⠿</button><button type="button" className="sb-section-select" aria-pressed={item.id === section?.id && !block} onClick={() => selectSection(item.id)}><strong>{item.name}</strong><small>{LAYOUTS[item.layout].label} · {item.columns.reduce((sum, col) => sum + col.blocks.length, 0)} blocks{effectiveStyle(item.styles, device).hidden ? ` · Hidden on ${device}` : ''}</small></button></div>
        {!singleSection && <div className="sb-reorder-actions"><button type="button" disabled={!editable || index === 0} aria-label={`Move section ${index + 1} up`} onClick={() => moveSection(item.id, -1)}>Up</button><button type="button" disabled={!editable || index === sections.length - 1} aria-label={`Move section ${index + 1} down`} onClick={() => moveSection(item.id, 1)}>Down</button></div>}
      </li>)}</ol>{!sections.length && <p className="sb-empty-copy">Add a section, choose its layout, then fill its columns with blocks.</p>}{!singleSection && sections.length > 0 && <div className={`sb-section-end ${dropTarget === 'section-end' ? 'is-drop-target' : ''}`} {...dropProps({ kind: 'section', id: null }, 'section-end')}>Drop a section here to move it last</div>}<p className="sb-help">Content is shared across devices. Style changes apply to the selected breakpoint and smaller screens unless overridden.</p></aside>

      <div className="sb-canvas-zone"><div className={`sb-canvas sb-canvas--${device}`} style={{ maxWidth: DEVICE_WIDTHS[device] }}>
        {view === 'preview' ? <SectionBuilderPreview value={sections} device={device} interactive /> : sections.map((item, sectionIndex) => {
          const sectionStyle = effectiveStyle(item.styles, device);
          return <article className={`sb-edit-section ${item.id === section?.id ? 'is-selected' : ''}`} key={item.id}><div className="sb-canvas-section-title"><button type="button" onClick={() => selectSection(item.id)}><span>{String(sectionIndex + 1).padStart(2, '0')}</span>{item.name}</button><span>{LAYOUTS[item.layout].label}</span></div>{sectionStyle.hidden ? <div className="sb-hidden-placeholder"><p>This section is hidden on {device}.</p><button type="button" disabled={!editable} onClick={() => { emit(sections.map(entry => entry.id === item.id ? { ...entry, styles: { ...entry.styles, [device]: { ...entry.styles[device], hidden: false } } } : entry), `Section shown on ${device}.`); }}>Show on {device}</button></div> : <div className="sb-edit-section-surface" style={{ backgroundColor: sectionStyle.background, backgroundImage: sectionStyle.backgroundImage ? `url("${safeMedia(sectionStyle.backgroundImage)}")` : undefined, color: sectionStyle.color, padding: `${sectionStyle.paddingTop}px ${sectionStyle.paddingX}px ${sectionStyle.paddingBottom}px`, border: `${sectionStyle.borderWidth}px solid ${sectionStyle.borderColor}`, borderRadius: sectionStyle.radius }}><div className="sb-edit-columns" style={{ gridTemplateColumns: gridTemplate(item, device), gap: `${sectionStyle.rowGap}px ${sectionStyle.columnGap}px`, maxWidth: sectionStyle.maxWidth, width: `${sectionStyle.width}%`, alignItems: sectionStyle.align }}>{item.columns.map((col, columnIndex) => <div className={`sb-edit-column ${dropTarget === col.id ? 'is-drop-target' : ''}`} key={col.id} {...dropProps({ kind: 'block', sectionId: item.id, columnId: col.id }, col.id)}><div className="sb-column-label">Column {columnIndex + 1}<span>{col.blocks.length} blocks</span></div>{col.blocks.map((entry, index) => <div className={`sb-block ${entry.id === blockId ? 'is-selected' : ''} ${dropTarget === entry.id ? 'is-drop-target' : ''}`} key={entry.id} {...dropProps({ kind: 'block', sectionId: item.id, columnId: col.id, beforeId: entry.id }, entry.id)}>
                <div className="sb-block-toolbar"><button type="button" className="sb-drag-handle" draggable={editable} disabled={!editable} aria-label={`Reorder ${BLOCKS[entry.type].label} block ${index + 1}. Use up and down arrows.`} onDragStart={event => startDrag(event, { kind: 'block', sectionId: item.id, id: entry.id })} onDragEnd={stopDrag} onKeyDown={event => { if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); moveSelectedBlock(item.id, col.id, entry.id, event.key === 'ArrowUp' ? -1 : 1); } }}>⠿</button><button type="button" className="sb-block-select" aria-pressed={entry.id === blockId} onClick={() => selectBlock(item.id, entry.id)}>{BLOCKS[entry.type].label}<span>Edit</span></button></div>
                <div className="sb-block-output" inert=""><BlockView block={entry} sectionStyle={sectionStyle} device={device} interactive /></div>
                <div className="sb-block-move"><button type="button" disabled={!editable || index === 0} aria-label={`Move ${BLOCKS[entry.type].label} block ${index + 1} up`} onClick={() => moveSelectedBlock(item.id, col.id, entry.id, -1)}>Up</button><button type="button" disabled={!editable || index === col.blocks.length - 1} aria-label={`Move ${BLOCKS[entry.type].label} block ${index + 1} down`} onClick={() => moveSelectedBlock(item.id, col.id, entry.id, 1)}>Down</button></div>
              </div>)}{!col.blocks.length && <p className="sb-column-empty">Drop a block here or add one below.</p>}<button type="button" className="sb-add-block" disabled={!editable || col.blocks.length >= 100} onClick={event => { setSelectedId(item.id); openPicker(col.id, event.currentTarget); }}>Add block +</button></div>)}</div></div>}</article>;
        })}
        {!sections.length && <div className="sb-canvas-empty"><span>Start with a section</span><h3>A blank canvas,<br />ready for your client.</h3><p>Choose from 15 editable blocks and seven layouts. No preset claims, testimonials or statistics are added.</p><button type="button" disabled={!editable} onClick={() => addSection()}>Create first section</button></div>}
      </div><p className="sb-canvas-caption">{view === 'preview' ? 'Links are disabled in this editor preview. Test destinations on the published page.' : 'Select a block to edit. Move it with drag and drop, Up/Down, or the destination controls.'}</p></div>

      <aside className="sb-inspector"><div className="sb-inspector-tabs" role="group" aria-label="Inspector panel">{['content', 'style', 'library'].map(item => <button type="button" key={item} aria-pressed={panel === item} onClick={() => setPanel(item)}>{readable(item)}</button>)}</div>
        {panel === 'library' ? <div className="sb-inspector-content"><p className="sb-kicker">This store’s saved designs</p><h3>Section library</h3><p className="sb-help">These records belong to the current store JSON. Saving here does not publish or deploy anything.</p>{!onLibraryChange && <p className="sb-note">Read-only library. Provide onLibraryChange to save, update or remove records.</p>}<Field label="Save selected section as" value={libraryName} onChange={setLibraryName} disabled={!section || !libraryEditable} maxLength={120} /><button type="button" className="sb-primary sb-wide" disabled={!section || !libraryEditable} onClick={() => saveToLibrary()}>{libraryBusy ? 'Updating library...' : 'Save new library section'}</button><Field label="Find a saved section" type="search" value={librarySearch} onChange={setLibrarySearch} />
          <div className="sb-library-list">{records.filter(record => String(record.name || '').toLowerCase().includes(librarySearch.toLowerCase())).map(record => <article className="sb-library-item" key={record.id}><h4>{record.name || 'Untitled saved section'}</h4><p>{LAYOUTS[record.section?.layout]?.label || 'Unknown layout'} · {record.section?.columns?.reduce((sum, col) => sum + (col.blocks?.length || 0), 0) ?? 0} blocks</p><div className="sb-library-actions"><button type="button" disabled={!editable || (!singleSection && sections.length >= 50)} onClick={() => reuse(record)}>{singleSection ? 'Apply design' : 'Insert section'}</button><button type="button" disabled={!section || !libraryEditable} onClick={() => { if (window.confirm(`Replace “${record.name}” in the library with the selected section?`)) saveToLibrary(record.id); }}>Update saved</button><button type="button" className="sb-danger" disabled={!libraryEditable} onClick={() => removeLibrary(record.id)}>Remove saved</button></div></article>)}</div>{!records.length && <p className="sb-empty-copy">No saved sections yet. Build a section and save it here to reuse its design.</p>}{records.length > 0 && !records.some(record => String(record.name || '').toLowerCase().includes(librarySearch.toLowerCase())) && <p className="sb-empty-copy">No saved sections match that search.</p>}</div> : !section ? <div className="sb-inspector-content"><h3>Nothing selected yet.</h3><p>Add a section to begin.</p></div> : <fieldset disabled={!editable} className="sb-inspector-content"><div className="sb-selected-heading"><span className="sb-kicker">{block ? `${BLOCKS[block.type].label} block` : 'Section settings'}</span><h3>{block ? describeBlock(block) : section.name}</h3>{block && <button type="button" className="sb-text-button" onClick={() => setBlockId('')}>Edit parent section</button>}</div>
          {panel === 'content' ? block ? <><BlockContent block={block} onChange={(key, nextValue) => updateBlock(next => ({ ...next, content: { ...next.content, [key]: nextValue } }))} /><div className="sb-control-group"><h4>Move this block</h4><Field label="Destination section" value={section.id} options={sections.map(item => ({ value: item.id, label: item.name }))} onChange={id => { const target = sections.find(item => item.id === id); if (target) transferBlock(section.id, block.id, target.id, target.columns[0].id); }} /><Field label="Move to column" value={column.id} options={section.columns.map((item, index) => ({ value: item.id, label: `Column ${index + 1}` }))} onChange={id => transferBlock(section.id, block.id, section.id, id)} /></div><div className="sb-action-pair"><button type="button" disabled={column.blocks.length >= 100} onClick={() => { const copy = { ...structuredClone(block), id: uid() }; updateSection(next => ({ ...next, columns: next.columns.map(item => { if (item.id !== column.id) return item; const blocks = [...item.blocks]; blocks.splice(blocks.findIndex(entry => entry.id === block.id) + 1, 0, copy); return { ...item, blocks }; }) }), 'Block duplicated.'); setBlockId(copy.id); }}>Duplicate block</button><button type="button" className="sb-danger" onClick={() => { updateSection(next => ({ ...next, columns: next.columns.map(item => ({ ...item, blocks: item.blocks.filter(entry => entry.id !== block.id) })) }), 'Block removed.'); setBlockId(''); }}>Remove block</button></div></> : <><Field label="Section name" value={section.name} maxLength={120} onChange={name => updateSection(next => ({ ...next, name }))} /><div className="sb-layout-picker" role="group" aria-label="Section layout">{Object.entries(LAYOUTS).map(([key, layout]) => <button type="button" key={key} aria-pressed={section.layout === key} onClick={() => updateSection(next => changeLayout(next, key), 'Layout updated. Blocks from removed columns are preserved in the last column.')}><span className={`sb-layout-icon sb-layout-icon--${key}`} aria-hidden="true">{Array.from({ length: layout.count }, (_, index) => <i key={index} />)}</span>{layout.label}</button>)}</div><p className="sb-help">Reducing columns preserves all blocks by moving them into the final column.</p><Field label={`Hide section on ${device}`} type="checkbox" value={style.hidden} onChange={hidden => setStyle('hidden', hidden)} />{!singleSection && <div className="sb-action-pair"><button type="button" disabled={sections.length >= 50} onClick={() => { const copy = cloneSection(section); const index = sections.findIndex(item => item.id === section.id); const next = [...sections]; next.splice(index + 1, 0, copy); emit(next, 'Section duplicated with independent blocks.'); selectSection(copy.id); }}>Duplicate section</button><button type="button" className="sb-danger" onClick={() => { if (section.columns.some(item => item.blocks.length) && !window.confirm('Remove this section and its blocks from this page?')) return; emit(sections.filter(item => item.id !== section.id), 'Section removed.'); setBlockId(''); }}>Remove section</button></div>}</> : <StyleControls section={section} block={block} device={device} onChange={setStyle} onReset={resetStyle} />}
        </fieldset>}
      </aside>
    </div>
    <footer className="sb-status-bar"><span role="status" aria-live="polite">{message || 'Changes update the controlled value immediately. Save the store to persist them.'}</span><span>{sections.reduce((sum, item) => sum + item.columns.reduce((total, col) => total + col.blocks.length, 0), 0)} blocks</span></footer>{error && <p className="sb-error" role="alert">{error}</p>}
    {pickerColumn && <dialog ref={pickerRef} className="sb-block-picker" onClose={closePicker}><div className="sb-picker-header"><div><span className="sb-kicker">15 building blocks</span><h3>What belongs here?</h3></div><button type="button" aria-label="Close block picker" onClick={() => pickerRef.current.close()}>×</button></div><Field label="Find a block" type="search" autoFocus value={blockSearch} onChange={setBlockSearch} /><div className="sb-block-catalogue">{Object.entries(BLOCKS).filter(([, spec]) => spec.label.toLowerCase().includes(blockSearch.toLowerCase())).map(([key, spec], index) => <button type="button" key={key} onClick={() => addBlock(key)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{spec.label}</strong><small>{BLOCK_HINTS[key]}</small></button>)}</div>{!Object.values(BLOCKS).some(spec => spec.label.toLowerCase().includes(blockSearch.toLowerCase())) && <p className="sb-empty-copy">No block matches that search.</p>}</dialog>}
  </div>;
}

const BLOCK_HINTS = {
  heading: 'Give the section a clear title', paragraph: 'Add an introduction or explanation', button: 'Link to a page or contact action', image: 'Add a client-approved photograph',
  icon: 'Pair a relevant symbol with a label', badge: 'Show a useful short label', stats: 'Add a real, verified figure', service: 'Explain a service with a destination',
  testimonial: 'Add an approved customer quote', logo: 'Display an authorised brand logo', divider: 'Separate related content', spacer: 'Set a deliberate vertical gap',
  video: 'Embed YouTube, Vimeo or a video file', list: 'Organise a set of items', contact: 'Show email, phone, website or address',
};

function Field({ label, value, onChange, type = 'text', options, hint, reset, ...props }) {
  const id = useId();
  return <div className={`sb-field ${type === 'checkbox' ? 'sb-field--check' : ''}`}><div className="sb-field-label"><label htmlFor={id}>{label}</label>{reset && <button type="button" className="sb-reset" onClick={reset} aria-label={`Reset ${label} to inherited value`}>Reset</button>}</div>{options ? <select id={id} value={value} onChange={event => onChange(event.target.value)} {...props}>{options.map(option => typeof option === 'string' ? <option key={option} value={option}>{readable(option)}</option> : <option key={option.value} value={option.value}>{option.label}</option>)}</select> : type === 'textarea' ? <textarea id={id} rows={4} value={value ?? ''} onChange={event => onChange(event.target.value)} {...props} /> : type === 'checkbox' ? <input id={id} type="checkbox" checked={Boolean(value)} onChange={event => onChange(event.target.checked)} {...props} /> : <input id={id} type={type} value={value ?? ''} onChange={event => { const next = type === 'number' || type === 'range' ? event.target.value === '' ? '' : Number(event.target.value) : event.target.value; onChange(next); }} {...props} />}{hint && <p className="sb-field-hint">{hint}</p>}</div>;
}

function BlockContent({ block, onChange }) {
  const content = block.content;
  const warnings = [];
  const media = block.type === 'image' || block.type === 'logo';
  if (media && content.url && !safeMedia(content.url)) warnings.push('Images need an HTTPS URL without embedded credentials. Upload assets through the store media manager, then paste their public URL.');
  if (block.type === 'video' && content.url && !videoSource(content.url)) warnings.push('Use an HTTPS YouTube, Vimeo, MP4, WebM or OGG video URL.');
  if (block.type === 'video' && content.poster && !safeMedia(content.poster)) warnings.push('The poster image needs an HTTPS URL.');
  if (['button', 'service'].includes(block.type) && content.url && !safeLink(content.url)) warnings.push('Use a page path, section anchor, HTTP(S), mailto: or tel: destination.');
  if (block.type === 'logo' && content.link && !safeLink(content.link)) warnings.push('The logo link is not a supported destination.');
  return <>{block.type === 'stats' && <p className="sb-note">Use only a verified figure supplied by the client. No statistic is generated automatically.</p>}{block.type === 'testimonial' && <p className="sb-note">Use a real customer quote with permission. Keep the attribution accurate.</p>}{CONTENT_FIELDS[block.type].map(([key, label, kind = 'text', min, max]) => <Field key={key} label={label} value={content[key]} type={Array.isArray(kind) ? 'text' : kind} options={Array.isArray(kind) ? kind : undefined} min={min} max={max} maxLength={kind === 'number' || kind === 'checkbox' ? undefined : 10000} onChange={value => onChange(key, value)} />)}{block.type === 'divider' && <p className="sb-help">This block separates content with a line. Use the section’s spacing controls to adjust the surrounding space.</p>}{media && <p className="sb-help">Provide descriptive alt text for content images. For a purely decorative image, leave the description empty.</p>}{warnings.map(warning => <p className="sb-warning" key={warning}>{warning}</p>)}</>;
}

const NUMBER_GROUPS = [
  ['Dimensions', [['width', 'Content width (%)', 20, 100], ['maxWidth', 'Maximum width (px)', 280, 1800], ['columns', 'Columns at this breakpoint', 1, 4]]],
  ['Spacing', [['paddingTop', 'Top padding (px)', 0, 240], ['paddingBottom', 'Bottom padding (px)', 0, 240], ['paddingX', 'Side padding (px)', 0, 120], ['columnGap', 'Column gap (px)', 0, 120], ['rowGap', 'Row / block gap (px)', 0, 120]]],
  ['Typography', [['headingSize', 'Heading size (px)', 16, 120], ['bodySize', 'Body size (px)', 12, 40], ['fontWeight', 'Font weight', 300, 900]]],
];

function StyleControls({ section, block, device, onChange, onReset }) {
  const sectionStyle = effectiveStyle(section.styles, device);
  const own = block ? blockStyle(block, device) : {};
  const effective = { ...sectionStyle, ...own };
  const overrides = (block || section).styles?.[device] || {};
  function control(key, label, type, options, min, max) {
    const value = key === 'columns' ? effective.columns || LAYOUTS[section.layout].count : effective[key];
    return <Field key={key} label={label} value={value} type={type} options={options} min={min} max={max} step={key === 'fontWeight' ? 100 : 1} onChange={next => onChange(key, next)} reset={Object.prototype.hasOwnProperty.call(overrides, key) ? () => onReset(key) : undefined} />;
  }
  return <><p className="sb-note">Editing <strong>{device}</strong> styles. Desktop is the base; tablet inherits desktop, and mobile inherits tablet. Reset removes an override.</p><button type="button" className="sb-wide" disabled={!Object.keys(overrides).length} onClick={() => { if (window.confirm(`Reset all ${device} style overrides for this ${block ? 'block' : 'section'}?`)) onReset(); }}>Reset {device} overrides</button>
    {block ? <>{TEXT_BLOCKS.has(block.type) && <div className="sb-control-group"><h4>Text appearance</h4>{control('color', 'Text colour', 'color')}{control('textAlign', 'Text alignment', 'text', ['left', 'center', 'right'])}{control('fontWeight', 'Font weight', 'number', undefined, 300, 900)}<p className="sb-help">Heading and body sizes come from the parent section’s typography settings.</p></div>}{['image', 'logo'].includes(block.type) && <div className="sb-control-group"><h4>Image appearance</h4>{control('imageWidth', 'Image width (%)', 'number', undefined, 10, 100)}{control('imageRadius', 'Image corners (px)', 'number', undefined, 0, 100)}{control('imagePosition', 'Image focal position', 'text', ['left', 'center', 'right', 'top', 'bottom'])}</div>}{!TEXT_BLOCKS.has(block.type) && !['image', 'logo'].includes(block.type) && <p className="sb-help">This block inherits its appearance from the parent section. Edit the section’s colours, buttons and spacing for a consistent design.</p>}</> : <>
      {NUMBER_GROUPS.map(([title, fields]) => <details className="sb-style-group" key={title} open={title === 'Dimensions'}><summary>{title}</summary>{fields.map(([key, label, min, max]) => control(key, label, 'number', undefined, min, max))}{title === 'Typography' && <>{control('color', 'Text colour', 'color')}{control('textAlign', 'Text alignment', 'text', ['left', 'center', 'right'])}</>}</details>)}
      <details className="sb-style-group"><summary>Background & borders</summary>{control('background', 'Background colour', 'color')}{control('backgroundImage', 'Background image URL', 'url')}{effective.backgroundImage && <p className="sb-help">Check text contrast against the actual image before publishing.</p>}{control('borderWidth', 'Border width (px)', 'number', undefined, 0, 12)}{control('borderColor', 'Border colour', 'color')}{control('radius', 'Section corners (px)', 'number', undefined, 0, 100)}{control('shadow', 'Shadow', 'text', ['none', 'soft', 'medium', 'strong'])}</details>
      <details className="sb-style-group"><summary>Alignment & visibility</summary>{control('align', 'Column alignment', 'text', ['start', 'center', 'end', 'stretch'])}{control('hidden', `Hide section on ${device}`, 'checkbox')}</details>
      <details className="sb-style-group"><summary>Buttons</summary>{control('buttonStyle', 'Button style', 'text', ['solid', 'outline', 'text'])}{control('buttonColor', 'Button / outline colour', 'color')}{control('buttonTextColor', 'Button text colour', 'color')}</details>
      <details className="sb-style-group"><summary>Images</summary>{control('imageWidth', 'Image width (%)', 'number', undefined, 10, 100)}{control('imageRadius', 'Image corners (px)', 'number', undefined, 0, 100)}{control('imagePosition', 'Image focal position', 'text', ['left', 'center', 'right', 'top', 'bottom'])}</details>
    </>}
  </>;
}

/** Responsive storefront renderer. Pass a device to force a breakpoint in an editor. */
export function SectionBuilderPreview({ value, sections: sectionsAlias, device, interactive = false, className = '' }) {
  const ref = useRef(null);
  const [measuredDevice, setMeasuredDevice] = useState('desktop');
  const input = value ?? sectionsAlias ?? EMPTY;
  const checked = useMemo(() => analyse(input), [input]);
  useEffect(() => {
    if (device || !ref.current) return;
    const update = width => setMeasuredDevice(width <= 640 ? 'mobile' : width <= 1024 ? 'tablet' : 'desktop');
    update(ref.current.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(entries => update(entries[0].contentRect.width));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [device]);
  const activeDevice = DEVICES.includes(device) ? device : measuredDevice;
  return <div ref={ref} className={`sb-renderer ${className}`} data-device={activeDevice} onClickCapture={interactive ? event => { if (event.target.closest('a')) event.preventDefault(); } : undefined}>
    {checked.error ? interactive ? <p role="alert" className="sb-error">Cannot preview this section: {checked.error}</p> : null : checked.sections.map(section => <div key={section.id} className="sb-renderer-section" style={{ '--sb-grid-template': gridTemplate(section, activeDevice) }}><CustomSection section={section} device={activeDevice} interactive={interactive} /></div>)}
  </div>;
}
