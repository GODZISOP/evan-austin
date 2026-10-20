import React, { useState, useEffect } from 'react';
import { safeImage } from './model.js';
import AbeerStorefront from './templates/AbeerStorefront.jsx';
import AtelierStorefront from './templates/AtelierStorefront.jsx';
import CircuitStorefront from './templates/CircuitStorefront.jsx';
import BotanicaStorefront from './templates/BotanicaStorefront.jsx';
import FormFieldStorefront from './templates/FormFieldStorefront.jsx';
import './commerce.css';
import './templates.css';

/**
 * Shared image component used throughout the app & editor
 */
export function Photo({ src, alt = '', className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && safeImage(src) && !failed ? (
    <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
  ) : (
    <div className={`cf-photo-empty ${className}`}>{alt || 'Photograph'}</div>
  );
}

/**
 * Universal Storefront Component Router
 * Routes each store/template to its own dedicated, bespoke website architecture:
 * 1. tradehouse -> AbeerStorefront (Wholesale & Retail B2B Trade House)
 * 2. atelier    -> AtelierStorefront (Haute Couture & Luxury Fashion)
 * 3. circuit    -> CircuitStorefront (High-End Creator Tech & Hi-Fi Audio)
 * 4. botanica   -> BotanicaStorefront (Certified Organic Skincare & Herbal Remedies)
 * 5. form       -> FormFieldStorefront (Japandi Architecture & Living Objects)
 */
export default function Storefront(props) {
  const theme = props.store?.theme;

  switch (theme) {
    case 'atelier':
      return <AtelierStorefront {...props} />;
    case 'circuit':
      return <CircuitStorefront {...props} />;
    case 'botanica':
      return <BotanicaStorefront {...props} />;
    case 'form':
      return <FormFieldStorefront {...props} />;
    case 'tradehouse':
    default:
      return <AbeerStorefront {...props} />;
  }
}
