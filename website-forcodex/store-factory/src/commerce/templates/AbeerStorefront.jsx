import React, { useEffect, useState } from 'react';
import {
  Search,
  ShoppingBag,
  PhoneCall,
  ArrowRight,
  Zap,
  ShieldCheck,
  CreditCard,
  Headphones,
  Star,
  Plus,
  Minus,
  CheckCircle2,
  X,
  Truck,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronDown,
  Mail,
  MapPin,
  MessageCircle,
  HelpCircle,
  Menu,
  Heart,
  User,
  Leaf,
  FlaskRound,
  RotateCcw
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { cartSummary, money, priceOf, safeImage, onColor } from '../model.js';
import { placeOrder } from '../repository.js';
import { CustomSection } from '../../sections/SectionRenderer.jsx';

function Photo({ src, alt = '', className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && safeImage(src) && !failed ? (
    <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
  ) : (
    <div className={`cf-photo-empty ${className}`}>{alt || 'Photograph'}</div>
  );
}

const FAQS_LIST = [
  {
    q: "What are the Minimum Order Quantities (MOQs) for wholesale procurement?",
    a: "We provide flexible procurement tiers starting with low sample MOQs (from 10–25 units for catalog evaluation) up to multi-container shipments (1,000–50,000+ units) with institutional volume price breaks."
  },
  {
    q: "How are international freight, customs clearance, and delivery handled?",
    a: "Abeer Trading operates direct air priority cargo (24–48 hours transit) and full-container ocean freight. All commercial shipments include pre-cleared customs, commercial invoices, packing lists, and automated tracking."
  },
  {
    q: "What payment methods and trade terms are supported for commercial buyers?",
    a: "We support verified international wire transfers (SWIFT / IBAN), confirmed Letters of Credit (LC) for container volume, and escrow terms. Commercial credit accounts are available for long-term partners approved by Tahir Mehmood."
  },
  {
    q: "How does Abeer Trading guarantee product authenticity and batch quality?",
    a: "Every consignment undergoes a mandatory 100% pre-shipment quality inspection at our regional consolidation hub. We provide genuine batch inspection certificates and tamper-evident manufacturer seals."
  },
  {
    q: "Can I request custom product sourcing or private labeling not currently in the catalog?",
    a: "Yes. Our executive trade desk specializes in bespoke sourcing across general consumer goods, electronics, textiles, and home fixtures. Contact Tahir Mehmood directly to request a custom sourcing brief."
  },
  {
    q: "How do I contact Tahir Mehmood directly for an instant quotation?",
    a: "You can reach Tahir Mehmood directly via WhatsApp at (+966) 547035184, call our executive line, or email Abeer.tahir2025@gmail.com for priority corporate quotes."
  }
];

export default function AbeerStorefront({
  store,
  preview = false,
  demo = false,
  initialPage = 'home',
  selectedSection = null,
  selectedTarget = null,
  activeTab = null,
  onSectionSelect = null,
  isMobile = false
}) {
  const [page, setPage] = useState(initialPage);
  const [productId, setProductId] = useState(store.products[0]?.id || '');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState('');
  const [cart, setCart] = useState([]);
  const [addedToast, setAddedToast] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [wishlist, setWishlist] = useState({});
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Wholesale / Bulk Procurement',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => { setPage(initialPage); }, [initialPage]);
  useEffect(() => {
    if (!addedToast) return;
    const t = setTimeout(() => setAddedToast(null), 3800);
    return () => clearTimeout(t);
  }, [addedToast]);

  const homeSections = store.pages?.home || [];
  const heroBlock = homeSections.find(s => s.type === 'hero') || homeSections[0];
  const catBlock = homeSections.find(s => s.type === 'collections');
  const promoBlock = homeSections.find(s => s.type === 'banner');
  const prodBlock = homeSections.find(s => s.type === 'products');
  const faqBlock = (store.pages?.faq || homeSections).find(s => s.type === 'faq');

  function isTargetSelected(target) {
    if (!selectedTarget && !selectedSection) return false;
    if (selectedTarget) {
      if (target.type === 'element' && selectedTarget.type === 'element') {
        return (
          target.sectionId === selectedTarget.sectionId &&
          target.field === selectedTarget.field
        );
      }
      if (target.type && selectedTarget.type && target.type === selectedTarget.type) {
        if (target.id && selectedTarget.id) return target.id === selectedTarget.id;
        return true;
      }
      if (target.id && selectedTarget.id) return target.id === selectedTarget.id;
      if (typeof selectedTarget === 'string' && (target.id === selectedTarget || target.sectionId === selectedTarget)) return true;
    }
    if (selectedSection) {
      const targetId = typeof target === 'string' ? target : target?.id || target?.sectionId;
      if (targetId && targetId === selectedSection) return true;
    }
    return false;
  }

  function inspectProps(target, label) {
    if (!preview || !onSectionSelect) return {};
    const isSelected = isTargetSelected(target);
    return {
      'data-inspect-label': label,
      'data-inspect-type': target.element || target.type || 'element',
      className: `ce-inspectable ${isSelected ? 'is-selected' : ''}`,
      onClick: (e) => {
        e.stopPropagation();
        e.preventDefault();
        onSectionSelect(target);
      }
    };
  }

  function InspectBadge({ target, label }) {
    if (!preview || !onSectionSelect) return null;
    return (
      <div className="ce-inspect-badge-wrap">
        <button
          type="button"
          className="ce-inspect-badge-btn"
          title={`Click to edit ${label} in sidebar`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onSectionSelect(target);
          }}
        >
          <span className="ce-badge-icon">✏️</span>
          <span>Edit {label}</span>
        </button>
      </div>
    );
  }

  const products = store.products.filter(p => p.status === 'published');
  const summary = cartSummary(store, cart, '', store.settings.shippingMethods[0]?.id || '');
  const cartItemCount = summary.lines.reduce((n, l) => n + l.quantity, 0);

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

  function navigateTo(p, cat = '') {
    setPage(p);
    setSelectedCat(cat);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const filteredProducts = products.filter(p => {
    const matchesCat = !selectedCat || p.category === selectedCat;
    const matchesSearch = !search || `${p.name} ${p.sku} ${p.description}`.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  function renderHomeSectionBlock(sec, index) {
    if (sec.visible === false) return null;

    if (sec.type === 'hero') {
      const isSecSelected = isTargetSelected({ type: 'section', id: sec.id });
      const secBg = sec.customBg || (sec.background === 'white' ? '#ffffff' : sec.background === 'muted' ? '#ecefe9' : sec.background === 'dark' ? '#12261b' : sec.background === 'brand' ? (store.settings?.color || '#0c363d') : undefined);
      const isDark = sec.background === 'dark' || (sec.background === 'brand' && onColor(store.settings?.color || '#0c363d') === '#ffffff');
      const secPadding = sec.spacing === 'compact' ? '30px 20px' : sec.spacing === 'airy' ? '90px 20px' : undefined;

      return (
        <section
          key={sec.id || index}
          className="abr-hero-section"
          style={{ backgroundColor: secBg, color: isDark ? '#ffffff' : undefined, padding: secPadding }}
          {...inspectProps({ type: 'section', id: sec.id, label: sec.title || 'Hero Section' }, 'Hero Section')}
        >
          <InspectBadge target={{ type: 'section', id: sec.id, label: sec.title || 'Hero Section' }} label="Hero Section" />
          <div className="abr-hero-container">
            <div className="abr-hero-left" style={{ textAlign: sec.align || 'left' }}>
              <span
                className="abr-purelis-eyebrow"
                style={{ color: sec.eyebrowColor || undefined }}
                {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'eyebrow', label: 'Hero Eyebrow' }, 'Hero Eyebrow')}
              >
                {sec.eyebrow || 'NATURALLY PURE.'}
              </span>
              <h1
                className="abr-hero-title"
                style={{
                  color: sec.titleColor || (isDark ? '#ffffff' : undefined),
                  fontSize: sec.titleSize === 'large' ? '2.8rem' : sec.titleSize === 'display' ? '3.5rem' : (sec.titleSize ? `${sec.titleSize}px` : undefined),
                  fontWeight: sec.titleWeight || undefined,
                  fontFamily: sec.titleFont ? (sec.titleFont === 'editorial' ? 'Georgia, serif' : sec.titleFont === 'serif' ? 'Georgia, serif' : sec.titleFont === 'modern' ? 'Arial, sans-serif' : undefined) : undefined
                }}
                {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'title', label: 'Hero Heading' }, 'Hero Heading')}
              >
                {sec.title || 'BEAUTIFULLY YOU.'}
              </h1>
              <p
                className="abr-hero-desc"
                style={{ color: sec.textColor || (isDark ? 'rgba(255,255,255,0.85)' : undefined) }}
                {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'text', label: 'Hero Description' }, 'Hero Description')}
              >
                {sec.text || "Clean, effective & cruelty-free skincare enriched with nature's finest ingredients. Verified commercial procurement & direct trade desk managed by Tahir Mehmood."}
              </p>
              <div className="abr-hero-actions" style={{ justifyContent: sec.align === 'center' ? 'center' : sec.align === 'right' ? 'flex-end' : 'flex-start' }}>
                <button
                  type="button"
                  className="abr-purelis-btn"
                  style={{
                    backgroundColor: sec.buttonBg || undefined,
                    color: sec.buttonColor || undefined,
                    borderRadius: sec.buttonRadius !== '' && sec.buttonRadius !== undefined ? `${sec.buttonRadius}px` : undefined,
                    border: sec.buttonBorder || undefined
                  }}
                  {...inspectProps({ type: 'element', element: 'button', sectionId: sec.id, field: 'button', targetField: 'target', label: 'Hero CTA Button' }, 'Hero Button')}
                  onClick={(e) => {
                    if (preview) {
                      e.stopPropagation();
                      e.preventDefault();
                      onSectionSelect?.({ type: 'element', element: 'button', sectionId: sec.id, field: 'button', targetField: 'target', label: 'Hero CTA Button' });
                    } else {
                      navigateTo(sec.target || 'shop');
                    }
                  }}
                >
                  {sec.button || 'SHOP NOW'}
                </button>
              </div>
            </div>

            <div className="abr-hero-right">
              <div
                className="abr-hero-photo-wrap"
                style={{ borderRadius: sec.imageRadius ? `${sec.imageRadius}px` : undefined, overflow: 'hidden' }}
                {...inspectProps({ type: 'element', element: 'image', sectionId: sec.id, field: 'image', label: 'Hero Image' }, 'Hero Image')}
              >
                <Photo
                  src={sec.image || '/commerce/purelis-hero.jpg'}
                  alt={sec.title || 'Purelis Skincare Bottles'}
                  className="abr-purelis-hero-img"
                  style={{ objectFit: sec.imageFit || 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (sec.type === 'services') {
      const items = sec.items && sec.items.length > 0 ? sec.items : [
        { title: 'Natural Ingredients', text: 'Safe & toxin-free' },
        { title: 'Clinically Tested', text: 'Dermatologically proven' },
        { title: 'Cruelty Free', text: 'We never test on animals' },
        { title: 'For All Skin Types', text: 'Gentle & effective care' }
      ];
      return (
        <div
          key={sec.id || index}
          className="abr-trust-strip"
          {...inspectProps({ type: 'section', id: sec.id, label: sec.title || 'Trust Pillars' }, 'Trust Strip')}
        >
          <InspectBadge target={{ type: 'section', id: sec.id, label: sec.title || 'Trust Pillars' }} label="Trust Strip" />
          {items.map((item, i) => (
            <div key={item.id || i} className="abr-trust-col">
              <div className="abr-trust-icon">
                {i === 0 ? <Leaf size={22} /> : i === 1 ? <FlaskRound size={22} /> : i === 2 ? <ShieldCheck size={22} /> : <CheckCircle2 size={22} />}
              </div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (sec.type === 'collections' || sec.type === 'categories') {
      const cats = (store.categories && store.categories.length > 0
        ? store.categories.map((catName, idx) => {
            const fallbackImgs = [
              '/template-images/cleaning.webp',
              '/commerce/perfume.webp',
              '/commerce/purelis-promo.jpg',
              '/commerce/purelis-hero.jpg',
              '/commerce/trade-forest.png',
              '/commerce/watch.webp'
            ];
            const col = store.collections?.[idx];
            return { name: catName, img: col?.image || fallbackImgs[idx % fallbackImgs.length] };
          })
        : [
            { name: 'CLEANSERS', img: '/template-images/cleaning.webp' },
            { name: 'SERUMS', img: '/commerce/perfume.webp' },
            { name: 'MOISTURIZERS', img: '/commerce/purelis-promo.jpg' },
            { name: 'SUN CARE', img: '/commerce/purelis-hero.jpg' },
            { name: 'SKIN CARE KITS', img: '/commerce/trade-forest.png' },
            { name: 'BEST SELLERS', img: '/commerce/watch.webp' }
          ]
      );
      return (
        <section
          key={sec.id || index}
          className="abr-categories-section"
          {...inspectProps({ type: 'section', id: sec.id, label: sec.title || 'Categories & Collections' }, 'Categories')}
        >
          <InspectBadge target={{ type: 'section', id: sec.id, label: sec.title || 'Categories & Collections' }} label="Categories" />
          <h2
            className="abr-purelis-heading"
            style={{ color: sec.titleColor || undefined }}
            {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'title', label: 'Categories Title' }, 'Categories Title')}
          >
            {sec.title || 'SHOP BY CATEGORY'}
          </h2>
          <div className="abr-category-pills-grid">
            {cats.map((c, idx) => (
              <div
                key={idx}
                className="abr-purelis-cat-card"
                onClick={(e) => {
                  if (preview) {
                    e.stopPropagation();
                    e.preventDefault();
                    onSectionSelect?.({ type: 'catalogue', label: c.name });
                  } else {
                    navigateTo('shop', c.name);
                  }
                }}
              >
                <div className="abr-purelis-cat-media">
                  <img src={c.img} alt={c.name} />
                </div>
                <span className="abr-purelis-cat-label">{c.name}</span>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sec.type === 'banner') {
      return (
        <section
          key={sec.id || index}
          className="abr-promo-banner-section"
          {...inspectProps({ type: 'section', id: sec.id, label: sec.title || 'Promotional Banner' }, 'Promo Banner')}
        >
          <InspectBadge target={{ type: 'section', id: sec.id, label: sec.title || 'Promotional Banner' }} label="Promo Banner" />
          <div
            className="abr-promo-banner-card"
            style={{ backgroundColor: sec.customBg || undefined }}
          >
            <div className="abr-promo-left" style={{ textAlign: sec.align || 'left' }}>
              <span
                className="abr-promo-eyebrow"
                style={{ color: sec.eyebrowColor || undefined }}
                {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'eyebrow', label: 'Banner Eyebrow' }, 'Banner Eyebrow')}
              >
                {sec.eyebrow || 'GOOD FOR YOUR SKIN. GOOD FOR THE PLANET.'}
              </span>
              <h3
                className="abr-promo-headline"
                style={{
                  color: sec.titleColor || undefined,
                  fontSize: sec.titleSize ? `${sec.titleSize}px` : undefined,
                  fontWeight: sec.titleWeight || undefined
                }}
                {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'title', label: 'Banner Headline' }, 'Banner Headline')}
              >
                {sec.title || 'Up to 25% Off Sitewide'}
              </h3>
              {sec.text && (
                <p
                  className="abr-promo-text"
                  style={{ color: sec.textColor || undefined, fontSize: '14px', opacity: 0.9, margin: '10px 0 16px', lineHeight: 1.5 }}
                  {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'text', label: 'Banner Description' }, 'Banner Description')}
                >
                  {sec.text}
                </p>
              )}
              <button
                type="button"
                className="abr-purelis-btn"
                style={{
                  backgroundColor: sec.buttonBg || undefined,
                  color: sec.buttonColor || undefined,
                  borderRadius: sec.buttonRadius !== '' && sec.buttonRadius !== undefined ? `${sec.buttonRadius}px` : undefined,
                  border: sec.buttonBorder || undefined
                }}
                {...inspectProps({ type: 'element', element: 'button', sectionId: sec.id, field: 'button', targetField: 'target', label: 'Banner Button' }, 'Banner Button')}
                onClick={(e) => {
                  if (preview) {
                    e.stopPropagation();
                    e.preventDefault();
                    onSectionSelect?.({ type: 'element', element: 'button', sectionId: sec.id, field: 'button', targetField: 'target', label: 'Banner Button' });
                  } else {
                    navigateTo(sec.target || 'shop');
                  }
                }}
              >
                {sec.button || 'EXPLORE OFFERS'}
              </button>
              <div className="abr-promo-features">
                <span><Leaf size={14} /> Clean Beauty</span>
                <span><Sparkles size={14} /> Sustainable</span>
                <span><ShieldCheck size={14} /> Eco-Friendly Packaging</span>
              </div>
            </div>
            <div className="abr-promo-right">
              <div
                style={{ borderRadius: sec.imageRadius ? `${sec.imageRadius}px` : undefined, overflow: 'hidden' }}
                {...inspectProps({ type: 'element', element: 'image', sectionId: sec.id, field: 'image', label: 'Banner Image' }, 'Banner Image')}
              >
                <Photo
                  src={sec.image || '/commerce/purelis-promo.jpg'}
                  alt={sec.title || 'Purelis Promo Banner'}
                  className="abr-purelis-promo-img"
                  style={{ objectFit: sec.imageFit || 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (sec.type === 'products') {
      const shownProds = products.slice(0, sec.limit || 4);
      return (
        <section
          key={sec.id || index}
          className="abr-products-section"
          {...inspectProps({ type: 'section', id: sec.id, label: sec.title || 'Product Selection' }, 'Products Selection')}
        >
          <InspectBadge target={{ type: 'section', id: sec.id, label: sec.title || 'Product Selection' }} label="Products Selection" />
          <div className="abr-purelis-section-header">
            <h2
              style={{ color: sec.titleColor || undefined }}
              {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'title', label: 'Products Heading' }, 'Products Heading')}
            >
              {sec.title || 'NEW ARRIVALS'}
            </h2>
            <button
              type="button"
              className="abr-view-all-link"
              onClick={(e) => {
                if (preview) {
                  e.stopPropagation();
                  e.preventDefault();
                  onSectionSelect?.({ type: 'section', id: sec.id, label: 'Products Section' });
                } else {
                  navigateTo('shop');
                }
              }}
            >
              VIEW ALL
            </button>
          </div>

          <div className="abr-purelis-products-grid">
            {shownProds.map(product => (
              <div
                key={product.id}
                className="abr-product-inspect-wrap"
                {...inspectProps({ type: 'product', id: product.id, label: `Product: ${product.name}` }, `Product: ${product.name}`)}
              >
                <ProductItemCard
                  product={product}
                  currency={store.settings.currency}
                  onAdd={() => addToCart(product, null, 1)}
                  onView={() => {
                    if (preview) {
                      onSectionSelect?.({ type: 'product', id: product.id, label: product.name });
                    } else {
                      viewProduct(product.id);
                    }
                  }}
                  isLiked={Boolean(wishlist[product.id])}
                  onToggleLike={() => setWishlist(w => ({ ...w, [product.id]: !w[product.id] }))}
                />
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sec.type === 'faq') {
      const faqList = (sec.items && sec.items.length > 0 ? sec.items.map(item => ({ q: item.title, a: item.text })) : FAQS_LIST);
      return (
        <section
          key={sec.id || index}
          className="abr-faq-preview-section"
          {...inspectProps({ type: 'section', id: sec.id, label: sec.title || 'FAQ Section' }, 'FAQ Section')}
        >
          <InspectBadge target={{ type: 'section', id: sec.id, label: sec.title || 'FAQ Section' }} label="FAQ Section" />
          <div className="abr-purelis-section-header centered">
            <span className="abr-sub-label">TRANSPARENT SOURCING</span>
            <h2
              style={{ color: sec.titleColor || undefined }}
              {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'title', label: 'FAQ Heading' }, 'FAQ Heading')}
            >
              {sec.title || 'Frequently Asked Questions'}
            </h2>
          </div>
          <div className="abr-faq-grid">
            {faqList.map((faq, idx) => (
              <div
                key={idx}
                className={`abr-faq-item ${openFaq === idx ? 'is-open' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <div className="abr-faq-q">
                  <strong>{faq.q}</strong>
                  <ChevronDown size={16} className={`abr-faq-chevron ${openFaq === idx ? 'is-rotated' : ''}`} />
                </div>
                {openFaq === idx && <p className="abr-faq-a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sec.type === 'contact') {
      return (
        <section
          key={sec.id || index}
          className="abr-contact-home-section"
          {...inspectProps({ type: 'contact', label: 'Contact Details' }, 'Contact Details')}
        >
          <InspectBadge target={{ type: 'contact', label: 'Contact Details' }} label="Contact Details" />
          <div className="abr-purelis-section-header centered">
            <span className="abr-sub-label">DIRECT EXECUTIVE CONTACT</span>
            <h2
              style={{ color: sec.titleColor || undefined }}
              {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'title', label: 'Contact Heading' }, 'Contact Heading')}
            >
              Connect With {store.name || 'Abeer Trading & Co.'}
            </h2>
            <p>{store.settings?.footerText || 'Managed directly by Tahir Mehmood · Fast response for commercial quotes & client support'}</p>
          </div>

          <div className="abr-contact-cards-row">
            <a
              href={preview ? '#inspect' : `mailto:${store.settings?.email || 'Abeer.tahir2025@gmail.com'}`}
              className="abr-contact-tile"
              onClick={(e) => {
                if (preview) {
                  e.preventDefault();
                  e.stopPropagation();
                  onSectionSelect?.({ type: 'contact' });
                }
              }}
            >
              <div className="abr-tile-icon"><Mail size={22} /></div>
              <div>
                <small>Official Trade Email</small>
                <strong>{store.settings?.email || 'Abeer.tahir2025@gmail.com'}</strong>
                <span>Priority executive response</span>
              </div>
            </a>
            <a
              href={preview ? '#inspect' : `https://wa.me/${(store.settings?.whatsapp || '966547035184').replace(/[^0-9]/g, '')}`}
              target={preview ? undefined : '_blank'}
              rel="noreferrer"
              className="abr-contact-tile"
              onClick={(e) => {
                if (preview) {
                  e.preventDefault();
                  e.stopPropagation();
                  onSectionSelect?.({ type: 'contact' });
                }
              }}
            >
              <div className="abr-tile-icon"><MessageCircle size={22} /></div>
              <div>
                <small>Instant WhatsApp Desk</small>
                <strong>Chat with Tahir Mehmood</strong>
                <span>{store.settings?.phone || '(+966) 547035184'}</span>
              </div>
            </a>
            <a
              href={preview ? '#inspect' : `tel:${store.settings?.phone || '+966547035184'}`}
              className="abr-contact-tile"
              onClick={(e) => {
                if (preview) {
                  e.preventDefault();
                  e.stopPropagation();
                  onSectionSelect?.({ type: 'contact' });
                }
              }}
            >
              <div className="abr-tile-icon"><PhoneCall size={22} /></div>
              <div>
                <small>Commercial Hotline</small>
                <strong>{store.settings?.phone || '(+966) 547035184'}</strong>
                <span>Direct phone line</span>
              </div>
            </a>
          </div>
        </section>
      );
    }

    if (sec.type === 'richtext') {
      return (
        <section
          key={sec.id || index}
          className="abr-richtext-section"
          style={{ padding: '60px 24px', maxWidth: '1280px', margin: 'auto' }}
          {...inspectProps({ type: 'section', id: sec.id, label: sec.title || 'Rich Text' }, 'Rich Text')}
        >
          <InspectBadge target={{ type: 'section', id: sec.id, label: sec.title || 'Rich Text' }} label="Rich Text" />
          <div style={{ display: 'grid', gridTemplateColumns: sec.image ? '1fr 1fr' : '1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              {sec.eyebrow && (
                <span
                  style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: sec.eyebrowColor || '#0c8a74', display: 'block', marginBottom: '8px' }}
                  {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'eyebrow', label: 'Eyebrow' }, 'Eyebrow')}
                >
                  {sec.eyebrow}
                </span>
              )}
              <h2
                style={{ fontSize: '32px', fontWeight: 700, color: sec.titleColor || '#12281c', margin: '0 0 16px', lineHeight: 1.2 }}
                {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'title', label: 'Heading' }, 'Heading')}
              >
                {sec.title}
              </h2>
              <p
                style={{ fontSize: '15px', color: sec.textColor || '#4a5d52', lineHeight: 1.7, margin: '0 0 24px' }}
                {...inspectProps({ type: 'element', element: 'text', sectionId: sec.id, field: 'text', label: 'Text' }, 'Text')}
              >
                {sec.text}
              </p>
              {sec.button && (
                <button
                  type="button"
                  className="abr-purelis-btn"
                  style={{
                    backgroundColor: sec.buttonBg || undefined,
                    color: sec.buttonColor || undefined,
                    borderRadius: sec.buttonRadius ? `${sec.buttonRadius}px` : undefined
                  }}
                  {...inspectProps({ type: 'element', element: 'button', sectionId: sec.id, field: 'button', targetField: 'target', label: 'Button' }, 'Button')}
                  onClick={(e) => {
                    if (preview) {
                      e.stopPropagation();
                      e.preventDefault();
                      onSectionSelect?.({ type: 'element', element: 'button', sectionId: sec.id, field: 'button', targetField: 'target', label: 'Button' });
                    } else {
                      navigateTo(sec.target || 'shop');
                    }
                  }}
                >
                  {sec.button}
                </button>
              )}
            </div>
            {sec.image && (
              <div
                style={{ borderRadius: '12px', overflow: 'hidden' }}
                {...inspectProps({ type: 'element', element: 'image', sectionId: sec.id, field: 'image', label: 'Image' }, 'Image')}
              >
                <Photo src={sec.image} alt={sec.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}
          </div>
        </section>
      );
    }

    if (sec.type === 'testimonials') {
      const quotes = sec.items && sec.items.length > 0 ? sec.items : [
        { title: 'Faisal Al-Otaibi', text: 'Outstanding commercial quality and lightning fast dispatch. Our clients love the formulations.' },
        { title: 'Dr. Tariq Mansoor', text: 'Certified purity and complete batch documentation. Unmatched service in wholesale skincare.' }
      ];
      return (
        <section
          key={sec.id || index}
          className="abr-testimonials-section"
          style={{ padding: '60px 24px', background: '#f6f9f6', margin: '30px 0' }}
          {...inspectProps({ type: 'section', id: sec.id, label: sec.title || 'Testimonials' }, 'Testimonials')}
        >
          <InspectBadge target={{ type: 'section', id: sec.id, label: sec.title || 'Testimonials' }} label="Testimonials" />
          <div style={{ maxWidth: '1100px', margin: 'auto', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#0c8a74' }}>CLIENT FEEDBACK</span>
            <h2 style={{ fontSize: '28px', margin: '8px 0 36px', color: '#132c1e' }}>{sec.title || 'Trusted By Industry Partners'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {quotes.map((q, idx) => (
                <div key={idx} style={{ background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '12px' }}>
                    {'★'.repeat(5)}
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#334155', fontStyle: 'italic', margin: '0 0 16px' }}>"{q.text}"</p>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>{q.title}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (sec.type === 'custom') {
      return (
        <div key={sec.id || index} {...inspectProps({ type: 'section', id: sec.id, label: sec.title || 'Custom Section' }, 'Custom Section')}>
          <InspectBadge target={{ type: 'section', id: sec.id, label: sec.title || 'Custom Section' }} label="Custom Section" />
          {sec.definition ? <CustomSection section={sec.definition} device={isMobile ? 'mobile' : 'desktop'} interactive={!preview} /> : null}
        </div>
      );
    }

    return null;
  }

  return (
    <div className={`abeer-theme-wrap ${isMobile ? 'is-mobile-frame' : ''}`}>
      {/* 1. TOP UTILITY BAR (Botanical Dark Green with Discount Code & Socials) */}
      <div className="abr-ticker-bar" {...inspectProps({ type: 'announcement' }, 'Announcement Bar & Phone')}>
        <InspectBadge target={{ type: 'announcement' }} label="Announcement & Phone" />
        <div className="abr-ticker-inner">
          <div className="abr-ticker-promo">
            <span>{store.settings?.announcement || 'Free shipping on orders over $499 | Use code: PURE20 for 20% OFF 🌿'}</span>
          </div>
          <div className="abr-ticker-right">
            <div className="abr-ticker-socials">
              <a href="#facebook" aria-label="Facebook"><FaFacebookF size={11} /></a>
              <a href="#instagram" aria-label="Instagram"><FaInstagram size={12} /></a>
              <a href="#youtube" aria-label="YouTube"><FaYoutube size={12} /></a>
            </div>
            <a href={`tel:${store.settings?.phone || '+966547035184'}`} className="abr-ticker-hotline">
              <PhoneCall size={12} /> {store.settings?.phone || '(+966) 547035184'}
            </a>
          </div>
        </div>
      </div>

      {/* 2. UNCLUTTERED PRIMARY HEADER */}
      <header className="abr-header" {...inspectProps({ type: 'header' }, 'Header & Navigation')}>
        <InspectBadge target={{ type: 'header' }} label="Header & Logo" />
        <div className="abr-header-inner">
          {/* Brand Mark - Purelis / Abeer Luxury Serif typography or Uploaded Logo */}
          <div
            className="abr-brand-block"
            {...inspectProps({ type: 'logo' }, 'Store Logo & Name')}
            onClick={(e) => {
              if (preview) {
                e.stopPropagation();
                onSectionSelect?.({ type: 'logo' });
              } else {
                navigateTo('home');
              }
            }}
          >
            {store.settings?.logo ? (
              <img src={store.settings.logo} alt={store.name} className="abr-brand-logo-img" style={{ maxHeight: '42px', objectFit: 'contain' }} />
            ) : (
              <>
                <span className="abr-brand-main-title">{store.name || 'PURELIS'}</span>
                <span className="abr-brand-sub-badge">SKINCARE & TRADE · EST. 2025</span>
              </>
            )}
          </div>

          {/* Centered Navigation with FAQs & Contact */}
          <nav className="abr-nav" {...inspectProps({ type: 'navbar' }, 'Navigation Menu')}>
            <button
              type="button"
              className={`abr-nav-link ${page === 'home' && !selectedCat ? 'is-active' : ''}`}
              onClick={(e) => {
                if (preview) {
                  e.stopPropagation();
                  onSectionSelect?.({ type: 'navbar' });
                } else {
                  navigateTo('home');
                }
              }}
            >
              HOME
            </button>
            <button
              type="button"
              className={`abr-nav-link ${page === 'shop' || selectedCat ? 'is-active' : ''}`}
              onClick={(e) => {
                if (preview) {
                  e.stopPropagation();
                  onSectionSelect?.({ type: 'navbar' });
                } else {
                  navigateTo('shop');
                }
              }}
            >
              SHOP <ChevronDown size={11} style={{ display: 'inline', marginLeft: 2 }} />
            </button>
            <button
              type="button"
              className={`abr-nav-link ${page === 'collections' ? 'is-active' : ''}`}
              onClick={(e) => {
                if (preview) {
                  e.stopPropagation();
                  onSectionSelect?.({ type: 'navbar' });
                } else {
                  navigateTo('collections');
                }
              }}
            >
              COLLECTIONS <ChevronDown size={11} style={{ display: 'inline', marginLeft: 2 }} />
            </button>
            <button
              type="button"
              className={`abr-nav-link ${page === 'services' ? 'is-active' : ''}`}
              onClick={(e) => {
                if (preview) {
                  e.stopPropagation();
                  onSectionSelect?.({ type: 'navbar' });
                } else {
                  navigateTo('services');
                }
              }}
            >
              ABOUT US
            </button>
            <button
              type="button"
              className={`abr-nav-link ${page === 'faq' ? 'is-active' : ''}`}
              onClick={(e) => {
                if (preview) {
                  e.stopPropagation();
                  onSectionSelect?.({ type: 'navbar' });
                } else {
                  navigateTo('faq');
                }
              }}
            >
              FAQS
            </button>
            <button
              type="button"
              className={`abr-nav-link ${page === 'contact' ? 'is-active' : ''}`}
              onClick={(e) => {
                if (preview) {
                  e.stopPropagation();
                  onSectionSelect?.({ type: 'navbar' });
                } else {
                  navigateTo('contact');
                }
              }}
            >
              CONTACT
            </button>
          </nav>

          {/* Right Action Tools: Search, User, Bag */}
          <div className="abr-header-actions">
            {/* Expandable Search Toggle */}
            <div className={`abr-search-wrapper ${searchOpen || search ? 'is-open' : ''}`}>
              <button
                type="button"
                className="abr-icon-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Toggle search"
              >
                <Search size={18} />
              </button>
              {(searchOpen || search) && (
                <div className="abr-search-input-box">
                  <input
                    type="search"
                    placeholder="Search products..."
                    autoFocus
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                      if (page !== 'shop') setPage('shop');
                    }}
                  />
                  {search && (
                    <button type="button" className="abr-search-clear-btn" onClick={() => setSearch('')}>
                      <X size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* User Account / B2B Desk Icon */}
            <button
              type="button"
              className="abr-icon-btn"
              onClick={() => navigateTo('contact')}
              aria-label="Account & B2B Desk"
              title="Tahir Mehmood B2B Desk"
            >
              <User size={18} />
            </button>

            {/* Shopping Bag Button */}
            <button
              type="button"
              className="abr-cart-btn"
              onClick={() => navigateTo('cart')}
              aria-label={`View shopping bag, ${cartItemCount} items`}
            >
              <ShoppingBag size={18} />
              {cartItemCount > 0 && <span className="abr-cart-count">{cartItemCount}</span>}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="abr-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="abr-mobile-menu">
            <button onClick={() => navigateTo('home')}>Home</button>
            <button onClick={() => navigateTo('shop')}>Shop ({products.length})</button>
            <button onClick={() => navigateTo('collections')}>Collections</button>
            <button onClick={() => navigateTo('services')}>About Us / Services</button>
            <button onClick={() => navigateTo('faq')}>FAQs</button>
            <button onClick={() => navigateTo('contact')}>Contact Us</button>
          </div>
        )}
      </header>

      {/* 3. SUB-NAV CATEGORY FILTER STRIP (Shown for catalog context) */}
      {(page === 'home' || page === 'shop' || page === 'collections') && (
        <div className="abr-category-strip">
          <div className="abr-strip-inner">
            <div className="abr-cat-pills">
              <button
                className={!selectedCat && page === 'shop' ? 'is-selected' : ''}
                onClick={() => navigateTo('shop', '')}
              >
                <Layers size={13} /> All Categories ({products.length})
              </button>
              {store.categories.map(cat => (
                <button
                  key={cat}
                  className={selectedCat === cat ? 'is-selected' : ''}
                  onClick={() => navigateTo('shop', cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="abr-strip-manager">
              <span>Executive Desk: <strong>Tahir Mehmood</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {addedToast && (
        <div className="abr-cart-toast">
          <CheckCircle2 size={18} color="#10b981" />
          <div className="abr-toast-info">
            <strong>Added to order bag!</strong>
            <span>{addedToast.product.name} (Qty {addedToast.quantity})</span>
          </div>
          <button type="button" className="abr-toast-action" onClick={() => navigateTo('cart')}>
            View Bag ({cartItemCount})
          </button>
          <button type="button" className="abr-toast-close" onClick={() => setAddedToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* PAGE: HOME */}
      {page === 'home' && (
        <div className="abr-home-sections-flow">
          {homeSections.map((sec, index) => renderHomeSectionBlock(sec, index))}
        </div>
      )}

      {/* PAGE: COLLECTIONS */}
      {page === 'collections' && (
        <section className="abr-collections-section">
          <div className="abr-section-header centered">
            <span className="abr-sub-label">CATALOG DIVISIONS</span>
            <h1>Product Collections & Lines</h1>
            <p>Explore specialized procurement departments structured for institutional distributors and retail buyers.</p>
          </div>
          <div className="abr-collections-grid">
            {store.collections.map((col, idx) => (
              <div key={col.id} className="abr-collection-card" onClick={() => navigateTo('shop', store.categories[idx] || '')}>
                <div className="abr-card-media">
                  <Photo src={col.image} alt={col.name} />
                </div>
                <div className="abr-card-content">
                  <span className="abr-collection-tag">DIVISION 0{idx + 1}</span>
                  <h3>{col.name}</h3>
                  <p>{col.description}</p>
                  <span className="abr-collection-link">Browse Division Items <ArrowRight size={13} /></span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PAGE: FAQS */}
      {page === 'faq' && (
        <section className="abr-faq-page">
          <div className="abr-section-header centered">
            <span className="abr-sub-label">KNOWLEDGE BASE & GUIDES</span>
            <h1>Procurement & Operations FAQs</h1>
            <p>Everything you need to know about purchasing, commercial tiers, shipping logistics, and customs clearance.</p>
          </div>

          <div className="abr-faq-full-list">
            {FAQS_LIST.map((faq, idx) => (
              <div
                key={idx}
                className={`abr-faq-item ${openFaq === idx ? 'is-open' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <div className="abr-faq-q">
                  <strong>{faq.q}</strong>
                  <ChevronDown size={18} className={`abr-faq-chevron ${openFaq === idx ? 'is-rotated' : ''}`} />
                </div>
                {openFaq === idx && <p className="abr-faq-a">{faq.a}</p>}
              </div>
            ))}
          </div>

          <div className="abr-faq-support-box">
            <div className="abr-support-icon">
              <Headphones size={28} />
            </div>
            <div>
              <h3>Still have questions?</h3>
              <p>Speak directly with Tahir Mehmood or send your formal procurement requirements to our desk.</p>
            </div>
            <button className="abr-primary-btn" onClick={() => navigateTo('contact')}>
              Contact Executive Desk <ArrowRight size={14} />
            </button>
          </div>
        </section>
      )}

      {/* PAGE: SHOP / CATALOG */}
      {page === 'shop' && (
        <section className="abr-shop-section">
          <div className="abr-shop-header">
            <div>
              <span className="abr-sub-label">WHOLESALE & RETAIL CATALOG</span>
              <h1>Active Available Inventory</h1>
              <p>Showing {filteredProducts.length} verified products ready for commercial and consumer delivery</p>
            </div>
            {selectedCat && (
              <button className="abr-clear-filter-btn" onClick={() => setSelectedCat('')}>
                Category: <strong>{selectedCat}</strong> <X size={13} />
              </button>
            )}
          </div>

          <div className="abr-products-grid">
            {filteredProducts.map(product => (
              <ProductItemCard
                key={product.id}
                product={product}
                currency={store.settings.currency}
                onAdd={() => addToCart(product, null, 1)}
                onView={() => viewProduct(product.id)}
              />
            ))}
          </div>

          {!filteredProducts.length && (
            <div className="abr-empty-catalog">
              <h3>No products matched your search.</h3>
              <p>Please clear your category filter or search keywords.</p>
              <button className="abr-primary-btn" onClick={() => { setSelectedCat(''); setSearch(''); }}>
                Reset Catalog Filters
              </button>
            </div>
          )}
        </section>
      )}

      {/* PAGE: PRODUCT DETAIL */}
      {page === 'product' && (
        <ProductDetailView store={store} productId={productId} onBack={() => navigateTo('shop')} onAdd={addToCart} onCheckout={() => navigateTo('cart')} />
      )}

      {/* PAGE: CART */}
      {page === 'cart' && (
        <CartView store={store} cart={cart} setCart={setCart} onContinue={() => navigateTo('shop')} onOrderPlaced={() => { setCart([]); navigateTo('order-success'); }} />
      )}

      {/* PAGE: ABOUT US / SERVICES */}
      {page === 'services' && (
        <section className="abr-about-page">
          <div className="abr-about-hero">
            <span className="abr-sub-label">OUR HERITAGE & MISSION</span>
            <h1>Crafted by Nature. Powered by Science.</h1>
            <p>
              Purelis and Abeer Trading & Co. bridge the gap between verified clean ingredients, direct manufacturer procurement, and uncompromising luxury skincare.
            </p>
          </div>

          <div className="abr-about-story-grid">
            <div className="abr-about-story-text">
              <span className="abr-story-badge">ETHICAL SOURCING & DIRECT TRADE</span>
              <h2>Purity in Every Batch, Transparency in Every Deal.</h2>
              <p>
                Owned and managed by <strong>Tahir Mehmood</strong>, Abeer Trading Company LLC combines global procurement infrastructure with artisanal skincare craftsmanship. Every product in our catalog undergoes rigorous dermatological review and pre-shipment quality verification.
              </p>
              <p>
                Whether supplying boutique beauty salons with bulk cleansers or delivering direct-to-consumer organic ritual sets, we operate with a strict zero-compromise policy: no synthetic fillers, no parabens, zero animal cruelty, and 100% genuine batch certifications.
              </p>
              <div className="abr-about-stats-strip">
                <div className="abr-about-stat-item">
                  <strong>100%</strong>
                  <span>Cruelty-Free & Clean</span>
                </div>
                <div className="abr-about-stat-item">
                  <strong>24–48h</strong>
                  <span>Priority Air Freight</span>
                </div>
                <div className="abr-about-stat-item">
                  <strong>50,000+</strong>
                  <span>Delivered Units</span>
                </div>
              </div>
            </div>

            <div className="abr-about-story-media">
              <img
                src="/commerce/purelis-hero.jpg"
                alt="Purelis Organic Formulations on Travertine Stone"
                className="abr-about-photo"
              />
              <div className="abr-about-media-tag">
                <ShieldCheck size={22} color="#233a27" />
                <div>
                  <strong>Certified Pure Sourcing</strong>
                  <small>Directly Overseen by Tahir Mehmood</small>
                </div>
              </div>
            </div>
          </div>

          <div className="abr-services-header">
            <span className="abr-sub-label">OPERATIONAL EXCELLENCE</span>
            <h2>Core Operational Pillars</h2>
          </div>

          <div className="abr-services-grid">
            <div className="abr-service-card">
              <div className="abr-srv-icon"><Leaf size={26} /></div>
              <h3>Certified Botanical Sourcing</h3>
              <p>Direct manufacturer batch audits, cold-pressed plant extracts, and clinical toxicity screenings ensuring 100% safe, non-toxic skincare formulations.</p>
            </div>
            <div className="abr-service-card">
              <div className="abr-srv-icon"><Truck size={26} /></div>
              <h3>Global Trade & Express Freight</h3>
              <p>Air priority (24–48h) and temperature-monitored cargo shipments with full pre-cleared customs, commercial invoices, and automated tracking.</p>
            </div>
            <div className="abr-service-card">
              <div className="abr-srv-icon"><CreditCard size={26} /></div>
              <h3>Institutional B2B Terms</h3>
              <p>Volume wholesale pricing tiers, flexible MOQs, commercial LC & SWIFT payment terms, and scheduled replenishment contracts for long-term partners.</p>
            </div>
          </div>

          <div className="abr-about-values-bar">
            <span>🌿 100% Natural Ingredients</span>
            <span>✨ Dermatologist Approved</span>
            <span>🐰 Cruelty-Free Certified</span>
            <span>📦 Eco-Friendly Packaging</span>
          </div>

          <div className="abr-services-cta-banner">
            <div>
              <h3>Have a bulk order or custom inquiry?</h3>
              <p>Connect directly with Tahir Mehmood to request a formal quotation or custom procurement plan.</p>
            </div>
            <button type="button" className="abr-purelis-btn" onClick={() => navigateTo('contact')}>
              Contact Executive Desk <ArrowRight size={14} />
            </button>
          </div>
        </section>
      )}

      {/* PAGE: CONTACT */}
      {page === 'contact' && (
        <section className="abr-contact-page">
          <div className="abr-contact-hero">
            <span className="abr-sub-label">GET IN TOUCH</span>
            <h1>Connect With Our Executive Desk</h1>
            <p>Have questions about formulations, catalog availability, or wholesale procurement? Speak directly with Tahir Mehmood or send us a message below.</p>
          </div>

          <div className="abr-contact-main-grid">
            {/* Left: Contact Info Cards */}
            <div className="abr-contact-info-col">
              <div className="abr-contact-box-card">
                <div className="abr-box-header">
                  <div className="abr-box-icon"><MessageCircle size={22} /></div>
                  <div>
                    <small>DIRECT WHATSAPP DESK</small>
                    <strong>Chat with Tahir Mehmood</strong>
                  </div>
                </div>
                <p>Instant corporate assistance, catalog price lists, and direct order queries.</p>
                <a href="https://wa.me/966547035184" target="_blank" rel="noreferrer" className="abr-whatsapp-link">
                  Open WhatsApp Chat (+966 547035184) <ArrowRight size={14} />
                </a>
              </div>

              <div className="abr-contact-box-card">
                <div className="abr-box-header">
                  <div className="abr-box-icon"><Mail size={22} /></div>
                  <div>
                    <small>OFFICIAL TRADE EMAIL</small>
                    <strong>Abeer.tahir2025@gmail.com</strong>
                  </div>
                </div>
                <p>Send formal RFP requests, RFQs, commercial purchase orders, and partnership proposals.</p>
                <a href="mailto:Abeer.tahir2025@gmail.com" className="abr-direct-link">
                  Send Direct Email <ArrowRight size={14} />
                </a>
              </div>

              <div className="abr-contact-box-card">
                <div className="abr-box-header">
                  <div className="abr-box-icon"><PhoneCall size={22} /></div>
                  <div>
                    <small>COMMERCIAL HOTLINE</small>
                    <strong>(+966) 547035184</strong>
                  </div>
                </div>
                <p>Direct telephone line for urgent cargo status, trade agreements, and partner support.</p>
                <a href="tel:+966547035184" className="abr-direct-link">
                  Call Executive Desk <ArrowRight size={14} />
                </a>
              </div>

              <div className="abr-contact-box-card">
                <div className="abr-box-header">
                  <div className="abr-box-icon"><MapPin size={22} /></div>
                  <div>
                    <small>HEADQUARTERS & DISTRIBUTION</small>
                    <strong>Abeer Trading Company LLC</strong>
                  </div>
                </div>
                <p>Wholesale Logistics Hub & Commercial Trade Office · Open Mon–Sat 9:00 AM – 7:00 PM</p>
              </div>
            </div>

            {/* Right: Full Interactive Contact Form */}
            <div className="abr-contact-form-col">
              <div className="abr-form-wrapper">
                {formSubmitted ? (
                  <div className="abr-form-success-box">
                    <CheckCircle2 size={48} color="#15803d" />
                    <h3>Message Sent Successfully!</h3>
                    <p>
                      Thank you, <strong>{contactForm.name}</strong>! Your inquiry regarding "<em>{contactForm.subject || contactForm.inquiryType}</em>" has been routed directly to Tahir Mehmood's executive trade desk.
                    </p>
                    <p className="abr-success-sub">We will review your message and reply via WhatsApp / Email within 2–4 hours.</p>
                    <button
                      type="button"
                      className="abr-purelis-btn"
                      onClick={() => {
                        setContactForm({ name: '', email: '', phone: '', inquiryType: 'Wholesale / Bulk Procurement', subject: '', message: '' });
                        setFormSubmitted(false);
                      }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form
                    className="abr-contact-form"
                    onSubmit={e => {
                      e.preventDefault();
                      setFormSubmitted(true);
                    }}
                  >
                    <div className="abr-form-title-group">
                      <h3>Send a Direct Commercial Message</h3>
                      <p>Fill out the form below and Tahir Mehmood's desk will get back to you promptly.</p>
                    </div>

                    <div className="abr-form-row">
                      <div className="abr-form-field">
                        <label>Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Faisal Al-Zahrani"
                          value={contactForm.name}
                          onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                        />
                      </div>
                      <div className="abr-form-field">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={contactForm.email}
                          onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="abr-form-row">
                      <div className="abr-form-field">
                        <label>Phone / WhatsApp Number</label>
                        <input
                          type="tel"
                          placeholder="+966 5X XXX XXXX"
                          value={contactForm.phone}
                          onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="abr-form-field">
                        <label>Inquiry Type</label>
                        <select
                          value={contactForm.inquiryType}
                          onChange={e => setContactForm({ ...contactForm, inquiryType: e.target.value })}
                        >
                          <option value="Wholesale / Bulk Procurement">Wholesale / Bulk Procurement</option>
                          <option value="Retail Order Inquiry">Retail Order Inquiry</option>
                          <option value="Custom Formulation & Private Label">Custom Formulation & Private Label</option>
                          <option value="General Partnership">General Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div className="abr-form-field">
                      <label>Subject *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bulk quote request for Calming Green Tea Wash"
                        value={contactForm.subject}
                        onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                      />
                    </div>

                    <div className="abr-form-field">
                      <label>Your Detailed Message *</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Please describe your quantities, destination city, or product requirements in detail..."
                        value={contactForm.message}
                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="abr-form-submit-btn">
                      <span>SEND MESSAGE TO EXECUTIVE DESK</span>
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Purelis Luxury 4-Column Footer */}
      <footer className="abr-footer" {...inspectProps({ type: 'footer' }, 'Footer & Store Info')}>
        <InspectBadge target={{ type: 'footer' }} label="Footer & Store Info" />
        <div className="abr-footer-prestrip">
          <div className="abr-prestrip-col">
            <Truck size={24} className="abr-prestrip-icon" />
            <div>
              <strong>FREE EXPRESS SHIPPING</strong>
              <p>On orders over $499 · 24-48h dispatch</p>
            </div>
          </div>
          <div className="abr-prestrip-col">
            <RotateCcw size={24} className="abr-prestrip-icon" />
            <div>
              <strong>14-DAY RETURN POLICY</strong>
              <p>100% satisfaction guarantee</p>
            </div>
          </div>
          <div className="abr-prestrip-col">
            <ShieldCheck size={24} className="abr-prestrip-icon" />
            <div>
              <strong>100% SECURE CHECKOUT</strong>
              <p>Encrypted commercial escrow & wire</p>
            </div>
          </div>
        </div>

        <div className="abr-footer-grid">
          {/* Col 1: Brand & Bio */}
          <div
            className="abr-footer-col abr-footer-brand-col"
            onClick={(e) => {
              if (preview) {
                e.stopPropagation();
                onSectionSelect?.({ type: 'logo' });
              }
            }}
          >
            <div className="abr-footer-logo-title">
              <span className="abr-brand-crest">P</span>
              <strong>{store.name || 'PURELIS'}</strong>
            </div>
            <span className="abr-footer-subline">ABEER TRADING & CO. · EST. 2025</span>
            <p>
              {store.settings?.footerText || 'Premium botanical skincare and certified global trade desk. Owned and managed by Tahir Mehmood.'}
            </p>
            <div className="abr-footer-hotlines">
              <a
                href={preview ? '#inspect' : `mailto:${store.settings?.email || 'Abeer.tahir2025@gmail.com'}`}
                onClick={(e) => {
                  if (preview) {
                    e.preventDefault();
                    e.stopPropagation();
                    onSectionSelect?.({ type: 'contact' });
                  }
                }}
              >
                <Mail size={13} /> {store.settings?.email || 'Abeer.tahir2025@gmail.com'}
              </a>
              <a
                href={preview ? '#inspect' : `tel:${store.settings?.phone || '+966547035184'}`}
                onClick={(e) => {
                  if (preview) {
                    e.preventDefault();
                    e.stopPropagation();
                    onSectionSelect?.({ type: 'contact' });
                  }
                }}
              >
                <PhoneCall size={13} /> {store.settings?.phone || '(+966) 547035184'}
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="abr-footer-col">
            <h4>EXPLORE</h4>
            <ul className="abr-footer-links">
              <li><button onClick={(e) => { if (preview) { e.stopPropagation(); onSectionSelect?.({ type: 'navbar' }); } else { navigateTo('home'); } }}>Home</button></li>
              <li><button onClick={(e) => { if (preview) { e.stopPropagation(); onSectionSelect?.({ type: 'navbar' }); } else { navigateTo('shop'); } }}>Shop Catalog ({products.length})</button></li>
              <li><button onClick={(e) => { if (preview) { e.stopPropagation(); onSectionSelect?.({ type: 'navbar' }); } else { navigateTo('collections'); } }}>Collections</button></li>
              <li><button onClick={(e) => { if (preview) { e.stopPropagation(); onSectionSelect?.({ type: 'navbar' }); } else { navigateTo('services'); } }}>About Us & Mission</button></li>
              <li><button onClick={(e) => { if (preview) { e.stopPropagation(); onSectionSelect?.({ type: 'navbar' }); } else { navigateTo('faq'); } }}>Frequently Asked Questions</button></li>
              <li><button onClick={(e) => { if (preview) { e.stopPropagation(); onSectionSelect?.({ type: 'navbar' }); } else { navigateTo('contact'); } }}>Contact & Quotation Desk</button></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="abr-footer-col">
            <h4>COLLECTIONS</h4>
            <ul className="abr-footer-links">
              {['CLEANSERS', 'SERUMS', 'MOISTURIZERS', 'SUN CARE', 'SKIN CARE KITS', 'BEST SELLERS'].map(cat => (
                <li key={cat}>
                  <button onClick={(e) => { if (preview) { e.stopPropagation(); onSectionSelect?.({ type: 'catalogue' }); } else { navigateTo('shop', cat); } }}>{cat}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter & Socials */}
          <div className="abr-footer-col abr-footer-news-col">
            <h4>STAY IN THE GLOW</h4>
            <p>Subscribe for exclusive wholesale price sheets, formulations, and 20% off code <strong>PURE20</strong>.</p>
            <form className="abr-newsletter-form" onSubmit={e => { e.preventDefault(); alert('Subscribed to Purelis updates!'); }}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit">SUBSCRIBE</button>
            </form>
            <div className="abr-footer-socials">
              <a href="#facebook" aria-label="Facebook"><FaFacebookF size={12} /></a>
              <a href="#instagram" aria-label="Instagram"><FaInstagram size={13} /></a>
              <a href="#youtube" aria-label="YouTube"><FaYoutube size={13} /></a>
            </div>
          </div>
        </div>

        <div className="abr-footer-bottom">
          <span>© {new Date().getFullYear()} Abeer Trading Company LLC · Purelis Skincare Line · All Rights Reserved</span>
          <span>Managed & Directed by Tahir Mehmood · (+966) 547035184</span>
        </div>
      </footer>
    </div>
  );
}

function ProductItemCard({ product, currency, onAdd, onView, isLiked, onToggleLike }) {
  const price = priceOf(product);
  const discount = product.salePrice !== '' && Number(product.price) > Number(product.salePrice)
    ? Math.round(((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100)
    : 0;

  return (
    <article className="abr-purelis-card">
      <div className="abr-purelis-media-box" onClick={onView}>
        <button
          type="button"
          className={`abr-purelis-heart ${isLiked ? 'is-active' : ''}`}
          onClick={e => {
            e.stopPropagation();
            if (onToggleLike) onToggleLike();
          }}
          aria-label="Wishlist"
        >
          <Heart size={16} fill={isLiked ? '#e11d48' : 'none'} color={isLiked ? '#e11d48' : '#888'} />
        </button>
        <Photo src={product.images[0]} alt={product.name} className="abr-purelis-thumb" />
      </div>

      <div className="abr-purelis-body">
        <h3 className="abr-purelis-title" onClick={onView}>{product.name}</h3>
        <div className="abr-purelis-price-box">
          <strong className="abr-purelis-current-price">{money(price, currency)}</strong>
          {product.salePrice !== '' && (
            <del className="abr-purelis-old-price">{money(product.price, currency)}</del>
          )}
        </div>
        <button type="button" className="abr-purelis-card-btn" onClick={onAdd}>
          ADD TO CART
        </button>
      </div>
    </article>
  );
}


function ProductDetailView({ store, productId, onBack, onAdd, onCheckout }) {
  const product = store.products.find(p => p.id === productId) || store.products[0];
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id || '');
  const currency = store.settings.currency;
  const currentVariant = product.variants.find(v => v.id === selectedVariant);
  const price = priceOf(product, currentVariant);
  const discount = product.salePrice !== '' && Number(product.price) > Number(product.salePrice)
    ? Math.round(((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100)
    : 0;

  return (
    <div className="abr-detail-page">
      <div className="abr-detail-breadcrumb">
        <button onClick={onBack}>Catalog</button>
        <ChevronRight size={13} />
        <span>{product.category}</span>
        <ChevronRight size={13} />
        <strong>{product.name}</strong>
      </div>

      <div className="abr-detail-split">
        <div className="abr-detail-gallery">
          <div className="abr-detail-main-img">
            <Photo src={product.images[selectedImg] || product.images[0]} alt={product.name} eager />
            {discount > 0 && <span className="abr-detail-discount-badge">Save {discount}% OFF</span>}
          </div>
          {product.images.length > 1 && (
            <div className="abr-detail-thumbs">
              {product.images.map((src, idx) => (
                <button key={idx} className={selectedImg === idx ? 'is-active' : ''} onClick={() => setSelectedImg(idx)}>
                  <Photo src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="abr-detail-content">
          <span className="abr-eyebrow-pill">{product.category} · SKU: {currentVariant?.sku || product.sku}</span>
          <h1 className="abr-detail-title">{product.name}</h1>

          <div className="abr-detail-price-box">
            <strong className="abr-detail-price">{money(price, currency)}</strong>
            {product.salePrice !== '' && <del className="abr-detail-del">{money(product.price, currency)}</del>}
            <span className="abr-tax-tag">Verified Commercial Tier</span>
          </div>

          <p className="abr-detail-desc">{product.description}</p>

          {product.variants.length > 0 && (
            <div className="abr-variant-section">
              <label>Select Size / Variant Option:</label>
              <div className="abr-variant-chips">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    className={`abr-v-chip ${selectedVariant === v.id ? 'is-selected' : ''}`}
                    onClick={() => setSelectedVariant(v.id)}
                  >
                    {v.name} {v.size ? `· ${v.size}` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="abr-qty-add-row">
            <div className="abr-qty-picker">
              <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}><Minus size={14} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}><Plus size={14} /></button>
            </div>
            <button className="abr-add-bag-btn" onClick={() => onAdd(product, currentVariant, qty)}>
              <ShoppingBag size={16} /> <span>Add to Order Bag</span>
            </button>
          </div>

          <div className="abr-guarantees-panel">
            <div className="abr-guarantee-item">
              <ShieldCheck size={18} />
              <div>
                <strong>100% Authentic Guaranteed</strong>
                <p>Direct batch inspection managed by Tahir Mehmood.</p>
              </div>
            </div>
            <div className="abr-guarantee-item">
              <Truck size={18} />
              <div>
                <strong>Express Air & Sea Freight</strong>
                <p>Door-to-door delivery with customs clearance tracking.</p>
              </div>
            </div>
          </div>

          {product.specifications && (
            <div className="abr-spec-box">
              <h4>Product Specifications</h4>
              <p>{product.specifications}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CartView({ store, cart, setCart, onContinue, onOrderPlaced }) {
  const summary = cartSummary(store, cart, '', store.settings.shippingMethods[0]?.id || '');
  const currency = store.settings.currency;
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!cart.length) {
    return (
      <div className="abr-cart-empty-view">
        <ShoppingBag size={52} />
        <h2>Your Commercial Order Bag is Empty</h2>
        <p>Explore our verified wholesale & retail catalog to initiate an order.</p>
        <button className="abr-primary-btn" onClick={onContinue}>Explore Catalog</button>
      </div>
    );
  }

  async function handleOrder(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await placeOrder(store, cart, customer, '', store.settings.shippingMethods[0]?.id || '', crypto.randomUUID(), true);
      onOrderPlaced();
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="abr-cart-page">
      <h1>Commercial Order Bag ({summary.lines.length} items)</h1>
      <div className="abr-cart-layout">
        <div className="abr-cart-lines">
          {summary.lines.map(line => (
            <div key={line.key} className="abr-cart-line-card">
              <Photo src={line.product.images[0]} alt={line.product.name} />
              <div className="abr-line-info">
                <h3>{line.product.name}</h3>
                <small>{line.variant?.name || line.product.category}</small>
                <div className="abr-line-price">{money(line.unitCents / 100, currency)}</div>
              </div>
              <div className="abr-line-qty">
                <span>Qty: {line.quantity}</span>
              </div>
              <button className="abr-line-remove" onClick={() => setCart(cart.filter(c => c.productId !== line.product.id))}>
                <X size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="abr-cart-sidebar">
          <h3>Order Summary</h3>
          <div className="abr-summary-row">
            <span>Subtotal</span>
            <strong>{money(summary.subtotal / 100, currency)}</strong>
          </div>
          <div className="abr-summary-row">
            <span>Freight Dispatch</span>
            <strong>Complimentary Insured</strong>
          </div>
          <div className="abr-summary-total">
            <span>Total Commercial Order</span>
            <strong>{money(summary.total / 100, currency)}</strong>
          </div>

          <form className="abr-checkout-form" onSubmit={handleOrder}>
            <h4>Commercial Contact Details</h4>
            <input required placeholder="Full Name / Representative" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
            <input required type="email" placeholder="Corporate / Business Email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} />
            <input required type="tel" placeholder="Phone Number (for customs tracking)" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
            <input required placeholder="Delivery / Warehouse Address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
            <button className="abr-primary-btn w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Order Request...' : 'Submit Commercial Order Request'}
            </button>
            <small className="abr-form-note">Tahir Mehmood and our desk will contact you with the invoice and shipping manifest.</small>
          </form>
        </div>
      </div>
    </div>
  );
}
