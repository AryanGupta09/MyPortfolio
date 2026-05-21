import { useState, useEffect, useRef } from "react";

// ─── CSS ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #050A14;
    --bg2:     #080E1A;
    --bg3:     #0C1220;
    --surface: rgba(255,255,255,0.03);
    --surface2:rgba(255,255,255,0.06);
    --border:  rgba(255,255,255,0.07);
    --border2: rgba(0,212,255,0.3);
    --cyan:    #00D4FF;
    --purple:  #7C3AED;
    --gold:    #F59E0B;
    --text:    #F0F6FF;
    --text2:   #8A9BB8;
    --text3:   #3D4F6B;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: linear-gradient(var(--cyan), var(--purple)); border-radius: 2px; }

  /* ── SCROLL REVEAL ── */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left  { opacity:0; transform:translateX(-40px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
  .reveal-left.visible  { opacity:1; transform:translateX(0); }
  .reveal-right { opacity:0; transform:translateX(40px);  transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
  .reveal-right.visible { opacity:1; transform:translateX(0); }

  /* ── NAVBAR ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    height: 68px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2.5rem;
    background: rgba(5,10,20,0.6);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid var(--border);
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .nav.scrolled {
    background: rgba(5,10,20,0.92);
    border-bottom-color: rgba(0,212,255,0.15);
    box-shadow: 0 4px 40px rgba(0,0,0,0.4);
  }
  .nav-logo {
    font-family: 'Orbitron', monospace;
    font-size: 1.3rem; font-weight: 900;
    letter-spacing: 0.08em;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    cursor: pointer;
  }
  .nav-links { display: flex; gap: 0.2rem; }
  .nav-link {
    font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text2);
    padding: 0.45rem 0.9rem;
    border-radius: 6px;
    text-decoration: none;
    position: relative;
    transition: color 0.25s;
  }
  .nav-link::after {
    content: '';
    position: absolute; bottom: 4px; left: 50%; right: 50%;
    height: 1px; background: var(--cyan);
    transition: left 0.3s cubic-bezier(0.16,1,0.3,1), right 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .nav-link:hover, .nav-link.active { color: var(--cyan); }
  .nav-link:hover::after, .nav-link.active::after { left: 12px; right: 12px; }
  .nav-mobile-btn {
    display: none; background: none; border: none;
    cursor: pointer; color: var(--text); padding: 0.5rem;
  }
  .nav-mobile-menu {
    display: none;
    position: fixed; top: 68px; left: 0; right: 0;
    background: rgba(5,10,20,0.97);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border);
    padding: 1rem;
    flex-direction: column; gap: 0.25rem;
    z-index: 999;
  }
  .nav-mobile-menu.open { display: flex; }
  .nav-mobile-link {
    display: block; font-size: 0.85rem;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text2); text-decoration: none;
    padding: 0.8rem 1rem; border-radius: 8px;
    transition: all 0.2s;
  }
  .nav-mobile-link:hover { color: var(--cyan); background: rgba(0,212,255,0.06); }
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .nav-mobile-btn { display: block; }
  }

  /* ── CANVAS ── */
  #particle-canvas {
    position: fixed; inset: 0; z-index: 0;
    pointer-events: none;
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    padding: 100px 2rem 2rem;
  }
  .hero-orb {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none;
  }
  .hero-orb-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%);
    top: -100px; left: -100px;
    animation: orbFloat1 8s ease-in-out infinite;
  }
  .hero-orb-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%);
    bottom: -50px; right: -50px;
    animation: orbFloat2 10s ease-in-out infinite;
  }
  .hero-orb-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%,-50%);
    animation: orbFloat3 12s ease-in-out infinite;
  }
  .hero-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
  }
  .hero-content {
    position: relative; z-index: 1;
    text-align: center; max-width: 900px;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--cyan);
    border: 1px solid rgba(0,212,255,0.25);
    background: rgba(0,212,255,0.05);
    padding: 0.45rem 1.2rem; border-radius: 100px;
    margin-bottom: 2.5rem;
    animation: fadeSlideDown 0.9s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .hero-badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--cyan);
    box-shadow: 0 0 8px var(--cyan);
    animation: pulse 2s ease-in-out infinite;
  }
  .hero-name {
    font-family: 'Orbitron', monospace;
    font-size: clamp(2.8rem, 8vw, 6.5rem);
    font-weight: 900; line-height: 1.05;
    letter-spacing: -0.01em;
    margin-bottom: 0.5rem;
    animation: fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }
  .hero-name-sub { color: var(--text2); font-size: 0.45em; display: block; margin-bottom: 0.3em; letter-spacing: 0.1em; }
  .hero-name-main {
    display: block;
    background: linear-gradient(135deg, #fff 0%, var(--cyan) 40%, var(--purple) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 30px rgba(0,212,255,0.3));
  }
  .hero-typed-wrap {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(0.9rem, 2.2vw, 1.15rem);
    color: var(--text2); letter-spacing: 0.04em;
    height: 2.2rem; margin-bottom: 3rem;
    animation: fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both;
  }
  .hero-typed-prefix { color: var(--cyan); margin-right: 0.5rem; }
  .hero-typed-cursor {
    display: inline-block; width: 2px; height: 1.1em;
    background: var(--cyan); margin-left: 2px;
    animation: blink 1s step-end infinite;
    vertical-align: text-bottom;
    box-shadow: 0 0 8px var(--cyan);
  }
  .hero-actions {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    margin-bottom: 4rem;
    animation: fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both;
  }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    color: #fff; font-size: 0.85rem; font-weight: 600;
    letter-spacing: 0.05em; padding: 0.85rem 2.2rem;
    border-radius: 8px; text-decoration: none;
    position: relative; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s;
    box-shadow: 0 0 30px rgba(0,212,255,0.2), 0 0 60px rgba(124,58,237,0.1);
  }
  .btn-primary::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 40px rgba(0,212,255,0.35), 0 8px 60px rgba(124,58,237,0.2); }
  .btn-primary:hover::before { opacity: 1; }
  .btn-outline {
    display: inline-flex; align-items: center; gap: 0.5rem;
    border: 1px solid rgba(0,212,255,0.3); color: var(--text);
    font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em;
    padding: 0.85rem 2.2rem; border-radius: 8px; text-decoration: none;
    background: rgba(0,212,255,0.03);
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .btn-outline:hover {
    border-color: var(--cyan); color: var(--cyan);
    background: rgba(0,212,255,0.08);
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0,212,255,0.15);
  }
  .hero-socials {
    display: flex; gap: 2rem; justify-content: center;
    animation: fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both;
  }
  .hero-social-link {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text3); text-decoration: none;
    transition: color 0.25s;
  }
  .hero-social-link:hover { color: var(--cyan); }
  .hero-social-line { width: 24px; height: 1px; background: currentColor; transition: width 0.3s cubic-bezier(0.16,1,0.3,1); }
  .hero-social-link:hover .hero-social-line { width: 44px; }
  .hero-scroll-indicator {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    animation: fadeSlideUp 1s cubic-bezier(0.16,1,0.3,1) 0.8s both;
  }
  .hero-scroll-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--text3);
  }
  .hero-scroll-arrow {
    width: 20px; height: 20px; color: var(--cyan);
    animation: bounceDown 2s ease-in-out infinite;
  }

  /* ── SECTIONS ── */
  .section-outer { position: relative; z-index: 1; }
  .section-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 7rem 2rem;
  }
  .section-inner-alt {
    max-width: 1100px; margin: 0 auto;
    padding: 7rem 2rem;
    background: transparent;
  }
  .section-bg { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .section-label {
    display: flex; align-items: center; gap: 1rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--cyan); margin-bottom: 1rem;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(to right, rgba(0,212,255,0.3), transparent);
  }
  .section-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700; line-height: 1.15;
    letter-spacing: -0.01em;
    margin-bottom: 3.5rem;
  }
  .section-title span {
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* ── ABOUT ── */
  .about-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: start;
  }
  .about-text { font-size: 1rem; line-height: 1.85; color: var(--text2); font-weight: 300; }
  .about-text p + p { margin-top: 1.25rem; }
  .about-stats {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1px; border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .about-stat {
    background: var(--surface);
    padding: 2rem 1.5rem;
    transition: background 0.3s;
    position: relative; overflow: hidden;
  }
  .about-stat::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,212,255,0.05), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .about-stat:hover { background: var(--surface2); }
  .about-stat:hover::before { opacity: 1; }
  .about-stat:nth-child(3) { grid-column: span 2; }
  .about-stat-num {
    font-family: 'Orbitron', monospace;
    font-size: 2.8rem; font-weight: 900;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1;
  }
  .about-stat-label {
    font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text3); margin-top: 0.5rem;
  }
  @media (max-width: 768px) {
    .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .about-stat:nth-child(3) { grid-column: span 1; }
  }

  /* ── TRAINING ── */
  .exp-card {
    border: 1px solid var(--border);
    border-radius: 16px; padding: 2.5rem;
    background: var(--surface);
    position: relative; overflow: hidden;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .exp-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--cyan), var(--purple), var(--gold));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  .exp-card:hover { border-color: rgba(0,212,255,0.2); box-shadow: 0 8px 40px rgba(0,0,0,0.3); }
  .exp-card:hover::before { transform: scaleX(1); }
  .exp-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;
  }
  .exp-title {
    font-family: 'Orbitron', monospace;
    font-size: 1.3rem; font-weight: 700;
    background: linear-gradient(135deg, var(--text), var(--cyan));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .exp-date {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; color: var(--cyan);
    border: 1px solid rgba(0,212,255,0.25);
    padding: 0.3rem 0.85rem; border-radius: 100px;
    white-space: nowrap;
    background: rgba(0,212,255,0.05);
  }
  .exp-company { font-size: 0.9rem; color: var(--purple); font-weight: 500; margin-top: 0.25rem; }
  .exp-items { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; }
  .exp-item {
    display: flex; gap: 0.85rem;
    font-size: 0.9rem; color: var(--text2); line-height: 1.65;
  }
  .exp-item::before {
    content: '▸'; color: var(--cyan); flex-shrink: 0; margin-top: 0.05rem;
    font-size: 0.75rem;
  }

  /* ── SKILLS ── */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 1px; border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .skill-cat {
    background: var(--surface);
    padding: 2rem;
    transition: background 0.3s;
    position: relative; overflow: hidden;
  }
  .skill-cat::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,212,255,0.04), rgba(124,58,237,0.04));
    opacity: 0; transition: opacity 0.4s;
  }
  .skill-cat:hover { background: var(--surface2); }
  .skill-cat:hover::after { opacity: 1; }
  .skill-cat-icon { font-size: 1.6rem; margin-bottom: 0.85rem; }
  .skill-cat-title {
    font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--text3); margin-bottom: 1.1rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .skill-tag {
    font-size: 0.75rem; color: var(--text2);
    border: 1px solid var(--border);
    padding: 0.22rem 0.7rem; border-radius: 6px;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    font-family: 'JetBrains Mono', monospace;
    position: relative; overflow: hidden;
    cursor: default;
  }
  .skill-tag::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.1));
    opacity: 0; transition: opacity 0.25s;
  }
  .skill-tag:hover {
    border-color: rgba(0,212,255,0.4);
    color: var(--cyan);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,212,255,0.15);
  }
  .skill-tag:hover::before { opacity: 1; }

  /* shimmer on skill-cat hover */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .skill-cat:hover .skill-cat-title {
    background: linear-gradient(90deg, var(--text3) 0%, var(--cyan) 50%, var(--text3) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: shimmer 1.5s linear infinite;
  }

  /* ── PROJECTS ── */
  .projects-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .project-card {
    border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
    background: var(--surface);
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, border-color 0.3s;
    cursor: pointer; position: relative;
  }
  .project-card::before {
    content: ''; position: absolute; inset: -1px;
    border-radius: 17px;
    background: linear-gradient(135deg, var(--cyan), var(--purple), var(--gold));
    opacity: 0;
    transition: opacity 0.4s;
    z-index: -1;
  }
  .project-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); border-color: transparent; }
  .project-card:hover::before { opacity: 0.6; }
  .project-card-top { padding: 2rem; border-bottom: 1px solid var(--border); }
  .project-card-meta {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1rem;
  }
  .project-icon { font-size: 2rem; }
  .project-date {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem; color: var(--text3);
    border: 1px solid var(--border);
    padding: 0.2rem 0.6rem; border-radius: 4px;
  }
  .project-name {
    font-family: 'Orbitron', monospace;
    font-size: 1.05rem; font-weight: 700; margin-bottom: 0.75rem;
    line-height: 1.3;
  }
  .project-desc { font-size: 0.875rem; color: var(--text2); line-height: 1.65; }
  .project-card-bottom { padding: 1.5rem 2rem; }
  .project-features {
    overflow: hidden; max-height: 0; opacity: 0;
    transition: max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s;
  }
  .project-features.open { max-height: 400px; opacity: 1; padding-bottom: 1rem; }
  .project-feature {
    font-size: 0.82rem; color: var(--text2);
    display: flex; gap: 0.65rem; margin-bottom: 0.5rem; line-height: 1.6;
  }
  .project-feature::before { content: '◆'; color: var(--cyan); flex-shrink: 0; font-size: 0.5rem; margin-top: 0.35rem; }
  .project-techs { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
  .project-tech {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem; color: var(--cyan);
    border: 1px solid rgba(0,212,255,0.2);
    padding: 0.2rem 0.65rem; border-radius: 4px;
    background: rgba(0,212,255,0.04);
    transition: all 0.2s;
  }
  .project-tech:hover { background: rgba(0,212,255,0.1); border-color: rgba(0,212,255,0.4); }
  .project-toggle {
    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text3); background: none; border: none; cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    transition: color 0.2s; padding: 0;
  }
  .project-toggle:hover { color: var(--cyan); }
  .proj-link-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.08em;
    color: var(--text3); text-decoration: none;
    border: 1px solid var(--border);
    padding: 0.25rem 0.7rem; border-radius: 5px;
    transition: all 0.25s;
  }
  .proj-link-btn:hover { color: var(--text); border-color: rgba(0,212,255,0.3); }
  .proj-link-live { color: var(--cyan); border-color: rgba(0,212,255,0.25); background: rgba(0,212,255,0.04); }
  .proj-link-live:hover { background: rgba(0,212,255,0.1); box-shadow: 0 0 15px rgba(0,212,255,0.2); }
  @media (max-width: 768px) { .projects-grid { grid-template-columns: 1fr; } }

  /* ── ACHIEVEMENTS & CERTS ── */
  .ach-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1.5rem; margin-top: 3rem;
  }
  .ach-card {
    border: 1px solid var(--border); border-radius: 16px;
    padding: 2rem; background: var(--surface);
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .ach-card:hover { border-color: rgba(0,212,255,0.15); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
  .ach-card-title {
    font-size: 0.68rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--cyan); margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .ach-card-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .ach-item {
    display: flex; gap: 1rem; align-items: flex-start;
    padding: 1rem 0; border-bottom: 1px solid var(--border);
    transition: padding-left 0.3s;
  }
  .ach-item:hover { padding-left: 0.5rem; }
  .ach-item:last-child { border-bottom: none; padding-bottom: 0; }
  .ach-icon { font-size: 1.3rem; flex-shrink: 0; }
  .ach-name { font-size: 0.9rem; font-weight: 500; margin-bottom: 0.25rem; }
  .ach-meta { font-size: 0.78rem; color: var(--text3); }
  .cert-link-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.67rem; letter-spacing: 0.08em;
    color: var(--cyan); text-decoration: none;
    border: 1px solid rgba(0,212,255,0.2);
    padding: 0.18rem 0.55rem; border-radius: 4px;
    white-space: nowrap; transition: all 0.2s;
    background: rgba(0,212,255,0.03);
  }
  .cert-link-btn:hover { background: rgba(0,212,255,0.1); box-shadow: 0 0 10px rgba(0,212,255,0.2); }
  @media (max-width: 768px) { .ach-grid { grid-template-columns: 1fr; } }

  /* ── EDUCATION TIMELINE ── */
  .edu-timeline { position: relative; padding-left: 0; }
  .edu-timeline-line {
    position: absolute; left: 10px; top: 0; bottom: 0; width: 2px;
    background: linear-gradient(to bottom, var(--cyan), var(--purple), transparent);
    transform-origin: top;
    animation: drawLine 1.5s cubic-bezier(0.16,1,0.3,1) 0.3s both;
  }
  .edu-item {
    padding-left: 3rem; padding-bottom: 2.5rem;
    position: relative;
  }
  .edu-item:last-child { padding-bottom: 0; }
  .edu-dot {
    position: absolute; left: 4px; top: 8px;
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--bg);
    border: 2px solid var(--cyan);
    box-shadow: 0 0 0 4px rgba(0,212,255,0.1), 0 0 20px rgba(0,212,255,0.4);
    transition: box-shadow 0.3s, transform 0.3s;
  }
  .edu-item:hover .edu-dot {
    box-shadow: 0 0 0 6px rgba(0,212,255,0.15), 0 0 30px rgba(0,212,255,0.6);
    transform: scale(1.2);
  }
  .edu-card {
    border: 1px solid var(--border); border-radius: 12px;
    padding: 1.75rem; background: var(--surface);
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  }
  .edu-card:hover {
    border-color: rgba(0,212,255,0.2);
    transform: translateX(6px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  }
  .edu-school {
    font-family: 'Orbitron', monospace;
    font-size: 1.1rem; font-weight: 700; margin-bottom: 0.3rem;
  }
  .edu-degree { font-size: 0.875rem; color: var(--text2); margin-bottom: 0.85rem; }
  .edu-meta { display: flex; gap: 1rem; flex-wrap: wrap; }
  .edu-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; color: var(--cyan);
    border: 1px solid rgba(0,212,255,0.25);
    padding: 0.22rem 0.7rem; border-radius: 5px;
    background: rgba(0,212,255,0.04);
  }
  .edu-grade {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; color: var(--gold);
    border: 1px solid rgba(245,158,11,0.25);
    padding: 0.22rem 0.7rem; border-radius: 5px;
    background: rgba(245,158,11,0.04);
  }

  /* ── CONTACT ── */
  .contact-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .contact-card {
    background: var(--surface);
    padding: 2.5rem 2rem;
    text-align: center; text-decoration: none; color: var(--text);
    transition: background 0.3s;
    display: flex; flex-direction: column;
    align-items: center; gap: 1rem;
    position: relative; overflow: hidden;
  }
  .contact-card::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at center, rgba(0,212,255,0.08), transparent 70%);
    opacity: 0; transition: opacity 0.4s;
  }
  .contact-card:hover { background: var(--surface2); }
  .contact-card:hover::before { opacity: 1; }
  .contact-icon {
    font-size: 2.2rem;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), filter 0.4s;
  }
  .contact-card:hover .contact-icon {
    transform: scale(1.2) translateY(-4px);
    filter: drop-shadow(0 0 12px rgba(0,212,255,0.5));
  }
  .contact-label {
    font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--text3); font-family: 'JetBrains Mono', monospace;
  }
  .contact-value { font-size: 0.875rem; color: var(--cyan); }
  @media (max-width: 640px) { .contact-grid { grid-template-columns: 1fr; } }

  /* ── FOOTER ── */
  .footer {
    border-top: 1px solid var(--border);
    padding: 2.5rem;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem;
    position: relative; z-index: 1;
  }
  .footer-copy {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    background: linear-gradient(135deg, var(--text3), var(--cyan));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .footer-links { display: flex; gap: 1.5rem; }
  .footer-link {
    font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text3); text-decoration: none;
    transition: color 0.2s;
    font-family: 'JetBrains Mono', monospace;
  }
  .footer-link:hover { color: var(--cyan); }

  /* ── SCROLL TO TOP ── */
  .scroll-top {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 500;
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    border: none; cursor: pointer; color: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(0,212,255,0.3);
    opacity: 0; transform: translateY(20px) scale(0.8);
    transition: opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  .scroll-top.visible {
    opacity: 1; transform: translateY(0) scale(1);
    pointer-events: auto;
  }
  .scroll-top:hover { transform: translateY(-4px) scale(1.1); box-shadow: 0 8px 30px rgba(0,212,255,0.4); }

  /* ── KEYFRAMES ── */
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px var(--cyan); }
    50%       { opacity: 0.6; transform: scale(0.8); box-shadow: 0 0 4px var(--cyan); }
  }
  @keyframes orbFloat1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(40px, -30px) scale(1.05); }
    66%       { transform: translate(-20px, 20px) scale(0.95); }
  }
  @keyframes orbFloat2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(-50px, 30px) scale(1.08); }
    66%       { transform: translate(30px, -20px) scale(0.92); }
  }
  @keyframes orbFloat3 {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50%       { transform: translate(-50%, -50%) scale(1.3); }
  }
  @keyframes bounceDown {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(8px); }
  }
  @keyframes drawLine {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const TITLES = ["Full Stack Developer", "AWS Enthusiast", "MERN Stack Expert", "Problem Solver"];

const NAV_ITEMS = ["Home", "About", "Training", "Skills", "Projects", "Education", "Contact"];

const SKILLS = [
  { icon: "⌨️", title: "Programming",   tags: ["C++", "Java"] },
  { icon: "🖼",  title: "Frontend",      tags: ["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind"] },
  { icon: "🗄️", title: "Backend",       tags: ["Node.js", "Express.js", "MongoDB", "SQL", "REST API"] },
  { icon: "☁️", title: "Cloud & DevOps",tags: ["AWS", "Git", "GitHub", "Cloud Computing"] },
  { icon: "💡", title: "Soft Skills",   tags: ["Problem-Solving", "Adaptability", "Quick Learner", "Innovation"] },
];

const PROJECTS = [
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

const ACHIEVEMENTS = [
  { icon: "🥇", name: "Winner — Code-A-Haunt 2.0", meta: "State Level Hackathon · Feb 2025" },
  { icon: "🏅", name: "Top 10 — Prompt Builder",   meta: "Hackathon · Jan 2025" },
];

const CERTS = [
  { icon: "📜", name: "Hands-on Intro to C++ Programming",   meta: "Coursera · Nov 2023", link: "https://drive.google.com/file/d/1WP9oEphU2qkphTuN5dOsvAodugQdi098/view?usp=drive_link" },
  { icon: "📜", name: "AWS Cloud Computing Training",         meta: "GokBoru · Jul 2024",  link: "https://drive.google.com/file/d/1GMKmmK89e9LngoktdJwwIsnQ9mWPHd2x/view?usp=drive_link" },
  { icon: "📜", name: "GenAI for Everyone",                   meta: "Fractal · May 2024",  link: "https://drive.google.com/file/d/12XDNPhRDafrZFIoZFR17L1tzYZ6IDhBC/view?usp=drive_link" },
  { icon: "📜", name: "Introduction to Internet of Things",   meta: "NPTEL · Nov 2025",    link: "https://drive.google.com/file/d/1X9kB9ZPjvV47VA1vC0_rI1_rMOYbB84R/view?usp=drive_link" },
];

const EDUCATION = [
  { school: "Lovely Professional University", degree: "B.E. in Computer Engineering", date: "Aug 2022 – Jun 2026", grade: "CGPA: 6.73" },
  { school: "Maharishi Vidya Mandir",         degree: "Intermediate (Class XII)",      date: "Apr 2020 – Mar 2021", grade: "82.6%" },
  { school: "Maharishi Vidya Mandir",         degree: "Matriculation (Class X)",       date: "Apr 2018 – Mar 2019", grade: "84.8%" },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useTyping(titles) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cur = titles[idx];
    const timeout = setTimeout(() => {
      if (!deleting && text !== cur)       setText(cur.slice(0, text.length + 1));
      else if (deleting && text !== "")    setText(cur.slice(0, text.length - 1));
      else if (!deleting && text === cur)  setTimeout(() => setDeleting(true), 2200);
      else if (deleting && text === "")    { setDeleting(false); setIdx(i => (i + 1) % titles.length); }
    }, deleting ? 45 : 130);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, titles]);

  return text;
}

