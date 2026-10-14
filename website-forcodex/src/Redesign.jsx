import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const HERO = "/images/morrow-chrome-study.png";
const VIOLET = "/images/morrow-violet-study.png";
const services = [
  { number: "01", title: "Brand direction", text: "A sharper point of view, carried through language, art direction, and the details people remember.", image: VIOLET },
  { number: "02", title: "Web experiences", text: "Websites with a clear story, considered interaction, and a reason behind every screen.", image: HERO },
  { number: "03", title: "Digital campaigns", text: "Campaign concepts that make one strong idea work across the places your audience actually sees it.", image: VIOLET },
  { number: "04", title: "Storefronts", text: "Commerce pages that balance the character of a brand with the clarity needed to choose and buy.", image: HERO },
];

function Reveal({ children, className = "", reduced, delay = 0, as = "div", ...rest }) {
  const Component = motion[as];
  return <Component className={className} initial={reduced ? false : { opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }} {...rest}>{children}</Component>;
}

function Header({ scrolled, reduced }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const escape = (event) => { if (event.key === "Escape") { setOpen(false); document.getElementById("menu-toggle")?.focus(); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  return <header className={`site-header ${scrolled || open ? "site-header--solid" : ""}`}>
    <div className="header-inner">
      <a className="brand" href="#top" aria-label="Morrow Studio, back to top" onClick={() => setOpen(false)}>MORROW<span>.</span><small>STUDIO</small></a>
      <nav className={`primary-nav ${open ? "primary-nav--open" : ""}`} id="primary-nav" aria-label="Main navigation">
        {[["Work", "#work"], ["Services", "#services"], ["Studio", "#studio"], ["Contact", "#contact"]].map(([label, href], index) => <motion.a key={href} href={href} onClick={() => setOpen(false)} initial={reduced ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + index * 0.07 }}>{label}</motion.a>)}
      </nav>
      <a className="header-cta" href="#contact">Start a conversation</a>
      <button className="menu-button" id="menu-toggle" type="button" aria-controls="primary-nav" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}<span className="menu-icon" aria-hidden="true"><i /><i /></span></button>
    </div>
  </header>;
}

function Hero({ reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 145]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  return <section className="hero" id="top" ref={ref} aria-labelledby="hero-title"><div className="hero-inner">
    <motion.div className="hero-copy" style={reduced ? undefined : { y: titleY, opacity: titleOpacity }}>
      <motion.p className="eyebrow hero-eyebrow" initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>Independent creative studio <span>/</span> Digital, with a point of view</motion.p>
      <h1 id="hero-title">{["Ideas made", "impossible", "to ignore."].map((line, index) => <span className={`hero-line ${index === 2 ? "hero-line--italic" : ""}`} key={line}><motion.span initial={reduced ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.17 + index * 0.14, ease: [0.22, 1, 0.36, 1] }}>{line}</motion.span></span>)}</h1>
      <motion.div className="hero-after" initial={reduced ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}><p>We shape brands and digital places people want to spend time with. The idea comes first. The details make it stick.</p><a className="text-link" href="#work">See the thinking <span aria-hidden="true">↗</span></a></motion.div>
    </motion.div>
    <motion.div className="hero-image-wrap" initial={reduced ? false : { opacity: 0, clipPath: "inset(12% 16% 12% 16%)" }} animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }} transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}><motion.img src={HERO} alt="Abstract chrome and violet acrylic sculpture for the Morrow concept site" loading="eager" style={reduced ? undefined : { y: imageY, scale: imageScale }} /><span>FIG. 01 / FORM STUDY</span></motion.div>
    <div className="hero-side-note" aria-hidden="true">SCROLL TO SEE WHAT WE MEAN <span>↓</span></div>
  </div></section>;
}

function Interlude({ reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-22%"]);
  return <section className="interlude" ref={ref} aria-label="Studio philosophy"><motion.div className="interlude-track" style={reduced ? undefined : { x }} aria-hidden="true">Form follows feeling <span>✳</span> Form follows feeling <span>✳</span> Form follows feeling</motion.div></section>;
}

function Services({ reduced }) {
  const [selected, setSelected] = useState(0);
  const active = services[selected];
  return <section className="services section-shell" id="services" aria-labelledby="services-title">
    <div className="section-topline"><span>01 / What we do</span><span>One idea, many expressions.</span></div>
    <div className="services-heading"><Reveal as="h2" id="services-title" className="section-title" reduced={reduced}>Good work starts<br />with a <em>clear angle.</em></Reveal><p>There is no house style to paste over your brief. We build the right shape for the story you need to tell.</p></div>
    <div className="services-grid"><div className="service-list" role="group" aria-label="Select a service">{services.map((item, index) => <button type="button" key={item.number} className={`service-row ${selected === index ? "service-row--active" : ""}`} onClick={() => setSelected(index)} aria-pressed={selected === index}><span className="service-number">{item.number}</span><span className="service-title">{item.title}</span><span className="service-arrow" aria-hidden="true">↗</span></button>)}</div>
      <div className="service-detail" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.div className="service-detail-inner" key={active.number} initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -20 }} transition={{ duration: 0.28 }}><div className="service-detail-image"><img src={active.image} alt="Abstract violet and chrome studio concept visual" loading="lazy" /></div><div className="service-detail-copy"><span>{active.number} / 04</span><p>{active.text}</p></div></motion.div></AnimatePresence></div>
    </div>
  </section>;
}

