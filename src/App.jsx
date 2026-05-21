import { useState, useEffect, useRef, useCallback } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --border: rgba(255,255,255,0.08);
    --accent: #64ffda;
    --accent2: #7928ca;
    --text: #ccd6f6;
    --text2: #8892b0;
    --font-main: 'Space Grotesk', sans-serif;
    --font-mono: 'Fira Code', monospace;
    --transition: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-main);
    line-height: 1.6;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent2); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    padding: 0 2rem;
    height: 70px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    transition: var(--transition);
  }
  .navbar.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.4); }
  .nav-logo {
    font-family: var(--font-mono);
    font-size: 1.4rem; font-weight: 700;
    color: var(--accent);
    text-decoration: none;
    letter-spacing: 2px;
  }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    color: var(--text2); text-decoration: none;
    font-family: var(--font-mono); font-size: 0.85rem;
    transition: color var(--transition);
    position: relative; padding-bottom: 4px;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 2px; background: var(--accent);
    transition: width var(--transition);
  }
  .nav-links a:hover, .nav-links a.active { color: var(--accent); }
  .nav-links a:hover::after, .nav-links a.active::after { width: 100%; }

  .hamburger {
    display: none; flex-direction: column; gap: 5px;
    background: none; border: none; cursor: pointer; padding: 4px;
  }
  .hamburger span {
    display: block; width: 24px; height: 2px;
    background: var(--accent); border-radius: 2px;
    transition: var(--transition);
  }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .mobile-menu {
    display: none; position: fixed; top: 70px; left: 0; right: 0;
    background: rgba(10,10,15,0.97); backdrop-filter: blur(20px);
    padding: 2rem; z-index: 999;
    border-bottom: 1px solid var(--border);
    flex-direction: column; gap: 1.5rem;
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a {
    color: var(--text2); text-decoration: none;
    font-family: var(--font-mono); font-size: 1rem;
    transition: color var(--transition);
  }
  .mobile-menu a:hover { color: var(--accent); }

  section { padding: 100px 0; }
  .container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }

  .section-title {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700; margin-bottom: 3rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .section-num {
    font-family: var(--font-mono); color: var(--accent);
    font-size: 1rem; font-weight: 400;
  }
  .section-title::after {
    content: ''; flex: 1; height: 1px;
    background: var(--border); max-width: 300px;
  }

  .fade-in {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  /* HERO */
  #hero {
    min-height: 100vh; display: flex; align-items: center;
    position: relative; overflow: hidden;
    padding-top: 70px;
  }
  .hero-canvas {
    position: absolute; inset: 0; z-index: 0;
  }
  .hero-content { position: relative; z-index: 1; }
  .hero-greeting {
    font-family: var(--font-mono); color: var(--accent);
    font-size: 1rem; margin-bottom: 1rem; letter-spacing: 1px;
  }
  .hero-name {
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 700; line-height: 1.1;
    color: #e6f1ff; margin-bottom: 0.5rem;
  }
  .hero-name span { color: var(--accent); }
  .hero-typing {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    color: var(--text2); font-weight: 500;
    min-height: 2.5rem; margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 2px;
  }
  .cursor {
    display: inline-block; width: 3px; height: 1.2em;
    background: var(--accent); animation: blink 1s infinite;
    border-radius: 2px;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .hero-desc {
    color: var(--text2); max-width: 540px;
    font-size: 1rem; margin-bottom: 2.5rem; line-height: 1.8;
  }
  .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 3rem; }
  .btn-primary {
    padding: 0.75rem 1.75rem; background: var(--accent);
    color: #0a0a0f; font-weight: 600; border: none;
    border-radius: 6px; cursor: pointer; font-family: var(--font-mono);
    font-size: 0.9rem; text-decoration: none;
    transition: var(--transition); display: inline-block;
  }
  .btn-primary:hover { background: #4de8c2; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(100,255,218,0.3); }
  .btn-outline {
    padding: 0.75rem 1.75rem; background: transparent;
    color: var(--accent); font-weight: 600;
    border: 1px solid var(--accent); border-radius: 6px;
    cursor: pointer; font-family: var(--font-mono); font-size: 0.9rem;
    text-decoration: none; transition: var(--transition); display: inline-block;
  }
  .btn-outline:hover { background: rgba(100,255,218,0.08); transform: translateY(-2px); }
  .hero-socials { display: flex; gap: 1.25rem; }
  .social-link {
    color: var(--text2); text-decoration: none;
    font-size: 1.3rem; transition: var(--transition);
    display: flex; align-items: center; justify-content: center;
    width: 42px; height: 42px; border: 1px solid var(--border);
    border-radius: 8px;
  }
  .social-link:hover { color: var(--accent); border-color: var(--accent); transform: translateY(-3px); }

  /* ABOUT */
  #about { background: var(--surface); }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .about-text p { color: var(--text2); margin-bottom: 1rem; line-height: 1.9; }
  .about-text p span { color: var(--accent); }
  .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .stat-card {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.5rem; text-align: center;
    transition: var(--transition);
  }
  .stat-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(100,255,218,0.1); }
  .stat-num {
    font-size: 2.5rem; font-weight: 700; color: var(--accent);
    font-family: var(--font-mono); display: block;
  }
  .stat-label { color: var(--text2); font-size: 0.85rem; margin-top: 0.25rem; }

  /* TRAINING */
  .training-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 2rem;
    transition: var(--transition);
  }
  .training-card:hover { border-color: rgba(100,255,218,0.3); box-shadow: 0 8px 40px rgba(100,255,218,0.05); }
  .training-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
  .training-title { font-size: 1.3rem; font-weight: 600; color: var(--text); }
  .training-org { color: var(--accent); font-family: var(--font-mono); font-size: 0.9rem; margin-top: 0.25rem; }
  .training-date {
    font-family: var(--font-mono); font-size: 0.8rem;
    color: var(--text2); background: var(--bg);
    padding: 0.4rem 0.9rem; border-radius: 20px;
    border: 1px solid var(--border); white-space: nowrap;
  }
  .training-bullets { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
  .training-bullets li {
    color: var(--text2); padding-left: 1.5rem; position: relative; line-height: 1.7;
  }
  .training-bullets li::before {
    content: '▹'; position: absolute; left: 0; color: var(--accent);
  }

  /* SKILLS */
  #skills { background: var(--surface); }
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
  .skill-category {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.5rem;
    transition: var(--transition);
  }
  .skill-category:hover { border-color: rgba(100,255,218,0.3); transform: translateY(-4px); }
  .skill-cat-title {
    font-family: var(--font-mono); color: var(--accent);
    font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 1rem;
  }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .skill-tag {
    font-family: var(--font-mono); font-size: 0.78rem;
    color: var(--text2); border: 1px solid var(--border);
    padding: 0.3rem 0.75rem; border-radius: 20px;
    transition: var(--transition); cursor: default;
  }
  .skill-tag:hover { color: var(--accent); border-color: var(--accent); box-shadow: 0 0 10px rgba(100,255,218,0.15); }

  /* PROJECTS */
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap: 2rem; }
  .project-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 2rem;
    transition: var(--transition); cursor: pointer;
  }
  .project-card:hover { border-color: rgba(100,255,218,0.3); box-shadow: 0 12px 40px rgba(100,255,218,0.07); transform: translateY(-4px); }
  .project-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
  .project-icon { font-size: 2.5rem; }
  .project-date { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text2); }
  .project-name { font-size: 1.15rem; font-weight: 600; color: var(--text); margin-bottom: 0.75rem; }
  .project-desc { color: var(--text2); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1rem; }
  .project-expand-btn {
    background: none; border: none; color: var(--accent);
    font-family: var(--font-mono); font-size: 0.82rem;
    cursor: pointer; padding: 0; margin-bottom: 1rem;
    transition: var(--transition);
  }
  .project-expand-btn:hover { color: #4de8c2; }
  .project-features {
    list-style: none; margin-bottom: 1.25rem;
    display: flex; flex-direction: column; gap: 0.6rem;
    overflow: hidden; transition: max-height 0.4s ease;
  }
  .project-features li {
    color: var(--text2); font-size: 0.85rem;
    padding-left: 1.25rem; position: relative; line-height: 1.6;
  }
  .project-features li::before { content: '▹'; position: absolute; left: 0; color: var(--accent); }
  .project-tech { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
  .tech-tag {
    font-family: var(--font-mono); font-size: 0.75rem;
    color: var(--accent); background: rgba(100,255,218,0.07);
    padding: 0.25rem 0.65rem; border-radius: 4px;
  }
  .project-links { display: flex; gap: 1rem; }
  .project-link {
    color: var(--text2); text-decoration: none;
    font-family: var(--font-mono); font-size: 0.82rem;
    display: flex; align-items: center; gap: 0.4rem;
    transition: color var(--transition);
  }
  .project-link:hover { color: var(--accent); }

  /* ACHIEVEMENTS */
  #achievements { background: var(--surface); }
  .achievements-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
  .achievement-card {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.5rem;
    transition: var(--transition);
  }
  .achievement-card:hover { border-color: rgba(100,255,218,0.3); transform: translateY(-4px); }
  .achievement-icon { font-size: 2rem; margin-bottom: 0.75rem; }
  .achievement-title { font-weight: 600; color: var(--text); margin-bottom: 0.25rem; }
  .achievement-sub { color: var(--text2); font-size: 0.85rem; font-family: var(--font-mono); }

  /* CERTIFICATIONS */
  .certs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
  .cert-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.5rem;
    transition: var(--transition); text-decoration: none;
    display: block;
  }
  .cert-card:hover { border-color: rgba(100,255,218,0.3); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(100,255,218,0.08); }
  .cert-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
  .cert-name { font-weight: 600; color: var(--text); font-size: 0.95rem; margin-bottom: 0.4rem; }
  .cert-issuer { color: var(--accent); font-family: var(--font-mono); font-size: 0.8rem; margin-bottom: 0.25rem; }
  .cert-date { color: var(--text2); font-size: 0.78rem; font-family: var(--font-mono); }
  .cert-view { color: var(--accent); font-size: 0.78rem; font-family: var(--font-mono); margin-top: 0.75rem; display: block; }

  /* EDUCATION */
  .timeline { position: relative; padding-left: 2rem; }
  .timeline::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 2px; background: linear-gradient(to bottom, var(--accent), var(--accent2));
    border-radius: 2px;
  }
  .timeline-item { position: relative; margin-bottom: 2.5rem; }
  .timeline-dot {
    position: absolute; left: -2.45rem; top: 0.4rem;
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--accent); border: 3px solid var(--bg);
    box-shadow: 0 0 10px rgba(100,255,218,0.5);
  }
  .timeline-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.5rem;
    transition: var(--transition);
  }
  .timeline-card:hover { border-color: rgba(100,255,218,0.3); transform: translateX(4px); }
  .timeline-school { font-weight: 600; color: var(--text); font-size: 1.05rem; }
  .timeline-degree { color: var(--accent); font-family: var(--font-mono); font-size: 0.85rem; margin: 0.25rem 0; }
  .timeline-meta { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
  .timeline-date, .timeline-grade { color: var(--text2); font-size: 0.82rem; font-family: var(--font-mono); }

  /* CONTACT */
  .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
  .contact-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 2rem; text-align: center;
    transition: var(--transition); text-decoration: none; display: block;
  }
  .contact-card:hover { border-color: rgba(100,255,218,0.3); transform: translateY(-6px); box-shadow: 0 12px 40px rgba(100,255,218,0.08); }
  .contact-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .contact-label { color: var(--text2); font-size: 0.82rem; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
  .contact-value { color: var(--text); font-weight: 500; word-break: break-all; }

  /* FOOTER */
  footer {
    background: var(--surface); border-top: 1px solid var(--border);
    padding: 2rem; text-align: center;
    color: var(--text2); font-family: var(--font-mono); font-size: 0.82rem;
  }
  footer span { color: var(--accent); }

  /* SCROLL TO TOP */
  .scroll-top {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 999;
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--accent); color: #0a0a0f;
    border: none; cursor: pointer; font-size: 1.2rem;
    display: flex; align-items: center; justify-content: center;
    transition: var(--transition); box-shadow: 0 4px 20px rgba(100,255,218,0.3);
    opacity: 0; pointer-events: none;
  }
  .scroll-top.visible { opacity: 1; pointer-events: all; }
  .scroll-top:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(100,255,218,0.4); }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .projects-grid { grid-template-columns: 1fr; }
    .hero-btns { flex-direction: column; align-items: flex-start; }
    section { padding: 70px 0; }
    .about-stats { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .about-stats { grid-template-columns: 1fr; }
    .timeline { padding-left: 1.5rem; }
    .timeline-dot { left: -1.95rem; }
  }
