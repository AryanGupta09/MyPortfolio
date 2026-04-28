import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080C14;
    --bg2: #0D1220;
    --bg3: #111827;
    --surface: #141B2D;
    --surface2: #1A2340;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(0,212,255,0.2);
    --accent: #00D4FF;
    --accent2: #6C63FF;
    --gold: #E8C56A;
    --text: #F0F4FF;
    --text2: #8A9BB8;
    --text3: #4A5568;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  /* NAVBAR */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 0 2rem;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(8,12,20,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    transition: all 0.3s ease;
  }
  .nav.scrolled {
    background: rgba(8,12,20,0.97);
    border-bottom-color: var(--border2);
  }
  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--text);
  }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 0.25rem; }
  .nav-link {
    font-size: 0.78rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text2);
    padding: 0.4rem 0.85rem;
    border-radius: 4px;
    text-decoration: none;
    transition: color 0.2s, background 0.2s;
  }
  .nav-link:hover, .nav-link.active {
    color: var(--accent);
    background: rgba(0,212,255,0.07);
  }
  .nav-mobile-btn {
    display: none;
    background: none; border: none; cursor: pointer;
    color: var(--text); padding: 0.5rem;
  }
  .nav-mobile-menu {
    display: none;
    position: fixed; top: 64px; left: 0; right: 0;
    background: rgba(8,12,20,0.98);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 1rem;
    flex-direction: column;
    gap: 0.25rem;
    z-index: 99;
  }
  .nav-mobile-menu.open { display: flex; }
  .nav-mobile-link {
    display: block;
    font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text2); text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    transition: all 0.2s;
  }
  .nav-mobile-link:hover { color: var(--accent); background: rgba(0,212,255,0.07); }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .nav-mobile-btn { display: block; }
  }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    padding: 100px 2rem 2rem;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 70%),
                radial-gradient(ellipse 50% 50% at 80% 80%, rgba(108,99,255,0.06) 0%, transparent 60%);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  }
  .hero-content {
    position: relative; z-index: 1;
    text-align: center; max-width: 860px;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--accent);
    border: 1px solid var(--border2);
    background: rgba(0,212,255,0.05);
    padding: 0.4rem 1rem; border-radius: 100px;
    margin-bottom: 2rem;
    animation: fadeSlideDown 0.8s ease forwards;
  }
  .hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s infinite;
  }
  .hero-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3.5rem, 9vw, 7rem);
    font-weight: 600; line-height: 1;
    letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
    animation: fadeSlideUp 0.8s ease 0.1s both;
  }
  .hero-name-highlight {
    display: block;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero-typed {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: var(--text2); letter-spacing: 0.05em;
    height: 2rem; margin-bottom: 3rem;
    animation: fadeSlideUp 0.8s ease 0.2s both;
  }
  .hero-typed-cursor {
    display: inline-block;
    width: 2px; height: 1.1em;
    background: var(--accent);
    margin-left: 2px;
    animation: blink 1s step-end infinite;
    vertical-align: text-bottom;
  }
  .hero-actions {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    margin-bottom: 3.5rem;
    animation: fadeSlideUp 0.8s ease 0.3s both;
  }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--accent); color: var(--bg);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em;
    padding: 0.8rem 2rem; border-radius: 6px;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 0 30px rgba(0,212,255,0.25);
  }
  .btn-primary:hover {
    background: #fff; color: var(--bg);
    box-shadow: 0 0 50px rgba(0,212,255,0.4);
    transform: translateY(-2px);
  }
  .btn-outline {
    display: inline-flex; align-items: center; gap: 0.5rem;
    border: 1px solid var(--border2); color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em;
    padding: 0.8rem 2rem; border-radius: 6px;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  .btn-outline:hover {
    border-color: var(--accent); color: var(--accent);
    background: rgba(0,212,255,0.05);
    transform: translateY(-2px);
  }
  .hero-socials {
    display: flex; gap: 1.5rem; justify-content: center;
    animation: fadeSlideUp 0.8s ease 0.4s both;
  }
  .hero-social-link {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text3); text-decoration: none;
    transition: color 0.2s;
  }
  .hero-social-link:hover { color: var(--accent); }
  .hero-social-line {
    width: 24px; height: 1px;
    background: currentColor; transition: width 0.3s;
  }
  .hero-social-link:hover .hero-social-line { width: 40px; }

  /* SECTIONS */
  section {
    padding: 6rem 2rem;
    max-width: 1100px; margin: 0 auto;
  }
  .section-label {
    display: flex; align-items: center; gap: 1rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 1rem;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(to right, var(--border2), transparent);
  }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 600; line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 3rem;
  }
  .section-wrapper {
    background: var(--bg2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 6rem 0;
  }

  /* ABOUT */
  .about-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: start;
  }
  .about-text {
    font-size: 1.05rem; line-height: 1.8;
    color: var(--text2); font-weight: 300;
  }
  .about-text p + p { margin-top: 1.25rem; }
  .about-stats {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1px;
    border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
  }
  .about-stat {
    background: var(--surface);
    padding: 2rem 1.5rem;
    transition: background 0.3s;
  }
  .about-stat:hover { background: var(--surface2); }
  .about-stat:nth-child(3) { grid-column: span 2; }
  .about-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem; font-weight: 700;
    color: var(--accent); line-height: 1;
  }
  .about-stat-label {
    font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text3); margin-top: 0.5rem;
  }

  @media (max-width: 768px) {
    .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .about-stat:nth-child(3) { grid-column: span 1; }
  }

  /* EXPERIENCE */
  .exp-card {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 2.5rem;
    background: var(--surface);
    transition: border-color 0.3s, background 0.3s;
    position: relative; overflow: hidden;
  }
  .exp-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(to right, var(--accent), var(--accent2));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s ease;
  }
  .exp-card:hover { border-color: var(--border2); background: var(--surface2); }
  .exp-card:hover::before { transform: scaleX(1); }
  .exp-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;
  }
  .exp-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600;
  }
  .exp-date {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem; color: var(--accent);
    border: 1px solid var(--border2);
    padding: 0.25rem 0.75rem; border-radius: 100px;
    white-space: nowrap;
  }
  .exp-company {
    font-size: 0.9rem; color: var(--accent2); font-weight: 500;
    margin-bottom: 1.5rem;
  }
  .exp-items { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
  .exp-item {
    display: flex; gap: 0.75rem;
    font-size: 0.9rem; color: var(--text2); line-height: 1.6;
  }
  .exp-item::before {
    content: '→'; color: var(--accent);
    flex-shrink: 0; margin-top: 0.05rem;
  }

  /* SKILLS */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1px;
    border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
  }
  .skill-cat {
    background: var(--surface);
    padding: 1.75rem;
    transition: background 0.3s;
  }
  .skill-cat:hover { background: var(--surface2); }
  .skill-cat-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
  .skill-cat-title {
    font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--text3); margin-bottom: 1rem;
  }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .skill-tag {
    font-size: 0.78rem; color: var(--text2);
    border: 1px solid var(--border);
    padding: 0.2rem 0.65rem; border-radius: 4px;
    transition: all 0.2s;
    font-family: 'JetBrains Mono', monospace;
  }
  .skill-cat:hover .skill-tag {
    border-color: rgba(0,212,255,0.25); color: var(--text);
  }

  /* PROJECTS */
  .projects-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .project-card {
    border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
    background: var(--surface);
    transition: border-color 0.3s, transform 0.3s, background 0.3s;
    cursor: pointer;
  }
  .project-card:hover {
    border-color: var(--border2);
    transform: translateY(-4px);
    background: var(--surface2);
  }
  .project-card-top {
    padding: 2rem;
    border-bottom: 1px solid var(--border);
  }
  .project-card-meta {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1rem;
  }
  .project-icon { font-size: 1.75rem; }
  .project-date {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; color: var(--text3);
  }
  .project-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem; font-weight: 600; margin-bottom: 0.75rem;
  }
  .project-desc { font-size: 0.875rem; color: var(--text2); line-height: 1.6; }
  .project-card-bottom { padding: 1.25rem 2rem; }
  .project-features {
    overflow: hidden;
    max-height: 0; opacity: 0;
    transition: max-height 0.4s ease, opacity 0.3s ease;
    padding-bottom: 0;
  }
  .project-features.open {
    max-height: 300px; opacity: 1;
    padding-bottom: 1rem;
  }
  .project-feature {
    font-size: 0.82rem; color: var(--text2);
    display: flex; gap: 0.6rem; margin-bottom: 0.4rem;
  }
  .project-feature::before { content: '·'; color: var(--accent); flex-shrink: 0; }
  .project-techs { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem; }
  .project-tech {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; color: var(--accent);
    border: 1px solid rgba(0,212,255,0.2);
    padding: 0.18rem 0.6rem; border-radius: 3px;
  }
  .project-toggle {
    font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text3); background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s; padding: 0;
  }
  .project-toggle:hover { color: var(--accent); }

  @media (max-width: 768px) {
    .projects-grid { grid-template-columns: 1fr; }
  }

  /* ACHIEVEMENTS & CERTS */
  .ach-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1.5rem; margin-top: 3rem;
  }
  .ach-card {
    border: 1px solid var(--border);
    border-radius: 12px; padding: 2rem;
    background: var(--surface);
  }
  .ach-card-title {
    font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .ach-card-title::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  .ach-item {
    display: flex; gap: 1rem; align-items: flex-start;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border);
  }
  .ach-item:last-child { border-bottom: none; padding-bottom: 0; }
  .ach-icon { font-size: 1.25rem; flex-shrink: 0; }
  .ach-name { font-size: 0.9rem; font-weight: 500; margin-bottom: 0.2rem; }
  .ach-meta { font-size: 0.78rem; color: var(--text3); }

  @media (max-width: 768px) {
    .ach-grid { grid-template-columns: 1fr; }
  }

  /* EDUCATION */
  .edu-timeline { position: relative; }
  .edu-timeline::before {
    content: ''; position: absolute;
    left: 0; top: 0; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, var(--accent), var(--accent2), transparent);
  }
  .edu-item {
    padding-left: 2.5rem; padding-bottom: 2.5rem;
    position: relative;
  }
  .edu-item:last-child { padding-bottom: 0; }
  .edu-dot {
    position: absolute; left: -5px; top: 6px;
    width: 11px; height: 11px; border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 12px rgba(0,212,255,0.5);
  }
  .edu-card {
    border: 1px solid var(--border); border-radius: 10px;
    padding: 1.75rem;
    background: var(--surface);
    transition: border-color 0.3s;
  }
  .edu-card:hover { border-color: var(--border2); }
  .edu-school {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; margin-bottom: 0.25rem;
  }
  .edu-degree { font-size: 0.875rem; color: var(--text2); margin-bottom: 0.75rem; }
  .edu-meta {
    display: flex; gap: 1.5rem; flex-wrap: wrap;
  }
  .edu-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem; color: var(--accent);
    border: 1px solid var(--border2);
    padding: 0.2rem 0.65rem; border-radius: 4px;
  }
  .edu-grade {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem; color: var(--gold);
    border: 1px solid rgba(232,197,106,0.25);
    padding: 0.2rem 0.65rem; border-radius: 4px;
  }

  /* CONTACT */
  .contact-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
  }
  .contact-card {
    background: var(--surface);
    padding: 2.5rem 2rem;
    text-align: center; text-decoration: none; color: var(--text);
    transition: background 0.3s;
    display: flex; flex-direction: column;
    align-items: center; gap: 1rem;
  }
  .contact-card:hover { background: var(--surface2); }
  .contact-icon { font-size: 2rem; }
  .contact-label {
    font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--text3);
  }
  .contact-value { font-size: 0.875rem; color: var(--accent); }

  @media (max-width: 640px) {
    .contact-grid { grid-template-columns: 1fr; }
  }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border);
    padding: 2.5rem;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem;
  }
  .footer-copy {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem; color: var(--text3);
  }
  .footer-links { display: flex; gap: 1.5rem; }
  .footer-link {
    font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text3); text-decoration: none;
    transition: color 0.2s;
  }
  .footer-link:hover { color: var(--accent); }

  .proj-link-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.08em;
    color: var(--text3); text-decoration: none;
    border: 1px solid var(--border);
    padding: 0.2rem 0.6rem; border-radius: 4px;
    transition: all 0.2s;
  }
  .proj-link-btn:hover { color: var(--text); border-color: var(--border2); }
  .proj-link-live { color: var(--accent); border-color: rgba(0,212,255,0.2); }
  .proj-link-live:hover { background: rgba(0,212,255,0.08); }

  .cert-link-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem; letter-spacing: 0.08em;
    color: var(--accent); text-decoration: none;
    border: 1px solid rgba(0,212,255,0.2);
    padding: 0.15rem 0.55rem; border-radius: 3px;
    white-space: nowrap;
    transition: all 0.2s;
  }
  .cert-link-btn:hover { background: rgba(0,212,255,0.08); }

  /* ANIMATIONS */
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }
`;

const TITLES = ["Full Stack Developer", "AWS Enthusiast", "MERN Stack Expert", "Problem Solver"];

function useTyping(titles) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cur = titles[idx];
    const timeout = setTimeout(() => {
      if (!deleting && text !== cur) setText(cur.slice(0, text.length + 1));
      else if (deleting && text !== "") setText(cur.slice(0, text.length - 1));
      else if (!deleting && text === cur) setTimeout(() => setDeleting(true), 2200);
      else if (deleting && text === "") { setDeleting(false); setIdx(i => (i + 1) % titles.length); }
    }, deleting ? 45 : 130);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, titles]);

  return text;
}

function useCounter(target, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 50;
    const inc = duration / steps;
    const timer = setInterval(() => {
      start++;
      setVal(Math.floor(target * (start / steps)));
      if (start >= steps) clearInterval(timer);
    }, inc);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const typed = useTyping(TITLES);
  const yearsCount = useCounter(3);
  const projectsCount = useCounter(4);
  const certsCount = useCounter(4);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = ["Home", "About", "Training", "Skills", "Projects", "Education", "Contact"];

  const skills = [
    { icon: "⌨️", title: "Programming", tags: ["C++", "Java"] },
    { icon: "🖼", title: "Frontend", tags: ["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind"] },
    { icon: "🗄️", title: "Backend", tags: ["Node.js", "Express.js", "MongoDB", "SQL", "REST API"] },
    { icon: "☁️", title: "Cloud & DevOps", tags: ["AWS", "Git", "GitHub", "Cloud Computing"] },
    { icon: "💡", title: "Soft Skills", tags: ["Problem-Solving", "Adaptability", "Quick Learner", "Innovation"] },
  ];

  const projects = [
    {
      icon: "🏥", name: "SwasthAI – AI-Powered Health & Fitness Platform", date: "Feb 2026",
      desc: "Full-stack MERN application offering AI-generated personalized Indian diet plans based on BMI, age, gender, food preference, and medical conditions. Deployed on Vercel and Render.",
      features: [
        "Integrated Groq AI (LLaMA 3.3 70B) for diet generation, meal swap recommendations, and a context-aware persistent AI fitness coach with session-based chat history",
        "Implemented BMI tracking with history (up to 30 records), calorie tracking (BMR, TDEE, target calories), and daily protein target calculation with per-meal protein display",
        "Secured APIs with JWT authentication, bcryptjs password hashing, rate limiting (100 req/15 min), input validation, and CORS configuration for production",
      ],
      tech: ["React 18", "Vite", "Node.js", "Express", "MongoDB", "Mongoose", "Groq AI", "JWT", "bcryptjs"],
      github: "https://github.com/AryanGupta09/SwasthAIFrontend",
      live: "https://swasth-ai-frontend.vercel.app",
    },
    {
      icon: "🧠", name: "Quizzy – AI-Powered Quiz Platform", date: "2025",
      desc: "Full-stack quiz application with AI-generated questions, global leaderboard, and quiz history review. Deployed on Vercel and Render.",
      features: [
        "Integrated Groq AI (llama-3.1-8b-instant) to dynamically generate 10 unique questions per quiz across 10+ topics and 3 difficulty levels",
        "Implemented global leaderboard, quiz history review, 30-second per-question timer, and AI-generated explanations for incorrect answers",
        "Built with React 19, Node.js, Express 5, and MongoDB Atlas with JWT-based authentication",
      ],
      tech: ["React 19", "Vite", "Node.js", "Express 5", "MongoDB", "Groq SDK", "JWT", "bcryptjs"],
      github: "https://github.com/AryanGupta09/quizzyf",
      live: "https://quizzyf.vercel.app",
    },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo">Aryan<span>.</span></div>
        <div className="nav-links">
          {navItems.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
          ))}
        </div>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(o => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </nav>
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {navItems.map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="nav-mobile-link" onClick={() => setMenuOpen(false)}>{item}</a>
        ))}
      </div>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Available for Opportunities
          </div>
          <h1 className="hero-name">
            Hi, I'm
            <span className="hero-name-highlight">Aryan Gupta</span>
          </h1>
          <div className="hero-typed">
            {typed}<span className="hero-typed-cursor" />
          </div>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Get In Touch →</a>
            <a href="#projects" className="btn-outline">View Projects</a>
          </div>
          <div className="hero-socials">
            {[
              { label: "GitHub", href: "https://github.com/AryanGupta09" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/aryan-gupta45/" },
              { label: "Email", href: "mailto:5guptaaryan10@gmail.com" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hero-social-link">
                <span className="hero-social-line" />{s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <div className="section-wrapper" id="about">
        <section style={{paddingTop: 0, paddingBottom: 0}}>
          <div className="section-label">01 — About</div>
          <h2 className="section-title">Building with purpose,<br/>learning without limits.</h2>
          <div className="about-grid">
            <div className="about-text">
              <p>I'm a Computer Engineering student at Lovely Professional University with a deep passion for full-stack development and cloud computing. I thrive at the intersection of elegant frontend experiences and robust backend systems.</p>
              <p>Currently exploring AI-integrated web applications and expanding my expertise in AWS cloud services. I believe in writing clean, maintainable code and shipping products that solve real problems.</p>
              <p style={{marginTop: "2rem"}}>
                <a href="#contact" className="btn-primary" style={{fontSize:"0.82rem", padding:"0.65rem 1.5rem", display:"inline-flex"}}>Let's work together →</a>
              </p>
            </div>
            <div className="about-stats">
              {[
                { num: yearsCount, label: "Years of Learning" },
                { num: projectsCount, label: "Projects Built" },
                { num: certsCount, label: "Certifications", span: true },
              ].map((s, i) => (
                <div key={i} className="about-stat" style={s.span ? {gridColumn:"span 2"} : {}}>
                  <div className="about-stat-num">{s.num}+</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* EXPERIENCE */}
      <section id="training">
        <div className="section-label">02 — Training</div>
        <h2 className="section-title">Where I've trained.</h2>
        <div className="exp-card">
          <div className="exp-header">
            <div>
              <div className="exp-title">AWS with Cloud Computing</div>
              <div className="exp-company">GokBoru</div>
            </div>
            <span className="exp-date">Jun 2024 – Jul 2024</span>
          </div>
          <ul className="exp-items">
            {[
              "Deployed and hosted a static website on AWS S3, implementing secure bucket policies and optimized content delivery",
              "Developed serverless functions using AWS Lambda to handle automated backend processes and integrated them with other AWS services",
              "Launched and managed EC2 instances for scalable compute, configuring security groups, key pairs, and monitoring with CloudWatch",
              "Ensured high availability, security, and performance by adhering to AWS best practices during deployment",
            ].map((item, i) => (
              <li key={i} className="exp-item">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* SKILLS */}
      <div className="section-wrapper" id="skills">
        <section style={{paddingTop: 0, paddingBottom: 0}}>
          <div className="section-label">03 — Skills</div>
          <h2 className="section-title">Tools & Technologies.</h2>
          <div className="skills-grid">
            {skills.map((cat, i) => (
              <div key={i} className="skill-cat">
                <div className="skill-cat-icon">{cat.icon}</div>
                <div className="skill-cat-title">{cat.title}</div>
                <div className="skill-tags">
                  {cat.tags.map(tag => <span key={tag} className="skill-tag">{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* PROJECTS */}
      <section id="projects">
        <div className="section-label">04 — Projects</div>
        <h2 className="section-title">Things I've built.</h2>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div key={i} className="project-card" onClick={() => setExpandedProject(expandedProject === i ? null : i)}>
              <div className="project-card-top">
                <div className="project-card-meta">
                  <span className="project-icon">{p.icon}</span>
                  <span className="project-date">{p.date}</span>
                </div>
                <div className="project-name">{p.name}</div>
                <div className="project-desc">{p.desc}</div>
              </div>
              <div className="project-card-bottom">
                <div className="project-techs">
                  {p.tech.map(t => <span key={t} className="project-tech">{t}</span>)}
                </div>
                <div className={`project-features${expandedProject === i ? " open" : ""}`}>
                  {p.features.map((f, fi) => <div key={fi} className="project-feature">{f}</div>)}
                </div>
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.5rem"}}>
                  <button className="project-toggle" onClick={e => { e.stopPropagation(); setExpandedProject(expandedProject === i ? null : i); }}>
                    {expandedProject === i ? "↑ Less" : "↓ Details"}
                  </button>
                  <div style={{display:"flex", gap:"0.6rem"}} onClick={e => e.stopPropagation()}>
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="proj-link-btn">GitHub ↗</a>
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="proj-link-btn proj-link-live">Live ↗</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements & Certs */}
        <div className="ach-grid">
          <div className="ach-card">
            <div className="ach-card-title">Achievements</div>
            {[
              { icon: "🥇", name: "Winner — Code-A-Haunt 2.0", meta: "State Level Hackathon · Feb 2025" },
              { icon: "🏅", name: "Top 10 — Prompt Builder", meta: "Hackathon · Jan 2025" },
            ].map((a, i) => (
              <div key={i} className="ach-item">
                <span className="ach-icon">{a.icon}</span>
                <div>
                  <div className="ach-name">{a.name}</div>
                  <div className="ach-meta">{a.meta}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="ach-card">
            <div className="ach-card-title">Certifications</div>
            {[
              { icon: "📜", name: "Hands-on Intro to C++ Programming", meta: "Coursera · Nov 2023", link: "https://drive.google.com/file/d/1WP9oEphU2qkphTuN5dOsvAodugQdi098/view?usp=drive_link" },
              { icon: "📜", name: "AWS Cloud Computing Training", meta: "GokBoru · Jul 2024", link: "https://drive.google.com/file/d/1GMKmmK89e9LngoktdJwwIsnQ9mWPHd2x/view?usp=drive_link" },
              { icon: "📜", name: "GenAI for Everyone", meta: "Fractal · May 2024", link: "https://drive.google.com/file/d/12XDNPhRDafrZFIoZFR17L1tzYZ6IDhBC/view?usp=drive_link" },
              { icon: "📜", name: "Introduction to Internet of Things", meta: "NPTEL · Nov 2025", link: "https://drive.google.com/file/d/1X9kB9ZPjvV47VA1vC0_rI1_rMOYbB84R/view?usp=drive_link" },
            ].map((c, i) => (
              <div key={i} className="ach-item">
                <span className="ach-icon">{c.icon}</span>
                <div style={{flex:1}}>
                  <div className="ach-name">{c.name}</div>
                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.4rem"}}>
                    <div className="ach-meta">{c.meta}</div>
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="cert-link-btn">View ↗</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <div className="section-wrapper" id="education">
        <section style={{paddingTop: 0, paddingBottom: 0}}>
          <div className="section-label">05 — Education</div>
          <h2 className="section-title">Academic background.</h2>
          <div className="edu-timeline">
            {[
              {
                school: "Lovely Professional University",
                degree: "B.E. in Computer Engineering",
                date: "Aug 2022 – Jun 2026",
                grade: "CGPA: 6.73",
              },
              {
                school: "Maharishi Vidya Mandir",
                degree: "Intermediate (Class XII)",
                date: "Apr 2020 – Mar 2021",
                grade: "82.6%",
              },
              {
                school: "Maharishi Vidya Mandir",
                degree: "Matriculation (Class X)",
                date: "Apr 2018 – Mar 2019",
                grade: "84.8%",
              },
            ].map((edu, i) => (
              <div key={i} className="edu-item">
                <div className="edu-dot" />
                <div className="edu-card">
                  <div className="edu-school">{edu.school}</div>
                  <div className="edu-degree">{edu.degree}</div>
                  <div className="edu-meta">
                    <span className="edu-badge">{edu.date}</span>
                    <span className="edu-grade">{edu.grade}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-label">06 — Contact</div>
        <h2 className="section-title">Let's connect.</h2>
        <p style={{color: "var(--text2)", marginBottom: "2.5rem", maxWidth: "500px", lineHeight: 1.7}}>
          I'm always open to new opportunities, collaborations, or just a good conversation about tech.
        </p>
        <div className="contact-grid">
          {[
            { icon: "✉️", label: "Email", value: "5guptaaryan10@gmail.com", href: "mailto:5guptaaryan10@gmail.com" },
            { icon: "📱", label: "Phone", value: "+91 8543882003", href: "tel:+918543882003" },
            { icon: "💼", label: "LinkedIn", value: "aryan-gupta45", href: "https://www.linkedin.com/in/aryan-gupta45/" },
          ].map((c, i) => (
            <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="contact-card">
              <span className="contact-icon">{c.icon}</span>
              <span className="contact-label">{c.label}</span>
              <span className="contact-value">{c.value}</span>
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-copy">© 2026 Aryan Gupta</span>
        <div className="footer-links">
          {[
            { label: "GitHub", href: "https://github.com/AryanGupta09" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/aryan-gupta45/" },
            { label: "Email", href: "mailto:5guptaaryan10@gmail.com" },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="footer-link">{l.label}</a>
          ))}
        </div>
      </footer>
    </>
  );
}