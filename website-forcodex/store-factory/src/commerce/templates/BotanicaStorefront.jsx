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
  Droplets,
  Heart,
  ShieldCheck,
  Feather
} from 'lucide-react';
import { cartSummary, money, priceOf, safeImage } from '../model.js';

function Photo({ src, alt = '', className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && safeImage(src) && !failed ? (
    <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
  ) : (
    <div className={`bot-photo-empty ${className}`}>{alt || 'Botanical Remedy'}</div>
  );
}

export default function BotanicaStorefront({ store, preview = false, initialPage = 'home' }) {
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
    <div className="botanica-theme-wrap">
      {/* 1. Organic Apothecary Banner */}
      <div className="bot-banner">
        <span>🌿 100% PURE BOTANICAL ACTIVES · CERTIFIED CRUELTY FREE · BATCH HARVEST NO. 402 READY</span>
      </div>

      {/* 2. Earthy Apothecary Header */}
      <header className="bot-header">
        <div className="bot-header-inner">
          <div className="bot-brand" onClick={() => { setPage('home'); setSelectedCat(''); }}>
            <div className="bot-brand-icon"><Droplets size={20} /></div>
            <div>
              <strong className="bot-brand-title">BOTANICA APOTHECARY</strong>
              <span className="bot-brand-subtitle">CERTIFIED ORGANIC FORMULATIONS</span>
            </div>
          </div>

          <nav className="bot-nav">
            <button className={page === 'home' && !selectedCat ? 'is-active' : ''} onClick={() => { setPage('home'); setSelectedCat(''); }}>RITUALS</button>
            <button className={page === 'shop' || selectedCat ? 'is-active' : ''} onClick={() => { setPage('shop'); setSelectedCat(''); }}>REMEDIES ({products.length})</button>
            <button className={page === 'botanicals' ? 'is-active' : ''} onClick={() => setPage('botanicals')}>HERBARIUM</button>
            <button className={page === 'contact' ? 'is-active' : ''} onClick={() => setPage('contact')}>APOTHECARY DESK</button>
          </nav>

          <div className="bot-header-tools">
            <button className="bot-tool-btn" onClick={() => setPage('shop')}>
              <Search size={16} />
            </button>
            <button className="bot-tool-btn bot-cart-btn" onClick={() => setPage('cart')}>
              <ShoppingBag size={17} />
              <span className="bot-cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {addedToast && (
        <div className="bot-toast">
          <Droplets size={16} color="#2b472e" />
          <span>Added to your daily ritual: <strong>{addedToast.product.name}</strong></span>
          <button onClick={() => setPage('cart')}>View Bag</button>
        </div>
      )}

      {/* HOME VIEW */}
      {page === 'home' && (
        <>
          {/* Botanical Hero */}
          <section className="bot-hero">
            <div className="bot-hero-container">
              <div className="bot-hero-left">
                <span className="bot-eyebrow">WILD-HARVESTED PLANT OILS</span>
                <h1 className="bot-hero-title">Restorative botanical potions crafted for mindful skin rituals.</h1>
                <p className="bot-hero-desc">
                  Micro-batch plant extracts, cold-pressed seed oils, and calming floral waters formulated without synthetic fillers or artificial fragrance.
                </p>
                <div className="bot-hero-actions">
                  <button type="button" className="bot-primary-btn" onClick={() => setPage('shop')}>
                    <span>DISCOVER REMEDIES</span> <ArrowRight size={15} />
                  </button>
                  <button type="button" className="bot-secondary-btn" onClick={() => setPage('botanicals')}>
                    <span>BOTANICAL INGREDIENTS</span>
                  </button>
                </div>
                <div className="bot-badges-strip">
                  <span>✓ 100% Vegan</span>
                  <span>✓ Cold-Pressed</span>
                  <span>✓ Leaping Bunny Certified</span>
                </div>
              </div>

              <div className="bot-hero-right">
                <div className="bot-hero-frame">
                  <Photo src={store.settings.hero || '/commerce/perfume.webp'} alt="Botanica Remedies" className="bot-hero-img" eager />
                  <div className="bot-floating-seal">
                    <Droplets size={18} />
                    <div>
                      <strong>Batch No. 2026.04</strong>
                      <small>Distilled in Grasse, France</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Catalog Section */}
          <section className="bot-catalog-section">
            <div className="bot-section-header">
              <div>
                <span className="bot-subhead">HARVEST APOTHECARY</span>
                <h2>Active Botanical Remedies</h2>
              </div>
              <div className="bot-cat-pills">
                <button className={!selectedCat ? 'is-active' : ''} onClick={() => setSelectedCat('')}>All Formulations ({products.length})</button>
                {store.categories.map(c => (
                  <button key={c} className={selectedCat === c ? 'is-active' : ''} onClick={() => setSelectedCat(c)}>{c}</button>
                ))}
              </div>
            </div>

            <div className="bot-products-grid">
              {products.slice(0, 6).map(product => (
                <BotanicaProductCard key={product.id} product={product} currency={store.settings.currency} onAdd={() => addToCart(product, null, 1)} onView={() => viewProduct(product.id)} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* CATALOG VIEW */}
      {page === 'shop' && (
        <section className="bot-shop-page">
          <div className="bot-shop-header">
            <div>
              <span className="bot-subhead">THE BOTANICAL CATALOG</span>
              <h1>Organic Remedies & Elixirs</h1>
            </div>
            <div className="bot-cat-filters">
              <button className={!selectedCat ? 'is-selected' : ''} onClick={() => setSelectedCat('')}>All Formulations ({products.length})</button>
              {store.categories.map(c => (
                <button key={c} className={selectedCat === c ? 'is-selected' : ''} onClick={() => setSelectedCat(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="bot-products-grid">
            {filteredProducts.map(product => (
              <BotanicaProductCard key={product.id} product={product} currency={store.settings.currency} onAdd={() => addToCart(product, null, 1)} onView={() => viewProduct(product.id)} />
            ))}
          </div>
        </section>
      )}

      {/* PRODUCT DETAIL VIEW */}
      {page === 'product' && (
        <BotanicaProductDetail store={store} productId={productId} onBack={() => setPage('shop')} onAdd={addToCart} />
      )}

      {/* CART VIEW */}
      {page === 'cart' && (
        <div className="bot-cart-view">
          <h1>Your Remedy Basket ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>
          {!cart.length ? (
            <div className="bot-empty-cart">
              <p>Your apothecary basket contains no remedies yet.</p>
              <button className="bot-primary-btn" onClick={() => setPage('shop')}>Explore Botanical Remedies</button>
            </div>
          ) : (
            <div className="bot-cart-grid">
              <div className="bot-cart-items">
                {summary.lines.map(line => (
                  <div key={line.key} className="bot-cart-item">
                    <Photo src={line.product.images[0]} alt="" />
                    <div className="bot-cart-item-info">
                      <h3>{line.product.name}</h3>
                      <span>{line.product.category} · Qty {line.quantity}</span>
                      <strong>{money(line.unitCents / 100, store.settings.currency)}</strong>
                    </div>
                    <button className="bot-remove-btn" onClick={() => setCart(cart.filter(c => c.productId !== line.product.id))}>Remove</button>
                  </div>
                ))}
              </div>
              <div className="bot-cart-summary">
                <h3>Order Basket</h3>
                <div className="bot-summary-line">
                  <span>Subtotal</span>
                  <strong>{money(summary.subtotal / 100, store.settings.currency)}</strong>
                </div>
                <div className="bot-summary-line">
                  <span>Sustainable Packaging</span>
                  <strong>Complimentary</strong>
                </div>
                <div className="bot-summary-total">
                  <span>Total</span>
                  <strong>{money(summary.total / 100, store.settings.currency)}</strong>
                </div>
                <button className="bot-primary-btn w-full" onClick={() => alert('Order accepted. Our herbalists are preparing your remedies.')}>
                  Order Remedies
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="bot-footer">
        <div className="bot-footer-inner">
          <div className="bot-footer-brand">
            <strong>BOTANICA APOTHECARY</strong>
            <p>Certified organic apothecary. Sourced from regenerative biodynamic gardens.</p>
          </div>
          <div className="bot-footer-info">
            <span>GRASSE · PROVENCE · LONDON</span>
            <span>apothecary@botanica.organic</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BotanicaProductCard({ product, currency, onAdd, onView }) {
  const price = priceOf(product);

  return (
    <article className="bot-card">
      <div className="bot-card-media" onClick={onView}>
        <Photo src={product.images[0]} alt={product.name} />
        <span className="bot-badge">Cold-Pressed</span>
      </div>
      <div className="bot-card-body">
        <span className="bot-cat">{product.category}</span>
        <h3 onClick={onView}>{product.name}</h3>
        <div className="bot-card-price-row">
          <span className="bot-price">{money(price, currency)}</span>
          <button type="button" className="bot-add-btn" onClick={e => { e.stopPropagation(); onAdd(); }}>
            <Plus size={14} /> Add to Ritual
          </button>
        </div>
      </div>
    </article>
  );
}

function BotanicaProductDetail({ store, productId, onBack, onAdd }) {
  const product = store.products.find(p => p.id === productId) || store.products[0];
  const currency = store.settings.currency;

  return (
    <div className="bot-detail-wrap">
      <button className="bot-back-btn" onClick={onBack}>← Return to Remedies</button>
      <div className="bot-detail-grid">
        <div className="bot-detail-media">
          <Photo src={product.images[0]} alt={product.name} eager />
        </div>
        <div className="bot-detail-info">
          <span className="bot-cat">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="bot-detail-price">{money(priceOf(product), currency)}</div>
          <p className="bot-desc">{product.description}</p>
          <div className="bot-specs-box">
            <h4>Botanical Ingredients:</h4>
            <p>{product.specifications || '100% Wild Harvested Damask Rose, Cold-Pressed Jojoba, Supercritical Bakuchiol.'}</p>
          </div>
          <button className="bot-primary-btn" onClick={() => onAdd(product, null, 1)}>
            Add to Daily Ritual
          </button>
        </div>
      </div>
    </div>
  );
}
