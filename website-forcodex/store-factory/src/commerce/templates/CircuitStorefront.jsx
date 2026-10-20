import React, { useEffect, useState } from 'react';
import {
  Search,
  ShoppingBag,
  ArrowRight,
  Zap,
  ShieldCheck,
  CheckCircle2,
  X,
  Cpu,
  Terminal,
  Activity,
  Sliders,
  Radio,
  Eye,
  Plus
} from 'lucide-react';
import { cartSummary, money, priceOf, safeImage } from '../model.js';

function Photo({ src, alt = '', className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && safeImage(src) && !failed ? (
    <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
  ) : (
    <div className={`cir-photo-empty ${className}`}>{alt || 'Circuit Gear'}</div>
  );
}

export default function CircuitStorefront({ store, preview = false, initialPage = 'home' }) {
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
    <div className="circuit-theme-wrap">
      {/* 1. Hardware Telemetry Bar */}
      <div className="cir-telemetry-bar">
        <div className="cir-telemetry-inner">
          <span className="cir-status-indicator">
            <span className="cir-led-dot"></span> SYSTEM ACTIVE // LATENCY 14MS
          </span>
          <span className="cir-telemetry-text">
            LOGISTICS PROTOCOL: NEXT-DAY EXPRESS AIR DISPATCH AVAILABLE ON ALL HARDWARE
          </span>
          <span className="cir-telemetry-firmware">FIRMWARE v2.6.4</span>
        </div>
      </div>

      {/* 2. Cybernetic Tech Header */}
      <header className="cir-header">
        <div className="cir-header-inner">
          <div className="cir-brand" onClick={() => { setPage('home'); setSelectedCat(''); }}>
            <div className="cir-brand-icon"><Cpu size={18} /></div>
            <div>
              <strong className="cir-brand-title">CIRCUIT_SUPPLY</strong>
              <span className="cir-brand-subtitle">CREATOR GEAR & HI-FI AUDIO</span>
            </div>
          </div>

          <nav className="cir-nav">
            <button className={page === 'home' && !selectedCat ? 'is-active' : ''} onClick={() => { setPage('home'); setSelectedCat(''); }}>COMMAND</button>
            <button className={page === 'shop' || selectedCat ? 'is-active' : ''} onClick={() => { setPage('shop'); setSelectedCat(''); }}>HARDWARE ({products.length})</button>
            <button className={page === 'benchmarks' ? 'is-active' : ''} onClick={() => setPage('benchmarks')}>BENCHMARKS</button>
            <button className={page === 'contact' ? 'is-active' : ''} onClick={() => setPage('contact')}>SUPPORT</button>
          </nav>

          <div className="cir-header-tools">
            <button className="cir-tool-btn" onClick={() => setPage('shop')}>
              <Search size={15} /> <span>SEARCH RIG</span>
            </button>
            <button className="cir-tool-btn cir-cart-btn" onClick={() => setPage('cart')}>
              <ShoppingBag size={16} />
              <span className="cir-cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {addedToast && (
        <div className="cir-toast">
          <Terminal size={16} color="#00f0ff" />
          <span>[SYSTEM] Loaded into hardware cart: <strong>{addedToast.product.name}</strong></span>
          <button onClick={() => setPage('cart')}>CHECKOUT →</button>
        </div>
      )}

      {/* HOME VIEW */}
      {page === 'home' && (
        <>
          {/* Cybernetic Tech Hero */}
          <section className="cir-hero">
            <div className="cir-hero-container">
              <div className="cir-hero-left">
                <div className="cir-badge">
                  <Activity size={12} />
                  <span>HARDWARE RELEASE // 2026 EDITION</span>
                </div>
                <h1 className="cir-hero-title">ENGINEERED FOR EXTREME FIDELITY.</h1>
                <p className="cir-hero-desc">
                  Studio monitors, 4K 60fps sensor compact cameras, and reference headphones calibrated for zero distortion and real-time low latency.
                </p>
                <div className="cir-hero-actions">
                  <button type="button" className="cir-primary-btn" onClick={() => setPage('shop')}>
                    <Zap size={15} /> <span>BROWSE HARDWARE</span>
                  </button>
                  <button type="button" className="cir-secondary-btn" onClick={() => setPage('benchmarks')}>
                    <span>VIEW BENCHMARKS</span>
                  </button>
                </div>
                <div className="cir-specs-ticker">
                  <div className="cir-spec-tag">
                    <strong>4K 60P</strong>
                    <span>Raw Optical Video</span>
                  </div>
                  <div className="cir-spec-tag">
                    <strong>40 HR</strong>
                    <span>Battery Life & ANC</span>
                  </div>
                  <div className="cir-spec-tag">
                    <strong>0.02%</strong>
                    <span>Total Harmonic Distortion</span>
                  </div>
                </div>
              </div>

              <div className="cir-hero-right">
                <div className="cir-hero-card">
                  <Photo src={store.settings.hero || '/commerce/headphones.webp'} alt="Circuit Tech Gear" className="cir-hero-photo" eager />
                  <div className="cir-floating-hud">
                    <span className="cir-hud-title"><Radio size={13} /> DSP ENGINE LOCKED</span>
                    <span className="cir-hud-val">LATENCY: 1.2ms · 96kHz / 24-bit</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hardware Categories Strip */}
          <div className="cir-categories-strip">
            <div className="cir-strip-title">FILTER HARDWARE MATRIX:</div>
            <div className="cir-strip-pills">
              <button className={!selectedCat ? 'is-active' : ''} onClick={() => { setSelectedCat(''); setPage('shop'); }}>All Devices ({products.length})</button>
              {store.categories.map(c => (
                <button key={c} className={selectedCat === c ? 'is-active' : ''} onClick={() => { setSelectedCat(c); setPage('shop'); }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Hardware Grid */}
          <section className="cir-catalog-section">
            <div className="cir-section-header">
              <h2>PRIMARY HARDWARE RIGS</h2>
              <span className="cir-header-status">VERIFIED FACTORY UNITS READY FOR FLIGHT</span>
            </div>

            <div className="cir-products-grid">
              {products.slice(0, 6).map(product => (
                <CircuitProductCard key={product.id} product={product} currency={store.settings.currency} onAdd={() => addToCart(product, null, 1)} onView={() => viewProduct(product.id)} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* CATALOG / SHOP VIEW */}
      {page === 'shop' && (
        <section className="cir-shop-page">
          <div className="cir-shop-header">
            <div>
              <span className="cir-subhead">HARDWARE CATALOG</span>
              <h1>Verified Gear Inventory</h1>
            </div>
            <div className="cir-cat-selector">
              <button className={!selectedCat ? 'is-active' : ''} onClick={() => setSelectedCat('')}>All ({products.length})</button>
              {store.categories.map(c => (
                <button key={c} className={selectedCat === c ? 'is-active' : ''} onClick={() => setSelectedCat(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="cir-products-grid">
            {filteredProducts.map(product => (
              <CircuitProductCard key={product.id} product={product} currency={store.settings.currency} onAdd={() => addToCart(product, null, 1)} onView={() => viewProduct(product.id)} />
            ))}
          </div>
        </section>
      )}

      {/* PRODUCT DETAIL VIEW */}
      {page === 'product' && (
        <CircuitProductDetail store={store} productId={productId} onBack={() => setPage('shop')} onAdd={addToCart} />
      )}

      {/* CART VIEW */}
      {page === 'cart' && (
        <div className="cir-cart-view">
          <h1>Hardware Terminal Bag ({cartCount} units)</h1>
          {!cart.length ? (
            <div className="cir-empty-cart">
              <p>NO HARDWARE UNITS QUEUED IN TERMINAL.</p>
              <button className="cir-primary-btn" onClick={() => setPage('shop')}>EXPLORE INVENTORY</button>
            </div>
          ) : (
            <div className="cir-cart-grid">
              <div className="cir-cart-items">
                {summary.lines.map(line => (
                  <div key={line.key} className="cir-cart-item">
                    <Photo src={line.product.images[0]} alt="" />
                    <div className="cir-cart-item-info">
                      <h3>{line.product.name}</h3>
                      <span>SKU: {line.product.sku} · Qty {line.quantity}</span>
                      <strong>{money(line.unitCents / 100, store.settings.currency)}</strong>
                    </div>
                    <button className="cir-remove-btn" onClick={() => setCart(cart.filter(c => c.productId !== line.product.id))}>REMOVE</button>
                  </div>
                ))}
              </div>
              <div className="cir-cart-checkout-box">
                <h3>DISPATCH MANIFEST</h3>
                <div className="cir-manifest-line">
                  <span>Subtotal</span>
                  <strong>{money(summary.subtotal / 100, store.settings.currency)}</strong>
                </div>
                <div className="cir-manifest-line">
                  <span>Priority Freight</span>
                  <strong>AIR EXPRESS INCLUDED</strong>
                </div>
                <div className="cir-manifest-total">
                  <span>TOTAL HARDWARE ORDER</span>
                  <strong>{money(summary.total / 100, store.settings.currency)}</strong>
                </div>
                <button className="cir-primary-btn w-full" onClick={() => alert('Order accepted by Circuit Terminal. Hardware technician preparing shipment.')}>
                  DEPLOY ORDER →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="cir-footer">
        <div className="cir-footer-inner">
          <div className="cir-footer-brand">
            <strong>CIRCUIT_SUPPLY // LABS</strong>
            <p>Silicon Valley audio and imaging hardware. 2-Year commercial warranty on all units.</p>
          </div>
          <div className="cir-footer-links">
            <span>TOKYO LOGISTICS HUB</span>
            <span>SHENZHEN LABS</span>
            <span>support@circuitsupply.io</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CircuitProductCard({ product, currency, onAdd, onView }) {
  const price = priceOf(product);

  return (
    <article className="cir-card">
      <div className="cir-card-media" onClick={onView}>
        <Photo src={product.images[0]} alt={product.name} />
        <div className="cir-card-spec-badge">
          <span>FACTORY VERIFIED</span>
        </div>
      </div>
      <div className="cir-card-body">
        <div className="cir-card-meta">
          <span className="cir-cat-tag">{product.category}</span>
          <span className="cir-stock-tag">IN STOCK</span>
        </div>
        <h3 onClick={onView}>{product.name}</h3>
        <div className="cir-card-price-bar">
          <strong className="cir-price">{money(price, currency)}</strong>
          <button type="button" className="cir-add-btn" onClick={e => { e.stopPropagation(); onAdd(); }}>
            <Plus size={14} /> <span>ADD TO RIG</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function CircuitProductDetail({ store, productId, onBack, onAdd }) {
  const product = store.products.find(p => p.id === productId) || store.products[0];
  const currency = store.settings.currency;

  return (
    <div className="cir-detail-wrap">
      <button className="cir-back-btn" onClick={onBack}>← BACK TO HARDWARE MATRIX</button>
      <div className="cir-detail-grid">
        <div className="cir-detail-media">
          <Photo src={product.images[0]} alt={product.name} eager />
        </div>
        <div className="cir-detail-info">
          <div className="cir-badge"><Cpu size={13} /> {product.category}</div>
          <h1>{product.name}</h1>
          <div className="cir-detail-price">{money(priceOf(product), currency)}</div>
          <p className="cir-desc">{product.description}</p>
          <div className="cir-specs-card">
            <h4>TECHNICAL SPECIFICATIONS:</h4>
            <p>{product.specifications || '4K 60FPS. Optical Image Stabilization. Low Latency Bluetooth 5.3 & USB-C.'}</p>
          </div>
          <button className="cir-primary-btn" onClick={() => onAdd(product, null, 1)}>
            <Zap size={16} /> ADD TO SYSTEM RIG
          </button>
        </div>
      </div>
    </div>
  );
}
