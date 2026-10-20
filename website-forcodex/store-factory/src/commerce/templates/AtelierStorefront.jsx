import React, { useEffect, useState } from 'react';
import {
  Search,
  ShoppingBag,
  ArrowRight,
  Star,
  Plus,
  Minus,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  Mail,
  Heart,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { cartSummary, money, priceOf, safeImage } from '../model.js';

function Photo({ src, alt = '', className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && safeImage(src) && !failed ? (
    <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
  ) : (
    <div className={`atl-photo-empty ${className}`}>{alt || 'Atelier Studio'}</div>
  );
}

export default function AtelierStorefront({ store, preview = false, initialPage = 'home' }) {
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
    <div className="atelier-theme-wrap">
      {/* 1. Haute Couture Top Banner */}
      <div className="atl-banner">
        <span>COMPLIMENTARY WHITE-GLOVE COURIER ON ORDERS OVER $250 · SPRING ARCHIVE 2026 NOW RELEASED</span>
      </div>

      {/* 2. Editorial Centered Masthead */}
      <header className="atl-header">
        <div className="atl-header-top">
          <div className="atl-header-left">
            <span>PARIS · NEW YORK · MILANO</span>
          </div>
          <div className="atl-brand" onClick={() => { setPage('home'); setSelectedCat(''); }}>
            <h1>ATELIER STUDIO</h1>
            <small>HAUTE COUTURE & LUXURY APPAREL</small>
          </div>
          <div className="atl-header-tools">
            <button className="atl-tool-btn" onClick={() => setPage('shop')} aria-label="Search Collection">
              <Search size={16} />
            </button>
            <button className="atl-tool-btn atl-bag-btn" onClick={() => setPage('cart')} aria-label="View Wardrobe Bag">
              <ShoppingBag size={17} />
              <span className="atl-bag-count">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* Minimalist Navigation */}
        <nav className="atl-nav-bar">
          <button className={page === 'home' && !selectedCat ? 'is-active' : ''} onClick={() => { setPage('home'); setSelectedCat(''); }}>EDITORIAL</button>
          <button className={page === 'shop' || selectedCat ? 'is-active' : ''} onClick={() => { setPage('shop'); setSelectedCat(''); }}>COLLECTION ({products.length})</button>
          <button className={page === 'lookbook' ? 'is-active' : ''} onClick={() => setPage('lookbook')}>LOOKBOOK</button>
          <button className={page === 'about' ? 'is-active' : ''} onClick={() => setPage('about')}>THE ATELIER</button>
          <button className={page === 'contact' ? 'is-active' : ''} onClick={() => setPage('contact')}>CONCIERGE</button>
        </nav>
      </header>

      {/* Toast Alert */}
      {addedToast && (
        <div className="atl-toast">
          <CheckCircle2 size={16} color="#111" />
          <span>Added to your curated wardrobe: <strong>{addedToast.product.name}</strong></span>
          <button onClick={() => setPage('cart')}>View Bag</button>
        </div>
      )}

      {/* HOME EDITORIAL VIEW */}
      {page === 'home' && (
        <>
          {/* Magazine Cover Hero */}
          <section className="atl-hero">
            <div className="atl-hero-image-wrap">
              <Photo src={store.settings.hero || '/commerce/fashion.webp'} alt="Atelier Spring Collection" className="atl-hero-img" eager />
              <div className="atl-hero-overlay"></div>
              <div className="atl-hero-caption">
                <span className="atl-hero-sub">ISSUE NO. 08 · PRE-FALL 2026</span>
                <h2 className="atl-hero-title">FORM, DRAPE & SILENCE.</h2>
                <p>Architectural silhouettes crafted in virgin Italian wool, heavy washed silk, and unstructured tailoring.</p>
                <div className="atl-hero-links">
                  <button type="button" className="atl-primary-btn" onClick={() => setPage('shop')}>
                    EXPLORE THE ARCHIVE <ArrowRight size={14} />
                  </button>
                  <button type="button" className="atl-secondary-btn" onClick={() => setPage('lookbook')}>
                    VIEW RUNWAY LOOKS
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Editorial Quote Strip */}
          <div className="atl-quote-strip">
            <blockquote>
              “Simplicity is not the lack of clutter. It is the purest statement of proportion, fiber, and quiet presence.”
            </blockquote>
            <cite>— Studio Director, Paris Salon</cite>
          </div>

          {/* Curated Pieces Grid */}
          <section className="atl-curated-section">
            <div className="atl-section-heading">
              <div>
                <span className="atl-heading-sub">SELECT RELEASES</span>
                <h2>The Current Wardrobe</h2>
              </div>
              <button type="button" className="atl-link" onClick={() => setPage('shop')}>
                View all pieces ({products.length}) →
              </button>
            </div>

            <div className="atl-product-grid">
              {products.slice(0, 6).map(product => (
                <AtelierProductCard key={product.id} product={product} currency={store.settings.currency} onAdd={() => addToCart(product, null, 1)} onView={() => viewProduct(product.id)} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* CATALOG / SHOP VIEW */}
      {page === 'shop' && (
        <section className="atl-shop-page">
          <div className="atl-shop-header">
            <div>
              <span className="atl-heading-sub">THE ARCHIVE</span>
              <h1>Current Collection</h1>
            </div>
            <div className="atl-cat-filters">
              <button className={!selectedCat ? 'is-selected' : ''} onClick={() => setSelectedCat('')}>All ({products.length})</button>
              {store.categories.map(c => (
                <button key={c} className={selectedCat === c ? 'is-selected' : ''} onClick={() => setSelectedCat(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="atl-product-grid">
            {filteredProducts.map(product => (
              <AtelierProductCard key={product.id} product={product} currency={store.settings.currency} onAdd={() => addToCart(product, null, 1)} onView={() => viewProduct(product.id)} />
            ))}
          </div>
        </section>
      )}

      {/* PRODUCT DETAIL VIEW */}
      {page === 'product' && (
        <AtelierProductDetail store={store} productId={productId} onBack={() => setPage('shop')} onAdd={addToCart} />
      )}

      {/* CART VIEW */}
      {page === 'cart' && (
        <div className="atl-cart-view">
          <h1>Your Curated Bag ({cartCount} {cartCount === 1 ? 'Piece' : 'Pieces'})</h1>
          {!cart.length ? (
            <div className="atl-cart-empty">
              <p>Your wardrobe bag is currently empty.</p>
              <button className="atl-primary-btn" onClick={() => setPage('shop')}>Discover the Collection</button>
            </div>
          ) : (
            <div className="atl-cart-grid">
              <div className="atl-cart-items">
                {summary.lines.map(line => (
                  <div key={line.key} className="atl-cart-item">
                    <Photo src={line.product.images[0]} alt="" />
                    <div className="atl-cart-item-info">
                      <h3>{line.product.name}</h3>
                      <span>{line.product.category}</span>
                      <strong>{money(line.unitCents / 100, store.settings.currency)}</strong>
                    </div>
                    <button className="atl-remove-btn" onClick={() => setCart(cart.filter(c => c.productId !== line.product.id))}>Remove</button>
                  </div>
                ))}
              </div>
              <div className="atl-cart-summary">
                <h3>Acquisition Summary</h3>
                <div className="atl-summary-line">
                  <span>Subtotal</span>
                  <strong>{money(summary.subtotal / 100, store.settings.currency)}</strong>
                </div>
                <div className="atl-summary-line">
                  <span>White-Glove Delivery</span>
                  <strong>Complimentary</strong>
                </div>
                <div className="atl-summary-line atl-total-line">
                  <span>Total</span>
                  <strong>{money(summary.total / 100, store.settings.currency)}</strong>
                </div>
                <button className="atl-primary-btn w-full" onClick={() => alert('Order confirmed. The Atelier Concierge will prepare your packaging.')}>
                  Proceed to Secure Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="atl-footer">
        <div className="atl-footer-top">
          <div className="atl-footer-brand">
            <h2>ATELIER STUDIO</h2>
            <p>Private luxury apparel & artisanal tailoring. Designed in New York, woven in Biella, Italy.</p>
          </div>
          <div className="atl-footer-links">
            <h4>COLLECTIONS</h4>
            <button onClick={() => { setPage('shop'); setSelectedCat(''); }}>Pre-Fall 2026</button>
            <button onClick={() => { setPage('shop'); setSelectedCat(''); }}>Runway Tailoring</button>
            <button onClick={() => { setPage('shop'); setSelectedCat(''); }}>Cashmere Archive</button>
          </div>
          <div className="atl-footer-links">
            <h4>CONCIERGE</h4>
            <span>Private Stylist Appointments</span>
            <span>Worldwide Insured Courier</span>
            <span>concierge@atelierstudio.com</span>
          </div>
        </div>
        <div className="atl-footer-bottom">
          <span>© {new Date().getFullYear()} ATELIER STUDIO LLC · ALL RIGHTS RESERVED</span>
          <span>CURATED LUXURY APPAREL · SECURE COMMERCE</span>
        </div>
      </footer>
    </div>
  );
}

function AtelierProductCard({ product, currency, onAdd, onView }) {
  const price = priceOf(product);

  return (
    <article className="atl-card">
      <div className="atl-card-image" onClick={onView}>
        <Photo src={product.images[0]} alt={product.name} />
        <div className="atl-card-overlay">
          <button type="button" className="atl-quick-add" onClick={e => { e.stopPropagation(); onAdd(); }}>
            + Quick Add to Bag
          </button>
        </div>
      </div>
      <div className="atl-card-details">
        <div className="atl-card-top">
          <span className="atl-cat">{product.category}</span>
          <span className="atl-tag">Italian Fabric</span>
        </div>
        <h3 onClick={onView}>{product.name}</h3>
        <span className="atl-price">{money(price, currency)}</span>
      </div>
    </article>
  );
}

function AtelierProductDetail({ store, productId, onBack, onAdd }) {
  const product = store.products.find(p => p.id === productId) || store.products[0];
  const [selectedImg, setSelectedImg] = useState(0);
  const currency = store.settings.currency;

  return (
    <div className="atl-detail-wrap">
      <button className="atl-back-btn" onClick={onBack}>← Return to Collection</button>
      <div className="atl-detail-grid">
        <div className="atl-detail-media">
          <Photo src={product.images[selectedImg] || product.images[0]} alt={product.name} eager />
        </div>
        <div className="atl-detail-info">
          <span className="atl-cat">{product.category}</span>
          <h1>{product.name}</h1>
          <span className="atl-detail-price">{money(priceOf(product), currency)}</span>
          <p className="atl-detail-description">{product.description}</p>
          <div className="atl-specs">
            <h4>Fabric & Construction:</h4>
            <p>{product.specifications || '100% Virgin Wool. Made in Italy. Horn buttons. Hand-finished hems.'}</p>
          </div>
          <button className="atl-primary-btn" onClick={() => onAdd(product, null, 1)}>
            Add to Wardrobe Bag
          </button>
        </div>
      </div>
    </div>
  );
}