function useCounter(target, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let step = 0;
    const steps = 50;
    const timer = setInterval(() => {
      step++;
      setVal(Math.floor(target * (step / steps)));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

// ─── PARTICLE CANVAS ─────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 60 particles
    const particles = Array.from({ length: 60 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // move
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      // connect lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,212,255,0.35)";
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled,         setScrolled]         = useState(false);
  const [showScrollTop,    setShowScrollTop]     = useState(false);
  const [menuOpen,         setMenuOpen]          = useState(false);
  const [activeSection,    setActiveSection]     = useState("home");
  const [expandedProject,  setExpandedProject]   = useState(null);

  const typed        = useTyping(TITLES);
  const yearsCount   = useCounter(3);
  const projCount    = useCounter(4);
  const certsCount   = useCounter(4);

  useReveal();

  // scroll listener
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setShowScrollTop(y > 400);

      // active nav section
      const sections = NAV_ITEMS.map(n => n.toLowerCase());
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <ParticleCanvas />

      {/* ── NAVBAR ── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo">AG.</div>
        <div className="nav-links">
          {NAV_ITEMS.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`nav-link${activeSection === item.toLowerCase() ? " active" : ""}`}
            >
              {item}
            </a>
          ))}
        </div>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_ITEMS.map(item => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="nav-mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section id="home" className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid-bg" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Available for Opportunities
          </div>

          <h1 className="hero-name">
            <span className="hero-name-sub">Hi, I'm</span>
            <span className="hero-name-main">Aryan Gupta</span>
          </h1>

          <div className="hero-typed-wrap">
            <span className="hero-typed-prefix">&gt;</span>
            {typed}
            <span className="hero-typed-cursor" />
          </div>

          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Get In Touch →</a>
            <a href="#projects" className="btn-outline">View Projects</a>
          </div>

          <div className="hero-socials">
            {[
              { label: "GitHub",   href: "https://github.com/AryanGupta09" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/aryan-gupta45/" },
              { label: "Email",    href: "mailto:5guptaaryan10@gmail.com" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hero-social-link">
                <span className="hero-social-line" />{s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span className="hero-scroll-text">scroll</span>
          <svg className="hero-scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <div className="section-outer section-bg" id="about">
        <div className="section-inner">
          <div className="section-label reveal">01 — About</div>
          <h2 className="section-title reveal">Building with purpose,<br /><span>learning without limits.</span></h2>
          <div className="about-grid">
            <div className="about-text reveal-left">
              <p>I'm a Computer Engineering student at Lovely Professional University with a deep passion for full-stack development and cloud computing. I thrive at the intersection of elegant frontend experiences and robust backend systems.</p>
              <p>Currently exploring AI-integrated web applications and expanding my expertise in AWS cloud services. I believe in writing clean, maintainable code and shipping products that solve real problems.</p>
              <p style={{ marginTop: "2rem" }}>
                <a href="#contact" className="btn-primary" style={{ fontSize: "0.82rem", padding: "0.7rem 1.6rem", display: "inline-flex" }}>
                  Let's work together →
                </a>
              </p>
            </div>
            <div className="about-stats reveal-right">
              {[
                { num: yearsCount, label: "Years of Learning" },
                { num: projCount,  label: "Projects Built" },
                { num: certsCount, label: "Certifications", span: true },
              ].map((s, i) => (
                <div key={i} className="about-stat" style={s.span ? { gridColumn: "span 2" } : {}}>
                  <div className="about-stat-num">{s.num}+</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TRAINING ── */}
      <div className="section-outer" id="training">
        <div className="section-inner">
          <div className="section-label reveal">02 — Training</div>
          <h2 className="section-title reveal">Where I've <span>trained.</span></h2>
          <div className="exp-card reveal">
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
        </div>
      </div>

      {/* ── SKILLS ── */}
      <div className="section-outer section-bg" id="skills">
        <div className="section-inner">
          <div className="section-label reveal">03 — Skills</div>
          <h2 className="section-title reveal">Tools &amp; <span>Technologies.</span></h2>
          <div className="skills-grid reveal">
            {SKILLS.map((cat, i) => (
              <div key={i} className="skill-cat">
                <div className="skill-cat-icon">{cat.icon}</div>
                <div className="skill-cat-title">{cat.title}</div>
                <div className="skill-tags">
                  {cat.tags.map(tag => <span key={tag} className="skill-tag">{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROJECTS ── */}
      <div className="section-outer" id="projects">
        <div className="section-inner">
          <div className="section-label reveal">04 — Projects</div>
          <h2 className="section-title reveal">Things I've <span>built.</span></h2>

          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <div
                key={i}
                className="project-card reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
                onClick={() => setExpandedProject(expandedProject === i ? null : i)}
              >
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
                    {p.features.map((f, fi) => (
                      <div key={fi} className="project-feature">{f}</div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                    <button
                      className="project-toggle"
                      onClick={e => { e.stopPropagation(); setExpandedProject(expandedProject === i ? null : i); }}
                    >
                      {expandedProject === i ? "↑ Less" : "↓ Details"}
                    </button>
                    <div style={{ display: "flex", gap: "0.6rem" }} onClick={e => e.stopPropagation()}>
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="proj-link-btn">GitHub ↗</a>
                      <a href={p.live}   target="_blank" rel="noopener noreferrer" className="proj-link-btn proj-link-live">Live ↗</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements & Certs */}
          <div className="ach-grid">
            <div className="ach-card reveal-left">
              <div className="ach-card-title">Achievements</div>
              {ACHIEVEMENTS.map((a, i) => (
                <div key={i} className="ach-item">
                  <span className="ach-icon">{a.icon}</span>
                  <div>
                    <div className="ach-name">{a.name}</div>
                    <div className="ach-meta">{a.meta}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ach-card reveal-right">
              <div className="ach-card-title">Certifications</div>
              {CERTS.map((c, i) => (
                <div key={i} className="ach-item">
                  <span className="ach-icon">{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div className="ach-name">{c.name}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem" }}>
                      <div className="ach-meta">{c.meta}</div>
                      <a href={c.link} target="_blank" rel="noopener noreferrer" className="cert-link-btn">View ↗</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── EDUCATION ── */}
      <div className="section-outer section-bg" id="education">
        <div className="section-inner">
          <div className="section-label reveal">05 — Education</div>
          <h2 className="section-title reveal">Academic <span>background.</span></h2>
          <div className="edu-timeline">
            <div className="edu-timeline-line" />
            {EDUCATION.map((edu, i) => (
              <div key={i} className="edu-item reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
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
        </div>
      </div>

      {/* ── CONTACT ── */}
      <div className="section-outer" id="contact">
        <div className="section-inner">
          <div className="section-label reveal">06 — Contact</div>
          <h2 className="section-title reveal">Let's <span>connect.</span></h2>
          <p className="reveal" style={{ color: "var(--text2)", marginBottom: "2.5rem", maxWidth: "500px", lineHeight: 1.8 }}>
            I'm always open to new opportunities, collaborations, or just a good conversation about tech.
          </p>
          <div className="contact-grid reveal">
            {[
              { icon: "✉️", label: "Email",    value: "5guptaaryan10@gmail.com",        href: "mailto:5guptaaryan10@gmail.com" },
              { icon: "📱", label: "Phone",    value: "+91 8543882003",                 href: "tel:+918543882003" },
              { icon: "💼", label: "LinkedIn", value: "aryan-gupta45",                  href: "https://www.linkedin.com/in/aryan-gupta45/" },
            ].map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="contact-card">
                <span className="contact-icon">{c.icon}</span>
                <span className="contact-label">{c.label}</span>
                <span className="contact-value">{c.value}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span className="footer-copy">© 2026 Aryan Gupta — Built with React</span>
        <div className="footer-links">
          {[
            { label: "GitHub",   href: "https://github.com/AryanGupta09" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/aryan-gupta45/" },
            { label: "Email",    href: "mailto:5guptaaryan10@gmail.com" },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="footer-link">{l.label}</a>
          ))}
        </div>
      </footer>

      {/* ── SCROLL TO TOP ── */}
      <button
        className={`scroll-top${showScrollTop ? " visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