function Work({ reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], [55, -55]);
  return <section className="work section-shell" id="work" ref={ref} aria-labelledby="work-title">
    <div className="section-topline"><span>02 / Selected experiments</span><span>Concept studies, not client commissions.</span></div>
    <div className="work-heading"><Reveal as="h2" id="work-title" className="section-title" reduced={reduced}>A little tension<br /><em>looks good.</em></Reveal><p>Two explorations in contrast, material, and digital presence. They show a way of thinking, not a claim about past clients.</p></div>
    <Reveal className="work-feature" reduced={reduced}><div className="work-image-frame"><motion.img src={VIOLET} alt="Violet acrylic crossing a matte black monolith" loading="lazy" style={reduced ? undefined : { scale, y }} /><span>STUDY / 001</span></div><div className="work-caption"><div><span>01 / Visual language study</span><h3>Form &amp; friction</h3></div><p>An exercise in making an angular material world feel precise, tactile, and distinctly digital.</p></div></Reveal>
    <Reveal className="work-secondary" reduced={reduced}><div className="work-secondary-image"><img src={HERO} alt="Chrome and translucent violet acrylic composition" loading="lazy" /></div><div className="work-secondary-copy"><span>02 / Image-making study</span><h3>After the<br /><em>first glance.</em></h3><p>One object, several surfaces, and a composition built to keep revealing itself as the page moves.</p></div></Reveal>
  </section>;
}

function Studio({ reduced }) {
  return <section className="studio" id="studio" aria-labelledby="studio-title"><div className="section-shell studio-inner"><div className="section-topline"><span>03 / A point of view</span><span>Small studio. Wide lens.</span></div><Reveal as="h2" id="studio-title" className="studio-statement" reduced={reduced}>Make it matter<br />before you make it <em>louder.</em></Reveal><div className="studio-bottom"><span className="studio-asterisk" aria-hidden="true">✳</span><p>Morrow is a concept studio built around a simple belief: memorable work needs a clear thought behind it. We use design, words, and motion to make that thought visible.</p></div></div></section>;
}

function Contact({ reduced }) {
  const [form, setForm] = useState({ name: "", email: "", project: "" });
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  function submit(event) {
    event.preventDefault();
    const name = form.name.trim(), email = form.email.trim(), project = form.project.trim();
    if (!name || !email || !project) { setStatus("Add your name, email, and a few words about the project."); setDraft(""); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setStatus("Please check the email address and try again."); setDraft(""); return; }
    setDraft(`Subject: Project inquiry\n\nFrom: ${name} <${email}>\n\n${project}`);
    setStatus("Your inquiry draft is ready below."); setCopyStatus("");
  }
  async function copyDraft() { try { await navigator.clipboard.writeText(draft); setCopyStatus("Copied. Paste it into your email app when ready."); } catch { setCopyStatus("Clipboard unavailable. Select and copy the text below."); } }
  return <section className="contact section-shell" id="contact" aria-labelledby="contact-title"><div className="section-topline"><span>04 / Your move</span><span>Have a brief? Have a question?</span></div><div className="contact-grid"><div className="contact-copy"><Reveal as="h2" id="contact-title" className="section-title" reduced={reduced}>Let's make<br /><em>something land.</em></Reveal><p>Tell us what you are making. A rough thought is plenty to begin with.</p></div><div className="contact-form-wrap"><form onSubmit={submit} noValidate><label>Your name<input name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>A few words about the project<textarea name="project" rows="4" placeholder="What are you thinking about?" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} /></label><button type="submit" className="form-submit">Create inquiry draft <span aria-hidden="true">↗</span></button><p className="form-note">This concept site creates a draft in your browser. It does not send a message.</p><p className="form-status" role="status" aria-live="polite">{status}</p></form><AnimatePresence>{draft && <motion.div className="draft-result" initial={reduced ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><label htmlFor="inquiry-draft">Your draft</label><textarea id="inquiry-draft" value={draft} readOnly rows="6" onFocus={(e) => e.target.select()} /><button type="button" onClick={copyDraft}>Copy draft</button><p className="form-status" role="status" aria-live="polite">{copyStatus}</p></motion.div>}</AnimatePresence></div></div></section>;
}

export default function Redesign() {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  useMotionValueEvent(scrollY, "change", (value) => { const next = value > 70; setScrolled((old) => old === next ? old : next); });
  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#main-content">Skip to content</a><motion.div className="page-progress" style={{ scaleX: progress }} aria-hidden="true" /><Header scrolled={scrolled} reduced={reduced} /><main id="main-content"><Hero reduced={reduced} /><Interlude reduced={reduced} /><Services reduced={reduced} /><Work reduced={reduced} /><Studio reduced={reduced} /><Contact reduced={reduced} /></main><footer className="footer section-shell"><a className="footer-brand" href="#top">MORROW<span>.</span></a><span>Independent studio / concept website</span><a href="#top">Back to top ↑</a></footer></MotionConfig>;
}
