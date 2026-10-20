import React, { useEffect, useState } from 'react';
import {
  Search,
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  X,
  Compass,
  Layers,
  Box
} from 'lucide-react';
import { cartSummary, money, priceOf, safeImage } from '../model.js';

function Photo({ src, alt = '', className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && safeImage(src) && !failed ? (
    <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
  ) : (
    <div className={`ff-photo-empty ${className}`}>{alt || 'Architectural Object'}</div>
  );
}

export default function FormFieldStorefront({ store, preview = false, initialPage = 'home' }) {
  const [page, setPage] = useState(initialPage);
  const [productId, setProductId] = useState(store.products[0]?.id || '');
  const [selectedCat, setSelectedCat] = useState('');
  const [cart, setCart] = useState([]);
  const [addedToast, setAddedToast] = useState(null);

  useEffect(() => { setPage(initialPage); }, [initialPage]);
  useEffect(() => {
    if (!addedToast) return;
    const t = setTimeout(() => setAddedToast(null), 3500);
    return () => clearTimeout(t);
  }, [addedToast]);

  const products = store.products.filter(p => p.status === 'published');
  const summary = cartSummary(store, cart, '', store.settings.shippingMethods[0]?.id || '');
  const cartCount = summary.lines.reduce((n, l) => n + l.quantity, 0);

  function addToCart(product, variant, qty = 1) {
    const existing = cart.find(l => l.productId === product.id && l.variantId === (variant?.id || ''));
    if (existing) {
      setCart(cart.map(l => l === existing ? { ...l, quantity: l.quantity + qty } : l));
    } else {
      setCart([...cart, { productId: product.id, variantId: variant?.id || '', quantity: qty }]);
    }
    setAddedToast({ product, variant, quantity: qty });
  }

  function viewProduct(id) {
    setProductId(id);
    setPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const filteredProducts = products.filter(p => !selectedCat || p.category === selectedCat);

  return (
    <div className="formfield-theme-wrap">
      {/* 1. Studio Architectural Banner */}
      <div className="ff-banner">
        <span>ARCHIVE INDEX // DISPATCHING OBJECTS DIRECT FROM COPENHAGEN & KYOTO STUDIOS</span>
      </div>

      {/* 2. Japandi Minimalist Header */}
      <header className="ff-header">
        <div className="ff-header-inner">
          <div className="ff-brand" onClick={() => { setPage('home'); setSelectedCat(''); }}>
            <span className="ff-brand-tag">01 / ARCHITECTURE</span>
            <strong className="ff-brand-title">FORM & FIELD</strong>
            <small>STUDIO & LIVING OBJECTS</small>
          </div>

          <nav className="ff-nav">
            <button className={page === 'home' && !selectedCat ? 'is-active' : ''} onClick={() => { setPage('home'); setSelectedCat(''); }}>INDEX</button>
            <button className={page === 'shop' || selectedCat ? 'is-active' : ''} onClick={() => { setPage('shop'); setSelectedCat(''); }}>OBJECTS ({products.length})</button>
            <button className={page === 'philosophy' ? 'is-active' : ''} onClick={() => setPage('philosophy')}>PHILOSOPHY</button>
            <button className={page === 'contact' ? 'is-active' : ''} onClick={() => setPage('contact')}>STUDIO TRADE</button>
          </nav>

          <div className="ff-header-tools">
            <button className="ff-tool-btn" onClick={() => setPage('shop')}>
              <Search size={15} />
            </button>
            <button className="ff-tool-btn ff-cart-btn" onClick={() => setPage('cart')}>
              <ShoppingBag size={16} />
              <span className="ff-cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {addedToast && (
        <div className="ff-toast">
          <Box size={16} color="#1f1f1d" />
          <span>Added to acquisitions: <strong>{addedToast.product.name}</strong></span>
          <button onClick={() => setPage('cart')}>View Bag</button>
        </div>
      )}

      {/* HOME VIEW */}
      {page === 'home' && (
        <>
          {/* Architectural Hero */}
          <section className="ff-hero">
            <div className="ff-hero-container">
              <div className="ff-hero-left">
                <span className="ff-plate-num">PLATE 01 // LIVING OBJECTS</span>
                <h1 className="ff-hero-title">Quiet objects designed with architectural permanence.</h1>
                <p className="ff-hero-desc">
                  Hand-thrown stoneware, spun solid brass, and smoked oak furniture crafted in limited editions for considered interior spaces.
                </p>
                <div className="ff-hero-actions">
                  <button type="button" className="ff-primary-btn" onClick={() => setPage('shop')}>
                    VIEW ARCHIVE <ArrowRight size={14} />
                  </button>
                  <button type="button" className="ff-secondary-btn" onClick={() => setPage('philosophy')}>
                    STUDIO PHILOSOPHY
                  </button>
                </div>
                <div className="ff-materials-strip">
                  <span>SOLID RAW BRASS</span>
                  <span>STONEWARE CLAY</span>
                  <span>FSC SMOKED OAK</span>
                </div>
              </div>

              <div className="ff-hero-right">
                <div className="ff-hero-card">
                  <Photo src={store.settings.hero || '/commerce/trade-forest.png'} alt="Form and Field Studio" className="ff-hero-photo" eager />
                  <div className="ff-floating-tag">
                    <strong>EDITION 2026</strong>
                    <small>KYOTO & COPENHAGEN</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Catalog Section */}
          <section className="ff-catalog-section">
            <div className="ff-section-header">
              <div>
                <span className="ff-section-num">02 / CATALOG</span>
                <h2>Living Objects & Lighting</h2>
              </div>
              <div className="ff-cat-links">
                <button className={!selectedCat ? 'is-active' : ''} onClick={() => setSelectedCat('')}>All Objects ({products.length})</button>
                {store.categories.map(c => (
                  <button key={c} className={selectedCat === c ? 'is-active' : ''} onClick={() => setSelectedCat(c)}>{c}</button>
                ))}
              </div>
            </div>

            <div className="ff-products-grid">
              {products.slice(0, 6).map(product => (
                <FormFieldProductCard key={product.id} product={product} currency={store.settings.currency} onAdd={() => addToCart(product, null, 1)} onView={() => viewProduct(product.id)} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* CATALOG VIEW */}
      {page === 'shop' && (
        <section className="ff-shop-page">
          <div className="ff-shop-header">
            <div>
              <span className="ff-section-num">ARCHIVE INDEX</span>
              <h1>Curated Objects & Fixtures</h1>
            </div>
            <div className="ff-cat-filter-row">
              <button className={!selectedCat ? 'is-selected' : ''} onClick={() => setSelectedCat('')}>All ({products.length})</button>
              {store.categories.map(c => (
                <button key={c} className={selectedCat === c ? 'is-selected' : ''} onClick={() => setSelectedCat(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="ff-products-grid">
            {filteredProducts.map(product => (
              <FormFieldProductCard key={product.id} product={product} currency={store.settings.currency} onAdd={() => addToCart(product, null, 1)} onView={() => viewProduct(product.id)} />
            ))}
          </div>
        </section>
      )}

      {/* PRODUCT DETAIL VIEW */}
      {page === 'product' && (
        <FormFieldProductDetail store={store} productId={productId} onBack={() => setPage('shop')} onAdd={addToCart} />
      )}

      {/* CART VIEW */}
      {page === 'cart' && (
        <div className="ff-cart-view">
          <h1>Acquisitions Bag ({cartCount} {cartCount === 1 ? 'object' : 'objects'})</h1>
          {!cart.length ? (
            <div className="ff-empty-cart">
              <p>No architectural objects currently selected.</p>
              <button className="ff-primary-btn" onClick={() => setPage('shop')}>Discover Objects</button>
            </div>
          ) : (
            <div className="ff-cart-grid">
              <div className="ff-cart-items">
                {summary.lines.map(line => (
                  <div key={line.key} className="ff-cart-item">
                    <Photo src={line.product.images[0]} alt="" />
                    <div className="ff-cart-item-info">
                      <h3>{line.product.name}</h3>
                      <span>{line.product.category} · Qty {line.quantity}</span>
                      <strong>{money(line.unitCents / 100, store.settings.currency)}</strong>
                    </div>
                    <button className="ff-remove-btn" onClick={() => setCart(cart.filter(c => c.productId !== line.product.id))}>Remove</button>
                  </div>
                ))}
              </div>
              <div className="ff-cart-summary">
                <h3>Acquisition Summary</h3>
                <div className="ff-summary-line">
                  <span>Subtotal</span>
                  <strong>{money(summary.subtotal / 100, store.settings.currency)}</strong>
                </div>
                <div className="ff-summary-line">
                  <span>Museum Crating & Freight</span>
                  <strong>Complimentary</strong>
                </div>
                <div className="ff-summary-total">
                  <span>Total</span>
                  <strong>{money(summary.total / 100, store.settings.currency)}</strong>
                </div>
                <button className="ff-primary-btn w-full" onClick={() => alert('Acquisition placed. Form & Field workshop will contact you.')}>
                  Confirm Acquisition
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="ff-footer">
        <div className="ff-footer-inner">
          <div className="ff-footer-brand">
            <strong>FORM & FIELD // STUDIO</strong>
            <p>Architectural objects, lighting, and ceramics. Workshop in Kyoto, showroom in Copenhagen.</p>
          </div>
          <div className="ff-footer-links">
            <span>KYOTO STUDIO</span>
            <span>COPENHAGEN WORKSHOP</span>
            <span>trade@formfield.studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FormFieldProductCard({ product, currency, onAdd, onView }) {
  const price = priceOf(product);

  return (
    <article className="ff-card">
      <div className="ff-card-media" onClick={onView}>
        <Photo src={product.images[0]} alt={product.name} />
        <span className="ff-mat-tag">RAW MATERIAL</span>
      </div>
      <div className="ff-card-body">
        <span className="ff-cat">{product.category}</span>
        <h3 onClick={onView}>{product.name}</h3>
        <div className="ff-card-price-row">
          <span className="ff-price">{money(price, currency)}</span>
          <button type="button" className="ff-add-btn" onClick={e => { e.stopPropagation(); onAdd(); }}>
            + Acquire Object
          </button>
        </div>
      </div>
    </article>
  );
}

function FormFieldProductDetail({ store, productId, onBack, onAdd }) {
  const product = store.products.find(p => p.id === productId) || store.products[0];
  const currency = store.settings.currency;

  return (
    <div className="ff-detail-wrap">
      <button className="ff-back-btn" onClick={onBack}>← Return to Objects Index</button>
      <div className="ff-detail-grid">
        <div className="ff-detail-media">
          <Photo src={product.images[0]} alt={product.name} eager />
        </div>
        <div className="ff-detail-info">
          <span className="ff-cat">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="ff-detail-price">{money(priceOf(product), currency)}</div>
          <p className="ff-desc">{product.description}</p>
          <div className="ff-specs-box">
            <h4>Material Provenance:</h4>
            <p>{product.specifications || 'Solid unlacquered raw brass, hand-turned oak, glazed stoneware.'}</p>
          </div>
          <button className="ff-primary-btn" onClick={() => onAdd(product, null, 1)}>
            Acquire Piece
          </button>
        </div>
      </div>
    </div>
  );
}
