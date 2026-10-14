import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

const HERO_IMAGE = "/images/morrow-folded-paper.png";
const STORY_IMAGE = "/images/morrow-paper-doorway.png";

const chapters = [
  {
    index: "01",
    lead: "Listen for the real brief.",
    detail:
      "The useful idea is usually already in the room. We find it, sharpen it, and give the whole project a point of view.",
  },
  {
    index: "02",
    lead: "Give the idea a shape.",
    detail:
      "Structure, language, and visual direction begin to move together. Every element earns its place on the page.",
  },
  {
    index: "03",
    lead: "Make the work hold up.",
    detail:
      "A strong impression should survive the small screen, the keyboard, and the moment someone needs to take action.",
  },
];

const studies = [
  {
    number: "A",
    title: "Common Ground",
    type: "Editorial identity study",
    description:
      "A reading environment shaped around longform stories, quiet pace, and a strong sense of place.",
    visual: "field",
  },
  {
    number: "B",
    title: "Night Transit",
    type: "Launch page study",
    description:
      "A direct route from curiosity to a useful next step, drawn with bold contrast and clear language.",
    visual: "night",
  },
];

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function Header({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("morrow-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#20231f" : "#f3efe7"
    );
    try {
      localStorage.setItem("morrow-theme", theme);
    } catch {
      // The chosen theme still works when browser storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${scrolled || menuOpen ? "site-header--solid" : ""}`}>
      <div className="header-inner">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Morrow Field Notes, back to top">
          <span className="brand-mark" aria-hidden="true" />
          <span>Morrow <i>/ Field Notes</i></span>
        </a>

        <nav className={`primary-nav ${menuOpen ? "primary-nav--open" : ""}`} id="primary-nav" aria-label="Main navigation">
          <a href="#approach" onClick={closeMenu}>Approach</a>
          <a href="#studies" onClick={closeMenu}>Studies</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <div className="header-actions">
          <button
            className="theme-button"
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            className="menu-button"
            id="menu-toggle"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-controls="primary-nav"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ reducedMotion, compact }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const animateScroll = !reducedMotion && !compact;

  return (
    <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-stage">
        <motion.div
          className="hero-photo"
          style={animateScroll ? { scale: imageScale, y: imageY } : undefined}
          aria-hidden="true"
        >
          <img src={HERO_IMAGE} alt="" loading="eager" />
        </motion.div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-frame" aria-hidden="true" />

        <motion.div className="hero-content" style={animateScroll ? { y: copyY, opacity: copyOpacity } : undefined}>
          <motion.p
            className="hero-label"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Independent digital studio <span className="hero-label-line" /> Field note 01
          </motion.p>
          <h1 id="hero-title">
            <motion.span
              className="hero-line"
              initial={reducedMotion ? false : { opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              Make the idea
            </motion.span>
            <motion.span
              className="hero-line hero-line--accent"
              initial={reducedMotion ? false : { opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              legible.
            </motion.span>
          </h1>
          <motion.p
            className="hero-description"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            A point of view is only useful when people can feel it. We make websites that turn a sharp idea into a clear next step.
          </motion.p>
          <motion.a
            className="hero-cta"
            href="#approach"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
          >
            Follow the idea <span aria-hidden="true">↘</span>
          </motion.a>
        </motion.div>

        <div className="hero-bottom" aria-hidden="true">
          <span>Scroll to unfold</span>
          <span className="hero-bottom-rule" />
          <span>M / FN</span>
        </div>
      </div>
    </section>
  );
}

function ApproachIntro({ reducedMotion }) {
  const introRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: introRef, offset: ["start end", "end start"] });
  const ruleScale = useTransform(scrollYProgress, [0.18, 0.55], [0, 1]);

  return (
    <section className="approach-intro section-wrap" id="approach" ref={introRef} aria-labelledby="approach-title">
      <div className="index-rail"><span>01 / The approach</span><span>Observe &nbsp; / &nbsp; Define &nbsp; / &nbsp; Build</span></div>
      <motion.h2
        id="approach-title"
        className="approach-headline"
        initial={reducedMotion ? false : { opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        Less noise.<br /><em>More signal.</em>
      </motion.h2>
      <div className="approach-bottom">
        <motion.div className="approach-rule" style={reducedMotion ? undefined : { scaleX: ruleScale }} aria-hidden="true" />
        <p>Bring the rough thought. We find the through line, give it a shape, and make the result useful in the real world.</p>
      </div>
    </section>
  );
}

function StoryScroll({ reducedMotion, compact }) {
  const storyRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start start", "end end"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacities = [
    useTransform(scrollYProgress, [0, 0.22, 0.29], [1, 1, 0]),
    useTransform(scrollYProgress, [0.29, 0.34, 0.58, 0.65], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [0.65, 0.73, 1], [0, 1, 1]),
  ];
  const shifts = [
    useTransform(scrollYProgress, [0, 0.29], [0, -40]),
    useTransform(scrollYProgress, [0.29, 0.44, 0.65], [40, 0, -40]),
    useTransform(scrollYProgress, [0.65, 0.86], [40, 0]),
  ];

  if (reducedMotion || compact) {
    return (
      <section className="story-static section-wrap" ref={storyRef} aria-label="How we work">
        <div className="story-static-media">
          <img src={STORY_IMAGE} alt="Concept still life of folded paper and rust red acetate forming a doorway" loading="lazy" />
        </div>
        <div className="story-static-steps">
          {chapters.map((chapter) => (
            <article className="story-static-step" key={chapter.index}>
              <span>{chapter.index} / 03</span>
              <h3>{chapter.lead}</h3>
              <p>{chapter.detail}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="story-scroll" ref={storyRef} aria-label="How we work">
      <div className="story-stage">
        <div className="story-image-wrap">
          <motion.img
            src={STORY_IMAGE}
            alt="Concept still life of folded paper and rust red acetate forming a doorway"
            loading="lazy"
            style={{ scale: imageScale, y: imageY }}
          />
          <div className="story-image-caption">Study in form / Morrow Field Notes</div>
        </div>
        <div className="story-copy">
          <p className="story-kicker">02 / A way of working</p>
          <div className="story-chapters">
            {chapters.map((chapter, index) => (
              <motion.article
                className="story-chapter"
                key={chapter.index}
                style={{ opacity: opacities[index], y: shifts[index] }}
              >
                <span className="story-chapter-index">{chapter.index} / 03</span>
                <h3>{chapter.lead}</h3>
                <p>{chapter.detail}</p>
              </motion.article>
            ))}
          </div>
          <div className="story-track" aria-hidden="true"><motion.span style={{ height: progressHeight }} /></div>
          <p className="story-footnote">The shape changes with the work. The intention stays clear.</p>
        </div>
      </div>
    </section>
  );
}

function Studies({ reducedMotion }) {
  return (
    <section className="studies section-wrap" id="studies" aria-labelledby="studies-title">
      <div className="section-meta"><span>03 / Practice pieces</span><span>These are concept studies, not client projects.</span></div>
      <div className="studies-heading">
        <h2 id="studies-title">Ways an idea<br /><em>can take form.</em></h2>
        <p>Every project needs its own rhythm. These studies show how tone, structure, and visual language can move together.</p>
      </div>
      <div className="study-list">
        {studies.map((study, index) => (
          <motion.article
            className={`study study--${study.visual}`}
            key={study.title}
            initial={reducedMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="study-art" role="img" aria-label={`Abstract visual study for ${study.title}`}>
              <div className="study-art-frame" aria-hidden="true" />
              <div className="study-art-shape" aria-hidden="true" />
              <span aria-hidden="true">{index === 0 ? "FIELD" : "NIGHT"}</span>
            </div>
            <div className="study-content">
              <span className="study-index">{study.number} / {study.type}</span>
              <h3>{study.title}</h3>
              <p>{study.description}</p>
              <a href="#contact">Discuss a similar project <span aria-hidden="true">↗</span></a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Contact({ reducedMotion }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus("Add your name, email, and a short note to create the draft.");
      setDraft("");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("Please check the email address. Use a format like you@example.com.");
      setDraft("");
      return;
    }

    setDraft(`Subject: Website inquiry\n\nFrom: ${name} <${email}>\n\n${message}`);
    setStatus("Your inquiry draft is ready below.");
    setCopyStatus("");
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopyStatus("Copied. You can paste the draft into your email app.");
    } catch {
      setCopyStatus("Clipboard unavailable here. Select and copy the draft text below.");
    }
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="section-wrap contact-inner">
        <div className="contact-heading">
          <span className="contact-index">04 / Your turn</span>
          <motion.h2
            id="contact-title"
            initial={reducedMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
          >
            Have a good<br /><em>question?</em>
          </motion.h2>
          <p>Tell us what you are making and where it feels unclear. Start with the rough version.</p>
        </div>

        <div className="contact-form-wrap">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} name="name" autoComplete="name" placeholder="Your name" /></label>
              <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
            </div>
            <label>What are you making?<textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} name="message" placeholder="A few useful details" rows="5" /></label>
            <div className="form-bottom">
              <button type="submit">Create inquiry draft <span aria-hidden="true">↗</span></button>
              <p>This preview creates a draft in your browser. It does not send a message.</p>
            </div>
            <p className="form-status" role="status" aria-live="polite">{status}</p>
          </form>
          <AnimatePresence>
            {draft && (
              <motion.div
                className="draft-result"
                initial={reducedMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label htmlFor="inquiry-draft">Your draft</label>
                <textarea id="inquiry-draft" value={draft} readOnly rows="6" onFocus={(event) => event.target.select()} />
                <button type="button" onClick={copyDraft}>Copy draft</button>
                <p className="form-status" role="status" aria-live="polite">{copyStatus}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const compact = useMediaQuery("(max-width: 760px)");
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > window.innerHeight * 0.65;
    setScrolled((previous) => (previous === next ? previous : next));
  });

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <motion.div className="page-progress" style={{ scaleX: smoothProgress }} aria-hidden="true" />
      <Header scrolled={scrolled} />
      <main id="main-content">
        <Hero reducedMotion={reducedMotion} compact={compact} />
        <ApproachIntro reducedMotion={reducedMotion} />
        <StoryScroll reducedMotion={reducedMotion} compact={compact} />
        <Studies reducedMotion={reducedMotion} />
        <Contact reducedMotion={reducedMotion} />
      </main>
      <footer className="footer section-wrap">
        <span>Morrow / Field Notes</span>
        <span>Independent digital studio / concept site</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </MotionConfig>
  );
}