`;

// ─── Data ────────────────────────────────────────────────────────────────────

const TYPING_TITLES = ["Full Stack Developer", "MERN Stack Engineer", "AWS Enthusiast", "Problem Solver"];

const SKILLS = [
  { cat: "Programming", tags: ["C++", "Java"] },
  { cat: "Frontend", tags: ["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind"] },
  { cat: "Backend", tags: ["Node.js", "Express.js", "MongoDB", "SQL", "REST API"] },
  { cat: "Cloud & DevOps", tags: ["AWS", "Git", "GitHub", "Cloud Computing"] },
  { cat: "Soft Skills", tags: ["Problem-Solving", "Adaptability", "Quick Learner", "Innovation"] },
];

const PROJECTS = [
  {
    icon: "🏥",
    name: "SwasthAI – AI-Powered Health & Fitness Platform",
    date: "Feb 2026",
    desc: "Full-stack MERN app with AI-generated personalized Indian diet plans based on BMI, age, gender, food preference, and medical conditions.",
    features: [
      "Groq AI (LLaMA 3.3 70B) for diet generation, meal swap recommendations, and persistent AI fitness coach with session-based chat history",
      "BMI tracking (30 records), calorie tracking (BMR, TDEE, target calories), daily protein target with per-meal display",
      "JWT auth, bcryptjs hashing, rate limiting (100 req/15 min), input validation, CORS for production",
    ],
    tech: ["React 18", "Vite", "Node.js", "Express", "MongoDB", "Groq AI", "JWT", "bcryptjs"],
    github: "https://github.com/AryanGupta09/SwasthAIFrontend",
    live: "https://swasth-ai-frontend.vercel.app",
  },
  {
    icon: "🧠",
    name: "Quizzy – AI-Powered Quiz Platform",
    date: "2025",
    desc: "Full-stack quiz app with AI-generated questions, global leaderboard, quiz history, and 30-second per-question timer.",
    features: [
      "Groq AI (llama-3.1-8b-instant) generates 10 unique questions per quiz across 10+ topics and 3 difficulty levels",
      "Global leaderboard, quiz history review, 30-second timer, AI-generated explanations for wrong answers",
      "React 19, Node.js, Express 5, MongoDB Atlas with JWT authentication",
    ],
    tech: ["React 19", "Vite", "Node.js", "Express 5", "MongoDB", "Groq SDK", "JWT", "bcryptjs"],
    github: "https://github.com/AryanGupta09/quizzyf",
    live: "https://quizzyf.vercel.app",
  },
];

const ACHIEVEMENTS = [
  { icon: "🥇", title: "Winner — Code-A-Haunt 2.0", sub: "State Level Hackathon · Feb 2025" },
  { icon: "🏅", title: "Top 10 — Prompt Builder", sub: "Hackathon · Jan 2025" },
];

const CERTS = [
  { icon: "📜", name: "Hands-on Intro to C++ Programming", issuer: "Coursera", date: "Nov 2023", link: "https://drive.google.com/file/d/1WP9oEphU2qkphTuN5dOsvAodugQdi098/view?usp=drive_link" },
  { icon: "📜", name: "AWS Cloud Computing Training", issuer: "GokBoru", date: "Jul 2024", link: "https://drive.google.com/file/d/1GMKmmK89e9LngoktdJwwIsnQ9mWPHd2x/view?usp=drive_link" },
  { icon: "📜", name: "GenAI for Everyone", issuer: "Fractal", date: "May 2024", link: "https://drive.google.com/file/d/12XDNPhRDafrZFIoZFR17L1tzYZ6IDhBC/view?usp=drive_link" },
  { icon: "📜", name: "Introduction to Internet of Things", issuer: "NPTEL", date: "Nov 2025", link: "https://drive.google.com/file/d/1X9kB9ZPjvV47VA1vC0_rI1_rMOYbB84R/view?usp=drive_link" },
];

const EDUCATION = [
  { school: "Lovely Professional University", degree: "B.E. Computer Engineering", date: "Aug 2022 – Jun 2026", grade: "CGPA: 6.73" },
  { school: "Maharishi Vidya Mandir", degree: "Intermediate (Class XII)", date: "Apr 2020 – Mar 2021", grade: "82.6%" },
  { school: "Maharishi Vidya Mandir", degree: "Matriculation (Class X)", date: "Apr 2018 – Mar 2019", grade: "84.8%" },
];

const TRAINING = {
  title: "AWS with Cloud Computing",
  org: "GokBoru",
  date: "Jun 2024 – Jul 2024",
  bullets: [
    "Deployed static website on AWS S3 with secure bucket policies and optimized content delivery",
    "Built serverless functions with AWS Lambda integrated with other AWS services",
    "Managed EC2 instances with security groups, key pairs, and CloudWatch monitoring",
    "Ensured high availability and security following AWS best practices",
  ],
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useTyping(words, speed = 90, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

function useCounter(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── ParticleCanvas ──────────────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100,255,218,0.25)";
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100,255,218,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [expandedProject, setExpandedProject] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const typedText = useTyping(TYPING_TITLES);
  useScrollReveal();

  const years = useCounter(3, 1200, statsVisible);
  const projects = useCounter(4, 1200, statsVisible);
  const certs = useCounter(4, 1200, statsVisible);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 400);

      const sections = ["hero", "about", "training", "skills", "projects", "achievements", "certifications", "education", "contact"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { id: "about", label: "About" },
    { id: "training", label: "Training" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "achievements", label: "Achievements" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <style>{CSS}</style>

      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <a href="#hero" className="nav-logo" onClick={e => { e.preventDefault(); scrollTo("hero"); }}>AG</a>
        <ul className="nav-links">
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeSection === id ? "active" : ""}
                onClick={e => { e.preventDefault(); scrollTo(id); }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks.map(({ id, label }) => (
          <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{label}</a>
        ))}
      </div>

      {/* HERO */}
      <section id="hero">
        <ParticleCanvas />
        <div className="container">
          <div className="hero-content">
            <p className="hero-greeting fade-in">Hi, my name is</p>
            <h1 className="hero-name fade-in">
              Aryan <span>Gupta</span>
            </h1>
            <div className="hero-typing fade-in">
              <span>{typedText}</span>
              <span className="cursor" />
            </div>
            <p className="hero-desc fade-in">
              I build full-stack web applications with modern technologies. Passionate about creating
              scalable, user-friendly products and exploring the intersection of AI and web development.
            </p>
            <div className="hero-btns fade-in">
              <a href="#contact" className="btn-primary" onClick={e => { e.preventDefault(); scrollTo("contact"); }}>
                Get In Touch
              </a>
              <a href="#projects" className="btn-outline" onClick={e => { e.preventDefault(); scrollTo("projects"); }}>
                View Work
              </a>
            </div>
            <div className="hero-socials fade-in">
              <a href="https://github.com/AryanGupta09" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub">
                <GithubIcon />
              </a>
              <a href="https://www.linkedin.com/in/aryan-gupta45/" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
              <a href="mailto:5guptaaryan10@gmail.com" className="social-link" aria-label="Email">
                <EmailIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="container">
          <h2 className="section-title fade-in">
            <span className="section-num">01.</span> About Me
          </h2>
          <div className="about-grid">
            <div className="about-text fade-in">
              <p>
                I&apos;m a <span>Computer Engineering student</span> at Lovely Professional University,
                passionate about building impactful web applications. I specialize in the{" "}
                <span>MERN stack</span> and love integrating AI capabilities into real-world products.
              </p>
              <p>
                My journey started with competitive programming in <span>C++ and Java</span>, which
                gave me a strong foundation in problem-solving. I then moved into full-stack development,
                building projects that combine modern frontend frameworks with robust backend architectures.
              </p>
              <p>
                I&apos;m also an <span>AWS enthusiast</span> — having completed hands-on cloud training
                and earned certifications in cloud computing, GenAI, and IoT. I enjoy learning new
                technologies and applying them to solve real problems.
              </p>
            </div>
            <div ref={statsRef} className="about-stats fade-in">
              <div className="stat-card">
                <span className="stat-num">{years}+</span>
                <span className="stat-label">Years of Coding</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">{projects}+</span>
                <span className="stat-label">Projects Built</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">{certs}+</span>
                <span className="stat-label">Certifications</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">2</span>
                <span className="stat-label">Hackathon Awards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAINING */}
      <section id="training">
        <div className="container">
          <h2 className="section-title fade-in">
            <span className="section-num">02.</span> Training
          </h2>
          <div className="training-card fade-in">
            <div className="training-header">
              <div>
                <div className="training-title">{TRAINING.title}</div>
                <div className="training-org">{TRAINING.org}</div>
              </div>
              <span className="training-date">{TRAINING.date}</span>
            </div>
            <ul className="training-bullets">
              {TRAINING.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="container">
          <h2 className="section-title fade-in">
            <span className="section-num">03.</span> Skills
          </h2>
          <div className="skills-grid">
            {SKILLS.map(({ cat, tags }) => (
              <div key={cat} className="skill-category fade-in">
                <div className="skill-cat-title">{cat}</div>
                <div className="skill-tags">
                  {tags.map(tag => (
                    <span key={tag} className="skill-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="container">
          <h2 className="section-title fade-in">
            <span className="section-num">04.</span> Projects
          </h2>
          <div className="projects-grid">
            {PROJECTS.map((p, i) => {
              const isExpanded = expandedProject === i;
              return (
                <div key={i} className="project-card fade-in">
                  <div className="project-top">
                    <span className="project-icon">{p.icon}</span>
                    <span className="project-date">{p.date}</span>
                  </div>
                  <div className="project-name">{p.name}</div>
                  <p className="project-desc">{p.desc}</p>
                  <button
                    className="project-expand-btn"
                    onClick={() => setExpandedProject(isExpanded ? null : i)}
                  >
                    {isExpanded ? "▲ Show less" : "▼ Show features"}
                  </button>
                  {isExpanded && (
                    <ul className="project-features">
                      {p.features.map((f, fi) => (
                        <li key={fi}>{f}</li>
                      ))}
                    </ul>
                  )}
                  <div className="project-tech">
                    {p.tech.map(t => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={p.github} target="_blank" rel="noreferrer" className="project-link">
                      <GithubIcon /> GitHub
                    </a>
                    <a href={p.live} target="_blank" rel="noreferrer" className="project-link">
                      <ExternalIcon /> Live Demo
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements">
        <div className="container">
          <h2 className="section-title fade-in">
            <span className="section-num">05.</span> Achievements
          </h2>
          <div className="achievements-grid">
            {ACHIEVEMENTS.map((a, i) => (
              <div key={i} className="achievement-card fade-in">
                <div className="achievement-icon">{a.icon}</div>
                <div className="achievement-title">{a.title}</div>
                <div className="achievement-sub">{a.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications">
        <div className="container">
          <h2 className="section-title fade-in">
            <span className="section-num">06.</span> Certifications
          </h2>
          <div className="certs-grid">
            {CERTS.map((c, i) => (
              <a key={i} href={c.link} target="_blank" rel="noreferrer" className="cert-card fade-in">
                <div className="cert-icon">{c.icon}</div>
                <div className="cert-name">{c.name}</div>
                <div className="cert-issuer">{c.issuer}</div>
                <div className="cert-date">{c.date}</div>
                <span className="cert-view">View Certificate →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education">
        <div className="container">
          <h2 className="section-title fade-in">
            <span className="section-num">07.</span> Education
          </h2>
          <div className="timeline fade-in">
            {EDUCATION.map((e, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <div className="timeline-school">{e.school}</div>
                  <div className="timeline-degree">{e.degree}</div>
                  <div className="timeline-meta">
                    <span className="timeline-date">📅 {e.date}</span>
                    <span className="timeline-grade">🎓 {e.grade}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="container">
          <h2 className="section-title fade-in">
            <span className="section-num">08.</span> Contact
          </h2>
          <div className="contact-grid">
            <a href="mailto:5guptaaryan10@gmail.com" className="contact-card fade-in">
              <div className="contact-icon">
                <EmailIcon />
              </div>
              <div className="contact-label">Email</div>
              <div className="contact-value">5guptaaryan10@gmail.com</div>
            </a>
            <a href="tel:+918543882003" className="contact-card fade-in">
              <div className="contact-icon">
                <PhoneIcon />
              </div>
              <div className="contact-label">Phone</div>
              <div className="contact-value">+91 8543882003</div>
            </a>
            <a href="https://www.linkedin.com/in/aryan-gupta45/" target="_blank" rel="noreferrer" className="contact-card fade-in">
              <div className="contact-icon">
                <LinkedinIcon />
              </div>
              <div className="contact-label">LinkedIn</div>
              <div className="contact-value">aryan-gupta45</div>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>Designed &amp; Built by <span>Aryan Gupta</span></p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}>
          Built with <span>React</span> · {new Date().getFullYear()}
        </p>
      </footer>

      {/* SCROLL TO TOP */}
      <button
        className={`scroll-top${showScrollTop ? " visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </>
  );
}
